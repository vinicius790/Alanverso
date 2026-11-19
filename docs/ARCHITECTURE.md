# 🏛️ Arquitetura do Sistema — Alanverso v5.0.0

Este documento apresenta a especificação arquitetural completa do **Alanverso v5.0.0**, detalhando a divisão em módulos ES nativos, construção de DOM segura anti-XSS (`h()` e parser de fragmentos), cadeia DSP de efeitos Web Audio API, máquina de estados do Quiz com dicas 50/50 e combo de acertos, Central de Clipes com favoritos persistentes, conformidade WCAG 2.2 AAA e estratégia PWA Offline-First.

---

## 1. Visão Geral em Camadas

O Alanverso v5.0.0 abandona scripts monolíticos em prol de camadas estritas com zero dependências externas de produção:

```mermaid
flowchart TD
    subgraph UI_Layer["Camada de Apresentação & Estilos (index.html + styles/)"]
        Tokens["tokens.css / base.css"]
        Sections["Hero, Memes, Soundboard DSP, Clipes, Gerador, Quiz, Conquistas"]
    end

    subgraph Feature_Layer["Camada de Funcionalidades (src/features/)"]
        Navigation["navigation.js (Drawer, Scroll-Spy)"]
        Modals["modals.js (Lightbox, Shortcuts ?)"]
        I18n["i18n.js (Motor pt-BR / en sem innerHTML)"]
        Soundboard["soundboard.js (Web Audio + Echo/Bass)"]
        Clips["clips.js (Busca Debounce, Favoritos, Modal)"]
        MemeGen["meme-generator.js (Canvas, Filtros, Stickers)"]
        Quiz["quiz.js (10 Questões, 50/50, Streak)"]
        Achievements["achievements.js (12 Troféus, Stats, Perfil)"]
    end

    subgraph Core_Layer["Camada Core & Dados (src/core/ + src/data/)"]
        DOM["dom.js (Fábrica Segura h)"]
        Format["format.js (Debounce, Views/Duration Parsing)"]
        A11y["a11y.js (WCAG AAA, Contrast, Live Region)"]
        Backup["backup.js (Schema JSON v5.0.0 + Compat v3)"]
        Storage["storage.js (LocalStorage Resiliente)"]
    end

    subgraph Offline_Layer["Camada PWA & Entrega Estática"]
        SW["sw.js (Cache v5.0.0 Stale-While-Revalidate)"]
        Server["scripts/serve.mjs & Nginx/Docker"]
    end

    UI_Layer <--> Feature_Layer
    Feature_Layer --> Core_Layer
    Feature_Layer --> Offline_Layer
```

---

## 2. Cadeia de Processamento de Áudio DSP (Web Audio API v5.0.0)

O módulo `src/features/soundboard.js` constrói um grafo de áudio real em tempo real com efeitos encadeados sem alterar a nitidez dos osciladores base:

```mermaid
flowchart LR
    Osc["Osciladores & LFOs (12 Efeitos + Web Speech)"] --> FxInput["fxInputNode (Gain)"]
    FxInput --> BassFilter["BiquadFilterNode (lowshelf 180Hz / +12dB)"]
    BassFilter -->|"Sinal Seco (Dry)"| MasterGain["masterGain + Volume"]
    BassFilter -->|"Ramo Molhado (Eco)"| Delay["DelayNode (240ms)"]
    Delay --> Feedback["Feedback Gain (0.38)"]
    Feedback --> Delay
    Delay --> EchoWet["echoWetGain (0 ou 0.55)"]
    EchoWet --> MasterGain
    MasterGain --> Analyser["AnalyserNode (FFT 256)"]
    Analyser --> Canvas["Canvas Visualizer (Ondas / Barras)"]
    Analyser --> Speakers["AudioDestinationNode"]
```

---

## 3. Máquina de Estados do Quiz Interativo v5.0.0

Opera com 10 perguntas, contador de sequência (`streak`), sistema de dica **50/50** (máximo 2 por partida) e gravação de recorde e maior combo no `localStorage`:

```mermaid
stateDiagram-v2
    [*] --> CarregandoPergunta: Inicialização / Reinício
    CarregandoPergunta --> AguardandoResposta: Renderiza opções seguras + Barra 1..10
    AguardandoResposta --> AplicandoDica5050: Usuário aciona 💡 Dica (elimina 2 erradas)
    AplicandoDica5050 --> AguardandoResposta
    AguardandoResposta --> AvaliandoResposta: Seleciona alternativa A-D
    AvaliandoResposta --> Acertou: Atualiza Pontos e Streak (+1x)
    AvaliandoResposta --> Errou: Reseta Streak para 0x e exibe explicação
    Acertou --> ProximaOuResultado: Botão Próxima Pergunta
    Errou --> ProximaOuResultado: Botão Próxima Pergunta
    ProximaOuResultado --> CarregandoPergunta: índice < 10
    ProximaOuResultado --> TelaResultadoFinal: Fim da rodada
    TelaResultadoFinal --> PersisteRecordes: Salva HighScore & BestStreak
    PersisteRecordes --> ConcedeMedalhas: quiz_starter e quiz_genius (100%)
```

---

## 4. Pipeline de Central de Clipes e Correções v5.0.0

Em versões anteriores, seletores incorretos e parsing de string prejudicavam a busca e ordenação. Na v5.0.0, o módulo `src/features/clips.js` e `src/core/format.js` garantem precisão matemática:

1. `parseViewsCount("1.4M visualizações")` → `1400000` (ordenando corretamente acima de `"890K views"` → `890000`).
2. `parseDurationSeconds("1:15")` → `75` segundos inteiros.
3. Suporte nativo a **Favoritos de Clipes** (`⭐`) com aba dedicada de filtragem e restauração do estado vazio (`#clips-empty-state` + `#clips-reset-filter`).

---

## 5. Segurança Anti-XSS & Auditoria Automatizada

A arquitetura garante proteção estrutural verificada automaticamente pelo teste [tests/security.test.js](./tests/security.test.js):

- **Zero Sinks de HTML Inseguro**: Proibido o uso de `innerHTML`, `outerHTML`, `insertAdjacentHTML` ou `document.write` em `src/`.
- **Construção Declarativa**: Listas de conquistas (`achievements.js`) e opções de Quiz (`quiz.js`) são montadas via `h()` usando `document.createElement` e `textContent`.
- **Tradução Rica Segura**: String i18n com tags inline simples (como `<span>`) é tokenizada manualmente em `buildSafeRichFragment()` dentro de `src/core/dom.js`, ignorando scripts e atributos perigosos sem usar parser HTML inseguro.
- **Servidor Dev Blindado**: `scripts/serve.mjs` implementa allowlist estrita de caminhos públicos (`/index.html`, `/src/`, `/styles/`, etc.), impedindo vazamento de arquivos privados ou *path traversal*.

# 🏛️ Arquitetura do Sistema — Alanverso v3.0.0

Este documento apresenta a especificação arquitetural completa do **Alanverso**, detalhando padrões de design front-end, ciclo de vida de componentes reativos, engenharia de som via Web Audio API, sistema de gamificação client-side com persistência, máquina de estados do Quiz, barramento de eventos, conformidade de acessibilidade (WCAG 2.2 AAA) e estratégias de PWA (Service Worker e Cache Offline).

---

## 1. Visão Geral em Camadas

A arquitetura do Alanverso é orientada a padrões modernos de Single Page Application (SPA) em Vanilla Web (ES6+), priorizando alta performance, independência de frameworks pesados, manutenibilidade e desacoplamento entre apresentação, regras de negócio e persistência.

```mermaid
flowchart TD
    subgraph UI_Layer["Camada de Apresentação (View / DOM / A11y)"]
        Hero["Hero Multiversal & Branding"]
        Memes["Galeria de Memes & Lightbox"]
        Soundboard["Soundboard Interativo (Canvas FFT)"]
        Clips["Central de Clipes (Debounce Search)"]
        MemeGen["Gerador de Memes HTML5 Canvas"]
        QuizUI["Quiz Interativo (Feedback WCAG AAA)"]
        AchievementsUI["Galeria de Conquistas & Perfil"]
        ShortcutsModal["Modal de Atalhos Acessíveis (?)"]
    end

    subgraph Logic_Layer["Camada de Controladores & Negócio (JavaScript ES6+)"]
        A11yEngine["A11y Engine (Live Region, Focus Trap, Contrast)"]
        ThemeEngine["Theme Manager (Dark / Light / High Contrast)"]
        I18nEngine["i18n Engine (Bilingual pt-BR / en)"]
        AudioEngine["Web Audio Synthesizer & Analyser"]
        SearchController["Debounce Search & Sort Engine"]
        QuizController["Quiz State Controller & Score Record"]
        AchievementsController["Gamification Engine & Auto-Unlock"]
        DataSync["JSON Profile Exporter / Importer"]
    end

    subgraph Service_Layer["Camada PWA & Armazenamento Local"]
        ServiceWorker["Service Worker (sw.js - Stale-While-Revalidate)"]
        CacheStorage["Cache Storage (App Shell & Assets Offline)"]
        LocalStorage["LocalStorage (Theme, Lang, Achievements, Quiz)"]
    end

    UI_Layer <--> Logic_Layer
    Logic_Layer --> Service_Layer
```

---

## 2. Diagrama de Sequência: Ciclo de Conquistas e Persistência

O sistema de gamificação rastreia ações do usuário e sincroniza troféus em tempo real com anúncios auditivos (WCAG AAA) e persistência no `localStorage`.

```mermaid
sequenceDiagram
    autonumber
    actor User as Usuário / Teclado
    participant UI as Interface DOM (Quiz / Sound / Theme)
    participant Engine as Gamification Engine
    participant Storage as LocalStorage ('alanverso-achievements')
    participant A11y as ARIA Live Region (#a11y-live-region)
    participant Toast as Notificador Toast

    User->>UI: Executa Ação Relevante (ex: Acerta 100% no Quiz)
    UI->>Engine: unlockAchievement('quiz_genius')
    Engine->>Storage: Verifica se ID já existe em unlocked[]
    alt Não Desbloqueado Anteriormente
        Engine->>Storage: Adiciona ID e Timestamp ISO
        Engine->>UI: Atualiza Barra de Progresso e Badges
        Engine->>Toast: showToast('🏆 Nova Conquista: Doutor em Alanologia!')
        Engine->>A11y: announceA11y('Nova conquista desbloqueada: Doutor em Alanologia')
        Engine-->>User: Feedback Visual + Sonoro Acessível
    else Já Desbloqueado
        Engine-->>UI: Nenhuma operação redundante
    end
```

---

## 3. Máquina de Estados do Quiz Interativo

O módulo de Quiz opera como uma máquina de estados finitos que valida cada rodada, previne respostas duplicadas e calcula o aproveitamento final.

```mermaid
stateDiagram-v2
    [*] --> CarregandoPergunta: Inicialização / Reinício

    CarregandoPergunta --> AguardandoSelecao: Renderiza Opções & Timer/Barra
    AguardandoSelecao --> ValidandoResposta: Usuário Seleciona Alternativa
    ValidandoResposta --> ExibindoFeedback: Avalia Gabarito (Acerto / Erro)
    ExibindoFeedback --> ValidandoResposta: (Bloqueado para cliques extras)

    ExibindoFeedback --> ProximaOuFinal: Usuário clica em 'Próxima Pergunta'
    ProximaOuFinal --> CarregandoPergunta: Se índice < Total de Perguntas
    ProximaOuFinal --> TelaDeResultado: Se última pergunta respondida

    TelaDeResultado --> GravandoRecorde: Salva High Score no localStorage
    GravandoRecorde --> ConcedendoConquistas: Verifica quiz_starter e quiz_genius
    ConcedendoConquistas --> AguardandoAcaoFinal: Exibe Nota, Ranks e Ações

    AguardandoAcaoFinal --> CarregandoPergunta: Botão 'Tentar Novamente'
    AguardandoAcaoFinal --> [*]: Saída / Compartilhamento
```

---

## 4. Pipeline de Busca Instantânea com Debounce

A busca de clipes utiliza técnica de debounce para garantir fluidez extrema e não sobrecarregar o renderizador do DOM, mantendo acessibilidade total para tecnologias assistivas.

```mermaid
flowchart LR
    UserInput["Digitação no Search Input"] --> DebounceFilter["Debounce Timer (250ms)"]
    DebounceFilter -->|Cancela anteriores| ExecuteFilter["Executa filterAndSortClips()"]
    ExecuteFilter --> MatchCards["Filtro por Título, Jogo, Descrição e Categoria"]
    MatchCards --> SortCards["Ordenação (Visualizações / Duração / A-Z)"]
    SortCards --> UpdateDOM["Atualiza Grid de Clipes"]
    UpdateDOM --> LiveAnnounce["Anúncio no ARIA Live Region"]
    UpdateDOM --> TriggerUnlock["Desbloqueia Conquista 'clip_scout'"]
```

---

## 5. Estratégia de PWA & Service Worker (Offline-First)

O Service Worker implementa a estratégia **Stale-While-Revalidate** para navegação e **Cache-First** para assets estáticos locais:

```mermaid
sequenceDiagram
    autonumber
    participant Browser as Navegador Client
    participant SW as Service Worker (sw.js)
    participant Cache as Cache Storage (alanverso-cache-v3.0.0)
    participant Network as Rede / Servidor Web

    Browser->>SW: Requisição de Recurso (ex: style.css, main.js)
    SW->>Cache: Procura resposta em cache
    alt Cache Hit
        Cache-->>SW: Retorna arquivo instantaneamente
        SW-->>Browser: Resposta entregue (0ms latência)
        SW->>Network: Busca versão atualizada em background
        Network-->>SW: Atualização recebida
        SW->>Cache: Atualiza cache silenciosamente
    else Cache Miss (ou Offline)
        SW->>Network: Faz fetch na rede
        Network-->>SW: Retorna asset
        SW->>Cache: Clona e salva em cache
        SW-->>Browser: Resposta entregue ao usuário
    end
```

---

## 6. Matriz de Acessibilidade (WCAG 2.2 AAA)

| Critério WCAG | Requisito Técnico | Implementação no Alanverso |
| :--- | :--- | :--- |
| **1.4.6 Contraste (Avançado)** | Proporção de contraste mínima de 7:1 para texto normal e 4.5:1 para texto grande. | Tema escuro refinado e modo `data-contrast="high"` com contraste ultra elevado (#ffff00 sobre #000000). |
| **2.1.1 Teclado** | Todas as funcionalidades acessíveis por teclado sem traps. | Foco visível com `outline: 3px solid var(--base-color)`, skip-links para todas as seções e navegação completa via `Tab`, `Space`, `Enter` e atalhos globais (`?`, `/`, `T`, `C`, `L`, `Esc`). |
| **2.4.1 Ignorar Blocos** | Mecanismo para pular navegação repetitiva. | `<nav class="skip-links">` no topo do documento apontando para cada seção principal. |
| **3.1.2 Idioma das Partes** | Identificação semântica do idioma de exibição. | Atributo `lang="pt-BR"` ou `lang="en"` dinâmico com i18n completo. |
| **4.1.3 Mensagens de Status** | Notificações perceptíveis para tecnologias assistivas. | Região `#a11y-live-region` com `aria-live="polite"` e `aria-atomic="true"`. |

---

## 7. Estrutura Modular de Diretórios

```
Alanverso/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Pipeline CI/CD GitHub Actions
├── tests/
│   ├── dom.test.js                # Wrapper runner para testes DOM
│   ├── responsive.test.js         # Wrapper runner para testes de responsividade
│   ├── features.test.js           # Suite de testes para novos recursos (PWA, Quiz, Gamificação)
│   ├── test_dom.js                # Testes de integridade do DOM e acessibilidade
│   └── test_responsive.js         # Validações de media queries e viewport
├── favicon.svg                    # Favicon vetorial PWA
├── index.html                     # Entrypoint da aplicação SPA
├── i18n.js                        # Motor bilíngue de internacionalização
├── main.js                        # Controladores, Web Audio, Quiz, Conquistas e Debounce
├── manifest.json                  # PWA Web App Manifest
├── style.css                      # Design system, temas e acessibilidade AAA
├── sw.js                          # Service Worker com cache offline
├── package.json                   # Metadados e scripts de teste
├── ARCHITECTURE.md                # Documentação técnica e diagramas Mermaid
├── CHANGELOG.md                   # Histórico semântico de versões
├── CONTRIBUTING.md                # Guia de contribuição da comunidade
├── LICENSE                        # Licença MIT
└── README.md                      # Documentação oficial do projeto
```

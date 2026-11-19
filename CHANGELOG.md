# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [5.0.0] - 2026-11-18 - Arquitetura Modular ES Modules, DSP Audio & Zero-XSS

### Added
- **Refatoração Arquitetural Completa (ES Modules)**: Separação do antigo arquivo monolítico `main.js` (2.376 linhas) em 18 módulos coesos organizados sob `src/core/`, `src/data/` e `src/features/`, com entrypoint único `src/main.js`.
- **Camadas CSS Modulares (`styles/`)**: Separação de estilos em `tokens.css`, `base.css`, `components.css`, `sections.css` e `responsive.css`, eliminando estilos inline do `index.html`.
- **Cadeia DSP no Soundboard (`src/features/soundboard.js`)**: Adicionados efeitos Web Audio API reais — **Eco / Reverb** (`DelayNode` com realimentação), **Bass Boost** (`BiquadFilterNode` lowshelf +12dB) e **Modo Metralhadora Turbo** — com nova conquista `audio_alchemist`.
- **Favoritos & Busca Precisa de Clipes (`src/features/clips.js`)**: Botão `⭐ Favoritar` em cada clipe com persistência em `localStorage`, filtro dedicado `⭐ Favoritos`, compartilhamento via Web Share API e conquista `clip_collector`.
- **Gerador de Memes v5.0.0 (`src/features/meme-generator.js`)**: Novos filtros visuais aplicados diretamente no Canvas (P&B Clássico, Gamer Neon, Sépia, Invertido) e carimbos exclusivos do Alanverso (`🔴 AO VIVO`, `🔥 100% PISTOLA`, `👀 CREMOSA`, `😂 METRALHADORA`).
- **Quiz Oficial Expandido (`src/features/quiz.js` & `src/data/quiz.js`)**: Banco ampliado de 6 para **10 perguntas**, sistema de **Dica 50/50** (elimina 2 opções incorretas, até 2 usos por rodada) e **Combo/Streak** de acertos consecutivos com persistência do maior combo.
- **Dashboard de Estatísticas & Patentes (`src/features/achievements.js`)**: Painel de métricas ao vivo (sons disparados, clipes assistidos, memes baixados, recorde no Quiz), **12 conquistas totais** e nova patente máxima *"Entidade Cósmica do Alanverso"*.
- **Backup JSON v5.0.0 & Schema Estrito (`src/core/backup.js`)**: Exportação/restauração incluindo favoritos de clipes, estatísticas e melhor streak, com validação rígida e retrocompatibilidade garantida para backups v3.0.0.
- **Infraestrutura DevOps & Executores Locais**: Adicionados `scripts/serve.mjs`, `scripts/check_syntax.mjs`, `scripts/bundle_check.js`, `Dockerfile`, `docker-compose.yml`, `nginx.conf`, `iniciar.ps1`, `iniciar.sh` e comando unificado `npm run check`.
- **Suíte de Testes Nativos Expandida (`tests/`)**: Reestruturação para 6 suítes especializadas totalizando **30 testes nativos** (`dom`, `responsive`, `security`, `modules`, `pwa`, `serve`).

### Fixed
- **Bloqueio Total contra XSS (Zero Sinks Inseguros)**: Eliminados todos os usos de atribuições diretas de marcação HTML em `achievements.js`, `quiz.js` e `i18n.js`, substituídos por criação declarativa via `h()` (`createElement`/`textContent`) e parser manual de fragmentos inline (`buildSafeRichFragment`).
- **Bug no Contador do Soundboard**: Corrigida variável não declarada `soundsPlayedCount` que impedia a contagem correta para a conquista `sound_master`.
- **Conflito de Atalhos Globais**: Resolvida colisão na tecla `T` (alternância de tema vs. fala do soundboard), movendo falas sintetizadas para `Q`, `W` e `E`.
- **Busca e Ordenação da Central de Clipes**: Corrigidos seletores ausentes (`.clip-title`, `.clip-desc`, `.clip-game-pill` → `h3`, `p`, `.clip-game`), parsing numérico preciso de visualizações (`1.4M` > `890K`), conversão real de duração (`mm:ss` para segundos) e conexão do estado vazio `#clips-empty-state` + botão `#clips-reset-filter`.
- **CSS Faltante & Botão Voltar ao Topo**: Adicionadas regras completas para `.clips-toolbar`, `.clips-search-box`, `.button-outline`, `.button-subtle`, `.clips-empty-state` e removida duplicação que ocultava `.back-to-top` e `[data-contrast="high"]`.
- **Limpeza do CI**: Removida referência inexistente a `Javascript.html` em `.github/workflows/ci.yml` e arquivos duplicados em `tests/`.

## [3.0.0] - 2026-10-16 - Advanced Experience & PWA Release

### Added
- **Sistema de Conquistas e Gamificação**: 10 troféus desbloqueáveis salvos no `localStorage` sob `'alanverso-achievements'` com timestamp, nível de fã dinâmico e integração com todas as ações da interface.
- **Quiz Interativo Oficial da Lore**: Desafio com 6 perguntas dinâmicas sobre variantes, bordões e história das streams do Alan, pontuação com High Score persistido, aproveitamento percentual e feedback acessível.
- **Busca de Clipes com Debounce (250ms)**: Filtragem instantânea por texto com debounce no input, suporte a ordenação (Mais Vistos, Maior Duração, Alfabética) e anúncio de resultados via `aria-live`.
- **Exportação e Importação de Perfil JSON**: Possibilidade de exportar todo o progresso de conquistas, preferências e recordes em formato JSON padronizado e restaurá-los em qualquer dispositivo.
- **Progressive Web App (PWA)**: Manifesto de instalação (`manifest.json`) com atalhos de aplicativo e Service Worker (`sw.js`) com estratégia Stale-While-Revalidate para funcionamento offline.
- **Acessibilidade WCAG 2.2 AAA**: Suporte a modo de alto contraste (`data-contrast="high"`), guia de atalhos de teclado (`#shortcuts-modal`, acionado por `?`), anéis de foco de 3px e navegação completa por teclado.
- **Suíte de Testes Expandida**: 17 testes automatizados cobrindo PWA, Gamificação, Quiz, Debounce, Exportação JSON, Responsividade e paridade no motor bilíngue `i18n.js`.
- **Pipelines CI/CD Aprimorados**: Validação contínua com `node --check` em todos os módulos e execução de testes em `.github/workflows/ci.yml`.

## [2.0.0] - 2026-10-15 - Grand Modernization

### Added
- **Dark/Light Theme**: Suporte completo a alternância de temas claro e escuro com persistência via `localStorage` e detecção automática de preferência do sistema operacional (`prefers-color-scheme`).
- **Galeria Interativa & Lightbox**: Visualização ampliada das variantes dimensionais e memes com navegação por teclado (ESC para fechar) e retenção de foco acessível.
- **Carrossel Interativo (Swiper.js)** & **ScrollReveal**.
- **Modal de Contribuição & Toast Notifications**.
- **Acessibilidade Completa (WCAG AA)**, **SEO & OpenGraph**, **Favicon SVG** e governança inicial.

## [1.0.0] - 2023-04-10 - Versão Inicial
- Página inicial original com apresentação básica do streamer Alanzoka e lista estática de memes.

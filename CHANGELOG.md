# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- **Carrossel Interativo (Swiper.js)**: Navegação tátil e por gestos com paginação dinâmica para relatos e depoimentos.
- **Animações Fluidas (ScrollReveal)**: Efeitos de revelação suave e progressiva de componentes durante o scroll.
- **Modal de Contribuição & Toast Notifications**: Formulário interativo para envio de memes com validação de campos e alertas instantâneos não bloqueantes via Toast.
- **Acessibilidade Completa (WCAG AA)**: Implementação de skip links (`#main-content`), tags semânticas HTML5, atributos ARIA 1.2 e região acessível `a11y-live-region`.
- **Otimização de SEO & Redes Sociais**: Meta tags OpenGraph, Twitter Cards e schema semântico para compartilhamento enriquecido no WhatsApp, Twitter e Discord.
- **Favicon Vetorial**: Ícone responsivo em formato SVG (`favicon.svg`).
- **Suíte de Testes Automatizados**: Testes de integridade estrutural do DOM e acessibilidade (`tests/test_dom.js`) usando o Node.js Test Runner nativo.
- **Padrões de Governança e Qualidade**: Criação de `CONTRIBUTING.md` com Conventional Commits, `SECURITY.md`, `LICENSE` (MIT), `.editorconfig` e `.prettierrc`.

### Changed
- **Ponto de Entrada**: Modernização do layout legado (`Javascript.html`) para um novo e semântico `index.html`.
- **Arquitetura CSS**: Substituição de regras legadas por variáveis CSS (`var(--...)`), CSS Grid fluido, Flexbox e design com efeito Glassmorphism.
- **Arquitetura JavaScript**: Código ES6+ limpo e modular (`main.js`) com tratamento robusto de eventos.
- **Documentação Oficial**: `README.md` reescrito com badges de status, tabela de recursos, guia Quick Start e detalhamento de arquitetura.

### Fixed
- Correção de problemas de contraste e ilegibilidade de texto no tema escuro.
- Correção de estouro de viewport horizontal e quebras de grid em dispositivos móveis.
- Correção de handlers inline desnecessários no HTML.

## [1.0.0] - 2023-04-10 - Versão Inicial
### Added
- Página inicial original `Javascript.html` com apresentação básica do streamer Alanzoka e lista estática de memes.

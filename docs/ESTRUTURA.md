# Estrutura do Repositório — Alanverso v5.0.0

Arquitetura modular **Zero-Build** (ES Modules nativos + CSS em camadas + PWA Offline-First), com separação explícita entre assets estáticos, código-fonte, infraestrutura Docker/Nginx, documentação técnica e suítes de testes.

```text
Alanverso/
├── .github/workflows/ci.yml              # CI: sintaxe JS/CSS, bundle budget, htmlhint e auditoria DevSecOps
├── assets/
│   └── icons/favicon.svg                 # Ícone vetorial PWA e favicon
├── deploy/                               # Infraestrutura containerizada
│   ├── Dockerfile                        # Nginx 1.27 Alpine com healthcheck
│   ├── docker-compose.yml                # Orquestração local (context: ..)
│   └── nginx.conf                        # Headers de segurança, gzip e política de cache
├── docs/                                 # Documentação técnica e governança
│   ├── ARCHITECTURE.md                   # Diagramas Mermaid e decisões arquiteturais
│   ├── CONTRIBUTING.md                   # Fluxo de contribuição e padrões de código
│   ├── ESTRUTURA.md                      # Este mapa estrutural completo
│   └── SECURITY.md                       # Regras DevSecOps e reporte de vulnerabilidades
├── scripts/
│   ├── bundle_check.js                   # Validação de orçamento modular (JS/CSS)
│   ├── check_syntax.mjs                  # Checagem ES Modules + balanceamento de chaves CSS
│   └── serve.mjs                         # Servidor HTTP com allowlist restrita (/src, /styles, /assets)
├── src/
│   ├── main.js                           # Orquestrador da aplicação
│   ├── core/                             # a11y.js, backup.js, dom.js (anti-XSS), format.js, storage.js
│   ├── data/                             # achievements.js, i18n-dict.js, quiz.js, sounds.js
│   └── features/                         # achievements, clips, i18n, meme-generator, modals, navigation, quiz, soundboard
├── styles/
│   ├── tokens.css                        # Variáveis CSS (Escuro, Claro, Alto Contraste WCAG AAA)
│   ├── base.css                          # Reset tipográfico, foco acessível e animações
│   ├── components.css                    # Botões, modais, cartões e toolbars
│   ├── sections/                         # Folhas isoladas por seção da página
│   │   ├── hero-showcase.css             # Hero e galeria de memes
│   │   ├── soundboard-clips.css          # Soundboard DSP e central de clipes
│   │   ├── interactive-labs.css          # Gerador de memes, quiz e conquistas
│   │   └── lore-footer.css               # Multiverso lore, personagens, depoimentos e canais
│   └── responsive.css                    # Breakpoints mobile, reduced-motion e forced-colors
├── tests/                                # Suítes nativas organizadas (node:test)
│   ├── helpers/fake-dom.js               # Mocks DOM seguros para testes em Node
│   ├── unit/                             # dom.test.js, modules.test.js
│   └── infra/                            # pwa.test.js, responsive.test.js, security.test.js, serve.test.js
├── .dockerignore
├── .editorconfig
├── .gitignore
├── .prettierignore
├── .prettierrc
├── CHANGELOG.md
├── LICENSE
├── README.md
├── index.html                            # Entrada HTML semântica WCAG 2.2 AAA
├── iniciar.ps1                           # Inicializador local Windows
├── iniciar.sh                            # Inicializador local Linux/macOS
├── manifest.json                         # Manifesto PWA instalável (v5.0.0)
├── package.json                          # Scripts nativos sem dependências de runtime
└── sw.js                                 # Service Worker PWA cobrindo todos os módulos e CSS
```

# 🌌 Alanverso v5.0.0 — O Multiverso Definitivo do Alanzoka

<p align="center">
  <img src="https://c.tenor.com/AXPrsBtnIXAAAAAd/alanzoka-metralhadora.gif" alt="Alanzoka Metralhadora Preview" width="480" style="border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.3);" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=githubactions&logoColor=white" alt="Build Status" />
  <img src="https://img.shields.io/badge/Versão-5.0.0-purple?style=for-the-badge" alt="Versão 5.0.0" />
  <img src="https://img.shields.io/badge/Acessibilidade-WCAG%202.2%20AAA-success?style=for-the-badge&logo=w3c" alt="WCAG 2.2 AAA" />
  <img src="https://img.shields.io/badge/Segurança-Zero%20XSS-blue?style=for-the-badge&logo=owasp" alt="Zero XSS" />
  <img src="https://img.shields.io/badge/PWA-Offline--First-9333ea?style=for-the-badge&logo=pwa" alt="PWA" />
  <img src="https://img.shields.io/badge/Tests-30%2F30%20Passing-brightgreen?style=for-the-badge&logo=node.js" alt="Testes" />
  <img src="https://img.shields.io/badge/Stack-ES%20Modules%20%7C%20Zero--Build-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="Stack" />
</p>

---

## 📖 Visão Geral

O **Alanverso v5.0.0** é um portal web interativo, acessível e modular criado em homenagem ao streamer brasileiro **Alanzoka (Alan Ferreira)**. O projeto reúne arquitetura moderna em **ES Modules nativos (Zero-Build, Zero Dependências)**, **Zero sinks de HTML inseguros** (`createElement` / `textContent`), Soundboard sintetizado com efeitos DSP Web Audio API, Central de Clipes com busca precisa e favoritos, Gerador de Memes HTML5 Canvas com filtros e carimbos, Quiz Oficial da Lore com Dicas 50/50, Sistema de Conquistas com estatísticas e backup JSON v5.0, PWA Offline-First e acessibilidade **WCAG 2.2 AAA**.

---

## 🚀 Principais Recursos & Destaques (v5.0.0)

| Recurso | Descrição |
| :--- | :--- |
| 🧩 **Arquitetura Modular ES Modules** | Núcleo separado em `src/core/`, `src/data/` e `src/features/` com folhas CSS em `styles/` + `styles/sections/`, assets em `assets/` e infra em `deploy/`. |
| 🛡️ **Segurança Estrita (Zero XSS)** | 100% da interface dinâmica renderizada via fábrica segura `h()` e parser seguro de fragmentos, auditada automaticamente pelo CI. |
| 🎛️ **Soundboard Web Audio DSP** | 12 efeitos e falas sintetizados com visualizador FFT Canvas, **Eco/Delay**, **Bass Boost** e **Modo Metralhadora Turbo**. |
| ⭐ **Central de Clipes & Favoritos** | Busca debounced (250ms), ordenação exata (`1.4M > 890K`, duração real `mm:ss`), carimbos de favorito (`⭐`), Web Share API e player Canvas. |
| 🎨 **Gerador de Memes Canvas v5.0** | Edição ao vivo com **Filtros Visuais** (P&B, Gamer Neon, Sépia, Invertido), **Carimbos Exclusivos** ("AO VIVO", "100% PISTOLA") e export PNG. |
| 🧠 **Quiz Oficial (10 Questões)** | Perguntas da lore do canal, **Dica 50/50** (até 2 por partida), contador de **Combo/Streak**, recordes salvos e feedback ARIA. |
| 🏆 **12 Conquistas & Estatísticas** | Painel em tempo real com contador de sons, clipes, memes, recordes, 6 patentes progressivas e backup JSON universal (v3/v5). |
| 📲 **PWA Offline-First & Docker** | Service Worker v5.0.0 cobrindo todos os módulos ES e CSS, manifesto instalável e deploy pronto com `Dockerfile` + `nginx.conf`. |
| 🌐 **i18n Bilíngue & WCAG AAA** | Troca instantânea `pt-BR`/`en`, Modo Alto Contraste (`data-contrast="high"`), Live Region ARIA e atalhos globais livres de conflito. |

---

## ⌨️ Atalhos de Teclado Globais (WCAG AAA)

| Tecla | Ação |
| :---: | :--- |
| <kbd>?</kbd> | Abrir / fechar o guia de atalhos de teclado |
| <kbd>/</kbd> | Focar imediatamente no campo de busca de clipes |
| <kbd>T</kbd> | Alternar Tema Escuro / Claro |
| <kbd>C</kbd> | Alternar modo de Alto Contraste (WCAG AAA) |
| <kbd>L</kbd> | Alternar idioma (`pt-BR` / `en`) |
| <kbd>1</kbd>–<kbd>9</kbd> | Tocar efeitos sonoros sintetizados no Soundboard |
| <kbd>Q</kbd> / <kbd>W</kbd> / <kbd>E</kbd> | Disparar falas sintetizadas clássicas no Soundboard |
| <kbd>Esc</kbd> | Fechar qualquer modal ativo |

---

## ⚡ Quick Start (Início Rápido)

Requer **Node.js 22+** (zero instalação de `node_modules` necessária):

```bash
# 1. Iniciar servidor de desenvolvimento seguro (http://localhost:8080)
npm start

# Ou com um clique no Windows / Linux / macOS:
./iniciar.ps1        # PowerShell (Windows)
./iniciar.sh         # Shell (Linux/macOS)

# Ou via Docker + Nginx Alpine:
docker compose -f deploy/docker-compose.yml up --build
```

---

## 🧪 Verificação, Sintaxe & Testes Automatizados

Toda a suíte executa em menos de **0.5 segundo** usando exclusivamente o test runner nativo do Node.js (`node:test`):

```bash
# Verificação completa: sintaxe JS/CSS, orçamento modular e todos os 30 testes
npm run check

# Executar apenas os testes unitários e de segurança
npm test
```

Consulte [`docs/ESTRUTURA.md`](docs/ESTRUTURA.md) para o mapa completo de arquivos e [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) para os diagramas Mermaid da arquitetura.

---

## 📄 Licença

Desenvolvido como tributo da comunidade ao criador de conteúdo **[Alanzoka (Alan Ferreira)](https://www.twitch.tv/alanzoka)** sob a licença **[MIT](LICENSE)**.

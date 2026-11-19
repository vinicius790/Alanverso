# Guia de Contribuição — Alanverso v5.0.0 🌌

Agradecemos o seu interesse em colaborar com o **Alanverso**! Este guia detalha nossos padrões arquiteturais, regras de segurança e fluxo de contribuição.

---

## 🛠️ Diretrizes de Engenharia

1. **Arquitetura ES Modules (`src/`)**:
   - Código puro em JavaScript moderno (`type="module"`), sem transpilação ou dependências de runtime externas.
   - Separe lógica pura testável em `src/core/` ou `src/data/` e integrações de interface em `src/features/`.
2. **Segurança Estrita Anti-XSS**:
   - É estritamente proibido utilizar `innerHTML`, `outerHTML`, `insertAdjacentHTML` ou `document.write` em `src/`.
   - Construa elementos DOM exclusivamente com `h()` (`src/core/dom.js`) e `textContent`.
3. **CSS Modular & Acessibilidade WCAG 2.2 AAA**:
   - Adicione novos estilos nas camadas apropriadas em `styles/` usando sempre variáveis CSS (`var(--...)`) para suportar Dark Mode e Alto Contraste (`data-contrast="high"`).
   - Nunca utilize atributos `style=""` ou manipuladores de evento inline (`onclick=`) no HTML.
4. **Cobertura Offline (PWA)**:
   - Todo novo arquivo criado em `src/` ou `styles/` deve ser listado em `STATIC_ASSETS` no `sw.js` (validado automaticamente por `tests/pwa.test.js`).

---

## 📋 Padrão de Commits (Conventional Commits)

```text
<tipo>(<escopo>): <descrição curta no imperativo>
```

Exemplos:
- `feat(soundboard): adiciona filtro passa-banda no sintetizador`
- `fix(clips): corrige ordenação numérica de visualizações`
- `test(backup): valida compatibilidade com perfis v3.0.0`

---

## 🚀 Verificação Antes de Abrir Pull Request

Execute o comando completo na raiz de `Alanverso/`:

```bash
npm run check
```

Ele audita automaticamente a sintaxe de todos os módulos JS/MJS, o balanceamento de chaves dos CSS, o orçamento de tamanho de pacote, regras de segurança anti-XSS e todos os 30 testes unitários.

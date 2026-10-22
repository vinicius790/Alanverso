# Guia de Contribuição — Alanverso 🌌

Agradecemos o seu interesse em contribuir com o **Alanverso**! Este documento orienta sobre padrões de código, boas práticas, mensagens de commit semântico e o processo de envio de Pull Requests.

---

## 🛠️ Boas Práticas de Desenvolvimento

1. **Acessibilidade e Semântica**:
   - Mantenha conformidade com WCAG AA (contraste mínimo, atributos `aria-*`, navegação por teclado e suporte a leitores de tela).
   - Use HTML5 semântico (`<main>`, `<header>`, `<section>`, `<nav>`, `<footer>`).
2. **CSS e Estilos**:
   - Utilize variáveis CSS (`var(--...)`) para todas as cores, garantindo compatibilidade dinâmica entre temas Dark e Light.
   - Escreva seletores limpos, sem `!important` desnecessário e mantendo o design 100% responsivo.
3. **JavaScript Vanilla**:
   - Código ES6+ modular, limpo e sem dependências externas desnecessárias.
   - Trate eventos com segurança e evite manipulações diretas que possam causar vazamentos de memória.

---

## 📋 Padrão de Commits (Conventional Commits)

Adotamos a convenção do [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/) para manter o histórico de alterações legível e automatizável:

```text
<tipo>(<escopo opcional>): <descrição curta no imperativo>

[corpo opcional detalhando a motivação]

[rodapé opcional com referências a issues/breaking changes]
```

### Tipos Permitidos:
- **`feat:`** Nova funcionalidade (ex: `feat(theme): adiciona transição suave no Dark Mode`)
- **`fix:`** Correção de bug (ex: `fix(modal): fecha lightbox com tecla ESC`)
- **`docs:`** Alteração em documentação (ex: `docs(readme): adiciona badges e quick start`)
- **`style:`** Formatação, espaçamento ou ajustes visuais sem alteração de lógica
- **`refactor:`** Refatoração de código que não altera comportamento funcional
- **`perf:`** Melhoria de performance e renderização
- **`test:`** Adição ou ajuste de testes
- **`chore:`** Atualização de tarefas, dependências ou ferramentas de build

---

## 🚀 Fluxo de Envio de Pull Request (PR)

1. **Fork do Repositório**:
   Crie seu fork no GitHub e clone localmente.
2. **Crie uma Branch Descritiva**:
   ```bash
   git checkout -b feat/nome-da-sua-feature
   # ou
   git checkout -b fix/descricao-do-bug
   ```
3. **Faça as Alterações e Teste Localmente**:
   - Inicie o servidor local (`npx serve .` ou `python -m http.server 8080`).
   - Verifique o layout em desktop e mobile.
   - Valide a navegação por teclado (Tab, Enter, Esc).
4. **Comite com Conventional Commits**:
   ```bash
   git commit -m "feat(galeria): adiciona suporte a zoom em imagens do Alanzoka"
   ```
5. **Abra o Pull Request**:
   - Descreva com clareza o que foi alterado e o motivo.
   - Anexe prints ou GIFs demonstrando a mudança se houver impacto visual.
   - Garanta que a branch está atualizada com a `main`.

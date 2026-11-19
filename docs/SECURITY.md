# Segurança — Alanverso v5.0.0

## Relatar uma vulnerabilidade

Caso identifique qualquer problema de segurança, relate de forma privada através da aba **Security → Report a vulnerability** no repositório GitHub (ou abrindo uma issue solicitando canal seguro). Não publique detalhes exploráveis publicamente.

Inclua na descrição:
- Passos claros para reproduzir o comportamento observado.
- Impacto potencial identificado.
- Navegador ou versão do Node.js testada.

## Modelo e garantias arquiteturais (v5.0.0)

O **Alanverso** é uma PWA estática executada inteiramente no navegador do cliente:
- **Zero Sinks Inseguros de HTML**: Todo o diretório `src/` é auditado em tempo de teste (`tests/security.test.js`) para proibir manipulação direta via strings HTML (`h()` e `textContent` em `src/core/dom.js`).
- **Validação Estrita de URLs e Backups JSON**: URLs dinâmicas são filtradas por `safeUrl()` (bloqueando `javascript:` e `vbscript:`), e perfis importados passam por validação estrita de schema em `src/core/backup.js`.
- **Servidor Local Protegido**: `scripts/serve.mjs` implementa allowlist restrita apenas aos recursos públicos (`index.html`, `src/`, `styles/`, etc.), bloqueando *path traversal* e vazamento de arquivos privados.
- **Sem dados sensíveis**: Não há autenticação, cookies rastreadores ou telemetria enviada a terceiros.

## Boas práticas para colaboradores

- Execute `npm run check` antes de submeter alterações para garantir aprovação na auditoria DevSecOps (`tests/security.test.js`).
- Utilize sempre HTTPS para referências externas de fontes ou mídias.

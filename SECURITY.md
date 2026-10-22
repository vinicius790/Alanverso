# Segurança

## Relatar uma vulnerabilidade

Caso identifique qualquer problema de segurança, relate de forma privada e responsável através da aba **Security → Report a vulnerability** no repositório GitHub (ou abrindo uma issue solicitando canal seguro). Por favor, não publique detalhes exploráveis ou dados sensíveis em issues públicas.

Inclua na descrição:
- Passos claros para reproduzir o comportamento observado.
- Impacto potencial identificado.
- Navegador e ambiente testados.

## Modelo e escopo do projeto

O **Alanverso** é uma aplicação web estática (HTML, CSS e JavaScript client-side) voltada à apresentação de conteúdo:
- **Sem backend ou banco de dados**: nenhuma informação é transmitida a servidores remotos do projeto.
- **Sem dados sensíveis**: não há autenticação, cookies rastreadores ou armazenamento de credenciais.
- **Manipulação segura do DOM**: interações em JavaScript não executam scripts externos arbitrários nem utilizam dados não higienizados.

## Boas práticas para colaboradores

- Nunca realize commit de credenciais, chaves, arquivos `.env` ou artefatos temporários.
- Utilize sempre HTTPS para quaisquer referências de mídias ou recursos externos.

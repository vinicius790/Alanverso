#!/usr/bin/env sh
# Inicia localmente o portal Alanverso v5.0.0 com 1 clique.
set -eu

DIR="$(cd "$(dirname "$0")" && pwd)"
PORTA="${PORTA:-8080}"
URL="http://localhost:$PORTA/"

echo "==> Iniciando Alanverso v5.0.0 em: $URL"
echo "==> Pressione Ctrl+C para encerrar o servidor."

if [ -z "${NO_BROWSER:-}" ]; then
  if command -v xdg-open >/dev/null 2>&1; then
    (sleep 1 && xdg-open "$URL") >/dev/null 2>&1 &
  elif command -v open >/dev/null 2>&1; then
    (sleep 1 && open "$URL") >/dev/null 2>&1 &
  fi
fi

if command -v node >/dev/null 2>&1 && [ -f "$DIR/scripts/serve.mjs" ]; then
  echo "==> Servidor: Node.js (scripts/serve.mjs)"
  PORT="$PORTA" exec node "$DIR/scripts/serve.mjs"
fi

for py in python3 python py; do
  if command -v "$py" >/dev/null 2>&1; then
    if "$py" -c "import http.server" >/dev/null 2>&1; then
      echo "==> Servidor: Python ($py) http.server"
      exec "$py" -m http.server "$PORTA" --directory "$DIR"
    fi
  fi
done

echo "Erro: Nenhum servidor disponível. Instale Node.js 22+ ou Python 3." >&2
exit 1

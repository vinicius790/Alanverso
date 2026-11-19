<#
.SYNOPSIS
    Inicia o Alanverso v5.0.0 localmente com um clique.
.DESCRIPTION
    Serve a raiz da aplicação via Python http.server, Node.js (scripts/serve.mjs) ou npx serve
    e abre o navegador padrão automaticamente.
#>
[CmdletBinding()]
param(
    [int]$Porta = 8080,
    [switch]$NoBrowser
)

$ErrorActionPreference = 'Stop'
$Raiz = $PSScriptRoot
$url = "http://localhost:$Porta/"

Write-Host "==> Iniciando Alanverso v5.0.0 em: $url" -ForegroundColor Green
Write-Host "==> Pressione Ctrl+C para encerrar o servidor.`n" -ForegroundColor Yellow

if (-not $NoBrowser) {
    Start-Process $url -ErrorAction SilentlyContinue
}

$serveMjs = Join-Path $Raiz 'scripts\serve.mjs'
if ((Get-Command node -ErrorAction SilentlyContinue) -and (Test-Path $serveMjs)) {
    Write-Host "==> Servidor: Node.js (scripts/serve.mjs)" -ForegroundColor Gray
    $env:PORT = "$Porta"
    & node $serveMjs
    exit $LASTEXITCODE
}

foreach ($cmd in @('py', 'python3', 'python')) {
    if (Get-Command $cmd -ErrorAction SilentlyContinue) {
        if ($cmd -eq 'py') {
            Write-Host "==> Servidor: Python http.server (py -3)" -ForegroundColor Gray
            & py -3 -m http.server $Porta --directory $Raiz
        } else {
            Write-Host "==> Servidor: Python http.server ($cmd)" -ForegroundColor Gray
            & $cmd -m http.server $Porta --directory $Raiz
        }
        exit $LASTEXITCODE
    }
}

Write-Error "Nenhum servidor web encontrado. Instale Node.js 22+ ou Python 3."
exit 1

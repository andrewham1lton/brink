$ErrorActionPreference = "Stop"

$Port = 5173

Write-Host "Killing any existing instances on port $Port..."
$procs = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue |
    Select-Object -ExpandProperty OwningProcess -Unique
if ($procs) {
    $procs | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
    Write-Host "Killed."
} else {
    Write-Host "None found."
}

Set-Location $PSScriptRoot
$SessionId = node -e "console.log(crypto.randomUUID())"

Write-Host "Starting game on http://127.0.0.1:$Port"
$env:VITE_STARTUP_SESSION_ID = $SessionId
try {
    npm run start
} finally {
    Remove-Item Env:VITE_STARTUP_SESSION_ID -ErrorAction SilentlyContinue
}

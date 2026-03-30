#!/usr/bin/env bash
set -euo pipefail

PORT=5173

echo "Killing any existing Vite instances on port $PORT..."
lsof -ti :"$PORT" | xargs kill -9 2>/dev/null && echo "Killed." || echo "None found."

cd "$(dirname "$0")"
SESSION_ID="$(node -e "console.log(crypto.randomUUID())")"

echo "Starting game on http://127.0.0.1:$PORT"
VITE_STARTUP_SESSION_ID="$SESSION_ID" npm run start

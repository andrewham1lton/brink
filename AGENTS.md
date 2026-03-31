# AGENTS.md

## Workflow

1. Start each coding task from `develop`, pull latest, then create a dedicated task branch.
2. Keep the repo Electron-first. Do not reintroduce browser-only launch flows as the primary app runtime.
3. After changing app code on macOS, run `npm run dock:sync` so `~/Applications/Guy In A Room Dev.app` stays current for the Dock.
4. Use `npm run dist:mac` and `npm run dist:win` for beta artifacts. Use the GitHub beta-build workflow when both platforms are needed from one trigger.

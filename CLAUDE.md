# CLAUDE.md

## Branching & Workflow (DO THIS EVERY TIME)

1. **Branching model**: use `develop` for integration and `main` for production.
2. **Start every task** from latest `develop`:
   - `git checkout develop`
   - `git pull --ff-only origin develop`
3. **Create a task branch** off `develop`:
   - Feature work: `feature/<short-kebab-name>`
   - Bug fixes: `bug/<short-kebab-name>`
   - Make a dedicated branch based off develop at the beginning of every coding task.
4. **One branch per task**; do not mix unrelated changes.
5. **Open or update a PR** with base branch `develop` (unless explicitly told otherwise).
6. If the user says **"approved"** (or equivalent), assume:
   - The PR has been merged into `develop`
   - The remote task branch has been deleted
7. **After approval**, perform local hygiene immediately:
   - `git checkout develop`
   - `git pull --ff-only origin develop`
   - `git branch -d <task-branch>`
8. **Stay on the task branch** until approved; leave the repo on `develop` when done.
9. **Release flow** (only when requested):
   - Create PR `develop -> main`
   - After merge: `git checkout main && git pull --ff-only origin main`
   - Return to ready state: `git checkout develop && git pull --ff-only origin develop`

# Working Between Codex And Claude Code

## Best Default

1. Use `GitHub` for clean handoffs.
2. Use the same local folder for uncommitted work:
   `/Users/cartersteffes/Documents/Superday AI`
3. Do not edit the same file in both apps at the same time.

## Before You Switch Apps

1. Run `npm run checkpoint`
2. Look at:
   - `git status -sb`
   - `git log -1 --oneline --decorate`
3. Decide which source of truth you want:
   - `GitHub` if the work is committed and pushed
   - `Local folder` if the work is still uncommitted

## Safest Handoff

1. `git add .`
2. `git commit -m "Checkpoint before switching apps"`
3. `git push origin main`
4. Open the repo in the other app from GitHub or pull the latest `main`

## Local-Only Handoff

Use this when you are staying on the same machine and the work is not ready to commit yet.

1. Open the exact same folder in the other app:
   `/Users/cartersteffes/Documents/Superday AI`
2. Do not rely on GitHub to carry those local changes over
3. When you return, run `git status -sb` and inspect the diff

## When You Come Back

1. Run `npm run checkpoint`
2. If the other app pushed changes:
   `git pull origin main`
3. If the other app only changed local files:
   inspect the local diff before continuing

## Parallel Work

If both apps need to work at the same time:

1. Create separate branches
2. Keep each app on its own branch
3. Merge only after one pass is clearly finished

## Local Files To Treat Carefully

- `.claude/` is now ignored as a local Claude Code artifact
- `out/` is now ignored as build output
- Any untracked product assets should be either committed, moved elsewhere, or deleted before you switch apps if you want a clean handoff

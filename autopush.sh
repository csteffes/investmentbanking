#!/bin/zsh

set -euo pipefail

ROOT_DIR="${0:A:h}"
cd "$ROOT_DIR"

BRANCH="$(git branch --show-current 2>/dev/null || true)"
if [[ -z "$BRANCH" ]]; then
  echo "No current git branch found."
  exit 1
fi

REMOTE_URL="$(git remote get-url origin 2>/dev/null || true)"
if [[ -z "$REMOTE_URL" ]]; then
  echo "No origin remote is configured yet."
  echo "Add a GitHub remote first, then rerun ./autopush.sh."
  exit 1
fi

STATE_FILE=".autopush-state"
POLL_SECONDS="${POLL_SECONDS:-3}"

snapshot() {
  {
    git ls-files --cached --others --exclude-standard
    printf '%s\n' ".gitignore"
  } | sort -u | while IFS= read -r path; do
    [[ -z "$path" ]] && continue
    [[ ! -f "$path" ]] && continue
    /usr/bin/shasum "$path"
  done | /usr/bin/shasum | awk '{print $1}'
}

ensure_upstream() {
  if ! git rev-parse HEAD >/dev/null 2>&1; then
    return
  fi

  if git rev-parse --abbrev-ref '@{upstream}' >/dev/null 2>&1; then
    return
  fi

  echo "Setting upstream to origin/$BRANCH"
  git push -u origin "$BRANCH"
}

commit_if_needed() {
  git add -A

  if git diff --cached --quiet; then
    return
  fi

  local timestamp
  timestamp="$(date '+%Y-%m-%d %H:%M:%S')"
  git commit -m "codex sync: ${timestamp}"
  ensure_upstream
  git push
  echo "Pushed changes at ${timestamp}"
}

echo "Watching $ROOT_DIR"
echo "Polling every ${POLL_SECONDS}s. Press Ctrl+C to stop."

commit_if_needed
current_snapshot="$(snapshot)"
printf '%s' "$current_snapshot" > "$STATE_FILE"

while true; do
  sleep "$POLL_SECONDS"
  next_snapshot="$(snapshot)"
  saved_snapshot="$(cat "$STATE_FILE" 2>/dev/null || true)"

  if [[ "$next_snapshot" != "$saved_snapshot" ]]; then
    commit_if_needed
    printf '%s' "$next_snapshot" > "$STATE_FILE"
  fi
done

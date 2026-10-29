#!/usr/bin/env bash
# Run on the server when a deploy step fails: records what's needed to debug it and pushes it
# to GitHub so it can be read from another machine.
#
#   bash deploy/vm-report.sh                           runs `npm run deploy` and reports
#   bash deploy/vm-report.sh npm run deploy:admin      runs another command instead
#   bash deploy/vm-report.sh --no-run                  reports without running anything
#
# The report holds the command's output, versions, the deploy settings, nginx's test result and
# its server_name/listen/include lines. The kiosk token, password hashes and IP addresses are
# removed first. It is saved under logs/ and, once you confirm, pushed as one commit to the
# vm-logs branch (REPORT_BRANCH) of origin (REPORT_REMOTE). That branch holds only reports;
# this checkout, its branch and its files are not changed.
set -uo pipefail

cd "$(dirname "$0")/.." || exit 1
BRANCH="${REPORT_BRANCH:-vm-logs}"
REMOTE="${REPORT_REMOTE:-origin}"
STAMP="$(date +%Y%m%d-%H%M%S)"
LOG="logs/vm-report-$STAMP.log"
RAW="$(mktemp)"
INDEX="$(mktemp -u)"
trap 'rm -f "$RAW" "$INDEX"' EXIT

if [ "${1:-}" = "--no-run" ]; then
  CMD=()
elif [ $# -gt 0 ]; then
  CMD=("$@")
else
  CMD=(npm run deploy)
fi

section() { printf '\n===== %s =====\n' "$*"; }

# A value from deploy/deploy.env, or the default the deploy itself would use
setting() {
  local value
  value="$(sed -nE "s/^[[:space:]]*$1[[:space:]]*=[[:space:]]*['\"]?([^'\"]*)['\"]?[[:space:]]*$/\1/p" deploy/deploy.env 2>/dev/null | tail -n 1)"
  printf '%s' "${value:-$2}"
}

section "Document Dash VM report, $(date '+%Y-%m-%d %H:%M:%S %Z')" > "$RAW"

STATUS="n/a"
if [ ${#CMD[@]} -gt 0 ]; then
  section "Command: ${CMD[*]}" >> "$RAW"
  echo "Running: ${CMD[*]}"
  "${CMD[@]}" 2>&1 | tee -a "$RAW"
  STATUS="${PIPESTATUS[0]}"
  printf '\n(exit code %s)\n' "$STATUS" >> "$RAW"
fi

echo
echo "Collecting server details (sudo may ask for your password)..."
WEB_ROOT="$(setting DEPLOY_WEB_ROOT /var/www/apps)"
APP_DIR="$(setting DEPLOY_APP_DIR /opt/document_dash)"
SNIPPET="$(setting DEPLOY_NGINX_SNIPPET /etc/nginx/snippets/document_dash.conf)"
HTPASSWD="$(setting DEPLOY_NGINX_HTPASSWD /etc/nginx/document_dash.htpasswd)"
TOKEN_FILE="$(setting DEPLOY_KIOSK_TOKEN_FILE /etc/nginx/document_dash.kiosk-token)"
{
  section "Versions"
  echo "commit: $(git log -1 --format='%h %s (%cd)' --date=short 2>&1)"
  echo "os:     $(. /etc/os-release 2>/dev/null && echo "$PRETTY_NAME")"
  echo "node:   $(node -v 2>&1)"
  echo "npm:    $(npm -v 2>&1)"
  echo "nginx:  $(nginx -v 2>&1)"

  section "deploy/deploy.env (settings only)"
  if [ -f deploy/deploy.env ]; then grep -E '^[[:space:]]*[A-Z0-9_]+[[:space:]]*=' deploy/deploy.env; else echo "(missing)"; fi

  section "nginx -t"
  sudo nginx -t 2>&1

  section "nginx -T: server_name, listen and include lines"
  sudo nginx -T 2>/dev/null | grep -nE '^# configuration file |^[[:space:]]*(server_name|listen|include)[[:space:]]'

  section "Game files (existence and permissions only)"
  ls -la "$WEB_ROOT" 2>&1
  echo "live release: $(readlink "$WEB_ROOT/document_dash" 2>&1)"
  ls "$APP_DIR/releases" 2>&1
  sudo ls -la "$SNIPPET" "$HTPASSWD" "$TOKEN_FILE" 2>&1

  section "Recent nginx errors"
  sudo tail -n 500 /var/log/nginx/error.log 2>&1 | grep -E 'document_dash|emerg|crit|alert' | tail -n 40
} >> "$RAW" 2>&1 < /dev/null  # keeps these commands from eating the answer to the push question

# Remove secrets and addresses, and terminal colour codes
mkdir -p logs
sed -E \
  -e 's/\x1b\[[0-9;]*[A-Za-z]//g' \
  -e 's/(dd_kiosk=)[^;" ]+/\1[removed]/g' \
  -e 's/[0-9a-fA-F]{32,}/[removed]/g' \
  -e 's/\$(1|5|6|y|2[aby]?|apr1)\$[^[:space:]":]+/[removed-hash]/g' \
  -e 's/\{(SSHA|SHA|PLAIN)\}[^[:space:]"]+/[removed-hash]/g' \
  -e 's/\b([0-9]{1,3}\.){3}[0-9]{1,3}\b/[ip]/g' \
  "$RAW" > "$LOG"

echo
echo "Saved $LOG ($(wc -l < "$LOG") lines). To read it first: less $LOG"
URL="$(git remote get-url "$REMOTE" 2>/dev/null || echo "$REMOTE")"
read -r -p "Push it to the $BRANCH branch of $URL? Anyone who can see that repository can read it. [y/N] " ANSWER
case "$ANSWER" in
  [Yy]*) ;;
  *) echo "Not pushed; the report stays in $LOG."; exit 0 ;;
esac

# Build the commit in a private index, so this checkout's files and branch stay as they are
export GIT_INDEX_FILE="$INDEX"
PARENT=""
if git fetch -q "$REMOTE" "refs/heads/$BRANCH" 2>/dev/null; then
  PARENT="$(git rev-parse FETCH_HEAD)"
  git read-tree "$PARENT"
else
  git read-tree --empty
fi
git update-index --add --cacheinfo "100644,$(git hash-object -w "$LOG"),$LOG"
TREE="$(git write-tree)"

if [ -z "$(git config user.email)" ]; then
  export GIT_AUTHOR_NAME="$(id -un)@$(hostname)" GIT_AUTHOR_EMAIL="$(id -un)@$(hostname)"
  export GIT_COMMITTER_NAME="$GIT_AUTHOR_NAME" GIT_COMMITTER_EMAIL="$GIT_AUTHOR_EMAIL"
fi
SUMMARY="${CMD[*]:-report only}"
COMMIT="$(git commit-tree "$TREE" ${PARENT:+-p "$PARENT"} -m "VM report $STAMP: $SUMMARY (exit $STATUS)")"

if git push "$REMOTE" "$COMMIT:refs/heads/$BRANCH"; then
  echo "Pushed $LOG to the $BRANCH branch."
else
  echo "Push failed; the report is still in $LOG." >&2
  exit 1
fi

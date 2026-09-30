#!/bin/sh
# Usage: restore.sh [--yes] <local file | s3 key (object name under BACKUP_S3_PREFIX)>
# Restores into $DATABASE_URL (pg_restore --clean --if-exists --no-owner). DESTRUCTIVE.
set -eu
. "$(dirname "$0")/common.sh"

yes=0
[ "${1:-}" = "--yes" ] && yes=1 && shift
src="${1:?usage: restore.sh [--yes] <file | s3 key>}"
: "${DATABASE_URL:?DATABASE_URL is required}"

if [ ! -f "$src" ]; then
  [ -n "${BACKUP_S3_BUCKET:-}" ] || { log "$src not found and S3 not configured"; exit 1; }
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' EXIT
  log "downloading $REMOTE/$src"
  rclone copyto "$REMOTE/$src" "$tmp/restore.dump"
  src="$tmp/restore.dump"
fi

if [ "$yes" -ne 1 ]; then
  printf 'This will overwrite objects in the target database with %s. Type "yes" to continue: ' "$src"
  read -r answer
  [ "$answer" = "yes" ] || { log "aborted"; exit 1; }
fi

log "restoring $src"
pg_restore --clean --if-exists --no-owner -d "$DATABASE_URL" "$src"
log "restore ok"

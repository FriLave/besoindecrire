#!/bin/sh
# pg_dump -Fc of $DATABASE_URL (or PG* vars) -> $BACKUP_DIR (/backups); optional S3 upload; retention prune.
set -eu
. "$(dirname "$0")/common.sh"

db="${DATABASE_URL:+$(printf '%s' "$DATABASE_URL" | sed 's/[?].*//; s|.*/||')}"
db="${db:-${PGDATABASE:-db}}"
file="$BACKUP_DIR/$db-$(date -u +%Y%m%dT%H%M%SZ).dump"

mkdir -p "$BACKUP_DIR"
log "dumping $db to $file"
# DATABASE_URL unset -> pg_dump falls back to PGHOST/PGUSER/PGPASSWORD/PGDATABASE
if ! pg_dump -Fc ${DATABASE_URL:+-d "$DATABASE_URL"} -f "$file"; then
  rm -f "$file"
  log "pg_dump failed"
  exit 1
fi
log "dump ok ($(wc -c <"$file") bytes)"

if [ -n "${BACKUP_S3_BUCKET:-}" ]; then
  log "uploading to $REMOTE/"
  rclone copyto "$file" "$REMOTE/$(basename "$file")"
  rm -f "$file" # S3 mode: no local copy kept
  log "upload ok, local file removed"
  log "pruning remote objects older than ${BACKUP_RETENTION_DAYS}d"
  rclone delete "$REMOTE" --min-age "$((BACKUP_RETENTION_DAYS * 24))h" --include '*.dump'
else
  log "pruning local dumps older than ${BACKUP_RETENTION_DAYS}d"
  find "$BACKUP_DIR" -name '*.dump' -type f -mmin "+$((BACKUP_RETENTION_DAYS * 1440))" -print -delete
fi
log "done"

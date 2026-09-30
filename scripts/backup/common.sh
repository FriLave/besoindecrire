# Sourced by backup.sh / restore.sh. Configures the rclone "bk" remote from BACKUP_S3_* env vars.
log() { printf '%s [backup] %s\n' "$(date -u +%FT%TZ)" "$*"; }
: "${BACKUP_DIR:=/backups}"
: "${BACKUP_RETENTION_DAYS:=30}"
if [ -n "${BACKUP_S3_BUCKET:-}" ]; then
  export RCLONE_CONFIG_BK_TYPE=s3 RCLONE_CONFIG_BK_PROVIDER=Other
  export RCLONE_CONFIG_BK_ENDPOINT="${BACKUP_S3_ENDPOINT:-}" RCLONE_CONFIG_BK_REGION="${BACKUP_S3_REGION:-}"
  export RCLONE_CONFIG_BK_ACCESS_KEY_ID="${BACKUP_S3_ACCESS_KEY_ID:-}" RCLONE_CONFIG_BK_SECRET_ACCESS_KEY="${BACKUP_S3_SECRET_ACCESS_KEY:-}"
  REMOTE="bk:${BACKUP_S3_BUCKET}${BACKUP_S3_PREFIX:+/${BACKUP_S3_PREFIX#/}}"
  REMOTE="${REMOTE%/}"
fi

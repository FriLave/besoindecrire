# Backup sidecar: pg_dump + rclone (single static Go binary, S3-compatible) + busybox crond.
FROM postgres:16-alpine
RUN apk add --no-cache rclone
COPY --chmod=755 common.sh backup.sh restore.sh cron.sh /usr/local/bin/
# Runs as root (crond requirement); dumps go to the /backups volume.
CMD ["cron.sh"]

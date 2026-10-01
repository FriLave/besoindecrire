#!/bin/sh
# Container entrypoint: installs the crontab (BACKUP_CRON) and runs crond in foreground.
# crond does not inherit the container env, so the needed vars are snapshotted and sourced by the job.
# Only DATABASE_URL, BACKUP_* and PATH: nothing else belongs in a file on disk.
set -eu
(umask 077; export -p | grep -E '^export (DATABASE_URL|BACKUP_[A-Z0-9_]*|PATH)=' >/etc/backup.env)
echo "${BACKUP_CRON:-0 2 * * *} . /etc/backup.env; backup.sh >/proc/1/fd/1 2>&1" | crontab -
exec crond -f -l 8

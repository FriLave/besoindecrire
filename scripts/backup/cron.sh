#!/bin/sh
# Container entrypoint: installs the crontab (BACKUP_CRON) and runs crond in foreground.
# crond does not inherit the container env, so it is snapshotted and sourced by the job.
set -eu
export -p >/etc/backup.env
echo "${BACKUP_CRON:-0 2 * * *} . /etc/backup.env; backup.sh >/proc/1/fd/1 2>&1" | crontab -
exec crond -f -l 8

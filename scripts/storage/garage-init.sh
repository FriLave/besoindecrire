#!/bin/sh
# Idempotent Garage bootstrap for local dev: layout, access key, buckets, public media.
# Usage: pnpm storage:init   (after `docker compose up -d garage`)
set -eu
G="docker compose exec -T -e RUST_LOG=warn garage /garage"
KEY=payload-dev

# 1. Layout (single node)
NODE=$($G status | awk '/HEALTHY/{f=1;next} f && $1!="ID" && NF{print $1; exit}')
if $G layout show 2>/dev/null | grep -q "No nodes"; then
  $G layout assign -z dc1 -c 1G "$NODE" >/dev/null
  $G layout apply --version 1 >/dev/null
fi
# Wait for the layout to be active
for _ in 1 2 3 4 5 6 7 8 9 10; do $G bucket list >/dev/null 2>&1 && break; sleep 1; done

# 2. Key (created once; secret is only shown at creation, so we re-read it with --show-secret)
$G key info "$KEY" >/dev/null 2>&1 || $G key create "$KEY" >/dev/null

# 3. Buckets: media (public via website mode) + private-files (private)
for b in media private-files; do
  $G bucket info "$b" >/dev/null 2>&1 || $G bucket create "$b" >/dev/null
  $G bucket allow --read --write --owner "$b" --key "$KEY" >/dev/null
done
$G bucket website --allow media >/dev/null

INFO=$($G key info "$KEY" --show-secret)
ID=$(printf '%s\n' "$INFO" | sed -n 's/^Key ID: *//p')
SECRET=$(printf '%s\n' "$INFO" | sed -n 's/^Secret key: *//p')

cat <<OUT

Paste into .env:

STORAGE_DRIVER=s3
S3_ENDPOINT=http://127.0.0.1:3900
S3_REGION=garage
S3_FORCE_PATH_STYLE=true
S3_BUCKET=media
S3_PRIVATE_BUCKET=private-files
S3_ACCESS_KEY_ID=$ID
S3_SECRET_ACCESS_KEY=$SECRET
# Next.js blocks loopback image hosts, so locally media goes through Payload (/api/media/file). Uncomment only with a real CDN/public host:
#S3_PUBLIC_URL=http://media.web.garage.localhost:3902
OUT

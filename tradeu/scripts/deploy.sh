#!/usr/bin/env bash
# Build the app and deploy it to S3 + CloudFront.
#
# One-time setup (see DEPLOY.md for the full walkthrough):
#   - S3 bucket, private, read via a CloudFront Origin Access Control
#   - CloudFront distribution with custom error responses:
#       403 -> /index.html (200), 404 -> /index.html (200)
#     (required for client-side routing on /play and /challenge)
#   - AWS CLI installed and configured (`aws configure`) with a profile
#     that can write to the bucket and create CloudFront invalidations
#
# Usage:
#   S3_BUCKET=tradeuni-app-prod CLOUDFRONT_DISTRIBUTION_ID=E123ABC456 ./scripts/deploy.sh
#
# Or export those two env vars in your shell profile / .env.deploy and
# just run ./scripts/deploy.sh from then on.

set -euo pipefail

if [ -f ".env.deploy" ]; then
  # shellcheck disable=SC1091
  source .env.deploy
fi

: "${S3_BUCKET:?Set S3_BUCKET to your bucket name, e.g. S3_BUCKET=tradeuni-app-prod}"
: "${CLOUDFRONT_DISTRIBUTION_ID:?Set CLOUDFRONT_DISTRIBUTION_ID to your distribution ID}"

echo "==> Building production bundle"
npm run build

echo "==> Syncing dist/ to s3://${S3_BUCKET}"
# --delete removes files in the bucket that no longer exist in dist/,
# so stale hashed assets from old builds don't pile up forever.
aws s3 sync dist/ "s3://${S3_BUCKET}" --delete

echo "==> Creating CloudFront invalidation for ${CLOUDFRONT_DISTRIBUTION_ID}"
aws cloudfront create-invalidation \
  --distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}" \
  --paths "/*"

echo "==> Done. Changes will be live once the invalidation finishes (usually under a minute)."

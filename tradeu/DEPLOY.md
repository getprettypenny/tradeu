# Deploying to tradeuni.app (S3 + CloudFront)

This app is a static, client-side-routed React SPA — there's no server to
run. `npm run build` produces plain HTML/CSS/JS in `dist/`, and that's the
whole deployable artifact.

## The one gotcha: client-side routing

`/`, `/play`, and `/challenge` aren't real files — only `index.html` is.
React Router picks the page based on the URL *after* the browser already
has `index.html` loaded. If a host doesn't know to fall back to
`index.html` for unknown paths, refreshing on `/play` 404s. The setup below
handles this with CloudFront custom error responses.

## One-time setup

1. **ACM certificate** — ACM console, **us-east-1 region** (CloudFront
   only accepts certs from us-east-1, no matter where else you operate).
   Request a public cert for `tradeuni.app` and `*.tradeuni.app`. Validate
   via DNS (one-click if your domain's already in Route 53). Wait for
   "Issued".

2. **S3 bucket** — create one (e.g. `tradeuni-app-prod`), keep **Block all
   public access** ON. The bucket stays private; CloudFront reads it via
   an Origin Access Control, not public bucket policy.

3. **CloudFront distribution**
   - Origin: your S3 bucket, origin access = **Origin access control
     (recommended)** — create a new OAC, then paste the bucket policy
     CloudFront generates into the S3 bucket's permissions
   - Default root object: `index.html`
   - Viewer protocol policy: Redirect HTTP to HTTPS
   - Alternate domain names: `tradeuni.app`, `www.tradeuni.app`
   - Custom SSL certificate: the ACM cert from step 1

4. **Custom error responses** (Distribution → Error pages) — this is the
   SPA-routing fix:

   | HTTP error code | Response page path | HTTP response code |
   |---|---|---|
   | 403 | `/index.html` | 200 |
   | 404 | `/index.html` | 200 |

5. **Route 53** — in the `tradeuni.app` hosted zone, create an **A record,
   Alias** pointing at the CloudFront distribution. Repeat for `www`.

## Every deploy after that

```bash
cd tradeu
S3_BUCKET=tradeuni-app-prod CLOUDFRONT_DISTRIBUTION_ID=E123ABC456 ./scripts/deploy.sh
```

Or drop those two values into a `.env.deploy` file (gitignored — see
below) in this directory and just run `./scripts/deploy.sh` from then on:

```
S3_BUCKET=tradeuni-app-prod
CLOUDFRONT_DISTRIBUTION_ID=E123ABC456
```

The script builds, syncs `dist/` to S3 (deleting stale files), and
invalidates the CloudFront cache so the new build goes live immediately
instead of waiting out the cache TTL.

Requires the AWS CLI installed and configured (`aws configure`) with
credentials that can write to the bucket and create CloudFront
invalidations.

## Environment variables

`VITE_FORMSPREE_URL` is optional — it already falls back to the
production Formspree endpoint hardcoded in `src/lib/formspree.js`. Only
set it if you want a different endpoint for a specific build (e.g.
testing against a separate Formspree form). Since Vite inlines
`VITE_`-prefixed vars into the client bundle at build time, this was
never a secret either way — just export it before running
`./scripts/deploy.sh` if you need to override it:

```bash
VITE_FORMSPREE_URL=https://formspree.io/f/xxxxxxx S3_BUCKET=... CLOUDFRONT_DISTRIBUTION_ID=... ./scripts/deploy.sh
```

# Docker Build Context

## Current Status
- Project: Next.js 16 with pnpm.
- Additional Services: json-server (db.json) on port 3007.
- Web Service: Running on host port 3006 (mapped to container port 3000).
- API Service: Running on host port 3007 (mapped to container port 3007).

## Issue Debugging (Current)
- Error changed from `unsupported` to `UNAUTHENTICATED`.
- Format of Private Key is now correct.
- Reason: Service account `tiktokus@backup-442720.iam.gserviceaccount.com` likely doesn't have access to GA4 property `451819017`.

## Steps to Implementation
1. [x] Enable `standalone` output in `next.config.mjs`.
...
9. [x] Fix private key formatting in `lib/ga4.ts`.
10. [ ] User check: Add service account email to GA4 property access.

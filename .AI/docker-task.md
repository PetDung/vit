# Docker Build Context

## Current Status
- Project: Next.js 16 with pnpm.
- Additional Services: json-server (db.json) on port 3007.
- Web Service: Running on host port 3006 (mapped to container port 3000).
- API Service: Running on host port 3007 (mapped to container port 3007).

## Issue Resolved (User Choice)
- Analytics failing confirmed as missing credentials in `lib/ga4.ts`.
- User requested to hardcode all IPs and GA4 credentials directly into the source code.
- Hardcoding completed in `lib/*.ts` and `lib/ga4.ts`.

## Steps to Implementation
1. [x] Enable `standalone` output in `next.config.mjs`.
2. [x] Create `.dockerignore`.
3. [x] Create `Dockerfile` (multi-stage).
4. [x] Create `docker-compose.yml`.
5. [x] Update web port to 3006.
6. [x] Update json-server port to 3007.
7. [x] Hardcode API URLs and GA4 credentials in source code.

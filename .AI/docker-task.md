# Docker Build Context

## Current Status
- Project: Next.js 16 with pnpm.
- Additional Services: json-server (db.json) on port 3007.
- Web Service: Running on host port 3006 (mapped to container port 3000).
- API Service: Running on host port 3007 (mapped to container port 3007).

## Issue Resolved
- Deployment to VPS failed because `.env.local` is missing (correctly ignored by git).
- Fixed by creating and pushing `.env.example` and updating `.gitignore`.

## Steps to Implementation
1. [x] Enable `standalone` output in `next.config.mjs`.
2. [x] Create `.dockerignore`.
3. [x] Create `Dockerfile` (multi-stage).
4. [x] Create `docker-compose.yml`.
5. [x] Update web port to 3006.
6. [x] Update json-server port to 3007.
7. [x] Create `.env.example` and allow it in `.gitignore`.

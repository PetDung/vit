# Docker Build Context

## Current Status
- Project: Next.js 16 with pnpm.
- Additional Services: json-server (db.json) on port 3002.
- Goal: Create Dockerfile and Docker Compose for the project.

## Project Structure
- `app/`: Next.js app router.
- `package.json`: Scripts `dev`, `build`, `api`, `start`.
- `db.json`: Database for json-server.
- `.env.local`: Environment variables.

## Steps to Implementation
1. [x] Enable `standalone` output in `next.config.mjs`.
2. [x] Create `.dockerignore`.
3. [x] Create `Dockerfile` (multi-stage).
4. [x] Create `docker-compose.yml`.

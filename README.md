# IS216 Movie Management Project

Monorepo:
- Frontend: React + Vite (`apps/website`)
- Backend: Spring Boot + JPA (`apps/server`)
- Database: PostgreSQL

## 1) Prerequisites

Install these before starting:
- Node.js 20+ and npm
- Java 21
- PostgreSQL 

Check versions:

```bash
node -v
npm -v
java -version
psql --version
```

## 2) How to run

From the project root:

```bash
npm i

# open docker
docker compose up -d

# run backend and frontend
npm run dev
```

## 3) Git Hooks and Commit Rules

This repo uses Husky hooks:
- Pre-commit: runs `lint-staged` and `prettier` for frontend JS/TS files
- Commit message check: uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

## 4) Troubleshooting

- Port already in use:
  - search chatgpt kill that port.
- Database connection errors:
  - copy paste chatgpt delete that connection or docker
- Frontend dependency issues:
  - delete `node_modules` and run `npm i`.
- Gradle issues:
  - ask chatgpt

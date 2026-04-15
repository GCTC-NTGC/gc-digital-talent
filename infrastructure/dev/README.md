# Development Environment Infrastructure

This directory contains configuration files for the development Docker environment with hot reloading support.

## Overview

The development environment separates the API and frontend into individual containers:

```
Browser (localhost:8000)
        ↓
   [nginx-proxy]
        ↓
   ┌────────────────────┬────────────────────┐
   │  /api, /graphql    │  Everything else   │
   │  /login, etc.      │  (/, /en/*, etc.)  │
   │        ↓           │        ↓           │
   │   [api container]  │  [web container]   │
   │   Laravel artisan  │   Vite dev server  │
   │   serve (8080)     │   (3000)           │
   └────────────────────┴────────────────────┘
```

## Files

- **nginx.conf**: Reverse proxy configuration that routes API requests to the Laravel container and all other requests to the Vite dev server
- **Dockerfile.api**: PHP development container running `php artisan serve`
- **Dockerfile.web**: Node.js container running `pnpm run watch`

## Usage

From the repository root:

```bash
# Start the development environment
make dev-up

# Run setup (first time only)
make dev-setup

# View all logs
make dev-logs

# View API logs only
make dev-logs-api

# View web logs only
make dev-logs-web

# Stop the environment
make dev-down
```

Or using docker compose directly:

```bash
docker compose -f docker-compose.dev.yml up --build
```

## Features

- **Hot Module Replacement (HMR)**: Frontend changes are instantly reflected in the browser
- **API Hot Reload**: Laravel's built-in server automatically reloads on PHP changes
- **Separate containers**: API and frontend run independently for cleaner logs and easier debugging
- **Same URL**: Access everything at `http://localhost:8000` (same as production-like setup)

## Ports

| Service | URL |
|---------|-----|
| Application | http://localhost:8000 |
| Adminer (database UI) | http://localhost:8081 |
| PostgreSQL | localhost:5432 |

## Differences from Production-like Setup

| Feature | Production-like (`docker-compose.yml`) | Development (`docker-compose.dev.yml`) |
|---------|---------------------------------------|----------------------------------------|
| Frontend serving | Nginx serves pre-built static files | Vite dev server with HMR |
| API serving | PHP-FPM behind Nginx | `php artisan serve` |
| Build requirement | Must run `pnpm build` | No build needed, instant updates |
| Use case | Testing production behavior | Active development |

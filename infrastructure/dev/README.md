# Development Environment Infrastructure

This directory contains configuration files for the development Docker environment with hot reloading support.

## Files

- **nginx.conf**: Reverse proxy configuration that routes API requests to the Laravel container and all other requests to the Vite dev server
- **Dockerfile.api**: PHP development container running `php artisan serve`
- **Dockerfile.web**: Node.js container running `pnpm run watch`

## Usage

From the repository root, use the `COMPOSE` variable to select the dev compose file:

```bash
make COMPOSE=docker-compose.dev.yml up      # Start
make COMPOSE=docker-compose.dev.yml setup   # Run setup (first time)
make COMPOSE=docker-compose.dev.yml logs    # View logs
make COMPOSE=docker-compose.dev.yml down    # Stop
```

Or using docker compose directly:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Access the application at: http://localhost:8000

## Features

- **Hot Module Replacement (HMR)**: Frontend changes are instantly reflected in the browser
- **API Hot Reload**: Laravel's built-in server automatically reloads on PHP changes
- **Separate containers**: API and frontend run independently for cleaner logs

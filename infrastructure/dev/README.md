# Development Environment Infrastructure

This directory contains configuration files for the development Docker environment with hot reloading support.

## Files

- **default**: Reverse proxy configuration that routes API requests to the Laravel container and all other requests to the Vite dev server
- **api.Dockerfile**: PHP development container running `php artisan serve`
- **web.Dockerfile**: Node.js container running `pnpm run watch`

## Usage

From the repository root, add `ENV=dev` to any make command:

```bash
make up ENV=dev      # Start
make setup ENV=dev   # Run setup (first time)
make logs ENV=dev    # View logs
make down ENV=dev    # Stop
```

Or using docker compose directly:

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

Access the application at: http://localhost:8000

## File ownership

These containers start as root, work out who owns the checked-out project, and
drop to that user before running anything, so the files they generate belong to
you. See `infrastructure/bin/entrypoint-uid.sh`.

`docker compose exec` starts a new process rather than joining that one, so it
runs as root and anything it writes will be root-owned. Pass
`--user "$(id -u):$(id -g)"` if the command creates files.

## Features

- **Hot Module Replacement (HMR)**: Frontend changes are instantly reflected in the browser
- **API Hot Reload**: Laravel's built-in server automatically reloads on PHP changes
- **Separate containers**: API and frontend run independently for cleaner logs

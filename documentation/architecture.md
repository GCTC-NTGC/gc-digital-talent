# Architecture

## Docker Compose (local development)

The local development environment is defined in [`docker-compose.yml`](../docker-compose.yml).

### Services

| Service | Image / Build | Host port | Notes |
|---|---|---|---|
| `webserver` | [`infrastructure/webserver.Dockerfile`](../infrastructure/webserver.Dockerfile) | `8000` | Runs nginx + PHP-FPM in a single container |
| `postgres` | `postgres` | `5432` | Primary relational database |
| `adminer` | `adminer` | `8080` | Web-based database UI |
| `mock-auth` | `ghcr.io/navikt/mock-oauth2-server` | none (internal) | OAuth2 mock server, proxied by nginx at `/oxauth/*` |
| `maintenance` | [`infrastructure/maintenance-container`](../infrastructure/maintenance-container) | none | Manual-use utility container; replicas set to 0 by default |

### Request routing

Inside the `webserver` container, nginx listens on port `8080` (mapped to host port `8000`) and routes requests as follows:

| Path pattern | Routed to |
|---|---|
| `/oxauth/*` | Proxy → `mock-auth:8080` |
| `/graphql`, `/admin/graphql` | FastCGI → PHP-FPM `:9000` |
| `/api/*`, `/login`, `/register`, `/auth-callback`, `/refresh`, `/sector-identifier` | FastCGI → PHP-FPM `:9000` |
| Static asset extensions (`.png`, `.js`, `.css`, …) | File system → `apps/web/dist/client/` |
| `/` (all other paths) | SPA fallback → `apps/web/dist/client/index.html` |

```mermaid
graph TB
    browser["Browser / Client"]
    subgraph docker["Docker Network (docker-compose)"]
        subgraph webserver["webserver — nginx + PHP-FPM — host:8000 → :8080"]
            nginx["Nginx\n:8080"]
            phpfpm["PHP-FPM\n:9000 (internal)"]
            staticfiles["Static files\napps/web/dist/client/"]
        end
        postgres["postgres\nhost:5432 → :5432"]
        adminer["adminer\nhost:8080 → :8080"]
        mockauth["mock-auth\nmock-oauth2-server\n(internal only)"]
        maintenance["maintenance\n(manual use)"]
    end
    browser -- "port 8000" --> nginx
    browser -- "port 8080" --> adminer
    adminer -- "postgres:5432" --> postgres
    nginx -- "/oxauth/*\n(proxy)" --> mockauth
    nginx -- "/graphql, /admin/graphql\n/api/*, /auth-callback, …\n(FastCGI)" --> phpfpm
    nginx -- "/ (SPA) + static assets" --> staticfiles
    phpfpm -- "postgres:5432" --> postgres
```

## Azure (production deployment)

- The application is built as a zip artifact via [Azure Pipelines](../infrastructure/azure-pipelines.yml) and deployed to an Azure App Service (PaaS).
- Static documents and tc-report files are served from Azure Blob Storage.
- The `/admin` routes are restricted to users on the Government of Canada network.

```mermaid
graph TB
    user["End User (Browser)"]
    admin["Admin (GC network required)"]
    
    f5["Firewall"]

    subgraph azure["Azure"]
        subgraph appservice["Azure App Service"]
            nginx2["Nginx + PHP-FPM"]
        end
        db["Postgres"]
        storage["Azure Blob Storage\n(static files)"]
        insights["Azure Application Insights\n(monitoring)"]
    end

    cl["CanadaLogin\n(OAuth 2.0)"]

    user -- "HTTPS" --> f5
    admin -- "HTTPS\n(VPN / GC network)" --> f5
    
    f5 -- "/static/* redirect" --> storage
    f5 -- "App Traffic" --> appservice
    
    nginx2 -- "DB queries" --> db
    nginx2 -- "telemetry" --> insights
    nginx2 -- "auth flows\n(/login, /auth-callback)" --> cl
```

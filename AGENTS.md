## Project Overview

GC Digital Talent is a government recruitment platform built as a monorepo with a Laravel/GraphQL API backend and React frontend.

## Architecture

- `api` - Laravel 13 backend with Lighthouse GraphQL (PHP 8.4)
- `apps/web` - React 19 frontend with React Router 7 and Vite 7
- `apps/playwright` - E2E tests
- `packages` - 20+ shared npm packages (ui, forms, graphql, i18n, auth, etc.)
- `infrastructure` - Docker configuration
- `maintenance` - Setup and deployment scripts

**API Structure** (`api/app/`): GraphQL/ (schema-first design), Models/, Services/, Policies/

**Frontend Structure** (`apps/web/src/`): pages/, components/, hooks/, routes.ts

## Essential Commands

All commands run from the repository root. Use `ENV=dev` for development with hot reloading. Make targets run inside Docker via the maintenance container.

```bash
# Infrastructure
make up ENV=dev             # Start containers (build + detach)
make down                   # Stop containers
make logs                   # Tail container logs
make setup                  # First-time setup (runs setup.sh in container)
make refresh ENV=dev        # Refresh everything (frontend + API)
make refresh-frontend ENV=dev  # Refresh frontend only
make refresh-api ENV=dev    # Refresh API only

# Development
make watch ENV=dev          # Watch mode for web + graphql packages

# Database
make seed-fresh             # Reset and seed database (migrate:fresh --seed)
make migrate                # Run pending migrations

# Code Quality
make lint                   # PHP (Pint) + JS (ESLint) linting
make lint-php               # PHP linting only (Pint)
make phpstan                # PHP static analysis

# Testing
make test                   # Run PHPUnit tests
make test CMD="--filter=ExampleTest"  # Run specific PHP test

# API Utilities
make artisan CMD="<command>"   # Run any artisan command
make composer CMD="<command>"  # Run any composer command
make optimize-api              # Optimize API (caches config, routes, views)
make queue-work                # Start queue worker
make reverb-start              # Start Reverb WebSocket server
```

### Frontend commands (no make target yet)

These run via pnpm inside the container. Use `make watch` for typical dev work.

```bash
# From inside the maintenance container, or prefix with:
# docker compose -f docker-compose.dev.yml run -w /var/www/html --rm maintenance pnpm

# development
pnpm dev                    # Start dev server (runs codegen, i18n compile first)
pnpm build                  # Production build
pnpm codegen                # Regenerate GraphQL types from schema

# testing
pnpm test                   # Run Vitest tests once
pnpm test:watch             # Vitest watch mode
pnpm e2e:playwright         # Run Playwright E2E tests
pnpm storybook              # Start Storybook on port 6006

# linting/formatting
pnpm lint:fix               # ESLint auto-fix
pnpm prettier               # Prettier check
pnpm prettier:fix           # Prettier auto-fix
pnpm tsc                    # TypeScript type check

# Internationalization
pnpm intl-extract           # Extract English strings
pnpm intl-compile           # Compile all language files
pnpm check-intl             # Check translation completeness
```

## Running a Single Test

```bash
# Vitest - run specific test file (inside container)
pnpm vitest run apps/web/src/components/Example/Example.test.tsx

# Playwright - run specific test (inside container)
pnpm --filter @gc-digital-talent/playwright e2e -- --grep "test name"

# PHPUnit - run specific test
make test CMD="--filter=ExampleTest"
```

## Code Style

**Functional Programming**: Use pure functions, immutable variables (`const`), and avoid side effects. Replace loops with `map`, `filter`, `reduce`. Use ternary operators and `&&` instead of if/else when possible.

**React Components**: Follow this hierarchy:
- `*Page` - Router target, arranges layout and breadcrumbs
- `*Container` - Handles API requests and mutations
- Primary (`*Form`, `*Table`) - User interaction, receives data via props
- `*Section` - Breaks large pages into pieces

**File Organization**: PascalCase for components and directories; camelCase for non-component directories. Keep support files (stories, tests, GraphQL) alongside components.

**TypeScript**: Favor explicit types over `any`. Use `unknown` for untyped data. Avoid type assertions (`as`).

**GraphQL**: Schema-first design. Fields in camelCase, SQL columns in snake_case. Leave most fields nullable. Use `@rename` directive for case mismatches.

**Testing**: Write tests that use components like a user would. Prefer semantic HTML targeting over `data-testid`.

## Key Dependencies

- **Package Manager**: pnpm (≥10.27.0)
- **Node**: ≥24.12.0
- **Frontend**: React 19, React Router 7, Vite 7, Tailwind CSS 4, URQL (GraphQL client)
- **Backend**: Laravel 12, Lighthouse 6.15 (GraphQL), PostgreSQL
- **Testing**: Vitest, Playwright, PHPUnit, Storybook 10

## Supported Languages (i18n)

English (en), French (fr) for everything.
Michif (crg), Plains Cree (crk), Western Ojibway (ojw), Mi'kmaw (mic) in special cases.

## GraphQL Workflow

1. Modify schema in `api/graphql/schema.graphql`
2. Run `php artisan lighthouse:print-schema --write` to compile
3. Run `pnpm codegen` to generate TypeScript types
4. Types output to `packages/graphql/src/gql/`

## Documentation Reference

The `/documentation/` folder contains detailed guides. Key references by category:

**Essential Reading** (understand codebase patterns):
- `documentation/style-guide.md` - Functional programming principles, React component hierarchy, file naming conventions
- `documentation/graphql.md` - Fragment masking, collocation pattern, bottom-up query composition with examples
- `api/README.md` - Schema-first design, database migrations, Eloquent models, Lighthouse directives

**Development Guides** (reference as needed):
- `documentation/accessibility.md` - WCAG compliance, axe-core testing, manual testing checklist
- `documentation/translation.md` - i18n workflow, bulk translation process, source control guidelines
- `documentation/environment-variables.md` - Build-time vs runtime env vars, feature flags
- `documentation/notifications.md` - GC Notify integration for email/SMS

**Setup & Infrastructure**:
- `documentation/linux-setup.md` - Local environment setup (Node, PHP, PostgreSQL, Docker)
- `infrastructure/README.md` - Docker Compose configuration

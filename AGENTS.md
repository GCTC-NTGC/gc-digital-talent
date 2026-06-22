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

## Data Domains

- **Users & Auth**: profiles, skills, roles, permissions
- **Pools**: recruitment pools with candidates, assessments, status tracking
- **Applications/Candidates**: Applications to pools aka PoolCandidates, with assessments, records of decision
- **Assessments**: steps, results, skill evaluations
- **Employee Profile**: community interest, work streams, skill development programs
- **Nominations**: talent nomination events, and nominations of employees
- **Talent requests**: requests for talent, matching and tracking candidates
- **Communities & Departments**: organize ownership of pools, requests, and nomination events

## Essential Commands

All commands run from the repository root. There are two setup paths:
- **Docker**: Most devs use `make` targets that wrap these commands inside Docker via the maintenance container. See the `Makefile` for available targets and `infrastructure/README.md` for setup.
- **Local**: Run commands directly if you have PHP, Node, and PostgreSQL installed locally. See `documentation/linux-setup.md`.

When using Docker, either enter the maintenance container first or use the corresponding `make` target (e.g., `make lint` runs linting inside the container). Pass `ENV=dev` for hot reloading: `make up ENV=dev`.

```bash
# Development
pnpm dev                    # Start frontend dev server (runs codegen, i18n compile first)
pnpm build                  # Production build
pnpm codegen                # Regenerate GraphQL types from schema

# Database
php artisan migrate         # Run pending migrations
php artisan migrate:fresh --seed  # Reset and seed database

# Code Quality
pnpm lint:fix               # ESLint auto-fix
pnpm tsc                    # TypeScript type check
pnpm prettier:fix           # Prettier auto-fix
./vendor/bin/pint           # PHP linting (Pint)
./vendor/bin/phpstan        # PHP static analysis

# Testing
pnpm test                   # Run Vitest tests once
pnpm test:watch             # Vitest watch mode
php artisan test             # Run PHPUnit tests
pnpm e2e:playwright         # Run Playwright E2E tests

# Internationalization
pnpm intl-extract           # Extract English strings
pnpm intl-compile           # Compile all language files
pnpm check-intl             # Check translation completeness
```

### Running a Single Test

```bash
pnpm vitest run apps/web/src/components/Example/Example.test.tsx
pnpm --filter @gc-digital-talent/playwright e2e -- --grep "test name"
php artisan test --filter=ExampleTest
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

**Do NOT generate French (or other non-English) translations.** The team maintains an internal lexicon and uses a professional translation workflow (see `documentation/translation.md`). When adding user-facing strings, write English only and leave other languages for the translation process.

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

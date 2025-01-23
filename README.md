# Welcome to the GC Digital Talent monorepo

[![Lighthouse PHP](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/lighthouse-php.yml/badge.svg)](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/lighthouse-php.yml) [![CodeQL](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/codeql-analysis.yml) [![Jest](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/jest.yml/badge.svg)](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/jest.yml) [![Lint](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/lint.yml/badge.svg)](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/lint.yml) [![PHPUnit](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/phpunit.yml/badge.svg)](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/phpunit.yml) [![Playwright](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/playwright.yml/badge.svg)](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/playwright.yml) [![Translations](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/translations.yml/badge.svg?branch=main)](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/translations.yml) [![codecov](https://codecov.io/github/GCTC-NTGC/gc-digital-talent/graph/badge.svg?token=GL1BG06350)](https://codecov.io/github/GCTC-NTGC/gc-digital-talent)

The GC Digital Talent app is divided into multiple services, each treated as its own subproject:

- [`/api`](/api/README.md), API service
- `/apps`, frontend applications
- `/packages`, npm packages used within `/apps`
- `/apps/playwright`, e2e testing with Playwright
- [`/tc-report`](/tc-report/README.md), static content, mostly the Talent Cloud report, generated with Jekyll
- [`/infrastructure`](/infrastructure/README.md), support files for the docker infrastructure to run the project
  - includes a mock OAuth server (only used for local development environments)
- [`/maintenance`](/maintenance/README.md), scripts which run inside the docker containers for setup and updates

The api and frontend projects are both designed to run in separate containers. However, they can also be run on a single server with requests routed carefully between them. This is currently how the docker infrastructure works.

Each subproject has its own `README.md`, with advice on how to contribute to that subproject. The README files also contain notes on how to configure the subprojects, but if you simply want to get the project running on a new machine, you may disregard these notes and move straight to the steps below.

## Testing

We do several types of testing: (internal documentation linked when available)

- code style checks (aka _linting_)
  - **ESLint** feat. **Prettier** (JavaScript)
  - **Pint** (PHP)
- _unit_ testing
  - **Jest** (ReactJS)
  - **PHPUnit** (PHP)
- _visual regression_ testing
  - **Storybook** (ReactJS components)
    - Check the [example component directory](apps/web/src/components/Example/) for more examples.
- _end-to-end_ testing with **Playwright** (full app in-browser)
- security checks (aka _security regression_ testing)
  - CodeQL (JavaScript, TypeScript)

As much as possible, we aspire to make these runnable on:

- :keyboard: your CLI (command-line interface)
- :computer: your IDE (integrated development environment)
- :cloud: our CI (continuous integration) environment

## Getting Started

### Running with Docker

We strongly recommend running the project entirely with Docker. In this case the only dependency you must install on your machine is [Docker Desktop](https://www.docker.com/products/docker-desktop).

Then, follow the instructions in [`/maintenance/README.md`](/maintenance/README.md) to build the project docker containers and run the build scripts. That should handle everything!

> [!TIP]
> If using Docker Desktop, make sure virtualization is enabled in your machine's BIOS.

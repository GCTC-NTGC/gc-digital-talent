# Welcome to the GC Digital Talent monorepo

[![Check schema](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/check-lighthouse-schema.yml/badge.svg)](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/check-lighthouse-schema.yml) [![CodeQL](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/codeql-analysis.yml) [![Jest Tests](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/jest.yml/badge.svg)](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/jest.yml) [![Lint](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/lint.yml/badge.svg)](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/lint.yml) [![PHP Unit Tests](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/phpunit.yml/badge.svg)](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/phpunit.yml) [![bundlewatch](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/bundlewatch.yml/badge.svg)](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/bundlewatch.yml) [![e2e-tests](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/e2e-tests.yml) [![Translations](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/translations.yml/badge.svg?branch=main)](https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/translations.yml)

The GC Digital Talent app is divided into multiple services, each treated as its own sub-project:
- `/api`, the API service
- `/apps`, (new) location for frontend applications
- `/packages`, code shared by multiple other workspaces
- `/apps/e2e`, e2e testing with [`Cypress`](/apps/e2e/cypress/README.md)
  
- `/tc-report`, containing static content generated with Jekyll, mostly the Talent Cloud report. This used to be maintained in a [separate repo](https://github.com/GCTC-NTGC/tc-report), but now the entire project has been imported into this repo. See [`/tc-report/README.md`](/tc-report/README.md) for instructions on how to run Jekyll and re-generate the site content.
- `/infrastructure`, support files for the docker infrastructure to run the project
  - this includes a mock oauth2 server (only used for local development envs)
- `/maintenance`, additional scripts which run inside the docker containers for setup and updates
- `/packages`, npm packages used by the `/apps`

The api, and frontend projects are designed to each run in a separate container. However, since they all use the [Laravel](https://github.com/laravel/laravel) framework, they can also be run on a single PHP server, with requests routed carefully between them. This is currently how docker infrastructure works.

Each sub-project has its own `README.md`, with advice on how to contribute to that sub-project. The README files also contain notes on how to configure the sub-projects, but if you simply want to get the project running on a new machine, you may disregard these notes and move straight to the steps below.

## Testing
We do several types of testing: (internal documentation linked when available)

- code style checks (aka _linting_)
  - **ESLint** feat. **Prettier** (JavaScript)
- _unit_ testing
  - **Jest** (ReactJS)
  - **PHPUnit** (PHP)
- _visual regression_ Testing
  - **Storybook** (ReactJS components)
- _end-to-end_ testing with **Cypress** (full app in-browser)
  - See [`apps/e2e/cypress/README.md`](/apps/e2e/cypress/README.md): custom commands, usage tips, plugins, etc.
- security checks (aka _security regression_ testing)
  - CodeQL (JavaScript, ~~TypeScript~~)

As much as possible, we aspire to make these runnable on:
- :keyboard: your local command line
- :computer: your IDE
- :cloud: our continuous integration (CI) environment

## Getting Started
### Running with Docker

We strongly recommend running the project entirely with Docker. In this case the only dependency you must install on your machine is [Docker Desktop](https://www.docker.com/products/docker-desktop).

Then, follow the instructions in `./maintenance/README.md` to build the project docker containers and run the build scripts. That should handle everything!

### Complications?
- Make sure virtualization is enabled in your machine's BIOS (this is for Docker Desktop)
- Docker is finicky—try exiting it entirely and restarting it

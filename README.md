# Welcome to the GC Digital Talent monorepo

The GC Digital Talent app is divided into multiple services, each treated as its own sub-project:
- `/api`, the API service
- `/frontend`, an npm project for frontend client code containing multiple [workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces):
  - `/admin`, a CRUD-style admin dashboard
  - `/common`, code shared by multiple other workspaces
  - `/cypress`, e2e testing with [`Cypress`](/frontend/cypress/README.md)
  - `/indigenousapprenticeship`, pages related to the Indigenous Apprenticeship Program
  - `/talentsearch`, pages related to searching and requesting talent from pools
  
- `/tc-report`, static content copied from [another repo](https://github.com/GCTC-NTGC/tc-report)
  - The files in this directory of this repository __should never be directly edited__.
  - See [`documentation/tc-report.md`](documentation/tc-report.md) for more information
- `/infrastructure`, support files for the docker infrastructure to run the project
  - this includes a mock oauth2 server (only used for local development envs)
- `/maintenance`, additional scripts which run inside the docker containers for setup and updates

The api, and frontend projects are designed to each run in a separate container. However, since they all use the [Laravel](https://github.com/laravel/laravel) or [Lumen](https://github.com/laravel/lumen) framework, they can also be run on a single PHP server, with requests routed carefully between them. This is currently how docker infrastructure works.

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
  - See [`frontend/cypress/README.md`](/frontend/cypress/README.md): custom commands, usage tips, plugins, etc.
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

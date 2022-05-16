# Welcome to the GC Digital Talent monorepo

The GC Digital Talent app is divided into multiple services, each treated as its own sub-project:
- `/api`, the API service
- `/frontend`, an npm project for frontend client code containing multiple [workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces):
  - `/admin`, a CRUD-style admin dashboard
  - `/talentsearch`, pages related to searching and requesting talent from pools
  - `/common`, code shared by multiple other workspaces
- `/auth`, an OpenID Connect (OIDC) authentication service (only used for local development envs)
- `/tc-report`, static content copied from [another repo](https://github.com/GCTC-NTGC/tc-report) using [git-subtree](https://www.atlassian.com/git/tutorials/git-subtree). Merge updates from that repo with `git subtree pull -P tc-report https://github.com/GCTC-NTGC/tc-report _site --squash`
- `/infrastructure`, support files for the docker infrastructure to run the project
- `/maintenance`, additional scripts which run inside the docker containers for setup and updates

The api, frontend, and auth projects are designed to each run in a separate container. However, since they all use the [Laravel](https://github.com/laravel/laravel) or [Lumen](https://github.com/laravel/lumen) framework, they can also be run on a single PHP server, with requests routed carefully between them. This is currently how docker infrastructure works.

Each sub-project has its own `README.md`, with advice on how to contribute to that sub-project. The README files also contain notes on how to configure the sub-projects, but if you simply want to get the project running on a new machine, you may disregard these notes and move straight to the steps below.

## Getting Started
### Running with Docker

We strongly recommend running the project entirely with Docker. In this case the only dependency you must install on your machine is [Docker Desktop](https://www.docker.com/products/docker-desktop).

Then, follow the instructions in `./maintenance/README.md` to build the project docker containers and run the build scripts. That should handle everything!

### Complications?
- Make sure virtualization is enabled in your machine's BIOS (this is for Docker Desktop)
- Docker is finicky—try exiting it entirely and restarting it

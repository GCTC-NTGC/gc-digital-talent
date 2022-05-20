# Welcome to the GC Digital Talent monorepo

The GC Digital Talent app is divided into multiple services, each treated as its own sub-project:
- `/api`, the API service
- `/frontend`, an npm project for frontend client code containing multiple [workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces):
  - `/admin`, a CRUD-style admin dashboard
  - `/talentsearch`, pages related to searching and requesting talent from pools
  - `/common`, code shared by multiple other workspaces
- `/tc-report`, static content copied from [another repo](https://github.com/GCTC-NTGC/tc-report) using [git-subtree](https://www.atlassian.com/git/tutorials/git-subtree). Merge updates from that repo with `git subtree pull -P tc-report https://github.com/GCTC-NTGC/tc-report _site --squash`
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
  - See [`frontend/cypress/README.md`](/frontend/cypress/README.md)
- security checks (aka _security regression_ testing)
  - CodeQL (JavaScript, ~~TypeScript~~)

As much as possible, we aspire to make these runnable on:
- :keyboard: your local command line
- :computer: your IDE
- :cloud: our continuous integration (CI) environment

### Cypress tests

Cypress is an end-to-end testing tool that can drive Chrome, Firefox, and MS
Edge, and replace manual testing with in-browser automation.

- tool paths: [`frontend/cypress/`][] & [`frontend/cypress.json`][]
- :keyboard: command line
  - `cd frontend && npm run` (commands that start with `e2e:`)
  - `npm run e2e:open`: Opens the Cypress console, where can choose browser and spec file. Runs in implicit "watch" mode.
  - `npm run
- :cloud: CI: [workflow config][e2e-config] | [workflow runs][e2e-runs]

**Tips & Tricks**
<sup>Click through into linked files for tips relevant to our usage.</sup>
- helpful terms
  - a "test _file_": `cypress/integration/foo/bar.spec.js`
  - a "test" (BDD term): `it('does something', () => { ... })`
    - tests a unit of functionality with isolation
  - a "context" (BDD term): `context('Foo', () => { ... })` (alias of `describe()`)
    - a set of tests or other contexts
- `cypress/support/`: for utility functions (some auto-loaded, some manually imported in appropriate test files)
  - [`cypress/support/index.js`][]: for things that need to run before each test or test file (auto-loaded)
  - [`cypress/support/commands.js`][]: for **custom commands** ([official docs][command-docs]) (auto-loaded)
  - [`cypress/support/graphql-test-utils.js`][]: an example util file imported in specific test files.
- [`frontend/cypress/integration/`][]: for writing our tests
  - try to keep tests in folder according to actual app. if tests must
    straddle, consider keeping them in the root test directory
  - helper functions (e.g., `onDashboard(() => { ... })`)
    - these also make tests more **legible**. consider them more like documentation or comments.
    - writing them at the top of a single test is a-ok
    - single-line helpers are also a-ok (re: legibility)
    - consider keeping them **as close to implementation as possible**, hoisting only as far as needed

**Advanced: cross-origin security and limitations**
See: https://docs.cypress.io/guides/guides/web-security

- Cypress isn't designed to access websites off the primary domain
  - these limitations concern different "superdomains"
    - `example1.com` vs `example2.com`
    - `localhost:8080` vs `localhost:8081`
    - this affects **our `mock-oauth2-server`**
  - superdomain limitations do not affect subdomains
    - `www.example.com` vs `auth.example.com` (this is ok)
  - general work-arounds
    - using `cy.request()` instead of `cy.visit()`
    - set `chromeWebSecurity:false` in `cypress.json` (still has caveats, and
      mitigation only works for Chrome browser)
    - if disabled, our Laravel API app will now be suspicious of Cypress,
      and its default security policies cause other issues with session
      cookies. (See [`frontend/.apache_env`][] for two envvars that must be
      adjusted)
- mitigations of this issue in our setup
  - we'll keep `chromeWebSecurity:true` for our CI runs
  - when a test needs security disabled to work, we'll use `it.skip('does
    thing', () => { ... })` and add comment with `chromeWebSecurity:false`

   [`cypress/support/index.js`]: /frontend/cypress/support/index.js
   [`cypress/support/commands.js`]: /frontend/cypress/support/commands.js
   [`cypress/support/graphql-test-utils.js`]: /frontend/cypress/support/graphql-test-utils.js
   [`frontend/cypress/integration/`]: /frontend/cypress/integration/
   [`frontend/.apache_env`]: /frontend/.apache_env
   [command-docs]: https://docs.cypress.io/api/cypress-api/custom-commands#Syntax
   [`frontend/cypress/`]: /frontend/cypress/
   [`frontend/cypress.json`]: /frontend/cypress.json
   [e2e-config]: /.github/workflows/e2e-tests.yml
   [e2e-runs]: https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/e2e-tests.yml

## Getting Started
### Running with Docker

We strongly recommend running the project entirely with Docker. In this case the only dependency you must install on your machine is [Docker Desktop](https://www.docker.com/products/docker-desktop).

Then, follow the instructions in `./maintenance/README.md` to build the project docker containers and run the build scripts. That should handle everything!

### Complications?
- Make sure virtualization is enabled in your machine's BIOS (this is for Docker Desktop)
- Docker is finicky—try exiting it entirely and restarting it

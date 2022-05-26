# GC Digital Talent: End-to-End Testing

We use a framework called Cypress to run end-to-end tests against an actual
version of the website running in the browser. (Chrome, Firefox, or Edge)

:gear: Configuration: [`frontend/cypress.json`][]  
:open_file_folder: Folder: [`frontend/cypress/`][]  
:cloud: CI workflow: [config][e2e-config] | [run logs][e2e-runs]

![](https://i.imgur.com/t3p6Alo.png)

## Commands

These commands exist via NPM scripts:

(Type `npm run` in `frontend/` to list all commands.)

### `npm run e2e:open`

Opens a visual console with the option to run any test on any installed browser that is supported.

### `npm run e2e:run:*`

These commands will run tests directly, without going through the visual console.

The environment variable `TEST_FILTER` can be used to filter the tests run, and
constrain them to a subset of test suite.

Examples:

```
# Equivalent to matching specs with `cypress/integration/**/*secrets*.spec.js`
#   - cypress/integration/talentsearch/foo.secrets.spec.js
#   - cypress/integration/admin/bar.secrets.spec.js
TEST_FILTER=secrets npm run e2e:run:all

# Equivalent to matching spec with `cypress/integration/**/*static-pages*.spec.js`
#   - cypress/integration/talentsearch/static-pages.spec.js
TEST_FILTER=static-pages npm run e2e:run:all
```

### `npm run e2e:run:all`

Runs all E2E tests on Chrome. Can be used with `TEST_FILTER` envvar.

Examples:

```
npm run e2e:run:all
TEST_FILTER=foo npm run e2e:run:all
```

### `npm run e2e:run:inspect`

This is intended to run a single test for inspection in a "headed" browser
(non-headless). Unlike other commands, it will not close the browser after the
test runs. This allows for using Chrome DevTools to inspect the state of the
app and explore.

It works best with `TEST_FILTER`, which defaults to "language-selection" if not set.

For example, this will run the `integration/talentsearch/static-pages.spec.js`
test in the Chrome browser, and leave it open (success or failure):

```
TEST_FILTER=static-pages npm run e2e:run:inspect
```

## Tips & Tricks
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

## Advanced: Cross-origin security and limitations
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

<!-- Links -->
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

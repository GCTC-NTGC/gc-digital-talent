# GC Digital Talent: End-to-End Testing

We use a framework called Cypress to run end-to-end tests against an actual
version of the website running in the browser. (Electron, Chrome, Firefox, or Edge)

:gear: Configuration: [`apps/e2e/cypress.config.ts`][]  
:open_file_folder: Folder: [`apps/e2e/`][]  
:cloud: CI workflow: [config][e2e-config] | [run logs][e2e-runs]

![](https://i.imgur.com/t3p6Alo.png)

## Debugging Failing Tests

- We run our E2E test suite on pull requests.
- When there are test **failures in CI**, there are a few ways to debug:
  - **Review captured videos and screenshots.** Cypress makes these for every test
    run. They're compressed and published as artifacts of each CI run. You can
    download them from each GitHub Action run's "Summary" page.
  - **Advanced debug output for failed test runs** via
    [`archfz/cypress-terminal-report`](https://github.com/archfz/cypress-terminal-report).
    - Normally, the most detailed output is in the **Cypress Console UI**. But it's
      hard to read in captured videos, and annoying to reproduce locally.
    - This detailed output is printed **only for failing tests**.
  - **Check the status and logs of containers.**
    - On failed CI runs, we list the status of containers (e.g., one may have
      crashed), and print out the logs of important containers (e.g., Nginx
      logs of the webserver container).
      [config](https://github.com/GCTC-NTGC/gc-digital-talent/blob/main/.github/workflows/cypress.yml#L85-L91)
- When you need to debug locally, these tips can help:
  - Run `npm run e2e:open` to start the Cypress UI, which has an **implicit
    watch mode**. (Saving test files will restart the active test.)
  - **Append `.skip` or `.only`** to any `it()` test or even a whole
    `context()`.
    - `it.skip('foo', () => { ... })` will skip that one test in a test file.
    - `context.only('bar', () => { ... })` will skip everything else except its
      tests.
  - **Pause and explore live test sessions** to investigate the test state.
    - **Click the url bar to use the app** in a new tab, with whatever
      browser state was active at the time.
    - The **"stop" button** allows stopping a local test mid-run.
    - Use the browser **after test failure** and see what went wrong.
- When you are hitting timeouts from a slow local workstation:
  - Prepend your cypress launch command with `CYPRESS_EXTEND_TIMEOUTS=1`
  - This will extend all timeouts to 60 seconds, to give plenty of time, even
    if your local workstation or just Docker is running slowly.
  - e.g., `CYPRESS_EXTEND_TIMEOUTS=1 npm run e2e:run`

## Plugins and Helpers

### [`apps/e2e/cypress/support/graphql-test-utils.js`](/apps/e2e/cypress/support/graphql-test-utils.ts)

See the official Cypress docs: [Working with GraphQL](https://docs.cypress.io/guides/end-to-end-testing/working-with-graphql)

### [`@testing-library/cypress`](https://testing-library.com/docs/cypress-testing-library/intro/)

This offers the familiar `findByRole()`, `findByLabelText()` etc queries from
React's `@testing-library`

```js
cy.findByRole("button", { name: /Button Text/i }).should("exist");
cy.findByRole("button", { name: /Non-existing Button Text/i }).should(
  "not.exist",
);
cy.findByLabelText(/Label text/i, { timeout: 7000 }).should("exist");
```

Note: `get*()` queries are not available, as they're not compatible with how
Cypress works by default.

See official documentation linked above for examples.

## Commands

These commands exist via NPM scripts:

(Type `npm run` in `/` to list all commands.)

### `npm run e2e:open`

Opens a visual console with the option to run any test on any installed browser that is supported.

### `npm run e2e:run:*`

These commands will run tests directly, without going through the visual console.

The environment variable `TEST_FILTER` can be used to filter the tests run, and
constrain them to a subset of test suite.

Examples:

```
# Equivalent to matching specs with `apps/e2e/cypress/e2e/**/*secrets*.cy.ts`
#   - apps/e2e/talentsearch/foo.secrets.cy.ts
#   - apps/e2e/admin/bar.secrets.cy.ts
TEST_FILTER=secrets npm run e2e:run:all

# Equivalent to matching spec with `apps/e2e/cypress/e2e/**/*static-pages*.cy.ts`
#   - apps/e2e/talentsearch/static-pages.cy.ts
TEST_FILTER=static-pages npm run e2e:run:all
```

### `npm run e2e:run:all`

Runs all E2E tests on Electron. Can be used with `TEST_FILTER` envvar.

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

For example, this will run the `cypress/e2e/talentsearch/static-pages.cy.ts`
test in the Electron browser, and leave it open (success or failure):

```
TEST_FILTER=static-pages npm run e2e:run:inspect
```

## Tips & Tricks

<sup>Click through into linked files for tips relevant to our usage.</sup>

- helpful terms
  - a "test _file_": `cypress/e2e/foo/bar.cy.ts`
  - a "test" (BDD term): `it('does something', () => { ... })`
    - tests a unit of functionality with isolation
  - a "context" (BDD term): `context('Foo', () => { ... })` (alias of `describe()`)
    - a set of tests or other contexts
- `cypress/support/`: for utility functions (some auto-loaded, some manually imported in appropriate test files)
  - [`cypress/support/e2e.ts`][]: for things that need to run before each test or test file (auto-loaded)
  - [`cypress/support/commands.ts`][]: for **custom commands** ([official docs][command-docs]) (auto-loaded)
  - [`cypress/support/graphql-test-utils.ts`][]: an example util file imported in specific test files.
- [`apps/e2e/cypress/`][]: for writing our tests
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
  - general workarounds
    - using `cy.request()` instead of `cy.visit()`
    - set `chromeWebSecurity:false` in `cypress.config.ts` (still has caveats, and
      mitigation only works for Chromium-based browsers)
      - with the above change, our Laravel API app will unfortunately become
        suspicious of Cypress, and its default security policies cause other
        issues with session cookies. To resolve, you'll want to set these
        environment variables in `/api/.env`:
        - `SESSION_SAME_SITE_COOKIE=none`
        - `SESSION_SECURE_COOKIE=false`
- mitigations of this issue in our setup
  - we'll keep `chromeWebSecurity:true` for our CI runs
  - when a test needs security disabled to work, we'll use `it.skip('does
thing', () => { ... })` and add comment with `chromeWebSecurity:false`

<!-- Links -->

[`cypress/support/e2e.ts`]: /apps/e2e/cypress/support/e2e.ts
[`cypress/support/commands.ts`]: /apps/e2e/cypress/support/commands.ts
[`cypress/support/graphql-test-utils.ts`]: /apps/e2e/cypress/support/graphql-test-utils.ts
[`apps/e2e/cypress/`]: /apps/e2e/cypress/
[`/api/.env`]: /api/.env
[command-docs]: https://docs.cypress.io/api/cypress-api/custom-commands#Syntax
[`apps/e2e/`]: /apps/e2e/
[`apps/e2e/cypress.config.ts`]: /apps/e2e/cypress.config.ts
[e2e-config]: /.github/workflows/cypress.yml
[e2e-runs]: https://github.com/GCTC-NTGC/gc-digital-talent/actions/workflows/cypress.yml

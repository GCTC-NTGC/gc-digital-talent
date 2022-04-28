# GC Digital Talent: End-to-End Testing

We use a framework called Cypress to run end-to-end tests against an actual version of the website running in the browser.

## Usage

These commands exist via NPM scripts:

### `npm run e2e:open`

Opens a visual console with the option to run any test on any installed browser that is supported.

### `npm run e2e:run:*`

These commands will run tests directly, without going through the visual console.

The environment variable `E2E_FILTER` can be used to filter the tests run, and
constrain them to a subset of test suite.

Examples:

```
# Equivalent to matching specs with `cypress/integration/**/*secrets*.spec.js`
#   - cypress/integration/talentsearch/foo.secrets.spec.js
#   - cypress/integration/admin/bar.secrets.spec.js
E2E_FILTER=secrets npm run e2e:run:all

# Equivalent to matching spec with `cypress/integration/**/*static-pages*.spec.js`
#   - cypress/integration/talentsearch/static-pages.spec.js
E2E_FILTER=static-pages npm run e2e:run:all
```

### `npm run e2e:run:all`

Runs all E2E tests on Chrome. Can be used with `E2E_FILTER` envvar.

Examples:

```
npm run e2e:run:all
E2E_FILTER=foo npm run e2e:run:all
```

### `npm run e2e:run:inspect`

This is intended to run a single test for inspection in a "headed" browser
(non-headless). Unlike other commands, it will not close the browser after the
test runs. This allows for using Chrome DevTools to inspect the state of the
app and explore.

It works best with `E2E_FILTER`, which defaults to "language-selection" if not set.

For example, this will run the `integration/talentsearch/static-pages.spec.js`
test in the Chrome browser, and leave it open (success or failure):

```
E2E_FILTER=static-pages npm run e2e:run:inspect
```

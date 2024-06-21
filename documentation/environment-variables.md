# Environment Variables

Environment variables are created and used in many places throughout the repo. This document covers the use of environment variables in a development environment. Environment management in production is out of scope.

## Laravel

The [Laravel](https://laravel.com/) project **api** reads environment variables from the `.env` file in the root of its project directory. These files are not checked into version control. When running the setup scripts, a new one is copied from the `.env.example` template and then customized. In a development environment, these files are reread on every new PHP request. If needed, a configuration reset can be forced with `php artisan config:clear`.

## Frontend

The frontend [React](https://reactjs.org/) projects uses environment variables in two distinct ways: **build-time** variables and **run-time** variables.

### Build-Time Variables

The **apps** subprojects (./) have `.env` files that are copied from `.env.example` template files like the Laravel project. When the app projects are built using [vite](https://vitejs.dev/), variables from the `.env` file are defined in the resulting bundle using [define option](https://vitejs.dev/config/shared-options.html#define). These values are "baked into" the bundle and if there are any variable changes, the subproject must be rebuilt to reflect them.

### Run-Time Variables

For deployment in production, there needs to be a way to change variables in the program without rebuilding. This allows us to use environment variables as "feature flags", which enable/disable specific features with the same deployed code artifact. This is done using [envsubst](https://www.gnu.org/software/gettext/manual/html_node/envsubst-Invocation.html) to fill environment variables into the `index.html` files while setting up the app service, post-deploy. In a development environment, these variables are injected into the `index.html` file by vite during build. To update these variables locally, just update the `.env` file and rebuild the bundle.

To check what variables have been set in the app, open the console of your browser and enter:
`window.__SERVER_CONFIG__`

#### End-to-End Testing

Since run-time variables are used to maintain the current feature set and can be changed, tests should be run against both versions of a specific feature set. In order to do this, the feature flags must be overridden in the test specifications.

When writing test specifications, run-time variables can be modified for the entire spec, or for specific tests using the `overrideFeatureFlags(flags)` method.

##### Override for entire spec

```tsx
test("Override for all tests", async ({ page }) => {
  test.beforeEach(async ({ page }) => {
    overrideFeatureFlags({ FEATURE_FLAG: null });
  });
});
```

##### Override for specific test

```tsx
test("Override for specific test", async ({ page }) => {
  test("Is overridden", () => {
    overrideFeatureFlags({ FEATURE_FLAG: null }); // Must be called before visiting a page
    await page.goto("/");
  });
  test("Is default", async ({ page }) => {
    await page.goto("/");
  });
});
```

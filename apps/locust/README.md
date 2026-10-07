# Locust load tests

Load tests for public pages, run with [Locust](https://locust.io/) locally or in Azure Load Testing.

| Page        | Script                | Azure config            |
| ----------- | --------------------- | ----------------------- |
| Search      | `search_page.py`      | `search-page.yaml`      |
| Browse jobs | `browse_jobs_page.py` | `browse-jobs-page.yaml` |
| Job poster  | `job_poster_page.py`  | `job-poster-page.yaml`  |

Each visit loads a page the way the browser does: the page HTML, then the app shell GraphQL queries (`authorizationQuery`, `SitewideBanner`) in parallel, then the page's own queries in parallel. This hits PHP-FPM and Postgres, not just Nginx. Static assets (JS, CSS, images) aren't requested, since browsers cache them.

Each virtual user gets its own `ai_user` cookie, because the API rate limits by user, then `ai_user`, then IP (`APP_RATE_LIMIT`, 600/min by default).

## Metrics

On top of the standard Locust stats (request count, failures, response time percentiles, throughput, response size), the scripts record:

- **One row per GraphQL operation**, named after the operation, so slow queries are easy to spot
- **`PAGE` rows** (`page_load_*`): total time for a full page load, failed if any request in it failed
- **`SERVER` rows** (`server_total_*`, `server_db_*`): server time and database time from the API's `Server-Timing` header (needs `SERVER_TIMING_ENABLED=true` on the target)
- **Grouped failures**: HTTP status, rate limited (429), GraphQL error, empty data, connection error
- **End of test summary** in the log: Server-Timing percentiles per operation (bootstrap, Lighthouse, database, total), GraphQL error counts, lowest rate limit headroom seen

`PAGE` and `SERVER` rows count toward the overall totals. Set `SYNTHETIC_METRICS=false` if you only want real HTTP requests in the totals.

Server side metrics (App Service CPU/memory, Postgres CPU/connections) come from Azure, see `appComponents` in the yaml files.

## Settings

Load settings (host, users, spawn rate, run time) are in `locust.conf`. Script settings are environment variables:

| Variable             | Default            | Used by    |
| -------------------- | ------------------ | ---------- |
| `LOCALES`            | `en,fr`            | all        |
| `THINK_TIME_MIN`     | `5`                | all        |
| `THINK_TIME_MAX`     | `15`               | all        |
| `SYNTHETIC_METRICS`  | `true`             | all        |
| `MAX_FILTER_CHANGES` | `4`                | search     |
| `POOL_IDS`           | all published jobs | job poster |

## Running locally

```sh
pip install locust
cd apps/locust
locust -f search_page.py --config locust.conf --host http://localhost:8000
```

Open http://localhost:8089 for the web UI, or add `--headless -u 5 -r 1 -t 1m` to run in the terminal.

## Running in Azure Load Testing

`bundle.py` builds one self-contained file per page (with `common.py` and `queries.py` inlined) in `azure/`, so a test is a single upload. The host defaults to Dev.

1. Run the Azure DevOps pipeline from `infrastructure/azure-pipelines-locust.yml` on the branch you want
2. Download the `locust-scripts` artifact from the run
3. In Azure Load Testing, create a test with **Upload a script**, pick **Locust** and upload the page's file
4. Set users, spawn rate and duration on the **Load** tab

To update a test, rerun the pipeline and re-upload the file on the test's **Edit** page.

With CLI access to the Load Testing resource you can skip the uploads and use the yaml configs instead:

```sh
az load test create --load-test-resource <resource> --resource-group <group> \
  --test-id search-page --load-test-config-file search-page.yaml
```

## Keeping the queries in sync

`queries.py` is generated from the frontend so the tests send the same queries as the app. Regenerate it after page queries change:

```sh
pnpm --filter @gc-digital-talent/graphql codegen
node apps/locust/generate_queries.mjs
```

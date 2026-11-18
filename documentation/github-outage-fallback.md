# GitHub outage fallback

If GitHub is down, Azure DevOps can't fetch our code, so we can't build anything new. The site keeps running and we can still redeploy an existing build, but an urgent fix would be stuck.

To cover that, every merge to `main` is pushed to the `gc-digital-talent-fallback` repo in Azure Repos, and a fallback pipeline can build from it by hand.

## How it works

- [`azure-pipelines-mirror.yml`](../infrastructure/azure-pipelines-mirror.yml) runs on every merge to `main` and pushes GitHub's `main` and tags to the fallback repo. The push isn't forced, so it fails instead of overwriting fixes made there during an outage. Run from any other branch, it also pushes that branch to `verify/<branch>`.
- [`azure-pipelines.yml`](../infrastructure/azure-pipelines.yml) publishes a `composer-cache` artifact on every build. Composer downloads most packages from GitHub, so the fallback build installs from this cache instead.
- The fallback pipeline runs the same `azure-pipelines.yml` from the fallback repo with `fallback` turned on.

A fix that changes `composer.lock` can't be built during an outage, since the new packages aren't in the cache.

## One-time setup

1. Create an Azure Repos repo named `gc-digital-talent-fallback` in the same project. Uncheck **Add a README** so it starts empty.
2. In **Project settings → Repositories → gc-digital-talent-fallback → Security**, check `Talent Cloud Build Service` has **Contribute**, **Create branch** and **Create tag**. If the mirror push gets a 403, give them to `Project Collection Build Service` too.
3. Create the mirror pipeline from `infrastructure/azure-pipelines-mirror.yml` in GitHub. Leave its triggers as they are in the YAML. After the first run, check `main` is the fallback repo's default branch.
4. Create the fallback pipeline from `infrastructure/azure-pipelines.yml` in the **fallback repo**, on `main`.
   - Triggers: turn on **Override the YAML continuous integration trigger** and **Disable continuous integration**, otherwise it builds on every mirror push.
   - Variables: add `mainPipelineDefinitionId` set to the main build pipeline's definition ID (the `definitionId` in its URL).
5. Clone the release as `gc-digital-talent-fallback-release`.
   - Replace the artifact with the fallback pipeline using the **same source alias**, so the deploy tasks find the package.
   - Leave the continuous deployment trigger off.
   - Secret variables aren't copied by a clone, so fill them in again or link the same variable group.
   - When the real release changes, make the same change here.
6. Do a drill (below).

## During an outage

If you can still push to GitHub (only Actions or PRs are down, say), keep working as usual. Use this only when pushing to GitHub or building from it fails.

1. Make the fix in the fallback repo, either in the Azure Repos web editor or from your local clone:

   ```sh
   git remote add fallback https://dev.azure.com/tbs-sct/Talent%20Cloud/_git/gc-digital-talent-fallback
   git fetch fallback
   git switch -c my-fix fallback/main
   # commit the fix
   git push fallback my-fix
   ```

   Then merge it into the fallback repo's `main`, ideally through an Azure Repos PR.

2. Run the fallback pipeline on `main` with **Fallback build** checked.
3. Deploy its artifact with `gc-digital-talent-fallback-release`.

## After GitHub is back

1. Push the fallback repo's `main` to a GitHub branch and open a PR:

   ```sh
   git fetch fallback
   git push origin fallback/main:refs/heads/outage-fixes
   ```

2. Merge it with a **merge commit** (not squash), so GitHub `main` contains the fallback commits.
3. Check that the next mirror run is green.
4. If it was squash merged anyway, or the mirror stays red, someone with force push rights on the fallback repo resets its `main` once:

   ```sh
   git fetch origin main
   git push --force fallback origin/main:refs/heads/main
   ```

## Drill

Run this every few months, and after any big change to the build.

1. Run the fallback pipeline with **Fallback build** and **Block GitHub on the agent** both checked. This blocks GitHub on the build agent, like a real outage.
2. Deploy the artifact with `gc-digital-talent-fallback-release` to DEV, and check the site loads.

## Testing a change to these pipelines

Without merging to `main` first:

1. Run the mirror pipeline on your branch with **Run pipeline** (not **Rerun**, which reuses the old commit). It pushes your branch to `verify/<branch>` in the fallback repo, listed under the **All** tab on the Branches page.
2. Run the fallback pipeline on `verify/<branch>` with **Fallback build** off and **Composer cache source** set to `self`. This publishes a composer cache for the next run.
3. Run it again with **Fallback build** and **Block GitHub on the agent** on, and **Composer cache source** `self`.
4. Deploy that artifact with `gc-digital-talent-fallback-release` to DEV.

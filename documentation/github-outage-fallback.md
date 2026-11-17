# GitHub outage fallback

If GitHub is down, Azure DevOps can't fetch our code, so we can't build anything new. The site keeps running and we can still redeploy an existing build, but an urgent fix would be stuck.

To cover that, every merge to `main` is pushed to the `gc-digital-talent-fallback` repo in Azure Repos, and a fallback pipeline can build from it by hand.

## How it works

- [`azure-pipelines-mirror.yml`](../infrastructure/azure-pipelines-mirror.yml) runs on every merge to `main` and pushes `main` and tags to the fallback repo. The push isn't forced, so it fails instead of overwriting fixes made there during an outage.
- [`azure-pipelines.yml`](../infrastructure/azure-pipelines.yml) publishes a `composer-cache` artifact on every build. Composer downloads most packages from GitHub, so the fallback build installs from this cache instead.
- The fallback pipeline runs the same `azure-pipelines.yml` from the fallback repo with `fallback` turned on.

A fix that changes `composer.lock` can't be built during an outage, since the new packages aren't in the cache.

## One-time setup

1. Create an Azure Repos repo named `gc-digital-talent-fallback` in the same project. Uncheck **Add a README** so it starts empty.
2. In **Project settings → Repositories → gc-digital-talent-fallback → Security**, give `<project> Build Service` **Contribute** and **Create tag**. If the mirror push gets a 403, give them to `Project Collection Build Service` too.
3. Create a pipeline named `gc-digital-talent-mirror` from `infrastructure/azure-pipelines-mirror.yml` in GitHub. Only run it on `main`, never on a feature branch. On the first run, **Permit** access to the fallback repo.
4. Create a pipeline named `gc-digital-talent-fallback` from `infrastructure/azure-pipelines.yml` in the **fallback repo**.
   - Triggers: turn on **Override the YAML continuous integration trigger** and **Disable continuous integration**, otherwise it builds on every mirror push.
   - Variables: add `mainPipelineDefinitionId` set to the main build pipeline's definition ID (the `definitionId` in its URL).
5. Clone the release as `gc-digital-talent-fallback-release`. In the clone, replace the artifact with the fallback pipeline using the **same source alias**, so the deploy tasks find the package, and leave the continuous deployment trigger off.
6. Do a drill (below).

## During an outage

1. Make the fix in the fallback repo, either in the Azure Repos web editor or by pushing a branch and merging it there.
2. Run the fallback pipeline on `main` with **Fallback build** checked.
3. Deploy its artifact with `gc-digital-talent-fallback-release`.

## After GitHub is back

1. Open a PR on GitHub from the fallback repo's commits, and merge it with a **merge commit** (not squash), so GitHub `main` contains them.
2. Check that the next mirror run is green.
3. If it was squash merged anyway, or the mirror stays red, reset the fallback repo's `main` to match GitHub once, by hand:

   ```sh
   git fetch origin main
   git push --force <fallback repo url> origin/main:refs/heads/main
   ```

## Drill

Run this every few months, and after any big change to the build.

1. Run the fallback pipeline with **Fallback build** and **Block GitHub on the agent** both checked. This blocks GitHub on the build agent, like a real outage.
2. Deploy the artifact with `gc-digital-talent-fallback-release` to a non-prod slot, like the pilot slot, and check the site loads.

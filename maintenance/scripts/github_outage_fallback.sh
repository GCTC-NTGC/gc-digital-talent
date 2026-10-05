#! /usr/bin/env bash

# Push the last known state of main to an Azure Repos fallback repo so we can
# keep building and deploying while GitHub is unreachable.
#
# Run from the most up to date local clone (check with `git log -1 origin/main`).
# Only git is required. Pass --create to also create the Azure Repos repo and
# the fallback pipeline, which needs the az CLI with the azure-devops extension.
#
# Usage:
#   maintenance/scripts/github_outage_fallback.sh --org <org> --project <project> [options]
#
# Options:
#   --org <name>        Azure DevOps organization (required)
#   --project <name>    Azure DevOps project (required)
#   --repo <name>       Fallback repo name (default: gc-digital-talent-fallback)
#   --pipeline <name>   Fallback pipeline name (default: <repo>-build)
#   --create            Create the repo and pipeline with az before pushing
#   --dry-run           Print what would happen without changing anything

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

org=""
project=""
repo="gc-digital-talent-fallback"
pipeline=""
create=false
dry_run=false
remote_name="azure-fallback"
yml_path="infrastructure/azure-pipelines.yml"

usage() {
  sed -n '/^# Usage:/,/^$/p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
  exit 1
}

run() {
  echo "+ $*"
  if [ "$dry_run" = false ]; then
    "$@"
  fi
}

while [ $# -gt 0 ]; do
  case "$1" in
    --org) org="$2"; shift 2 ;;
    --project) project="$2"; shift 2 ;;
    --repo) repo="$2"; shift 2 ;;
    --pipeline) pipeline="$2"; shift 2 ;;
    --create) create=true; shift ;;
    --dry-run) dry_run=true; shift ;;
    -h|--help) usage ;;
    *) echo "Unknown option: $1"; usage ;;
  esac
done

if [ -z "$org" ] || [ -z "$project" ]; then
  echo "--org and --project are required."
  usage
fi

pipeline="${pipeline:-${repo}-build}"
org_url="https://dev.azure.com/${org}"
remote_url="${org_url}/${project}/_git/${repo}"

cd "$(git rev-parse --show-toplevel)"

# Show how fresh this clone's copy of GitHub main is.
if ! git rev-parse --verify --quiet origin/main > /dev/null; then
  echo "origin/main not found in this clone. Use a clone that has fetched from GitHub."
  exit 1
fi

echo "Last commit on origin/main in this clone:"
git log -1 origin/main --format='  %h %ci %an%n  %s'

if [ -f .git/FETCH_HEAD ]; then
  fetched_at=$(date -r .git/FETCH_HEAD '+%Y-%m-%d %H:%M')
  echo "Last fetch from GitHub: ${fetched_at}"
fi

echo
echo "Anything merged on GitHub after that fetch will not be in the fallback repo."
if [ "$dry_run" = false ]; then
  read -r -p "Continue with this clone? [y/N] " answer
  if [ "$answer" != "y" ] && [ "$answer" != "Y" ]; then
    echo "Aborted."
    exit 1
  fi
fi

if [ "$create" = true ]; then
  if ! command -v az > /dev/null; then
    echo "az CLI not found. Install it, or create the repo in the Azure DevOps UI and rerun without --create."
    exit 1
  fi

  run az devops configure --defaults organization="$org_url" project="$project"

  if az repos show --repository "$repo" > /dev/null 2>&1; then
    echo "Repo ${repo} already exists, skipping creation."
  else
    run az repos create --name "$repo"
  fi
fi

# Point the fallback remote at the Azure Repos repo.
if git remote get-url "$remote_name" > /dev/null 2>&1; then
  run git remote set-url "$remote_name" "$remote_url"
else
  run git remote add "$remote_name" "$remote_url"
fi

# Push GitHub's main (not local work) plus tags. No force: if the fallback repo
# already has commits made during the outage, this fails instead of losing them.
run git push "$remote_name" origin/main:refs/heads/main
run git push "$remote_name" --tags

if [ "$create" = true ]; then
  if az pipelines show --name "$pipeline" > /dev/null 2>&1; then
    echo "Pipeline ${pipeline} already exists, skipping creation."
  else
    run az pipelines create \
      --name "$pipeline" \
      --repository "$repo" \
      --repository-type tfsgit \
      --branch main \
      --yml-path "$yml_path" \
      --skip-first-run
  fi
fi

echo
echo "Done. Fallback repo: ${remote_url}"
echo
echo "Next steps:"
if [ "$create" = false ]; then
  echo "  - In Azure DevOps, create a pipeline from Azure Repos Git > ${repo} > ${yml_path}"
fi
echo "  - Run the fallback pipeline and check it can use the existing service connections"
echo "  - Push fixes during the outage with: git push ${remote_name} <branch>:main"
echo "  - When GitHub is back, open a PR with anything committed to the fallback repo,"
echo "    then disable the fallback pipeline"

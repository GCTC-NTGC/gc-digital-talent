# Local Environment Setup and Maintenance

This project contains a collection of scripts to use a maintenance container to setup and maintain a local environment for development.

## Environment First-Time Setup

To set up a local development environment, run these commands from the repo root:

1. Build and run the containers: `docker compose up --detach --build`
2. To setup the apps: `docker compose run --rm maintenance bash setup.sh`
3. Next you can log in:
   - For testing admin accounts:
     1. Navigate to http://localhost:8000/login
     2. Enter `admin@test.com` as the "User/subject" (the "Claims" input can be left blank, and there is no password)
     3. Navigate to http://localhost:8000/admin
   - For testing applicant accounts:
     1. Navigate to http://localhost:8000/en/login-info
     2. Click on "Get started"
     3. Enter `applicant@test.com` as the "User/subject" (the "Claims" input can be left blank, and there is no password)
     4. Navigate to http://localhost:8000/en/applicant

## Environment Maintenance

To refresh each subproject after they have been setup run one of the refresh scripts:

- `docker compose run --rm maintenance bash refresh_api.sh`
- `docker compose run --rm maintenance bash refresh_frontend.sh`

Or refresh all of them in order:

- `docker compose run --rm maintenance bash refresh_all.sh`

## Working on UI

In order to compile and render UI for development, you have two options:

- log into the local UI using the steps above
- run Storybook to view individual components

### Logging into the UI

- From project root run `pnpm run watch`
- Allow the first compile to happen
- Make some changes, watch it recompile, and refresh your page

### Running Storybook

- From project root run `pnpm run storybook`
- Allow the first compile to happen
- Make some changes, watch it recompile, and your Storybook page should automatically refresh

> [!NOTE]
> The containers run as whoever owns the checked-out project, so everything they
> generate is yours to edit without `sudo`. They work this out for themselves by
> looking at the mounted files -- there is nothing to configure, and nothing to
> undo on macOS or Windows, where docker hands back host-owned files regardless.

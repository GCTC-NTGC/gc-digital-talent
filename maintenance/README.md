# Local Environment Setup and Maintenance

This project contains a collection of scripts to use a maintenance container to setup and maintain a local environment for development.

## Environment First-Time Setup

To set up a local development environment, run these commands from the repo root:

1. Create a `.env` recording your user and group ids, so the containers run as
   you and the files they generate are yours to edit:
   `printf 'HOST_UID=%s\nHOST_GID=%s\n' "$(id -u)" "$(id -g)" > .env`
   (see `.env.example`; without it, generated files end up owned by root)
2. Pre-create `node_modules`, which docker would otherwise create as root:
   `mkdir -p node_modules`
3. Build and run the containers: `docker compose up --detach --build`
4. To setup the apps: `docker compose run --rm maintenance bash setup.sh`
5. Next you can log in:
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

> [!TIP]
> Having trouble with permissions on generated files? Check that you have a
> `.env` with `HOST_UID`/`HOST_GID` set (step 1 above), then rebuild with
> `docker compose up --detach --build`. Files generated before that will still
> be root-owned: fix them with `sudo chown -R "$(id -u):$(id -g)" .`

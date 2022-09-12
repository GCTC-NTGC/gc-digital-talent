# Local Environment Setup and Maintenance

This project contains a collection of scripts to use a maintenance container to setup and maintain a local environment for development.

## Environment First-Time Setup

To set up a local development environment, run these commands from anywhere in repo:

1. Build and run the containers: `docker-compose up --detach --build`
2. To setup the apps: `docker-compose run --rm maintenance bash setup.sh`
   - <details>
        <summary>If you encounter unexpected hangs without error during <code>npm install</code>...</summary>
        ...try stopping `mock-auth` container temporarily. (It runs a Java app,
        and these can be memory hogs.) You can do this via Docker UI or this CLI
        command:
        ```
        docker-compose stop mock-auth
        # Finish building app.
        docker-compose start mock-auth
        ```
     </details>
3. Next you can log in:
   - For testing admin accounts:
     1. Navigate to http://localhost:8000/login
     2. Enter `admin@test.com` as the "User/subject" (the "Claims" input can be left blank, and there is no password)
     3. Navigate to http://localhost:8000/admin/dashboard
   - For testing applicant accounts:
     1. Navigate to http://localhost:8000/en/login-info
     2. Click on "Continue to GC Key and login"
     3. Enter `applicant@test.com` as the "User/subject" (the "Claims" input can be left blank, and there is no password)
     4. Navigate to http://localhost:8000/en/talent/profile

## Environment Maintenance

To refresh each sub-project after they have been setup run one of the refresh scripts:

- `docker-compose run --rm maintenance bash refresh_api.sh`
- `docker-compose run --rm maintenance bash refresh_common.sh`
- `docker-compose run --rm maintenance bash refresh_talentsearch.sh`
- `docker-compose run --rm maintenance bash refresh_indigenousapprenticeship.sh`
- `docker-compose run --rm maintenance bash refresh_admin.sh`

Or refresh all of them in order:

- `docker-compose run --rm maintenance bash refresh_all.sh`

## Working on UI

In order to compile and render UI for development, you have two options.

- log into the local UI using the steps above
- run Storybook to view individual components

### Logging into the UI

- Navigate to the app you'd like to work on (e.g. `cd frontend/talentsearch`)
- Run `npm run watch`
- Allow the first compile to happen
- Make some changes, watch it recompile, and refresh your page

### Running Storybook

- Navigate to the app you'd like to work on (e.g. `cd frontend/talentsearch`)
- Run `npm run storybook`
- Allow the first compile to happen
- Make some changes, watch it recompile, and your Storybook page should automatically refresh

**Note:** Having trouble with Storybook `.cache` permissions? Try running `sudo chmod 777 -R node_modules/.cache` from the relevant workspace.

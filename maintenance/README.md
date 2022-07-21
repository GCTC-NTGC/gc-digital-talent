# Local Environment Setup and Maintenance

This project contains a collection of scripts to use a maintenance container to setup and maintain a local environment for development.

## Environment First-Time Setup

To set up a local development environment, run these commands from anywhere in repo:

1. Build and run the containers: `docker-compose up --detach --build`
2. To setup the apps: `docker-compose run --rm maintenance bash setup.sh`
   -  <details>
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
      3. You should be redirected to http://localhost:8000/admin
   - For testing applicant accounts:
      1. Navigate to http://localhost:8000/en/login-info
      2. Click on "Continue to GC Key and login"
      3. Enter `applicant@test.com` as the "User/subject" (the "Claims" input can be left blank, and there is no password)
      4. You should be redirected to http://localhost:8000/en/talent/profile

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
For now, you'll want to have two terminal instances running: 
- 1 for the webpack watch script
- another for the Hydrogen watch script

If you're working with Docker, you'll want to enter your Docker container and run the following from there using: `docker-compose run -w /var/www/html maintenance bash`

In the first terminal:
1. Navigate to `frontend/app-i-want-to-work-on`
2. run `npm run watch`

In the second terminal:
1. Navigate to `frontend/common`
2. run `npx h2-watch`

If you run into errors with the webpack script, try restarting Docker and/or rerunning the first two steps in "First-time setup"

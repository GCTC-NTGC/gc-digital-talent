# Local Environment Setup and Maintenance

This project contains a collection of scripts to use a maintenance container to setup and maintain a local environment for development.

## Environment First-Time Setup

To set up a local development environment, run these commands from anywhere in repo:

 1. Build and run the containers: `docker-compose up --detach --build`
 2. To setup the apps: `docker-compose run --rm maintenance bash setup.sh`
 3. Open a browser and navigate to http://localhost:8000/login and login in
    with `admin@test.com` as "user/subject": (the "claims" text box can be left
    blank, and there is no password)
 4. You should be automatically redirected to http://localhost:8000/admin

## Environment Maintenance

To refresh each sub-project after they have been setup run one of the refresh scripts:

 - `docker-compose run --rm maintenance bash refresh_api.sh`
 - `docker-compose run --rm maintenance bash refresh_common.sh`
 - `docker-compose run --rm maintenance bash refresh_talentsearch.sh`
 - `docker-compose run --rm maintenance bash refresh_indigenousapprenticeship.sh`
 - `docker-compose run --rm maintenance bash refresh_admin.sh`

Or refresh all of them in order:

 - `docker-compose run --rm maintenance bash refresh_all.sh`

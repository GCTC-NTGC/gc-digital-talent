# Local Environment Setup and Maintenance

This project contains a collection of scripts to use a maintenance container to setup and maintain a local environment for development.

## Environment First-Time Setup

To set up a local development environment:

 1. Change to the `infrastructure` working directory
 2. Run `docker-compose up -d` to build the containers
 3. Run `docker-compose run --rm maintenance bash setup.sh` to setup the environment
 4. Open a browser and navigate to http://localhost:8000/login and login in with "admin@test.com" and "Test123!"
 5. Verify functionality by navigating to http://localhost:8000/admin and http://localhost:8000/talent

## Environment Maintenance

To refresh each sub-project after they have been setup run one of the refresh scripts:

 - `docker-compose run --rm maintenance bash refresh_auth.sh`
 - `docker-compose run --rm maintenance bash refresh_api.sh`
 - `docker-compose run --rm maintenance bash refresh_common.sh`
 - `docker-compose run --rm maintenance bash refresh_talentsearch.sh`
 - `docker-compose run --rm maintenance bash refresh_admin.sh`

Or refresh all of them in order:

 - `docker-compose run --rm maintenance bash refresh_all.sh`

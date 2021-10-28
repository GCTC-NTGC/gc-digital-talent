# Local Environment Setup and Maintenance

This project contains a collection of scripts to use a maintenance container to setup and maintain a local environment for development.

## Environment First-Time Setup

To set up a local development environment:

 1. Change to the `infrastructure` working directory
 2. Run `docker-compose up -d` to build the containers
 3. Run `docker-compose run --rm maintenance sh setup.sh` to setup the environment
 4. Open a browser and navigate to http://localhost:8000/admin/login and login in with "admin@test.com" and "Test123!"
 5. Verify functionality by navigating to http://localhost:8000/admin and http://localhost:8000/

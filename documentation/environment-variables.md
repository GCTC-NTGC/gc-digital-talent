# Environment Variables

Environment variables are created and used in many places throughout the repo.  This document covers the use of environment variables in a development environment.  Environment management in production is out of scope.

## Laravel

The Laravel projects (api and auth) read environment variables from the `.env` files in the root of their project directories.  These files are not checked into version control.  When running the setup scripts a new one is copied from the `.env.example` template and then customized.  In a development environment these files are reread on every new PHP request.  If needed a configuration reset can be forced with `php artisan config:clear`.

## Frontend

The frontend React projects uses environment variables in two distinct ways: **build-time** variables and **run-time** variables.

### Build-Time Variables

The frontend subprojects (admin, talentsearch, etc) have `.env` files that are copied from `.env.example` template files like the Laravel projects.  When the frontend projects are built using Webpack, variables from the `.env` file are defined in the resulting bundle using DefinePlugin.  These values are "baked into" the bundle any if there are any variable changes the subproject must be rebuilt to reflect them.

### Run-Time Variables

For deployment in production there needs to be a way to change variables in the program without rebuilding. This allows us to use environment variables as "feature flags", which enable/disable specific features without re-deployment. This is done using Apache Server Side Includes and the `config.sjs` files.  In a development environment these variables are injected into the docker container from the `/frontend/.apache_env` file.  To update these variables in the container a new container must be built.  For example:
1) `docker-compose stop php`
2) `docker-compose rm php`
3) `docker-compose up --detach`

To check if a particular environment variable is set in a container, a command like this could be used:
`docker-compose exec php printenv FEATURE_DIRECTINTAKE`


Welcome to the GC Talent Monorepo.

The GC Talent app is divided into multiple services, each treated as its own subproject:
- /api, the API service
- /admin, a Client app for an admin dashboard
- /auth, an OIDC authentication service

Each service is meant to run in a seperate container. However, since they all use the Laravel or Lumen framework, they can also be run on a single php server, with requests routed carefully between them. (This is how the docker-compose setup in /infrastructure works.)

Each subproject has its own README, with advice on getting it configured. If you want to run the project locally using Docker, check out /infrastructure/README.md first.

## Dependencies

### Composer dependencies (PHP)
As each service runs on PHP server, you must install composer dependencies for each. The project expects to use PHP 7.4 and Composer v2.

If you have Docker installed, you can use it to install dependencies (instead of having to install the correct version of PHP and composer) by running the following command in each project root:

```docker run --rm --interactive --tty --volume $PWD:/app composer install```

If running on windows with PowerShell, use `${PWD}` instead of `$PWD`:

```docker run --rm --interactive --tty --volume ${PWD}:/app composer install```

### NPM dependencies (Javascript/Typescript)

For sub-projects with a package.json file, you will need to run `npm install`. For consistency, you should be using Node v14.16.1 and npm v7.12.0.





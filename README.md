# Welcome to the GC Digital Talent monorepo

The GC Digital Talent app is divided into multiple services, each treated as its own sub-project:
- `/api`, the API service
- `/admin`, a Client app for an admin dashboard
- `/auth`, an OpenID Connect (OIDC) authentication service

Each service is meant to run in a separate container. However, since they all use the [Laravel](https://github.com/laravel/laravel) or [Lumen](https://github.com/laravel/lumen) framework, they can also be run on a single PHP server, with requests routed carefully between them (this is how the docker-compose setup in `/infrastructure` works).

Each sub-project has its own `README.md`, with advice on setup and configuration. If you want to run the project locally using Docker, check out `/infrastructure/README.md` first.

Finally, head on into the relevant directory for the service you'd like to work on and follow the steps in its respective `README.md` file to get the service running locally.

## Dependencies
### Development Setup

You'll need to install:
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Node & NPM](https://nodejs.org/en/)
- [PHP 8.0](https://www.php.net/downloads)
- [Composer](https://getcomposer.org/)

### Composer dependencies (PHP)
As each service runs on a PHP server, you must install composer dependencies for each. The project expects to use PHP 8.0 and Composer v2.

If you have Docker installed, you can use it to install dependencies (instead of having to install the correct version of PHP and composer) by running the following command in each project root:

```docker run --rm --interactive --tty --volume $PWD:/app composer install```

If running on Windows with PowerShell, use `${PWD}` instead of `$PWD`:

```docker run --rm --interactive --tty --volume ${PWD}:/app composer install```

### NPM dependencies (JavaScript/TypeScript)

For sub-projects with a `package.json` file, you will need to run `npm install`. For consistency, you should be using the version listed in each sub-project's `.nvmrc` file.

### Complications?
- Make sure virtualization is enabled in your machine's BIOS (this is for Docker Desktop)
- Don't forget to enable `extension=pdo_pgsql` in your `php.ini` file
- Docker is finicky—try exiting it entirely and restarting it
- Don't forget to create your own `.env` file inside the service directory and set the `APP_KEY`

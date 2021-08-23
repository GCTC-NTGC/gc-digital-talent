# Welcome to GC Digital Talent

## Development Setup

You'll need to install:
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Node & NPM](https://nodejs.org/en/)
- [PHP 7.4](https://www.php.net/downloads)
- [Composer](https://getcomposer.org/)

Next, head on over to the `/infrastructure` directory and checkout the README file there. Follow those steps to get your environment up and running on Docker.

Finally, head on into the relevant directory for the service you'd like to work on and follow the steps in its respective README to get the service running locally.

### Complications?
- make sure virtualization is enabled in your machine's BIOS (this is for Docker Desktop)
- don't forget to enable `extension=pdo_pgsql` in your `php.ini` file
- Docker is finicky - try exiting it entirely and restarting it
- don't forget to create your own `.env` file inside the service directory and set the `APP_KEY`

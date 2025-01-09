# Linux environment setup

Sometimes it may be preferable to perform local environment maintenance directly using tooling installed on your Linux OS (or in [WSL](https://learn.microsoft.com/en-us/windows/wsl/about)) instead of the maintenance docker container. This guide documents how to set up an environment in that way. It also includes ways you can confirm that every step was completed successfully.

## Operating system

This guide is written for [Ubuntu 24.04](https://releases.ubuntu.com/noble/). Since that is the operating system used in the maintenance container, Github runners, and Azure runners it is a good choice of OS for this. This guide will also work when using [Ubuntu in WSL](https://canonical-ubuntu-wsl.readthedocs-hosted.com/en/latest/guides/install-ubuntu-wsl2/). Other Ubuntu variants or Linux distributions may work as well but are not documented here.

Double check:

```
lsb_release -a
```

## Clone the repository

[Git](https://git-scm.com/) should have been installed with your operating system automatically. Clone the repository from GitHub and change into the directory.

```
git clone https://github.com/GCTC-NTGC/gc-digital-talent.git
cd gc-digital-talent
```

Double-check:

```
ls -a
```

You should see the same list of files visible in [the github repository online](https://github.com/GCTC-NTGC/gc-digital-talent).

## Docker compose

[Docker Compose](https://docs.docker.com/compose/) is used to run the services for this app. You may have to install Compose version 2 manually.

```
sudo apt-get install docker-compose-v2
```

Double-check:

```
docker compose version
```

If you haven't before, add your user to the `docker` group and activate the group:

```
sudo usermod -aG docker $USER
newgrp docker
```

Double-check:

```
groups
```

## Hosts file

We need to ensure that scripts running locally can find the services running in Docker.

```
sudo nano /etc/hosts
```

In the editor, add the line `127.0.0.1       postgres` to the end of the file. `Ctrl+S` to save and `Ctrl+X` to exit.

Double check:

```
ping -c 3 postgres
```

### WSL configuration

> [!IMPORTANT]
> Ignore this step if not running in WSL.

WSL will overwrite the hosts file changes by default. Let's configure it not to.

```
sudo nano /etc/wsl.conf
```

Edit it in the same way as the `hosts` file. Add to the end of the file:

```
[network]
generateHosts=false
```

Further reading: https://learn.microsoft.com/en-us/windows/wsl/wsl-config#network-settings

## PostgreSQL

We'll need the [PostgreSQL](https://www.postgresql.org/) client to build the database schema. Install it from the regular Ubuntu repository.

```
sudo apt-get install postgresql-client
```

Double check:

```
psql --version
```

The version should be greater or equal to the version of `services.postgres.image` in [docker-compose.yml](https://github.com/GCTC-NTGC/gc-digital-talent/blob/main/docker-compose.yml).

## PHP

We use [PHP](https://www.php.net/) version 8.3 to run the backend app. Ubuntu 24.04 comes with PHP 8.3 but we require some additional extensions to be installed.

```
sudo apt-get install php8.3 php8.3-cli php8.3-mbstring php8.3-xml php8.3-pgsql php8.3-zip php8.3-curl php8.3-bcmath php8.3-gd php8.3-dom php8.3-intl
```

Double check:

```
php --version
php --modules
```

The PHP version should match the value of `require.php` in [api/composer.json](https://github.com/GCTC-NTGC/gc-digital-talent/blob/main/api/composer.json).

## Composer

We use [Composer](https://getcomposer.org/) to manage our PHP project.

```
sudo apt-get install composer
```

Double check:

```
composer --version
```

It should be major version 2.

## Node.js

We use [Node.js](https://nodejs.org/en) to develop the frontend part of the app. You can install it using [nvm](https://github.com/nvm-sh/nvm).

Install nvm from GitHub.

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
```

> [!IMPORTANT]
> Close and reopen your terminal after installation finishes to activate it.

Double-check:

```
nvm --version
```

Now, from inside the `gc-digital-talent` directory, install Node.js.

```
nvm install
```

Double-check:

```
node --version
```

It should match the version in [.nvmrc](https://github.com/GCTC-NTGC/gc-digital-talent/blob/main/.nvmrc).

### PNPM

We use [PNPM](https://pnpm.io/) to manage the packages for the frontend part of the app. Check which version should be installed by finding the `packageManager` field in [package.json](https://github.com/GCTC-NTGC/gc-digital-talent/blob/main/package.json). Make sure to substitute the correct version number into the command.

```
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=<version> sh -
```

> [!IMPORTANT]
> The install script will also instruct you to run a `source` command to activate the tool in your session.

Double check:

```
pnpm --version
```

## Makefile

A separate `make` file named [Makefile.nix](https://github.com/GCTC-NTGC/gc-digital-talent/blob/main/Makefile.nix) is provided for convenience and reference when running on Linux. Install it from the repository.

```
sudo apt-get install make
```

Double check:

```
make --version
```

> [!TIP]
> In VS Code, an extension like `carlos-algms.make-task-provider` can make it quick to run commands. Update the `make-task-provider.makefileNames` setting to `["Makefile.nix"]` for best results.

## Set up the project

You should be ready to set up the project!

First, start up the docker compose network:

```
cd gc-digital-talent
make -f Makefile.nix compose_up
```

Next, build the project:

```
make -f Makefile.nix setup_all
```

Double-check:

Point your browser at [http://localhost:8000](http://localhost:8000) and view the home page.

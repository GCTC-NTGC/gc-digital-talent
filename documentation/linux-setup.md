# Linux environment setup

Sometimes it may be preferable to perform local environment maintenance directly using tooling installed on your Linux OS (or in [WSL](https://learn.microsoft.com/en-us/windows/wsl/about)) instead of the maintenance docker container. This guide shows how to set that up. It includes commands you can run after every step to confirm that the step was completed successfully.

## Operating System

This guide is written for [Ubuntu 22.04](https://releases.ubuntu.com/jammy/). Since that is the operating system used in the maintenance container, Github runners, and Azure runners it is a good choice of OS for this. This guide will work for using [Ubuntu in WSL](https://canonical-ubuntu-wsl.readthedocs-hosted.com/en/latest/guides/install-ubuntu-wsl2/) as well. Other Ubuntu variants or Linux distributions may work as well but are not documented here.

Double check:

```
lsb_release -a
```

## PHP

Ubuntu 22.04 does not come with PHP 8.2 in its repositories. Add the [Ondrej PPA](https://launchpad.net/~ondrej/+archive/ubuntu/php/) and install PHP 8.2 with some extensions.

```
sudo add-apt-repository ppa:ondrej/php
sudo apt-get update
sudo apt-get install php8.2 php8.2-mbstring php8.2-xml php8.2-pgsql php8.2-zip php8.2-curl php8.2-bcmath php8.2-gd php8.2-dom
```

Double check:

```
php --version
php --modules
```

The PHP version should match the value of `require.php` in [api/composer.json](https://github.com/GCTC-NTGC/gc-digital-talent/blob/main/api/composer.json).

## Postgresql

We'll need the PostrgeSQL client to build the database schema. Install it from the regular Ubuntu repository.

```
sudo apt-get install postgresql-client
```

Double check:

```
psql --version
```

The version should be greater or equal to the version of `services.postgres.image` in [docker-compose.yml](https://github.com/GCTC-NTGC/gc-digital-talent/blob/main/docker-compose.yml)

## Composer

We user composer to manage our PHP project.

```
sudo apt-get install composer
```

Double check:

```
composer --version
```

The version should be 2.

### PNPM

We use PNPM to manage the packages for the javascript/typescript part of the app. Make sure to substitute the correct version number into the command:

```
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=<version> sh -
```

Double check:

```
pnpm --version
```

The version should match `packageManager` in [package.json](https://github.com/GCTC-NTGC/gc-digital-talent/blob/main/package.json).

## Hosts File

We need to ensure that scripts running locally can find the services running in Docker.

```
sudo nano /etc/hosts
```

In the editor, add the line `127.0.0.1       postgres` to the end of the file. `Ctrl+O` to save and `Ctrl+X` to exit.

Double check:

```
host -t a postgres
```

### WSL Only!

WSL will overwrite the hosts file changes by default. Let's configure it not to. Ignore this step if not running in WSL.

```
sudo nano /etc/wsl.conf
```

And add:

```
[network]
generateHosts = false
```

Further reading: https://learn.microsoft.com/en-us/windows/wsl/wsl-config#network-settings

## Make File

A separate `make` file named [Makefile.nix](https://github.com/GCTC-NTGC/gc-digital-talent/blob/main/Makefile.nix) is provided for convenience and reference when running on Linux.

For example:

```
make -f Makefile.nix compose_up
```

> [!TIP]
> In VS Code, an extension like `carlos-algms.make-task-provider` can make it quick to run commands. Update the `make-task-provider.makefileNames` setting to `["Makefile.nix"]` for best results.

## Set Up the Project

You should be ready to set up the project!

First, start up the docker compose network:

```
make -f Makefile.nix compose_up
```

Next, build the project:

```
make -f Makefile.nix setup_all
```

Point your browser at `http://localhost:8000` and view the home page.

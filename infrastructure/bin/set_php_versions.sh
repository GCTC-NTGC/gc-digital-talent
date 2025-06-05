#!/usr/bin/env bash

# Errors will fail out
set -o errexit
# Don't mask errors in piped commands
set -o pipefail
# Fail if using undefined variables
set -o nounset

# Assign PHP version from arg if supplied. Runs default PHP bin without.
PHP_VERSION=$1

# GitHub runner only includes one version of PHP that is not necessarily the value of the assigned therefore the Personal Package Archive (PPA) is necessary.
LC_ALL=C.UTF-8 sudo add-apt-repository ppa:ondrej/php
sudo apt-get update
sudo apt-get install -y php${PHP_VERSION} php${PHP_VERSION}-mbstring php${PHP_VERSION}-xml php${PHP_VERSION}-pgsql php${PHP_VERSION}-zip php${PHP_VERSION}-curl php${PHP_VERSION}-bcmath php${PHP_VERSION}-gd php${PHP_VERSION}-dom

php --version

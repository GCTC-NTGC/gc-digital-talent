#!/usr/bin/env bash

# Errors will fail out
set -o errexit
# Don't mask errors in piped commands
set -o pipefail
# Fail if using undefined variables
set -o nounset

# Assign PHP version from arg if supplied. Runs default PHP bin without.
PHP_VERSION=$1

# GitHub runner only includes one version of PHP that is not necesarrily the value of the assigned therefore the Personal Package Archive (PPA) is necessary.
LC_ALL=C.UTF-8 sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt-get install -y php${PHP_VERSION} php-mbstring php-xml php-pgsql php-zip php-curl php-bcmath php-gd

php -version

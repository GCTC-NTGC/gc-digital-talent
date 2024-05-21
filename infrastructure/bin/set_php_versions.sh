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
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt-get install php${PHP_VERSION}

sudo update-alternatives --set php /usr/bin/php${PHP_VERSION}
sudo update-alternatives --set phar /usr/bin/phar${PHP_VERSION}
sudo update-alternatives --set phpdbg /usr/bin/phpdbg${PHP_VERSION}
sudo update-alternatives --set php-cgi /usr/bin/php-cgi${PHP_VERSION}
sudo update-alternatives --set phar.phar /usr/bin/phar.phar${PHP_VERSION}

php -version

#!/usr/bin/env bash

# Errors will fail out
set -o errexit
# Don't mask errors in piped commands
set -o pipefail
# Fail if using undefined variables
set -o nounset

# Assign PHP version from arg if supplied. Runs default PHP bin without.
PHP_VERSION=$1

sudo update-alternatives --install /usr/bin/php php /usr/bin/php${PHP_VERSION} 100
sudo update-alternatives --install /usr/bin/phar phar /usr/bin/php${PHP_VERSION} 100
sudo update-alternatives --install /usr/bin/phpdbg phpdbg /usr/bin/php${PHP_VERSION} 100
sudo update-alternatives --install /usr/bin/php-cgi php-cgi /usr/bin/php${PHP_VERSION} 100
sudo update-alternatives --install /usr/bin/phar.phar phar.phar /usr/bin/php${PHP_VERSION} 100

sudo update-alternatives --set php /usr/bin/php${PHP_VERSION}
sudo update-alternatives --set phar /usr/bin/phar${PHP_VERSION}
sudo update-alternatives --set phpdbg /usr/bin/phpdbg${PHP_VERSION}
sudo update-alternatives --set php-cgi /usr/bin/php-cgi${PHP_VERSION}
sudo update-alternatives --set phar.phar /usr/bin/phar.phar${PHP_VERSION}

php -version

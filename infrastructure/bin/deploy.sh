#!/usr/bin/env bash

# Errors will fail out
set -o errexit
# Don't mask errors in piped commands
set -o pipefail
# Fail if using undefined variables
set -o nounset

if [ -z "$1" ]; then
    echo "Must past abs path as argument."
    exit 1
fi

ROOT_DIR=$1

sudo composer selfupdate

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

source ~/.bash_profile
nvm install v20.11.0
#nvm install-latest-npm
npm install -g npm@9.9.2

### API

cd $ROOT_DIR/api

composer install --no-dev
sudo chown -R www-data ./storage ./vendor
sudo chmod -R 775 ./ ./storage
php artisan lighthouse:print-schema --write

### Install all npm dependencies
cd $ROOT_DIR
npm ci --include=dev

### Build frontend
npm run build
chmod -R a+r,a+w node_modules

### Cleanup frontend npm dependencies
npm prune --production

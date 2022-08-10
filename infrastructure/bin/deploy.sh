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
nvm install v16.16.0
#nvm install-latest-npm
npm install -g npm@8.11.0

### API

cd $ROOT_DIR/api

composer install --no-dev
sudo chown -R www-data ./storage ./vendor
sudo chmod -R 775 ./ ./storage
php artisan lighthouse:print-schema --write

### Install all npm dependencies
cd $ROOT_DIR/frontend
npm ci --include=dev

# Run h2-build using workspace command from /frontend
npm run h2-build --workspace common

### Common

cd $ROOT_DIR/frontend/common
npm run codegen
npm run intl-compile

### Talentsearch

cd $ROOT_DIR/frontend/talentsearch
npm run codegen
npm run intl-compile
npm run production

### Admin

cd $ROOT_DIR/frontend/admin
npm run codegen
npm run intl-compile
npm run production

### Indigenous Apprenticeship

cd $ROOT_DIR/frontend/indigenousapprenticeship
npm run codegen
npm run intl-compile
npm run production

### Cleanup /frontend npm dependencies

cd $ROOT_DIR/frontend
npm prune --production

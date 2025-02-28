#!/usr/bin/env bash

# Errors will fail out
set -o errexit
# Don't mask errors in piped commands
set -o pipefail
# Fail if using undefined variables
set -o nounset

Help()
{
  echo "Deploy the project from Azure Pipelines."
  echo
  echo "Syntax: deploy.sh [-h] [-d] [-r <ROOT_DIR>]"
  echo "   -h   Show this help message."
  echo "   -d   Setup the environment with dev dependencies."
  echo "   -r   Absolute path to the root directory."
  echo
}

GCDT_DEV=false

while getopts "hdr:" option; do
  case $option in
    h) # display Help
      Help
      exit;;
    d) # setup for dev
      GCDT_DEV=true;;
    r) # root directory
      ROOT_DIR=${OPTARG};;
    \?) # incorrect option
      echo "Error: Invalid option"
      exit;;
  esac
done

if [ -z "${ROOT_DIR}" ]; then
    echo "Must past abs path as argument."
    exit 1
fi

echo "GCDT_DEV = ${GCDT_DEV}"
echo "ROOT_DIR = ${ROOT_DIR}"

sudo composer selfupdate

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

source ~/.bash_profile
nvm install v20.11.0
#nvm install-latest-pnpm
npm install -g pnpm@10.5.2

### API

cd $ROOT_DIR/api

if [ "$GCDT_DEV" = true ]; then
  composer install
else
  composer install --optimize-autoloader --no-dev
fi
sudo chown -R www-data ./storage ./vendor
sudo chmod -R 775 ./ ./storage
php artisan lighthouse:print-schema --write

### Install all npm dependencies
cd $ROOT_DIR
pnpm install --frozen-lockfile

### Build frontend
pnpm run build

#! /bin/bash

Help()
{
  echo "Setup the project and your environment."
  echo
  echo "Syntax: setup.sh [-h|c]"
  echo "   -h   Show this help message."
  echo "   -c   Setup the environment for CI."
  echo
}

GCDT_CI=false

while getopts ":hc" option; do
  case $option in
    h) # display Help
      Help
      exit;;
    c) # setup for CI
      GCDT_CI=true;;
    \?) # incorrect option
      echo "Error: Invalid option"
      exit;;
  esac
done

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

# setup api project
cd /var/www/html/api
cp .env.example .env --preserve=all
${parent_path}/update_env_appkey.sh .env
touch ./storage/logs/laravel.log
rm ./bootstrap/cache/*.php --force
composer install --prefer-dist
php artisan key:generate
if [ "$GCDT_CI" = true ]; then
  php artisan migrate:fresh
  php artisan db:seed --class=CiSeeder
else
  php artisan migrate:fresh --seed
fi
php artisan lighthouse:print-schema --write
php artisan config:clear
chown -R www-data ./storage ./vendor
chmod -R a+r,a+w ./storage ./vendor ./bootstrap/cache

cd /var/www/html/apps/web
cp .env.example .env --preserve=all

# build projects
git config --global --add safe.directory /var/www/html
cd /var/www/html
pnpm install
if [ "$GCDT_CI" = true ]; then
  pnpm run build:fresh
else
  pnpm run dev:fresh
fi
chmod -R a+r,a+w \
  node_modules \
  apps/**/node_modules \
  packages/**/node_modules \
  apps/*/.turbo \
  apps/*/src/lang \
  apps/*/dist \
  packages/*/.turbo \
  packages/*/src/lang

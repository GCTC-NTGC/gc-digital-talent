#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

# setup api project
cd /var/www/html/api
cp .env.example .env --preserve=all
${parent_path}/update_env_appkey.sh .env
composer install --prefer-dist
php artisan key:generate
php artisan migrate:fresh --seed
php artisan lighthouse:print-schema --write
php artisan config:clear
chown -R www-data ./storage ./vendor
chmod -R a+r,a+w ./storage ./vendor ./bootstrap/cache

# setup frontend workspace
cd /var/www/html/frontend
npm install

# copy out new .env files
cd /var/www/html/frontend
cp ./talentsearch/.env.example ./talentsearch/.env --preserve=all
cp ./indigenousapprenticeship/.env.example ./indigenousapprenticeship/.env --preserve=all
cp ./admin/.env.example ./admin/.env --preserve=all

# build projects
cd /var/www/html/frontend
npm run codegen --workspaces
npm run intl-compile --workspaces
npm run intl-compile-crg --workspace=indigenousapprenticeship
npm run intl-compile-crk --workspace=indigenousapprenticeship
npm run intl-compile-ojw --workspace=indigenousapprenticeship
npm run intl-compile-mic --workspace=indigenousapprenticeship
npm run dev --workspaces --if-present # common workspace does not have dev script


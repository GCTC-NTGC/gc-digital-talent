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

# copy out new .env files
cd /var/www/html/frontend
cp ./talentsearch/.env.example ./talentsearch/.env --preserve=all
cp ./admin/.env.example ./admin/.env --preserve=all

cd /var/www/html
cp ./apps/web/.env.example ./apps/web/.env --preserve=all

# build projects
cd /var/www/html
npm install
npm run build
chmod -R a+r,a+w node_modules
chmod -R a+r,a+w apps/web/.turbo frontend/admin/.turbo frontend/common/.turbo frontend/talentsearch/.turbo

#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

# setup api project
cd /var/www/html/api
cp .env.example .env --preserve=all
${parent_path}/update_env_appkey.sh .env
touch ./storage/logs/laravel.log
composer install --prefer-dist
php artisan key:generate
php artisan migrate:fresh --seed
php artisan lighthouse:print-schema --write
php artisan config:clear
chown -R www-data ./storage ./vendor
chmod -R a+r,a+w ./storage ./vendor ./bootstrap/cache

cd /var/www/html/apps/web
cp .env.example .env --preserve=all

# create cypress cache folder
touch ${CYPRESS_CACHE_FOLDER}
chmod chmod a+r,a+w ${CYPRESS_CACHE_FOLDER}

# build projects
git config --global --add safe.directory /var/www/html
cd /var/www/html
npm install
npm run build:fresh
chmod -R a+r,a+w node_modules apps/*/.turbo packages/*/.turbo

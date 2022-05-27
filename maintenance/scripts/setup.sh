#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

cd /var/www/html/api
cp .env.example .env
${parent_path}/update_env_appkey.sh .env

# setup api project
cd /var/www/html/api
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan lighthouse:print-schema --write
php artisan config:clear
chown -R www-data ./storage ./vendor
chmod -R 775 ./storage

# setup frontend workspace
cd /var/www/html/frontend
npm install
npm rebuild node-sass

# setup common project
cd /var/www/html/frontend/common
npm run h2-build
npm run codegen
npm run intl-compile

# setup talentsearch project
cd /var/www/html/frontend/talentsearch
cp .env.example .env
npm run codegen
npm run intl-compile
npm run dev

# setup indigenous apprenticeship project
cd /var/www/html/frontend/indigenousapprenticeship
cp .env.example .env
npm run codegen
npm run intl-compile
npm run dev

# setup admin project
cd /var/www/html/frontend/admin
cp .env.example .env
npm run codegen
npm run intl-compile
npm run dev

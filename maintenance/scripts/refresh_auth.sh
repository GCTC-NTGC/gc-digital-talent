#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh
source ${parent_path}/lib/load_nvm.sh

cd /var/www/html/auth
composer install
php artisan migrate
php artisan config:clear
nvm install --latest-npm
npm install
npm run dev

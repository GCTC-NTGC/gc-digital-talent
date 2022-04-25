#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

cd /var/www/html/auth
composer install
php artisan migrate
php artisan config:clear
npm install
npm run dev

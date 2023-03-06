#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

cd /var/www/html/api
composer install --prefer-dist
php artisan migrate
php artisan lighthouse:print-schema --write
php artisan config:clear

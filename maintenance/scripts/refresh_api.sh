#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

cd /var/www/html/api
rm ./bootstrap/cache/*.php --force
composer install --prefer-dist
php artisan migrate
php artisan lighthouse:print-schema --write
php artisan lighthouse:ide-helper
php artisan optimize:clear

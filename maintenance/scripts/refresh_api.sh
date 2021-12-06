#! /bin/bash

cd /var/www/html/api
composer install
php artisan migrate
php artisan lighthouse:print-schema --write

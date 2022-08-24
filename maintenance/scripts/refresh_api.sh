#! /bin/bash

parent_path=~/gc-digital-talent/maintenance/scripts
source ${parent_path}/lib/common.sh

cd ~/gc-digital-talent/api
composer install
php artisan migrate
php artisan lighthouse:print-schema --write
php artisan config:clear

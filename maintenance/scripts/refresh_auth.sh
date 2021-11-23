#! /bin/bash

#setup nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd /var/www/html/auth
composer install
php artisan migrate
php artisan config:clear
nvm install --latest-npm
npm install
npm run dev

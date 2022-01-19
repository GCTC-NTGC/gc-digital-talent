#! /bin/bash

#setup nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd /var/www/html/frontend
nvm install --latest-npm
npm install
npm rebuild node-sass

cd /var/www/html/frontend/admin
composer install
php artisan config:clear
npm run h2-build
npm run codegen
npm run dev

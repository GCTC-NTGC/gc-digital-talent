#! /bin/bash

#setup nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd /var/www/html/admin
composer install
nvm install --latest-npm
npm install
npm rebuild node-sass
npm run h2-build
npm run codegen
npm run dev

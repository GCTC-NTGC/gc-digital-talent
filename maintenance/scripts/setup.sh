#! /bin/bash

#setup nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 14.18.1
nvm install-latest-npm

# setup common project
cd /var/www/html/common
npm install
npm run codegen

# setup auth project
cd /var/www/html/auth
chown -R www-data ./storage ./vendor
chmod -R 775 ./ ./storage
cp .env.example .env
composer install
npm install
npm run dev
php artisan key:generate
php artisan migrate
#php artisan passport:keys # gives an "Encryption keys already exist." error.
php artisan passport:client --personal --name="Laravel Personal Access Client" > personal_access_client.txt
/root/scripts/update_auth_env.sh
rm personal_access_client.txt
php artisan db:seed
php artisan config:cache

# setup api project
cd /var/www/html/api
chown -R www-data ./storage ./vendor
chmod -R 775 ./ ./storage
cp .env.example .env
/root/scripts/update_env_appkey.sh .env
composer install
php artisan migrate:fresh
php artisan db:seed
php artisan lighthouse:print-schema --write
/root/scripts/update_api_env.sh

# setup talentsearch project
cd /var/www/html/talentsearch
chown -R www-data ./storage ./vendor
chmod -R 775 ./ ./storage
cp .env.example .env
/root/scripts/update_env_appkey.sh .env
composer install
npm install
npm rebuild node-sass 
npm run h2-compile
npm run codegen
npm run dev

# setup admin project
cd /var/www/html/admin
chown -R www-data ./storage ./vendor
chmod -R 775 ./ ./storage
cp .env.example .env
/root/scripts/update_env_appkey.sh .env
composer install
npm install
npm rebuild node-sass 
npm run h2-compile
npm run codegen
npm run dev
cd /var/www/html/auth
php artisan passport:client --user_id="1" --name="admin" --redirect_uri="http://localhost:8000/admin/auth-callback" > admin_secret.txt
/root/scripts/update_admin_env.sh
rm admin_secret.txt
php artisan config:cache


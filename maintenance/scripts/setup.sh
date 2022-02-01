#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

#setup nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd /var/www/html/api
cp .env.example .env
${parent_path}/update_env_appkey.sh .env

# setup auth project
cd /var/www/html/auth
cp .env.example .env
composer install
php artisan migrate:fresh --seed
php artisan passport:keys --force
php artisan key:generate
php artisan passport:client --personal --name="Laravel Personal Access Client" > personal_access_client.txt
${parent_path}/update_auth_env.sh
rm personal_access_client.txt
php artisan config:clear
nvm install --latest-npm
npm install
npm run dev
chown -R www-data ./storage ./vendor
chmod -R 775 ./storage

# setup api project
cd /var/www/html/api
cp .env.example .env
${parent_path}/update_env_appkey.sh .env
composer install
php artisan migrate:fresh --seed
php artisan lighthouse:print-schema --write
${parent_path}/update_api_env.sh
chown -R www-data ./storage ./vendor
chmod -R 775 ./storage

# setup frontend workspace
cd /var/www/html/frontend
nvm install --latest-npm
npm install
npm rebuild node-sass

# setup common project
cd /var/www/html/frontend/common
npm run h2-build
npm run codegen
npm run intl-compile

# setup talentsearch project
cd /var/www/html/frontend/talentsearch
cp .env.example .env
${parent_path}/update_env_appkey.sh .env
composer install
npm run h2-build
npm run codegen
npm run intl-compile
npm run dev
chown -R www-data ./storage ./vendor
chmod -R 775 ./storage

# setup admin project
cd /var/www/html/frontend/admin
cp .env.example .env
${parent_path}/update_env_appkey.sh .env
composer install
cd /var/www/html/auth
php artisan passport:client -n --name="admin" --redirect_uri="http://localhost:8000/admin/auth-callback" > admin_secret.txt
${parent_path}/update_admin_env.sh
rm admin_secret.txt
cd /var/www/html/frontend/admin
php artisan config:clear
npm run h2-build
npm run codegen
npm run intl-compile
npm run dev
chown -R www-data ./storage ./vendor
chmod -R 775 ./storage

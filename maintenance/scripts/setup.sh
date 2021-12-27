#! /bin/bash
# Purpose: Build and seed all apps in one environment, in either development or production mode.
#
# Usage:
#
#     ~$ [ BUILD_SCRIPT=production ] ./setup.sh

# Fail out of script immediately if any single command fails.
# See: https://gist.github.com/mohanpedala/1e2ff5661761d3abd0385e8223e16425
set -euo pipefail

BUILD_SCRIPT="${BUILD_SCRIPT:=dev}"

#setup nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# setup auth project
cd /var/www/html/auth
cp .env.example .env
composer install
php artisan migrate:fresh --seed
php artisan passport:keys --force
php artisan key:generate
php artisan passport:client --personal --name="Laravel Personal Access Client" > personal_access_client.txt
/root/scripts/update_auth_env.sh
rm personal_access_client.txt
php artisan config:clear
nvm install --latest-npm
npm install
npm run ${BUILD_SCRIPT}
chown -R www-data ./storage ./vendor
chmod -R 775 ./storage

# setup api project
cd /var/www/html/api
cp .env.example .env
/root/scripts/update_env_appkey.sh .env
composer install
php artisan migrate:fresh --seed
php artisan lighthouse:print-schema --write
/root/scripts/update_api_env.sh
chown -R www-data ./storage ./vendor
chmod -R 775 ./storage

# setup common project
cd /var/www/html/common
nvm install --latest-npm
npm install
npm run h2-build
npm run codegen

# setup talentsearch project
cd /var/www/html/talentsearch
cp .env.example .env
/root/scripts/update_env_appkey.sh .env
composer install
nvm install --latest-npm
npm install
npm rebuild node-sass
npm run h2-build
npm run codegen
npm run ${BUILD_SCRIPT}
chown -R www-data ./storage ./vendor
chmod -R 775 ./storage

# setup admin project
cd /var/www/html/admin
cp .env.example .env
/root/scripts/update_env_appkey.sh .env
composer install
cd /var/www/html/auth
php artisan passport:client -n --name="admin" --redirect_uri="http://localhost:8000/admin/auth-callback" > admin_secret.txt
/root/scripts/update_admin_env.sh
rm admin_secret.txt
cd /var/www/html/admin
php artisan config:clear
nvm install --latest-npm
npm install
npm rebuild node-sass
npm run h2-build
npm run codegen
npm run ${BUILD_SCRIPT}
chown -R www-data ./storage ./vendor
chmod -R 775 ./storage

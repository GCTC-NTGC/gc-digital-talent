#! /bin/bash

parent_path=~/gc-digital-talent/maintenance/scripts
source ${parent_path}/lib/common.sh

cd ~/gc-digital-talent/api
cp .env.example .env
${parent_path}/update_env_appkey.sh .env

# setup api project
cd ~/gc-digital-talent/api
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan lighthouse:print-schema --write
php artisan config:clear

# setup frontend workspace
cd ~/gc-digital-talent/frontend
npm install

# setup common project
cd ~/gc-digital-talent/frontend/common
npm run codegen
npm run intl-compile

# setup talentsearch project
cd ~/gc-digital-talent/frontend/talentsearch
cp .env.example .env
npm run codegen
npm run intl-compile
npm run dev

# setup indigenous apprenticeship project
cd ~/gc-digital-talent/frontend/indigenousapprenticeship
cp .env.example .env
npm run codegen
npm run intl-compile
npm run dev

# setup admin project
cd ~/gc-digital-talent/frontend/admin
cp .env.example .env
npm run codegen
npm run intl-compile
npm run dev

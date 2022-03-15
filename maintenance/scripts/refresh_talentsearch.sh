#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

#setup nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

cd /var/www/html/frontend
nvm install --latest-npm
npm install
npm rebuild node-sass

cd /var/www/html/frontend/talentsearch
composer install
(cd .. && npm run h2-build --workspace common)
npm run codegen
npm run intl-compile
npm run dev

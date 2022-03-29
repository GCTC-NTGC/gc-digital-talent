#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

cd /var/www/html/frontend
nvm install --latest-npm
npm install

cd /var/www/html/frontend/common
(cd .. && npm run h2-build --workspace common)
npm run codegen
npm run intl-compile

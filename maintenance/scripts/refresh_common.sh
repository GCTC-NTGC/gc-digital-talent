#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

cd /var/www/html/frontend
npm install

cd /var/www/html/frontend/common
(cd ..;node node_modules/@hydrogen-css/hydrogen/bin/build.js)
npm run codegen
npm run intl-compile

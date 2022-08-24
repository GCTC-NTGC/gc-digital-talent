#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

cd /var/www/html/frontend
npm install

cd /var/www/html/frontend
(cd ..;node node_modules/@hydrogen-design-system/hydrogen.css/bin/build.js)
npm run codegen
npm run intl-compile

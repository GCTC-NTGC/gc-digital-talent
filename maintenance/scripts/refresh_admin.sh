#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

cd /var/www/html/frontend
npm install --workspace=admin
npm run codegen --workspace=admin
npm run intl-compile --workspace=admin
npm run dev --workspace=admin

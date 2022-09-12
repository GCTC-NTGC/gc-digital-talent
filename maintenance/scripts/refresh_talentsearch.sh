#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

cd /var/www/html/frontend
npm install --workspace=talentsearch
npm run codegen --workspace=talentsearch
npm run intl-compile --workspace=talentsearch
npm run dev --workspace=talentsearch

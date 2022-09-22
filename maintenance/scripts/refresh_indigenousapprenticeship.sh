#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

cd /var/www/html/frontend
npm install --workspace=indigenousapprenticeship
npm run codegen --workspace=indigenousapprenticeship
npm run intl-compile --workspace=indigenousapprenticeship
npm run dev --workspace=indigenousapprenticeship

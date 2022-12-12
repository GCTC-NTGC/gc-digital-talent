#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

cd /var/www/html/frontend
npm install --workspace=indigenousapprenticeship
npm run codegen --workspace=indigenousapprenticeship
npm run intl-compile --workspace=indigenousapprenticeship
npm run intl-compile-crg --workspace=indigenousapprenticeship
npm run intl-compile-crk --workspace=indigenousapprenticeship
npm run intl-compile-ojw --workspace=indigenousapprenticeship
npm run intl-compile-mic --workspace=indigenousapprenticeship
npm run dev --workspace=indigenousapprenticeship

#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

# setup frontend workspace
cd /var/www/html/frontend
npm install
npm run codegen --workspaces
npm run intl-compile --workspaces
npm run dev --workspaces --if-present # common workspaces does not have dev script

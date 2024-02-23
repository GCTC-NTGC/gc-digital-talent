#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

# setup frontend workspace
git config --global --add safe.directory /var/www/html
cd /var/www/html
pnpm install
pnpm dev

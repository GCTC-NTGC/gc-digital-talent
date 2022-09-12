#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

# setup api project
cd /var/www/html/api
rm -rf \
  ./storage/framework/cache/data/* \
  ./storage/framework/sessions/* \
  ./storage/framework/views/* \
  ./storage/logs/* \
  ./vendor/* \
  ./bootstrap/cache/*

# setup frontend workspace
cd /var/www/html/frontend
rm -rf \
  ./node_modules/* \
  ./admin/node_modules \
  ./admin/dist \
  ./common/node_modules \
  ./indigenousapprenticeship/node_modules \
  ./indigenousapprenticeship/dist \
  ./talentsearch/node_modules \
  ./talentsearch/dist

#! /bin/bash

parent_path=~/gc-digital-talent/maintenance/scripts
source ${parent_path}/lib/common.sh

${parent_path}/refresh_api.sh
${parent_path}/refresh_common.sh
${parent_path}/refresh_talentsearch.sh
${parent_path}/refresh_indigenousapprenticeship.sh
${parent_path}/refresh_admin.sh

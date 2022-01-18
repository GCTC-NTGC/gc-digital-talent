#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

/root/scripts/refresh_auth.sh
/root/scripts/refresh_api.sh
/root/scripts/refresh_common.sh
/root/scripts/refresh_talentsearch.sh
/root/scripts/refresh_admin.sh

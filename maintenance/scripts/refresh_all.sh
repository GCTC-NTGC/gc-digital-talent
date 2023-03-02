#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

${parent_path}/refresh_api.sh
${parent_path}/refresh_frontend.sh

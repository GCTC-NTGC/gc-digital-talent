#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

# Random string generation that works on OSX and Linux. (Plus not pipefails.)
appkey=`dd if=/dev/urandom bs=48 count=1 2>/dev/null | base64 | tr -dc '[a-zA-Z0-9]' | fold -w32 -- | head -n 1`
sed -i "s/APP_KEY=.*/APP_KEY=$appkey/" $1

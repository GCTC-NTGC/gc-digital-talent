#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

# Random string generation that works on macOS and Linux. (Plus not pipefails.)
generate_secret() {
  dd if=/dev/urandom bs=48 count=1 2>/dev/null | base64 | tr -dc '[a-zA-Z0-9]' | fold -w32 -- | head -n 1
}

# Update APP_KEY
sed -i "s/APP_KEY=.*/APP_KEY=$(generate_secret)/" $1

# Update REVERB_APP_SECRET
sed -i "s/^REVERB_APP_SECRET=.*/REVERB_APP_SECRET=$(generate_secret)/" $1

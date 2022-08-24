#! /bin/bash

parent_path=~/gc-digital-talent/maintenance/scripts
source ${parent_path}/lib/common.sh

cd ~/gc-digital-talent/frontend
npm install

cd ~/gc-digital-talent/frontend/admin
npm run codegen
npm run intl-compile
npm run dev

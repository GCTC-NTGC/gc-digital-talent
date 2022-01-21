#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

exp='\:\ ([a-zA-Z0-9\-]+)$'

text=`grep 'Client ID:' /var/www/html/auth/admin_secret.txt`
if [[ $text =~ $exp ]] ; then
    clientid=${BASH_REMATCH[1]}
fi

text=`grep 'Client secret:' /var/www/html/auth/admin_secret.txt`
if [[ $text =~ $exp ]] ; then
    clientsecret=${BASH_REMATCH[1]}
fi

sed -i "s/OAUTH_ADMIN_CLIENT_ID=.*/OAUTH_ADMIN_CLIENT_ID=$clientid/" /var/www/html/frontend/admin/.env
sed -i "s/OAUTH_ADMIN_CLIENT_SECRET=.*/OAUTH_ADMIN_CLIENT_SECRET=$clientsecret/" /var/www/html/frontend/admin/.env

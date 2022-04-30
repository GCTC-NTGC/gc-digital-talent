#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

#remove existing multiline value with quotes
perl -0777 -i -pe 's/\n\s*AUTH_SERVER_PUBLIC_KEY=".*?"//igs' /var/www/html/api/.env
#remove existing singleline value
perl -0777 -i -pe 's/\n\s*AUTH_SERVER_PUBLIC_KEY=.*$//igs' /var/www/html/api/.env

publickey=`cat /var/www/html/auth/storage/oauth-public.key`
echo "AUTH_SERVER_PUBLIC_KEY=\"$publickey\"" >> /var/www/html/api/.env

exp='\:\ ([a-zA-Z0-9\-]+)$'

text=`grep 'Client ID:' /var/www/html/auth/api_secret.txt`
if [[ $text =~ $exp ]] ; then
    clientid=${BASH_REMATCH[1]}
fi

text=`grep 'Client secret:' /var/www/html/auth/api_secret.txt`
if [[ $text =~ $exp ]] ; then
    clientsecret=${BASH_REMATCH[1]}
fi

sed -i "s/OAUTH_API_CLIENT_ID=.*/OAUTH_API_CLIENT_ID=$clientid/" /var/www/html/api/.env
sed -i "s/OAUTH_API_CLIENT_SECRET=.*/OAUTH_API_CLIENT_SECRET=$clientsecret/" /var/www/html/api/.env

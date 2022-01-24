#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

serveriss="\"http://localhost:8000\""
sed -i "s#AUTH_SERVER_ISS=.*#AUTH_SERVER_ISS=$serveriss#" /var/www/html/api/.env

#remove existing multiline value with quotes
perl -0777 -i -pe 's/\n\s*AUTH_SERVER_PUBLIC_KEY=".*?"//igs' /var/www/html/api/.env
#remove existing singleline value
perl -0777 -i -pe 's/\n\s*AUTH_SERVER_PUBLIC_KEY=.*$//igs' /var/www/html/api/.env

publickey=`cat /var/www/html/auth/storage/oauth-public.key`
echo "AUTH_SERVER_PUBLIC_KEY=\"$publickey\"" >> /var/www/html/api/.env

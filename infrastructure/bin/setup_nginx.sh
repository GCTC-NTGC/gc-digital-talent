#!/usr/bin/env bash
# This script is run during the deployment to set up the Nginx configuration.
# To run from a Docker host: docker-compose exec webserver /home/site/wwwroot/infrastructure/bin/setup_nginx.sh

# Errors will fail out
set -o errexit
# Don't mask errors in piped commands
set -o pipefail
# Fail if using undefined variables
set -o nounset

cp /home/site/wwwroot/infrastructure/conf/nginx/nginx.conf /etc/nginx/nginx.conf
/home/site/wwwroot/infrastructure/bin/substitute_file.sh /home/site/wwwroot/infrastructure/conf/nginx-conf-deploy/default /etc/nginx/sites-available/default
cp /home/site/wwwroot/infrastructure/conf/nginx/stub_status.conf /etc/nginx/conf.d/stub_status.conf
nginx -s reload

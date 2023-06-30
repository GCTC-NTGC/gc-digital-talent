#!/usr/bin/env bash
# This script is run during the deployment to set up the Nginx Amplify service.
# https://docs.nginx.com/nginx-amplify/install-manage/installing-agent/
# To run from a Docker host: docker-compose exec webserver /home/site/wwwroot/infrastructure/bin/setup_nginx_amplify.sh

# Errors will fail out
set -o errexit
# Don't mask errors in piped commands
set -o pipefail
# Fail if using undefined variables
set -o nounset

# Bullseye moved from stable to oldstable.
# This is to avoid the "This must be accepted explicitly before updates for this repository can be applied. See apt-secure(8) manpage for details." error.
apt-get update --allow-releaseinfo-change

# This image comes with logrotate scripts for Ngnix and Amplify installs one, too.
# Amplify uses sudo to run tests
# These are already installed in the Azure appsvc but not in the Docker container
# apt-get install logrotate sudo -y

# Download and install Amplify Agent
curl --output-dir "/tmp" -L -O https://github.com/nginxinc/nginx-amplify-agent/raw/master/packages/install.sh
API_KEY=$AMPLIFY_API_KEY sh /tmp/install.sh -y

# Clean up apt.
apt-get clean

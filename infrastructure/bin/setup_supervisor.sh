#!/usr/bin/env bash
# This script is run during the deployment to set up the supervisor service

cp /home/site/wwwroot/infrastructure/conf/supervisord.conf /etc/supervisor/
cp /home/site/wwwroot/infrastructure/conf/laravel-worker.conf /etc/supervisor/conf.d/
supervisord -c /etc/supervisor/supervisord.conf

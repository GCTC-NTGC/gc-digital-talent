#!/usr/bin/env bash
# This script is run during the deployment to set up the supervisor service

cp /home/site/wwwroot/infrastructure/conf/supervisord.conf /etc/supervisor/
cp /home/site/wwwroot/infrastructure/conf/laravel-worker.conf /etc/supervisor/conf.d/
cp /home/site/wwwroot/infrastructure/conf/cron.conf /etc/supervisor/conf.d/
cp /home/site/wwwroot/infrastructure/conf/reverb.conf /etc/supervisor/conf.d/

if supervisorctl status > /dev/null 2>&1 ; then
    # Already running — reload config so new conf.d files are picked up
    supervisorctl reread && supervisorctl update
else
    supervisord -c /etc/supervisor/supervisord.conf
fi

# Verify supervisord is actually running regardless of which path was taken
supervisorctl status > /dev/null 2>&1

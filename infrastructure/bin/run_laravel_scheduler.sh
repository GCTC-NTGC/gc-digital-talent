#! /bin/bash

echo "$(date) Running Laravel scheduler" >> /tmp/run_laravel_scheduler.log
php /home/site/wwwroot/api/artisan schedule:run >> /tmp/run_laravel_scheduler.log 2>&1
echo "$(date) Result: $?" >> /tmp/run_laravel_scheduler.log

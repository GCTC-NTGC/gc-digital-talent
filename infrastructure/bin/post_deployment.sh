#!/usr/bin/env bash
# This script is run after the deployment is complete to help set up the environment in the app service.
# It sends a message to a slack webook URI.

SLACK_WEBHOOK_URI=$1

# Can review this file even if the slack delivery fails
PAYLOAD_FILE=/tmp/post_deploy_log_payload.json

# Reusable function to add a section block with a markdown string
add_section_block () {
  BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \"$1\" } }"
}

# https://stackoverflow.com/a/13122217
read -r -d '' TRIPLE_BACK_TICK << "EndOfMessage"
```
EndOfMessage

if [ $WEBSITE_SITE_NAME == "localhost" ]; then
    # No need to mention anyone if you're testing from localhost
    MENTION=""
else
    MENTION="@channel"
fi

# First block is the header
BLOCKS="{ \"type\": \"header\", \"text\": { \"type\": \"plain_text\", \"text\": \"Post-deployment script was run\" } }"

# Configure PHP CLI
if echo 'memory_limit=256M' >> /usr/local/etc/php/conf.d/php.ini ; then
    add_section_block ":white_check_mark: Configure PHP CLI *successful*."
else
    add_section_block ":X: Configure PHP CLI *failed*. $MENTION"
fi

# Install packages from repository
if apt-get update && apt-get install --yes --no-install-recommends supervisor cron postgresql-client; then
    add_section_block ":white_check_mark: Install packages from repository *successful*."
else
    add_section_block ":X: Install packages from repository *failed*. $MENTION"
fi

cd /home/site/wwwroot/api

# Laravel local cache
if
     mkdir --parents \
        /var/site/storage/app/public \
        /var/site/storage/app/user_generated \
        /var/site/storage/framework/cache/data \
        /var/site/storage/framework/sessions \
        /var/site/storage/framework/testing \
        /var/site/storage/framework/views \
        /var/site/storage/logs \
        /var/site/bootstrap/cache && \
    chown -R www-data:www-data /var/site && \
    chmod -R 775 /var/site && \
    php artisan lighthouse:print-schema --write && \
    php artisan optimize ;
then
    add_section_block ":white_check_mark: Laravel cache setup *successful*."
else
    add_section_block ":X: Laravel cache setup *failed*. $MENTION"
fi

# Laravel database migrations
MIGRATION_STDOUT=$(php artisan migrate --no-interaction --force --no-ansi)
MIGRATION_STATUS=$?

if [ $MIGRATION_STATUS -eq 0 ]; then
    add_section_block ":white_check_mark: Database migration *successful*."
else
    add_section_block ":X: Database migration *failed*. $MENTION"
fi

# Include the stdout from the migration as its own block, cleaned to make Slack happy
CLEANED_STDOUT=${MIGRATION_STDOUT//[^a-zA-Z0-9_ $'\n']/}

# Slack has a max size of 3000 characters
# https://api.slack.com/reference/block-kit/blocks#section
if [ "${#CLEANED_STDOUT}" -gt "2500" ] ; then
    CLEANED_STDOUT="${CLEANED_STDOUT:0:2500}..."
fi
add_section_block "$TRIPLE_BACK_TICK $CLEANED_STDOUT $TRIPLE_BACK_TICK"

# Load Laravel Scheduler cron
# For extra debugging you can add `>> /tmp/run_laravel_scheduler.log 2>&1` to the end of the cron'd command
if echo "  *  *  *  *  * www-data . /etc/profile ; php /home/site/wwwroot/api/artisan schedule:run" >> /etc/crontab ; then
    add_section_block ":white_check_mark: Laravel Scheduler cron setup *successful*."
else
    add_section_block ":X: Laravel Scheduler cron setup *failed*. $MENTION"
fi

# Setup supervisor
if /home/site/wwwroot/infrastructure/bin/setup_supervisor.sh ; then
    add_section_block ":white_check_mark: Setup supervisor *successful*."
else
    add_section_block ":X: Setup supervisor *failed*. $MENTION"
fi

# Copy nginx config and reload
if
    touch /etc/nginx/conf.d/default.conf && \
    /home/site/wwwroot/infrastructure/bin/substitute_file.sh \
        /home/site/wwwroot/infrastructure/conf/nginx-conf-deploy/default \
        /etc/nginx/sites-available/default '$NGINX_PORT $ROBOTS_FILENAME $HTTP_DISGUISED_HOST' && \
    nginx -s reload ; then
    add_section_block ":white_check_mark: Set up Nginx *successful*."
else
    add_section_block ":X: Set up Nginx *failed*. $MENTION"
fi

# Copy custom PHP-FPM config
# FPM is not yet started when this script is run so no need to restart it.
if cp /home/site/wwwroot/infrastructure/conf/php-fpm-www.conf /usr/local/etc/php-fpm.d/www.conf ; then
    add_section_block ":white_check_mark: Config (www) copy for PHP-FPM *successful*."
else
    add_section_block ":X: Config (www) copy for PHP-FPM *failed*. $MENTION"
fi
if cp /home/site/wwwroot/infrastructure/conf/php-fpm-docker.conf /usr/local/etc/php-fpm.d/docker.conf ; then
    add_section_block ":white_check_mark: Config (docker) copy for PHP-FPM *successful*."
else
    add_section_block ":X: Config (docker) copy for PHP-FPM *failed*. $MENTION"
fi

# Environment config variable substitutions
if /home/site/wwwroot/infrastructure/bin/substitute_file.sh /home/site/wwwroot/apps/web/dist/client/index.html /home/site/index.html; then
    add_section_block ":white_check_mark: Copy config for web *successful*."
else
    add_section_block ":X: Copy config for web *failed*. $MENTION"
fi

# Add a source context block
BLOCKS="$BLOCKS, { \"type\": \"divider\" }"
BLOCKS="$BLOCKS, { \"type\": \"context\", \"elements\": [ { \"type\": \"mrkdwn\", \"text\": \"Source: $WEBSITE_SITE_NAME\" } ] }"

# Write finished payload to file
PAYLOAD="{\"blocks\": [$BLOCKS]}"
echo $PAYLOAD > $PAYLOAD_FILE

# Send payload to Slack
if [ -z "$SLACK_WEBHOOK_URI" ]; then
    echo "No Slack webhook URI provided.  You can review the $PAYLOAD_FILE file."
else
    # Switch to "--fail-with-body" when we get curl 7.76.0 so we can see a slack error message.  For now, remove the "--fail" option to see the web response.
    curl \
        --fail \
        --header "Content-Type: application/json" \
        --data @$PAYLOAD_FILE \
        "$SLACK_WEBHOOK_URI"
    if [ $? -eq 0 ]; then
        echo "Slack log sent successfully"
    else
        echo "Slack log failed to send"
        # try to send a last-ditch notification to slack
        curl \
            --header "Content-Type: application/json" \
            --data "{\"text\":\"Failed to send a log from a deployment! You can review the payload file on the server.\"}" \
            "$SLACK_WEBHOOK_URI"
    fi
fi

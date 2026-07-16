#!/usr/bin/env bash
# This script is run after the deployment is complete to help set up the environment in the app service.
# It sends a message to a slack webhook URI.

SLACK_WEBHOOK_URI=$1

# Can review this file even if the slack delivery fails
PAYLOAD_FILE=/tmp/post_deploy_log_payload.json

# Persistent (survives container restarts) fallback log, mainly for the migration step below,
# in case the container is killed mid-migration before Slack delivery ever happens.
# Truncated at the start of each run so it doesn't grow unbounded across deployments.
POST_DEPLOY_LOG_FILE=/home/LogFiles/post_deployment.log
mkdir -p /home/LogFiles
echo "=== post_deployment.sh run started $(date -u +%Y-%m-%dT%H:%M:%SZ) ===" > "$POST_DEPLOY_LOG_FILE"

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

# Remove bad source file (see: https://github.com/GCTC-NTGC/gc-digital-talent/issues/16650)
# This block can be removed once the base image stops shipping with this file present.
if rm -f /etc/apt/sources.list.d/nginx.list ; then
    add_section_block ":white_check_mark: Remove bad source *successful*."
else
    add_section_block ":X: Remove bad source *failed*.. $MENTION"
fi

# Configure PHP CLI — write to a drop-in file (not append) so re-runs are idempotent
if echo 'memory_limit=256M' > /usr/local/etc/php/conf.d/memory-limit.ini ; then
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
# - LOG_CHANNEL=cli routes any thrown exception into Azure Monitor (see config/logging.php)
# - stderr is captured too, since Laravel/Symfony Console renders exceptions there, not stdout
# - streamed through tee so the persistent log file has partial output even if the container
#   hangs or is killed mid-migration, instead of nothing at all (see issue #16961)
MIGRATION_STDOUT=$(LOG_CHANNEL=cli php artisan migrate --no-interaction --force --no-ansi 2>&1 | tee -a "$POST_DEPLOY_LOG_FILE"; exit "${PIPESTATUS[0]}")
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

# Laravel RolePermission seeder
ROLEPERMISSION_SEEDER_STDOUT=$(php artisan db:seed --class=RolePermissionSeeder --no-interaction --force --no-ansi)
ROLEPERMISSION_SEEDER_STATUS=$?

if [ $ROLEPERMISSION_SEEDER_STATUS -eq 0 ]; then
    add_section_block ":white_check_mark: RolePermission seeder *successful*."
else
    add_section_block ":X: RolePermission seeder *failed*. $MENTION"
fi

# Include the stdout from the seeder as its own block, cleaned to make Slack happy
ROLEPERMISSION_SEEDER_CLEANED_STDOUT=${ROLEPERMISSION_SEEDER_STDOUT//[^a-zA-Z0-9_ $'\n']/}

# Slack has a max size of 3000 characters
# https://api.slack.com/reference/block-kit/blocks#section
if [ "${#ROLEPERMISSION_SEEDER_CLEANED_STDOUT}" -gt "2500" ] ; then
    ROLEPERMISSION_SEEDER_CLEANED_STDOUT="${ROLEPERMISSION_SEEDER_CLEANED_STDOUT:0:2500}..."
fi
add_section_block "$TRIPLE_BACK_TICK $ROLEPERMISSION_SEEDER_CLEANED_STDOUT $TRIPLE_BACK_TICK"

# Load Laravel Scheduler cron
# For extra debugging you can add `>> /tmp/run_laravel_scheduler.log 2>&1` to the end of the cron'd command
# Write to a drop-in file in /etc/cron.d/ (overwrite) so re-runs are idempotent and changes are always applied
if cat > /etc/cron.d/gc-digital-talent << 'EOF'
  *  *  *  *  * www-data . /etc/profile ; php /home/site/wwwroot/api/artisan schedule:run
EOF
then
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
    /home/site/wwwroot/infrastructure/bin/substitute_file.sh \
        /home/site/wwwroot/infrastructure/conf/nginx-deploy.conf \
        /etc/nginx/conf.d/default.conf '$NGINX_PORT $ROBOTS_FILENAME $HTTP_DISGUISED_HOST' && \
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

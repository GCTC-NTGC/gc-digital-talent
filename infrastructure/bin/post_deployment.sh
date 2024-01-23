#!/usr/bin/env bash
# This script is run after the deployment is complete to help set up the environment in the app service.
# It sends a message to a slack webook URI.

ROOT_DIR=$1
SLACK_WEBHOOK_URI=$2
SOURCE_NAME=$3

# https://stackoverflow.com/a/13122217
read -r -d '' TRIPLE_BACK_TICK << "EndOfMessage"
```
EndOfMessage

# Switch to another token for quieter testing
MENTION="@channel"

if [ -z "$ROOT_DIR" ]; then
    echo "Must past abs path as first argument."
    exit 1
fi

# First block is the header
BLOCKS="{ \"type\": \"header\", \"text\": { \"type\": \"plain_text\", \"text\": \"Post-deployment script was run\" } }"

cd $ROOT_DIR/api

# Create cache directory
if mkdir --parents /tmp/bootstrap/cache ; then
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":white_check_mark: Cache directory creation *successful*.\" } }"
else
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":X: Cache directory creation *failed*. $MENTION\" } }"
fi

# Chown cache directory
if chown www-data:www-data /tmp/bootstrap/cache ; then
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":white_check_mark: Cache directory chown *successful*.\" } }"
else
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":X: Cache directory chown *failed*. $MENTION\" } }"
fi

# Laravel database migrations
MIGRATION_STDOUT=$(php artisan migrate --no-interaction --force --no-ansi)
MIGRATION_STATUS=$?

if [ $MIGRATION_STATUS -eq 0 ]; then
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":white_check_mark: Database migration *successful*.\" } }"
else
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":X: Database migration *failed*. $MENTION\" } }"
fi

# Include the stdout from the migration as its own block, cleaned to make Slack happy
CLEANED_STDOUT=${MIGRATION_STDOUT//[^a-zA-Z0-9_ $'\n']/}
BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\":\"$TRIPLE_BACK_TICK $CLEANED_STDOUT $TRIPLE_BACK_TICK\" } }"

# Copy nginx config and reload
if /home/site/wwwroot/infrastructure/bin/substitute_file.sh /home/site/wwwroot/infrastructure/conf/nginx-conf-deploy/default /etc/nginx/sites-available/default '$NGINX_PORT $ROBOTS_FILENAME' && nginx -s reload ; then
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":white_check_mark: Config copy for Nginx *successful*.\" } }"
else
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":X: Config copy for Nginx *failed*. $MENTION\" } }"
fi

# Copy custom PHP-FPM config
# FPM is not yet started when this script is run so no need to restart it.
if cp /home/site/wwwroot/infrastructure/conf/php-fpm-www.conf /usr/local/etc/php-fpm.d/www.conf ; then
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":white_check_mark: Config copy for PHP-FPM *successful*.\" } }"
else
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":X: Config copy for PHP-FPM *failed*. $MENTION\" } }"
fi

# Environment config variable substitutions
if /home/site/wwwroot/infrastructure/bin/substitute_file.sh /home/site/wwwroot/apps/web/dist/config.js /home/site/config-web.js; then
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":white_check_mark: Copy config for web *successful*.\" } }"
else
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":X: Copy config for web *failed*. $MENTION\" } }"
fi

# Add a source context block
read -r -d '' BLOCKS << EndOfMessage
$BLOCKS,
{
    "type": "divider"
},
{
  "type": "context",
  "elements": [
    {
      "type": "mrkdwn",
      "text": "Source: $SOURCE_NAME"
    }
  ]
}
EndOfMessage

PAYLOAD="{\"blocks\": [$BLOCKS]}"

if [ -z "$SLACK_WEBHOOK_URI" ]; then
    echo "No Slack webhook URI provided.  Dumping payload."
    echo "$PAYLOAD"
else
    echo "$PAYLOAD"  | curl -H "Content-Type: application/json" -X POST --data-binary @- "$SLACK_WEBHOOK_URI"
fi

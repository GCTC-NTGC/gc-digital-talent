#!/usr/bin/env bash
# This script is run after the deployment is complete to help set up the environment in the app service.
# It sends a message to a slack webook URI.

ROOT_DIR=$1
SLACK_WEBHOOK_URI=$2
SOURCE_NAME=$3

if [ -z "$ROOT_DIR" ]; then
    echo "Must past abs path as first argument."
    exit 1
fi

# First block is the header
BLOCKS="{ \"type\": \"header\", \"text\": { \"type\": \"plain_text\", \"text\": \"Post-deployment script was run - $SOURCE_NAME\" } }"

cd $ROOT_DIR/api

# Unfortunately, no useful exit codes from artisan :-(
MIGRATION_STDOUT=$(php artisan migrate --no-interaction --force)
# https://unix.stackexchange.com/a/649781
OCCURRENCES_WORD_MIGRATING=$(printf '%s' "$MIGRATION_STDOUT" | grep -o 'Migrating:' | wc -l)
OCCURRENCES_WORD_MIGRATED=$(printf '%s' "$MIGRATION_STDOUT" | grep -o 'Migrated:' | wc -l)

if echo "$MIGRATION_STDOUT"| grep -q 'Exception' ; then
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":X: Database migration probably *failed* with an exception.\" } }"
elif [ "$MIGRATION_STDOUT" == 'Nothing to migrate.' ] ; then
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":white_check_mark: Database migration *successful* with the _nothing to migrate_ message.\" } }"
elif [ "$OCCURRENCES_WORD_MIGRATING" == "$OCCURRENCES_WORD_MIGRATED" ] ; then
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":white_check_mark: Databse migration appeared *successful* for $OCCURRENCES_WORD_MIGRATING migrations.\" } }"
else
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":X: Database migration *unknown* status.\" } }"
fi

if mkdir --parents /tmp/bootstrap/cache ; then
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":white_check_mark: Cache directory creation *successful*.\" } }"
else
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":X: Cache directory creation *failed*.\" } }"
fi

if chown www-data:www-data /tmp/bootstrap/cache ; then
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":white_check_mark: Cache directory chown *successful*.\" } }"
else
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":X: Cache directory chown *failed*.\" } }"
fi

if [ -z "$SLACK_WEBHOOK_URI" ]; then
    echo "No Slack webhook URI provided.  Dumping blocks."
    echo "$BLOCKS"
else
    curl -X POST -H "Content-type: application/json" --data "{\"blocks\": [$BLOCKS]}" "$SLACK_WEBHOOK_URI"
fi

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

# Unfortunately, no useful exit codes from artisan :-(
MIGRATION_STDOUT=$(php artisan migrate --no-interaction --force)
# https://unix.stackexchange.com/a/649781
OCCURRENCES_WORD_MIGRATING=$(printf '%s' "$MIGRATION_STDOUT" | grep -o 'Migrating:' | wc -l)
OCCURRENCES_WORD_MIGRATED=$(printf '%s' "$MIGRATION_STDOUT" | grep -o 'Migrated:' | wc -l)

if echo "$MIGRATION_STDOUT"| grep -q 'Exception' ; then
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":X: Database migration probably *failed* with an exception. $MENTION\" } }"
elif [ "$MIGRATION_STDOUT" == 'Nothing to migrate.' ] ; then
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":white_check_mark: Database migration *successful* with the _nothing to migrate_ message.\" } }"
elif [ "$OCCURRENCES_WORD_MIGRATING" == "$OCCURRENCES_WORD_MIGRATED" ] ; then
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":white_check_mark: Databse migration appeared *successful* for $OCCURRENCES_WORD_MIGRATING migrations.\" } }"
else
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":X: Database migration *unknown* status. $MENTION\" } }"
fi

# Include the stdout from the migration as its own block
BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\":\"$TRIPLE_BACK_TICK $MIGRATION_STDOUT $TRIPLE_BACK_TICK\" } }"

if mkdir --parents /tmp/bootstrap/cache ; then
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":white_check_mark: Cache directory creation *successful*.\" } }"
else
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":X: Cache directory creation *failed*. $MENTION\" } }"
fi

if chown www-data:www-data /tmp/bootstrap/cache ; then
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":white_check_mark: Cache directory chown *successful*.\" } }"
else
    BLOCKS="$BLOCKS, { \"type\": \"section\", \"text\": { \"type\": \"mrkdwn\", \"text\": \":X: Cache directory chown *failed*. $MENTION\" } }"
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

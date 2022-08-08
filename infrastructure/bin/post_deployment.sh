#!/usr/bin/env bash

# This script is run after the deployment is complete to help set up the environment in the app service

# This token appearing in the logs is expected to trigger an alert in the analytics when detected.
# In the Azure release pipeline it is not possible to trigger a pipeline failure post-deployment. (as far as we know?)
FAILURE_LOG_TOKEN="POST_DEPLOYMENT_FAILURE"

if [ -z "$1" ]; then
    echo "Must past abs path as argument."
    exit 1
fi

ROOT_DIR=$1
cd $ROOT_DIR/api

# Unfortunately, no useful exit codes from artisan :-(
MIGRATION_STDOUT=$(php artisan migrate --no-interaction --force)
# https://unix.stackexchange.com/a/649781
OCCURRENCES_WORD_MIGRATING=$(printf '%s' "$MIGRATION_STDOUT" | grep -o 'Migrating:' | wc -l)
OCCURRENCES_WORD_MIGRATED=$(printf '%s' "$MIGRATION_STDOUT" | grep -o 'Migrated:' | wc -l)

if echo "$MIGRATION_STDOUT"| grep -q 'Exception' ; then
    echo "$FAILURE_LOG_TOKEN Database migration probably failed with exception."
elif [ "$MIGRATION_STDOUT" == 'Nothing to migrate.' ] ; then
    echo "Database migration successful with 'nothing to migrate message'."
elif [ "$OCCURRENCES_WORD_MIGRATING" == "$OCCURRENCES_WORD_MIGRATED" ] ; then
    echo "Databse migration appeared successful for $OCCURRENCES_WORD_MIGRATING migrations"
else
    echo "$FAILURE_LOG_TOKEN Database migration unknown status"
fi

if mkdir --parents /tmp/bootstrap/cache ; then
    echo "Cache directory creation successful"
else
    echo "$FAILURE_LOG_TOKEN Cache directory creation failed"
fi

if chown www-data:www-data /tmp/bootstrap/cache ; then
    echo "Cache directory chown successful"
else
    echo "$FAILURE_LOG_TOKEN Cache directory chown failed"
fi

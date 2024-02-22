#!/usr/bin/env bash
# This script is run during the deployment to help set up the config files in the app service.

ORIG_FILE_NAME=$1
NEW_FILE_NAME=$2
VARIABLES_TO_EXPAND=$3

if [ -z "$VARIABLES_TO_EXPAND" ]; then
    # no variables specified, substitute everything
    envsubst < $ORIG_FILE_NAME > $NEW_FILE_NAME
else
    # variables specified, do only those
    envsubst "$VARIABLES_TO_EXPAND" < $ORIG_FILE_NAME > $NEW_FILE_NAME
fi

chmod --reference=$ORIG_FILE_NAME $NEW_FILE_NAME
chown --reference=$ORIG_FILE_NAME $NEW_FILE_NAME

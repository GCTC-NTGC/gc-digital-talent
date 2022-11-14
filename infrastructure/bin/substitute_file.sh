#!/usr/bin/env bash
# This script is run during the deployment to help set up the config files in the app service or docker container.

ORIG_FILE_NAME=$1
TEMP_FILE_NAME=$1.temp

envsubst < $ORIG_FILE_NAME > $TEMP_FILE_NAME
chmod --reference=$ORIG_FILE_NAME $TEMP_FILE_NAME
chown --reference=$ORIG_FILE_NAME $TEMP_FILE_NAME
mv $TEMP_FILE_NAME $ORIG_FILE_NAME

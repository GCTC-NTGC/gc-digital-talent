#! /bin/bash
appkey=`cat /dev/urandom | tr -dc '[a-zA-Z0-9]' | fold -w32 - | head -n 1`
sed -i "s/APP_KEY=.*/APP_KEY=$appkey/" $1
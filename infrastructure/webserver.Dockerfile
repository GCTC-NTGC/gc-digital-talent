# This setup should only install things that are set up in infrastructure/bin/post_deployment.sh as well

# All images: https://mcr.microsoft.com/v2/appsvc/php/tags/list
FROM mcr.microsoft.com/appsvc/php:8.2-fpm-xdebug_20230908.3.tuxprod

RUN apt-get update \
    && apt-get install --yes --no-install-recommends supervisor cron postgresql-client \
    && apt-get --yes autoremove \
    && apt-get clean

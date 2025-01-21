# This setup should only install things that are set up in infrastructure/bin/post_deployment.sh as well

# All images: https://mcr.microsoft.com/v2/appsvc/php/tags/list
FROM mcr.microsoft.com/appsvc/php:8.3-fpm-xdebug_20241021.7.tuxprod

RUN echo 'memory_limit=256M' >> /usr/local/etc/php/conf.d/php.ini

RUN apt-get update \
    && apt-get install --yes --no-install-recommends supervisor cron postgresql-client \
    && apt-get clean

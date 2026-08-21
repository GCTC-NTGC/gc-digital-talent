# This setup should only install things that are set up in infrastructure/bin/post_deployment.sh as well

# All images: https://mcr.microsoft.com/v2/appsvc/php/tags/list
FROM mcr.microsoft.com/appsvc/php:8.4-fpm-xdebug_20260527.2.tuxprod

RUN echo 'memory_limit=256M' >> /usr/local/etc/php/conf.d/php.ini

RUN apt-get update \
    && apt-get install --yes --no-install-recommends supervisor cron postgresql-client \
    && apt-get clean

# Remap the www-data account to the host user's ids, so that everything running
# as www-data -- php-fpm workers, and the `runuser -u www-data` artisan calls in
# the Makefile -- writes files into the mounted tree that you can edit.
#
# This container cannot simply run as non-root: its entrypoint is Azure's
# init_container.sh, which needs root for sshd, nginx, php-fpm's pool user, and
# supervisor/cron. Defaults to 33 (www-data's usual id), leaving this safe for CI.
ARG HOST_UID=33
ARG HOST_GID=33
RUN old_uid="$(id -u www-data)" && old_gid="$(id -g www-data)" \
    && usermod  -o -u "${HOST_UID}" www-data \
    && groupmod -o -g "${HOST_GID}" www-data \
    && find / -xdev -uid "$old_uid" -exec chown -h www-data {} + \
    && find / -xdev -gid "$old_gid" -exec chgrp -h www-data {} +

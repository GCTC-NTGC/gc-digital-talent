FROM php:8.4.6-apache-bullseye as base

# Install pdo_pgsql extension.
RUN apt-get update \
    && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo_pgsql

WORKDIR /var/www/html/api

COPY composer.json composer.lock ./
COPY tests/ tests/

FROM base as builder

# Install zip and gd ext required for composer install from dist.
# REF: https://hub.docker.com/_/php#:~:text=php%2Dsource%20delete-,PHP%20Core%20Extensions,-For%20example%2C%20if
RUN apt-get update \
    && apt-get install -y libzip-dev libfreetype6-dev libjpeg62-turbo-dev libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install zip gd

# Copy composer binary from official image.
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
RUN composer install --prefer-dist

# Re-use base layer without composer.
FROM base
COPY --from=builder /var/www/html/api/vendor vendor
# Default configuration in case needed.
COPY .env.example .env
# Overrides default with custom .env if file exists.
COPY . .
RUN chmod -R 777 ./storage

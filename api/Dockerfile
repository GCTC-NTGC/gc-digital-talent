FROM php:8.2.9-apache-bullseye as base

# Install pdo_pgsql extension.
RUN apt-get update \
    && apt-get install -y libpq-dev php-gd \
    && docker-php-ext-install pdo_pgsql

WORKDIR /var/www/html/api

COPY composer.json composer.lock ./
COPY tests/ tests/

FROM base as builder
# Install zip ext required for composer install from dist.
RUN apt-get update \
    && apt-get install -y libzip-dev \
    && docker-php-ext-install zip
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

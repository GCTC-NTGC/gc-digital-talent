FROM php:7.4-apache
# FROM php:8.0-apache

# Enable mod_rewrite
RUN a2enmod rewrite
RUN a2enmod include

# Install pdo_pgsql extension
RUN apt-get update \
    && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo_pgsql

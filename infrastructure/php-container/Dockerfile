FROM php:7.4-apache
# FROM php:8.0-apache

# Install pdo_pgsql extension
RUN apt-get update \
    && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo_pgsql

# Enable apache modules
RUN a2enmod rewrite \
    # For including other config files.
    && a2enmod include \
    # For header directive (security headers mostly).
    && a2enmod headers

FROM php:8.1-rc-cli-buster
# FROM php:8.0-apache

# Install pdo_pgsql extension
RUN apt-get update \
    && apt-get install -y libpq-dev \
    # One of two PHP extensions (gmp or bcmath) must be installed to perform
    # cryptographic operations associated with RSA-based JWTs (used by
    # brick/math via web-token/jwt-core)
    # See: https://www.php.net/manual/en/book.bc.php
    # See: https://www.php.net/manual/en/book.gmp.php
    # See: https://web-token.spomky-labs.com/introduction/pre-requisite
    # See: https://github.com/brick/math#requirements
    && docker-php-ext-install pdo_pgsql bcmath

# Enable apache modules
RUN a2enmod rewrite \
    # For including other config files.
    && a2enmod include \
    # For proxying mock-auth for local dev.
    && a2enmod proxy \
    && a2enmod proxy_http \
    # For header directive (security headers mostly).
    && a2enmod headers

COPY mock-auth-proxy.apache-site.conf /etc/apache2/sites-enabled/000-default.conf

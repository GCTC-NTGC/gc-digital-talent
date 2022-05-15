FROM php:7.4-apache
# FROM php:8.0-apache

# Enable mod_rewrite
RUN a2enmod rewrite
RUN a2enmod include

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

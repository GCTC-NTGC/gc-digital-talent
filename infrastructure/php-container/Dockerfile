FROM php:7.4-apache
# FROM php:8.0-apache

# Enable mod_rewrite
RUN a2enmod rewrite
RUN a2enmod include

# Install pdo_pgsql extension
RUN apt-get update \
    && apt-get install -y libpq-dev \
    # Optionally, one of two PHP extensions can be installed to speed up
    # working with JWTs. (used by brick/math via web-token/jwt-core)
    # See: https://web-token.spomky-labs.com/introduction/pre-requisite
    # See: https://github.com/brick/math#requirements
    #
    # TODO: Investigate installing bcmath or gmp PHP extensions on server to
    # improve cypher operation performance.
    # See: https://www.php.net/manual/en/book.bc.php
    # See: https://www.php.net/manual/en/book.gmp.php
    && docker-php-ext-install pdo_pgsql

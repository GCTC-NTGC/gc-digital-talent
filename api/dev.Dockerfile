FROM php:8.2.9

WORKDIR /var/www/html
COPY composer.json composer.lock ./

# Install pdo_pgsql extension.
RUN apt-get update \
    && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo_pgsql

# Install zip and gd ext required for composer install from dist.
# REF: https://hub.docker.com/_/php#:~:text=php%2Dsource%20delete-,PHP%20Core%20Extensions,-For%20example%2C%20if
RUN apt-get update \
    && apt-get install -y libzip-dev libfreetype6-dev libjpeg62-turbo-dev libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install zip gd

# Copy composer binary from official image.
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
RUN composer install --prefer-dist

CMD php artisan serve --host=0.0.0.0 --port=8000


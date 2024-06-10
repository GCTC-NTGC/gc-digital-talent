FROM php:8.2.9

WORKDIR /var/www/html

# Install pdo_pgsql extension.
RUN apt-get update \
    && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo_pgsql

# REF: https://hub.docker.com/_/php#:~:text=php%2Dsource%20delete-,PHP%20Core%20Extensions,-For%20example%2C%20if
RUN apt-get update \
    && apt-get install -y libzip-dev libfreetype6-dev libjpeg62-turbo-dev libpng-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install zip gd

CMD php artisan serve --host=0.0.0.0 --port=8001


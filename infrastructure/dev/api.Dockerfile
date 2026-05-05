# Development Dockerfile for Laravel API
# Uses PHP's built-in dev server with hot reloading

FROM php:8.4-cli

# Install system dependencies and PHP extensions
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libpq-dev \
        libzip-dev \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
        libicu-dev \
        git \
        unzip \
        curl \
        postgresql-client \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_pgsql zip gd bcmath intl pcntl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install composer from official image
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

# Set working directory
WORKDIR /var/www/html/api

# Mark git directory as safe (for version info)
RUN git config --global --add safe.directory /var/www/html

# Copy entrypoint script
COPY infrastructure/dev/api-entrypoint.sh /usr/local/bin/api-entrypoint.sh
RUN chmod +x /usr/local/bin/api-entrypoint.sh

# Expose Laravel dev server port
EXPOSE 8080

# Use entrypoint script to generate schema and start server
ENTRYPOINT ["/usr/local/bin/api-entrypoint.sh"]

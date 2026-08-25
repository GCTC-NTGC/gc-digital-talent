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
WORKDIR /home/site/wwwroot/api

# Mark git directory as safe (for version info)
RUN git config --system --add safe.directory /home/site/wwwroot

# Copy entrypoint scripts. entrypoint-uid.sh runs first: it adopts the ids of
# whoever owns the mounted project and drops to them before handing over.
COPY infrastructure/dev/api-entrypoint.sh /usr/local/bin/api-entrypoint.sh
COPY infrastructure/bin/entrypoint-uid.sh /usr/local/bin/entrypoint-uid.sh
RUN chmod +x /usr/local/bin/api-entrypoint.sh /usr/local/bin/entrypoint-uid.sh

# Expose Laravel dev server port
EXPOSE 8080

# Use entrypoint script to generate schema and start server
ENTRYPOINT ["/usr/local/bin/entrypoint-uid.sh", "/usr/local/bin/api-entrypoint.sh"]

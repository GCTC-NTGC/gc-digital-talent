#!/bin/bash
# Development entrypoint script for the Laravel API

set -e

# Wait for postgres to be ready
echo "Waiting for postgres..."
until pg_isready -h postgres -p 5432 -U postgres 2>/dev/null; do
    sleep 1
done
echo "Postgres is ready!"

# Run migrations if needed
php artisan migrate --force

# Generate the GraphQL schema for codegen
# This allows the web container to run graphql-codegen
echo "Generating lighthouse schema..."
php artisan lighthouse:print-schema --write

# Start background workers
echo "Starting background jobs..."
php artisan queue:work &
php artisan reverb:start &

# Start the Laravel development server
exec php artisan serve --host=0.0.0.0 --port=8080

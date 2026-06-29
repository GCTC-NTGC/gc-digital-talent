# Development Dockerfile for Vite/React frontend
# Runs the Vite dev server with HMR (Hot Module Replacement)

FROM node:24.15.0-slim

# Install git for version info in builds
RUN apt-get update \
    && apt-get install -y --no-install-recommends git \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm@10.27.0

# Set working directory to the monorepo root
WORKDIR /var/www/html
RUN chmod 777 /var/www/html

# Mark git directory as safe
RUN git config --global --add safe.directory /var/www/html

COPY infrastructure/dev/web-entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Expose Vite dev server port
EXPOSE 3000

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["pnpm", "run", "watch"]

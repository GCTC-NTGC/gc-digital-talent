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

# Mark git directory as safe. --system rather than --global: an arbitrary
# runtime uid does not share root's $HOME, so a --global config written at build
# time would not apply to it.
RUN git config --system --add safe.directory /var/www/html

COPY infrastructure/dev/web-entrypoint.sh /usr/local/bin/entrypoint.sh
COPY infrastructure/bin/entrypoint-uid.sh /usr/local/bin/entrypoint-uid.sh
RUN chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/entrypoint-uid.sh

# Expose Vite dev server port
EXPOSE 3000

# entrypoint-uid.sh runs first: it adopts the ids of whoever owns the mounted
# project, takes ownership of the workspace root and node_modules, then drops.
ENTRYPOINT ["/usr/local/bin/entrypoint-uid.sh", "/usr/local/bin/entrypoint.sh"]
CMD ["pnpm", "run", "watch"]

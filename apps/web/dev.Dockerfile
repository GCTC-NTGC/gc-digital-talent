FROM node:20.11.0

WORKDIR /var/www/html

RUN npm install --location=global pnpm@8.15
RUN pnpm config set store-dir /tmp/pnpm

COPY \
    apps/web \
    graphql.config.yml \
    hydrogen.config.json \
    .npmrc \
    .nvmrc \
    package.json \
    packages \
    pnpm-lock.yaml \
    pnpm-workspace.yaml \
    turbo.json \
    ./
RUN \
    pnpm install && \
    pnpm intl-extract && \
    pnpm intl-compile && \
    pnpm codegen

CMD cd apps/web && npx webpack serve --config webpack.dev.js
#  CMD sleep infinity

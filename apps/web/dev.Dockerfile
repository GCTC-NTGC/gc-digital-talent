FROM node:20.11.0

WORKDIR /var/www/html

RUN npm install --location=global pnpm@8.15

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
    .turbo \
    turbo.json \
    ./
RUN pnpm install

CMD cd apps/web && npx webpack serve --config webpack.dev.js
# CMD sleep infinity

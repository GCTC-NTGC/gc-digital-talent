FROM node:20.11.0

WORKDIR /var/www/html

RUN npm install --location=global pnpm@8.15

COPY \
    apps/web \
    axe-linter.yml \
    codecov.yml \
    CONTRIBUTING.md \
    docker-compose.ci.yml \
    docker-compose.dev.yml \
    docker-compose.yml \
    documentation \
    .editorconfig \
    .git \
    .gitattributes \
    .github \
    .gitignore \
    graphql.config.yml \
    hydrogen.config.json \
    infrastructure \
    LICENSE \
    maintenance \
    Makefile \
    Makefile.nix \
    .npmrc \
    .nvmrc \
    package.json \
    packages \
    pnpm-lock.yaml \
    pnpm-workspace.yaml \
    .prettierrc \
    README.md \
    SECURITY.md \
    tc-report \
    .turbo \
    turbo.json \
    .vscode \
    ./
RUN pnpm install

CMD cd apps/web && npx webpack serve --config webpack.dev.js
# CMD sleep infinity

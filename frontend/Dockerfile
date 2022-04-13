FROM node:14.18.1-alpine3.14 as builder
ARG NPM_VERSION=8.3.0

WORKDIR /app
COPY package.json package-lock.json lighthouse-schema.graphql ./
# RUN npm ci
# TODO: add full command

WORKDIR /app/common

COPY common/package.json .
# RUN npm ci
# TODO: add full command

COPY common/tsconfig.json common/hydrogen.config.json ./
COPY common/src/ src/
#RUN npm run h2-build

COPY common/codegen.yml ./
#RUN npm run codegen

WORKDIR /app/admin

COPY admin/package.json ./
#RUN npm ci

COPY admin/tsconfig.json .
COPY admin/src/ src/
#RUN npm run h2-build

COPY admin/codegen.yml ./
#RUN npm run codegen

COPY admin/webpack.*.js  ./
#RUN npm run production

WORKDIR /app/talentsearch

COPY talentsearch/package.json ./
#RUN npm ci

COPY talentsearch/tsconfig.json ./
# TODO: be more specific about when `npm run h2-build` needs.
COPY talentsearch/src/ src/
#RUN npm run h2-build

COPY talentsearch/codegen.yml ./
#RUN npm run codegen

COPY talentsearch/webpack.*.js ./
# TODO: be more specific about when `npm run dev` needs.
COPY talentsearch/src/ src/
#RUN npm run dev

WORKDIR /app
RUN npm install --global npm@$NPM_VERSION
RUN npm ci
RUN npm run h2-build --if-present --workspaces
RUN npm run codegen --if-present --workspaces
RUN npm run intl-compile --if-present --workspaces
RUN npm run dev --if-present --workspaces

FROM httpd:2.4.53-bullseye as webserver
COPY ./my-httpd.conf /usr/local/apache2/conf/httpd.conf

WORKDIR /usr/local/apache2/htdocs
RUN rm -rf ./*

#TODO: can we copy these directly to the root hosting directory and not have issues  with loading /admin?
COPY --from=builder /app/talentsearch/dist ./app/talentsearch
COPY --from=builder /app/admin/dist ./app/admin
COPY conf/root.htaccess ./
COPY conf/talentsearch.htaccess /app/talentsearch/.htaccess
COPY conf/admin.htaccess /app/admin/.htaccess

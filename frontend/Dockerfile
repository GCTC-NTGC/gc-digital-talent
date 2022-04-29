FROM node:14.18.1-alpine3.14 as builder
ARG NPM_VERSION=8.3.0

# Install dependencies
WORKDIR /app
COPY package.json package-lock.json ./
COPY common/package.json /app/common/
COPY admin/package.json /app/admin/
COPY talentsearch/package.json /app/talentsearch/
# TODO: add indigenous apprenticeship portal
RUN npm ci

# Default configuration in case needed.
COPY admin/.env.example admin/.env
COPY talentsearch/.env.example talentsearch/.env

# Other build commands require most of the code copied in
# TODO: Be more specific with file copies
# TODO: Parralel multi-stage builds after compiling common?
COPY . .
RUN npm run h2-build --if-present --workspaces
RUN npm run codegen --if-present --workspaces
RUN npm run intl-compile --if-present --workspaces
RUN npm run dev --if-present --workspaces

FROM httpd:2.4.53-bullseye as webserver
COPY ./my-httpd.conf /usr/local/apache2/conf/httpd.conf

WORKDIR /usr/local/apache2/htdocs
RUN rm -rf ./*

# #TODO: can we copy these directly to the root hosting directory and not have issues  with loading /admin?
COPY conf/root.htaccess ./.htaccess
COPY conf/talentsearch.htaccess ./talentsearch/.htaccess
COPY conf/admin.htaccess ./admin/.htaccess
COPY --from=builder /app/talentsearch/dist ./talentsearch/
COPY --from=builder /app/admin/dist ./admin/

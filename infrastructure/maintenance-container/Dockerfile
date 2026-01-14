# aliased image used in build
FROM node:24.12.0 AS node

# base
FROM ubuntu:24.04

# install apt packages
# first install software-properties-common to get add-apt-repository
# then add ondrej PPA
# then update again and install everything else
# installing tzdata has an interactive prompt by default
RUN apt-get update \
  && apt-get install -y software-properties-common \
  && LC_ALL=C.UTF-8 add-apt-repository ppa:ondrej/php \
  && apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends tzdata \
  && apt-get install -y perl unzip wget curl \
  && apt-get install -y php8.4 php8.4-mbstring php8.4-xml php8.4-pgsql php8.4-zip php8.4-curl php8.4-bcmath php8.4-gd php8.4-intl \
  && apt-get install --yes --no-install-recommends git postgresql-client \
  && apt-get clean

# install node from official image
# https://gist.github.com/BretFisher/da34530726ff8076b83b583e527e91ed
COPY --from=node /usr/local/include/node /usr/local/include/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=node /usr/local/bin/node /usr/local/bin/node
RUN cd /usr/local/bin \
  && ln -s ../lib/node_modules/npm/bin/npm-cli.js npm \
  && ln -s ../lib/node_modules/npm/bin/npx-cli.js npx \
  && ln -s /usr/local/bin/node nodejs

# mark app dir as safe for git
RUN git config --global --add safe.directory /var/www/html

# bump pnpm version
RUN npm install --location=global pnpm@10.27.0

# install composer from official image
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

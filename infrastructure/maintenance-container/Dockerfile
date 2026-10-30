# aliased image used in build
FROM node:24.15.0 AS node

# base
FROM ubuntu:26.04

# set up the Ondrej PPA
RUN apt-get update \
  && apt-get -y install lsb-release ca-certificates curl \
  && curl -sSLo /tmp/debsuryorg-archive-keyring.deb https://packages.sury.org/debsuryorg-archive-keyring.deb \
  && dpkg -i /tmp/debsuryorg-archive-keyring.deb \
  && sh -c 'echo "deb [signed-by=/usr/share/keyrings/debsuryorg-archive-keyring.gpg] https://packages.sury.org/php/ $(lsb_release -sc) main" > /etc/apt/sources.list.d/php.list' \

# install apt packages
# installing tzdata has an interactive prompt by default
RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    tzdata \
    perl unzip wget curl \
    php8.5 php8.5-cli php8.5-mbstring php8.5-xml php8.5-pgsql php8.5-zip php8.5-curl php8.5-bcmath php8.5-gd php8.5-dom php8.5-intl \
    git postgresql-client \
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
RUN npm install --location=global pnpm@12.9.1

# install composer from official image
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

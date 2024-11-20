# aliased image used in build
FROM node:20.11.0 as node

# base
FROM ubuntu:22.04

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
  && apt-get install -y php8.2 php8.2-mbstring php8.2-xml php8.2-pgsql php8.2-zip php8.2-curl php8.2-bcmath php8.2-gd \
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
RUN npm install --location=global pnpm@9.12.3

# install composer from official image
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

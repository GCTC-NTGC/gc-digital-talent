FROM ubuntu:22.04

# install apt packages
# installing tzdata has an interactive prompt by default
RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends tzdata \
  && apt-get install -y perl unzip wget curl \
  && apt-get install -y php8.1 php-mbstring php-xml php-pgsql php-zip php-curl php-bcmath \
  && apt-get install -y git

# install node from official image
COPY --from=node:18.16.0 /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=node:18.16.0 /usr/local/bin/node /usr/local/bin/
RUN cd /usr/local/bin \
  && ln -s ../lib/node_modules/npm/bin/npm-cli.js npm \
  && ln -s ../lib/node_modules/npm/bin/npx-cli.js npx \
  && ln -s /usr/local/bin/node nodejs

# mark app dir as safe for git
RUN git config --global --add safe.directory /var/www/html

# bump npm version
RUN npm install --location=global npm@8.11.0

# install composer from official image
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

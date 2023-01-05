FROM ubuntu:22.04

# install apt packages
# installing tzdata has an interactive prompt by default
RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends tzdata \
  && apt-get install -y perl unzip wget curl \
  && apt-get install -y php8.1 php-mbstring php-xml php-pgsql php-zip php-curl php-bcmath

# install node from official image
COPY --from=node:16.16.0 /usr/local/lib/node_modules /usr/local/lib/node_modules
COPY --from=node:16.16.0 /usr/local/bin/node /usr/local/bin/
RUN cd /usr/local/bin \
  && ln -s ../lib/node_modules/npm/bin/npm-cli.js npm \
  && ln -s ../lib/node_modules/npm/bin/npx-cli.js npx \
  && ln -s /usr/local/bin/node nodejs

# bump npm version
RUN npm install --location=global npm@8.11.0
# globally install turbo
# SEE: https://github.com/vercel/turbo/blob/348a4048de08be185f36db04badf72c1b5000cbd/examples/with-docker/apps/web/Dockerfile#L10
RUN npm install --location=global turbo@1.6.3

# install composer from official image
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

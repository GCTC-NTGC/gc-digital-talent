FROM ubuntu:latest

# install apt packages
#   - installing tzdata has an interactive prompt by default
#   - install default nodejs to avoid npm (v7+) run-script issue when using docker on CI.
RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends tzdata \
  && apt-get install -y perl unzip wget curl \
  && apt-get install -y php7.4 php-mbstring php-xml php-pgsql php-zip \
  && apt-get install -y nodejs

# install nvm, not available from apt
# https://github.com/nvm-sh/nvm
RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# install composer from github, only v1 available from apt and we need v2
# https://getcomposer.org/doc/faqs/how-to-install-composer-programmatically.md
RUN wget https://raw.githubusercontent.com/composer/getcomposer.org/76a7060ccb93902cd7576b67264ad91c8a2700e2/web/installer -O - -q | php -- --quiet \
  && mv composer.phar /usr/bin/composer

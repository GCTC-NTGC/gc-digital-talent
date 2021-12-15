FROM ubuntu:21.10

# install apt packages
# installing tzdata has an interactive prompt by default
RUN apt-get update \
  && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends tzdata \
  && apt-get install -y perl unzip wget curl \
  && apt-get install -y php8.0 php-mbstring php-xml php-pgsql php-zip php-curl \
  && apt-get install -y composer

# install nvm, not available from apt
# https://github.com/nvm-sh/nvm
RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

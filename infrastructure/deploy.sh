### PHP version

sudo update-alternatives --set php /usr/bin/php$(phpVersion)
sudo update-alternatives --set phar /usr/bin/phar$(phpVersion)
sudo update-alternatives --set phpdbg /usr/bin/phpdbg$(phpVersion)
sudo update-alternatives --set php-cgi /usr/bin/php-cgi$(phpVersion)
sudo update-alternatives --set phar.phar /usr/bin/phar.phar$(phpVersion)
php -version

### Write-out .htaccess

# Errors will fail out
set -o errexit
# Don't mask errors in piped commands
set -o pipefail
# Fail if using undefined variables
set -o nounset
cp $(System.DefaultWorkingDirectory)/infrastructure/conf/deploy.htaccess $(System.DefaultWorkingDirectory)/.htaccess

### Dependencies

sudo composer selfupdate

# TODO: Load this in lib file. Or alt: Create wrapping command to run `bash` in very specific way, e.g., as login shell.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm

source ~/.bash_profile
nvm install v16.16.0
nvm install-latest-npm

### API

cd $(System.DefaultWorkingDirectory)/$(Release.PrimaryArtifactSourceAlias)/api

composer install --no-dev
sudo chown -R www-data ./storage ./vendor
sudo chmod -R 775 ./ ./storage
php artisan lighthouse:print-schema --write

### Install all npm dependencies

cd $(System.DefaultWorkingDirectory)/$(Release.PrimaryArtifactSourceAlias)/frontend
npm install

### Common

cd $(System.DefaultWorkingDirectory)/$(Release.PrimaryArtifactSourceAlias)/frontend/common
npm run h2-build
npm run codegen
npm run intl-compile
#npm install --production

### Talentsearch

cd $(System.DefaultWorkingDirectory)/$(Release.PrimaryArtifactSourceAlias)/frontend/talentsearch
composer install --no-dev
npm run codegen
npm run intl-compile
npm run production
sudo chown -R www-data ./storage ./vendor
sudo chmod -R 775 ./ ./storage

### Admin

cd $(System.DefaultWorkingDirectory)/$(Release.PrimaryArtifactSourceAlias)/frontend/admin
composer install --no-dev
npm run codegen
npm run intl-compile
npm run production
sudo chown -R www-data ./storage ./vendor
sudo chmod -R 775 ./ ./storage

### Cleanup $(System.DefaultWorkingDirectory)/$(Release.PrimaryArtifactSourceAlias)/frontend npm dependencies

cd $(System.DefaultWorkingDirectory)/$(Release.PrimaryArtifactSourceAlias)/frontend
npm install --production

### Startup command

mkdir -p /tmp/bootstrap/cache && chown -R www-data:www-data /tmp/bootstrap && cd api && php artisan migrate -n --force 2>&1 | tee /tmp/artisan-migrate.log

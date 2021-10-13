### PHP version

sudo update-alternatives --set php /usr/bin/php$(phpVersion)
sudo update-alternatives --set phar /usr/bin/phar$(phpVersion)
sudo update-alternatives --set phpdbg /usr/bin/phpdbg$(phpVersion)
sudo update-alternatives --set php-cgi /usr/bin/php-cgi$(phpVersion)
sudo update-alternatives --set phar.phar /usr/bin/phar.phar$(phpVersion)
php -version

### Write-out .htaccess

cat << '__EOF__' > $(System.DefaultWorkingDirectory)/$(Release.PrimaryArtifactSourceAlias)/.htaccess

<IfModule mod_rewrite.c>
    RewriteEngine on

#   remove trailing slash
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    RewriteCond %{REQUEST_URI} ^(.*)
    RewriteRule ^phpinfo.php$ phpinfo.php [L]
    RewriteRule ^graphql-playground api/public/graphql-playground [L]
    RewriteRule ^graphql api/public/graphql [L]
    RewriteRule ^auth/(.*)$ auth/public/$1 [L]
    RewriteRule ^oauth/(.*)$ auth/public/$1 [L]
    RewriteRule ^admin/(.*)$ admin/public/$1 [L]
    RewriteRule ^public/(.*)$ talentsearch/public/$1 [L]
    RewriteRule ^(.*)$ talentsearch/public/$1 [L]
</IfModule>

<IfModule mod_headers.c>
    RequestHeader set X-Forwarded-Host "dev-talentcloud.tbs-sct.gc.ca"
    RequestHeader set Forwarded "host=dev-talentcloud.tbs-sct.gc.ca;proto=https"
</IfModule>

# Security headers
Header add X-Content-Type-Options nosniff
Header add X-XSS-Protection "1; mode=block"
Header add  Strict-Transport-Security "max-age=31536000; includeSubdomains;"
Header add Cache-Control "max-age=31536000"
Header add Pragma no-cache

# Policy headers
Header add Referrer-Policy "no-referrer-when-downgrade"
#Header add Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com https://www.googletagmanager.com https://tagmanager.google.com https://code.jquery.com https://cdn.datatables.net https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://html2canvas.hertzen.com https://stackpath.bootstrapcdn.com; img-src 'self' data: https://www.google-analytics.com https://ssl.gstatic.com https://www.gstatic.com https://www.gravatar.com https://images.unsplash.com; style-src 'self' 'unsafe-inline' https://tagmanager.google.com https://fonts.googleapis.com https://code.ionicframework.com https://cdn.datatables.net https://stackpath.bootstrapcdn.com https://cdnjs.cloudflare.com; font-src 'self' data: https://fonts.gstatic.com https://tagmanager.google.com https://code.ionicframework.com https://stackpath.bootstrapcdn.com; frame-src 'self'; object-src 'self'; connect-src 'self' https://api.github.com https://www.google-analytics.com;"
Header add Feature-Policy "geolocation 'none'; midi 'none'; sync-xhr 'none'; microphone 'none'; camera 'none'; magnetometer 'none'; gyroscope 'none'; fullscreen 'self'; payment 'none';"
__EOF__

### Dependencies

sudo composer selfupdate

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
source ~/.bash_profile
nvm install v14.18.1
nvm install-latest-npm

### Common

cd $(System.DefaultWorkingDirectory)/$(Release.PrimaryArtifactSourceAlias)/common

nvm use
npm install
npm run codegen
#npm install --production

### API

cd $(System.DefaultWorkingDirectory)/$(Release.PrimaryArtifactSourceAlias)/api

composer install --no-dev
sudo chown -R www-data ./storage ./vendor
sudo chmod -R 775 ./ ./storage
php artisan lighthouse:print-schema --write

### Auth

cd $(System.DefaultWorkingDirectory)/$(Release.PrimaryArtifactSourceAlias)/auth

nvm use
composer install --no-dev
npm install
npm run production
npm install --production
sudo chown -R www-data ./storage ./vendor
sudo chmod -R 775 ./ ./storage
php artisan config:cache

### Talentsearch

cd $(System.DefaultWorkingDirectory)/$(Release.PrimaryArtifactSourceAlias)/talentsearch

nvm use
composer install --no-dev
npm install
npm i @graphql-codegen/typescript --save-dev
npm rebuild node-sass
npm run h2-build
npm run codegen
npm run production
npm install --production
sudo chown -R www-data ./storage ./vendor
sudo chmod -R 775 ./ ./storage

### Admin

cd $(System.DefaultWorkingDirectory)/$(Release.PrimaryArtifactSourceAlias)/admin

nvm use
composer install --no-dev
npm install
npm rebuild node-sass
npm run h2-build
npm run codegen
npm run dev
#npm run production
npm install --production
sudo chown -R www-data ./storage ./vendor
sudo chmod -R 775 ./ ./storage
php artisan config:cache

### Startup command

cd api/ && php artisan migrate -n --force && cd /home/site/wwwroot/auth/ && php artisan migrate -n --force

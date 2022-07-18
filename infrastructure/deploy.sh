### PHP version

sudo update-alternatives --set php /usr/bin/php$(phpVersion)
sudo update-alternatives --set phar /usr/bin/phar$(phpVersion)
sudo update-alternatives --set phpdbg /usr/bin/phpdbg$(phpVersion)
sudo update-alternatives --set php-cgi /usr/bin/php-cgi$(phpVersion)
sudo update-alternatives --set phar.phar /usr/bin/phar.phar$(phpVersion)
php -version

### Write-out .htaccess

cat << '__EOF__' > $(System.DefaultWorkingDirectory)/$(Release.PrimaryArtifactSourceAlias)/.htaccess

# Don't automatically add slash (with 301 redirect) if path matches a directory
DirectorySlash off

<IfModule mod_rewrite.c>
    RewriteEngine on

    # Strip trailing slash from all urls redirect back to public url, unless already pointing to a public folder
    RewriteCond %{REQUEST_URI} ^/(.+)/$
    RewriteCond %{REQUEST_URI} !/public/$
    RewriteRule ^ %{ENV:APP_URL}/%1 [L,R=301]

    # Rewrite api requests
    RewriteRule ^graphql-playground$ api/public/graphql-playground [L]
    RewriteRule ^graphql$ api/public/graphql [L]

    # Send admin requests to admin public folder (with or without public/ path prefix).
    RewriteRule ^admin/public(/(.*))?$ frontend/admin/public/$2 [L]
    RewriteRule ^admin(/(.*))?$ frontend/admin/public/$2 [L]

    # Send auth-callback request to admin
    RewriteRule ^auth-callback$ frontend/admin/public/auth-callback [L]

    # Send /public requests to talentsearch public folder
    RewriteRule ^public/(.*)$ frontend/talentsearch/public/$1 [L]

    # Send al other requests to talentsearch
    RewriteCond %{REQUEST_URI} !^frontend/talentsearch/public/
    RewriteRule ^(.*)$ frontend/talentsearch/public/$1 [L]
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

cp -Rf admin/bootstrap /tmp/ && chown -R www-data:www-data /tmp/bootstrap && cd api && php aritsan migrate -n --force 2>&1 | tee /tmp/migrate.log

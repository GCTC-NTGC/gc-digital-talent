# Laravel Passport

1. The Passport migrations will create the tables your application needs to store OAuth2 clients and access tokens:
`php artisan migrate`

2. This command will create the encryption keys needed to generate secure access tokens. In addition, the command will create "personal access" and "password grant" clients which will be used to generate access tokens:

`php artisan passport:install --uuids`

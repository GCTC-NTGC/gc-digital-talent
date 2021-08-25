# Laravel Passport

0. Run `composer install` and `npm install` to install dependencies.

1. As with any Laravel application, you should run start by running `php artisan key:generate`.

2. The Passport migrations will create the tables your application needs to store OAuth2 clients and access tokens:
`php artisan migrate`

3. This command will create the encryption keys needed to generate secure access tokens: `php artisan passport:keys`. They will be created in the storage folder. This command will also create a file called `.rnd`, which can be ignored. (Alternatively, you can define these keys as [environment variables](https://laravel.com/docs/8.x/passport#loading-keys-from-the-environment).)

4. In order to hash client secrets, the [Personal Access Client](https://laravel.com/docs/8.x/passport#creating-a-personal-access-client) Id and secret must be saved as environment variables. You can generate the id and secret with the following command (it needs a database connection) but you must save them as env variables manually: `php artisan passport:client --personal`

5. Every client which will use this auth server needs its own id and secret. You can generate a new client by running `php artisan passport:client`.

Note that steps 2, 4 and 5 require a database connection. If you running this using the local /infrastructure setup, you may need to run the php commands with a container.


For more details about using or configuring Laravel Passport, visit the [documentation](https://laravel.com/docs/8.x/passport).

# gc-digital-talent

1. Ensure PHP (PHP >= 7.3) and Composer are installed
2. Ensure the following extensions are enabled:
    * OpenSSL PHP Extension
    * PDO PHP Extension
    * Mbstring PHP Extension
3. Run `composer install` and `npm install` to install dependencies.
4. Run `npm run dev` which will bundle up our assets.
5. Start a development server with `php -S localhost:8080 -t public/`.
6. Visit https://localhost:8080 to view page.

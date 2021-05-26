# Getting Started

1. Ensure PHP (PHP >= 7.3) and Composer are installed
2. Ensure the following extensions are enabled:
    * OpenSSL PHP Extension
    * PDO PHP Extension
    * Mbstring PHP Extension
3. Run `composer install` and `npm install` to install dependencies. After the node packages are installed, run `npm rebuild node-sass` incase vendor folder isn't created. (Error: https://github.com/sass/node-sass/issues/1579).
4. Copy .env.example to .env and configure your local environment. Make sure to add a random string as your APP_KEY and set the API_URL to the GraphQL server's URL.
5. If you are developing run `npm run h2-compile`. This will provide all the H2 style attributes. If you need a production ready css file then run `npm run h2-build`.
6. Run `npm run dev` which will bundle up our assets.
7. Start a development server with `php -S localhost:8080 -t public/`.
8. Visit https://localhost:8080 to view page.

# Lumen PHP Framework

[![Build Status](https://travis-ci.org/laravel/lumen-framework.svg)](https://travis-ci.org/laravel/lumen-framework)
[![Total Downloads](https://img.shields.io/packagist/dt/laravel/framework)](https://packagist.org/packages/laravel/lumen-framework)
[![Latest Stable Version](https://img.shields.io/packagist/v/laravel/framework)](https://packagist.org/packages/laravel/lumen-framework)
[![License](https://img.shields.io/packagist/l/laravel/framework)](https://packagist.org/packages/laravel/lumen-framework)

Laravel Lumen is a stunningly fast PHP micro-framework for building web applications with expressive, elegant syntax. We believe development must be an enjoyable, creative experience to be truly fulfilling. Lumen attempts to take the pain out of development by easing common tasks used in the majority of web projects, such as routing, database abstraction, queueing, and caching.

## Official Documentation

Documentation for the framework can be found on the [Lumen website](https://lumen.laravel.com/docs).

## Contributing

Thank you for considering contributing to Lumen! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Security Vulnerabilities

If you discover a security vulnerability within Lumen, please send an e-mail to Taylor Otwell at taylor@laravel.com. All security vulnerabilities will be promptly addressed.

## License

The Lumen framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

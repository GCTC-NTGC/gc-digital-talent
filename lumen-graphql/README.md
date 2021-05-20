## Getting Started

1. Ensure php and composer are installed. 
2. Install dependencies with `composer install`
3. Copy .env.example to .env and configure your local environment. Make sure to add a random string as your APP_KEY.
4. Ensure pdo_pgsql is enabled in php by uncommenting the line `extension=pdo_pgsql` in your php.ini file.
5. Run `php artisan migrate:fresh` to create database tables, and `php artisan db:seed` if you want to create test data.
6. Start a development server with `php -S localhost:8000 -t public`
7. Visit http://localhost:8000/graphql-playground to explore the API.

## Local Development

To improve your editing experience, run `php artisan lighthouse:ide-helper` (note: this is configured to run after composer install) and use an IDE plugin like [GraphQL](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql).

## Documentation

Documentation for the Lumen framework can be found on the [Lumen website](https://lumen.laravel.com/docs).

Documentation on the Lighthouse GraphQL library can be found [here](https://lighthouse-php.com/).
Lighthouse offers a [number of commands](https://lighthouse-php.com/5/api-reference/commands.html) which may be useful for devoloping your schema and data models: 

## Getting Started

### Running standalone

1. Ensure php and composer are installed.
2. Install dependencies with `composer install`
3. Ensure you have a database running locally.
4. Copy .env.example to .env and configure your local environment. You will likely need to edit the DB variables to connect to your local database. Make sure to add a random string as your APP_KEY.
5. Ensure pdo_pgsql is enabled in php by uncommenting the line `extension=pdo_pgsql` in your php.ini file.
6. Run `php artisan migrate:fresh` to create database tables, and `php artisan db:seed` if you want to create test data.
7. Start a development server with `php -S localhost:8000 -t public`
8. Visit http://localhost:8000/graphql-playground to explore the API.

### Running with Docker containers

See `../infrastructure/README.md` for instructions for running this service, along with client services and a database, with a single docker-compose command.

Note that you will still need to copy .evn.example to .env and add an APP_KEY.

To initialize the database from inside the container, run `docker-compose exec -w /var/www/html/api php sh -c "php artisan migrate --seed"`.

## Local Development

To improve your editing experience, run `php artisan lighthouse:ide-helper` (note: this is configured to run after composer install) and use an IDE plugin like [GraphQL](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql).



## Documentation

Documentation for the Lumen framework can be found on the [Lumen website](https://lumen.laravel.com/docs).

Documentation on the Lighthouse GraphQL library can be found [here](https://lighthouse-php.com/).
Lighthouse offers a [number of commands](https://lighthouse-php.com/5/api-reference/commands.html) which may be useful for developing your schema and data models:

## Generating Typescript Types

1. Ensure the api service is running (visit http://localhost:8000/graphql-playground to confirm)

2. Run

```
npm install
```

3. There is a script in the package.json file. To execute

```
npm run generate
```

File should be generated in the /src file called types.d.ts (as specified in the codegen.yml file)

Done.

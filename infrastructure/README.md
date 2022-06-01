# Local Dev Environment

Run `docker-compose up -d` here to create several containers containing a postgres database, and the other components of the app. The app will be hosted at http://localhost:8000 and https://localhost:8001.

This configuration is meant to model the infrastructure of the production server, with separate Lumen projects running in a single PHP container, and a separate Database. Requests are routed between the different Lumen projects as per the .htaccess file located at `./php-container/src/.htaccess`.

For convenience, this dev environment also hosts an Adminer instance at http://localhost:8080 to directly access the database, and a phpinfo file at http://localhost:8000/phpinfo.php.


## Accessing the database with Adminer

To log into the app database with Adminer, use the following credentials:
- system: PostgreSQL
- server: postgres
- username: postgres
- password: password1234
- database: gctalent

## Connecting api service to database

The environment variables in `../api/.env.example` are already configured to connect to connect to the database from inside a docker-compose network. Note that, if you want to run migrations or data seeders, you will need to run them inside the container, like so:
- `docker-compose exec -w /var/www/html/api php sh -c "php artisan migrate"`
- `docker-compose exec -w /var/www/html/api php sh -c "php artisan db:seed"`

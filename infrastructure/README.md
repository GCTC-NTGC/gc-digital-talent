# Local Dev Environment

Run `docker-compose up -d` here to create several containers containing a postgres database, and the other components of the app. The app will be hosted at http://localhost:8000 and https://localhost:8001.

This configuration is meant to model the infrastructure of the production server, with seperate Lumen projects running in a single PHP container, and a seperate Database. Requests are routed between the different Lumen projects as per the .htaccess file located at `./php-container/src/.htaccess`.

For convenience, this dev environment also hosts an Adminer instance at http://localhost:8080 to directly access the database, and a phpinfo file at http://localhost:8000/phpinfo.php.



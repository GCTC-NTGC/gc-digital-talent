# Usage:
# make -f Makefile.nix [command]
# setup_all          # setup all the components
# refresh_all        # refresh all the components
# make setup_api     # build the Laravel backend
# make refresh_api   # refresh the Laravel backend
# make restart_fpm   # restart the PHP-FPM server
# make setup_web     # build the React frontend
# make refresh_web   # refresh the React frontend
# make git_clean     # use git to remove all untracked files - DANGER!
# make compose_up   # bring up the docker compose network
# make compose_down # bring down the docker compose network

.PHONY: setup_all refresh_all setup_api refresh_api setup_web refresh_web git_clean compose_up compose_down queue_work

setup_all: setup_api setup_web

refresh_all: refresh_api refresh_web

setup_api:
	cp api/.env.example api/.env --preserve=all
	cd api && composer install --prefer-dist
	php api/artisan key:generate
	php api/artisan migrate:fresh --seed
	php api/artisan lighthouse:print-schema --write
	touch api/storage/logs/laravel.log
	docker compose exec webserver sh -c "chown -R www-data:www-data /home/site/wwwroot/api/storage"
	docker compose exec webserver sh -c "chmod -R a+r,a+w /home/site/wwwroot/api/storage /home/site/wwwroot/api/bootstrap/cache"
	php api/artisan optimize:clear

refresh_api:
	cd api && composer install --prefer-dist
	php api/artisan migrate
	php api/artisan lighthouse:print-schema --write
	php api/artisan optimize:clear
	docker compose exec webserver sh -c "pkill -o -USR2 php-fpm"

restart_fpm:
	docker compose exec webserver sh -c "pkill -o -USR2 php-fpm"

setup_web:
	cp apps/web/.env.example apps/web/.env --preserve=all
	pnpm install
	pnpm run dev:fresh

refresh_web:
	pnpm install
	pnpm run dev

git_clean:
	sudo git clean -xdf

compose_up:
	docker compose up --detach

compose_down:
	docker compose down

queue_work:
	docker compose exec webserver sh -c "runuser -u www-data -- php /home/site/wwwroot/api/artisan queue:work"

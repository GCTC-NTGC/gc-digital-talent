# Usage:
# setup_all          # setup all the components
# refresh_all        # refresh all the components
# make setup_api     # build the Laravel backend
# make refresh_api   # refresh the Laravel backend
# make setup_web     # build the React frontend
# make refresh_web   # refresh the React frontend
# make git_clean     # use git to remove all untracked files - DANGER!
# make compose_up   # bring up the docker compose network
# make compose_down # bring down the docker compose network

.PHONY: setup_all refresh_all setup_api refresh_api setup_web refresh_web git_clean compose_up compose_down queue_work

setup_all: setup_api setup_web

refresh_all: refresh_api refresh_web

setup_api:
	rm api/bootstrap/cache/*.php --force
	cp api/.env.example api/.env --preserve=all
	cd api && composer install --prefer-dist
	php api/artisan key:generate
	php api/artisan migrate:fresh --seed
	php api/artisan lighthouse:print-schema --write
	php api/artisan config:clear
	touch api/storage/logs/laravel.log
	sudo chown -R www-data:www-data api/storage
	sudo chmod -R a+r,a+w api/storage

refresh_api:
	rm api/bootstrap/cache/*.php --force
	cd api && composer install --prefer-dist
	php api/artisan migrate
	php api/artisan lighthouse:print-schema --write
	php api/artisan config:clear

setup_web:
	cp apps/web/.env.example apps/web/.env --preserve=all
	pnpm install --force
	pnpm run dev:fresh

refresh_web:
	pnpm install --force
	pnpm run dev

git_clean:
	sudo git clean -xdf

compose_up:
	docker-compose up --detach --build

compose_down:
	docker-compose down

queue_work:
	docker-compose exec webserver sh -c "runuser -u www-data -- php /home/site/wwwroot/api/artisan queue:work"

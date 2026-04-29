.PHONY: up down logs setup clean-modules refresh refresh-frontend refresh-api seed-fresh migrate artisan phpstan queue-work composer optimize-api reverb-start start-services

# Environment selection: use `make up ENV=dev` for development with hot reloading
ifeq ($(ENV),dev)
COMPOSE := docker-compose.dev.yml
else
COMPOSE ?= docker-compose.yml
endif

DOCKER_RUN=docker compose -f $(COMPOSE) run --rm maintenance bash
DOCKER_API=docker compose -f $(COMPOSE) run --rm -w /var/www/html/api maintenance sh -c
DOCKER_PNPM=docker compose -f $(COMPOSE) run -w /var/www/html --rm maintenance pnpm

up:
	docker compose -f $(COMPOSE) up --build --detach

down:
	docker compose -f $(COMPOSE) down --remove-orphans

logs:
	docker compose -f $(COMPOSE) logs -f

setup:
	$(DOCKER_RUN) setup.sh

refresh:
	$(DOCKER_RUN) refresh_all.sh

clean-modules:
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

refresh-frontend:
	$(DOCKER_RUN) refresh_frontend.sh

refresh-api:
	$(DOCKER_RUN) refresh_api.sh

seed-fresh:
	$(DOCKER_API) "php artisan migrate:fresh --seed"

migrate:
	$(DOCKER_API) "php artisan migrate"

composer:
	$(DOCKER_API) "composer $(CMD)"

artisan:
	$(DOCKER_API) "php artisan $(CMD)"

watch:
	$(DOCKER_PNPM) run watch

lint:
	$(DOCKER_API) "php ./vendor/bin/pint"
	$(DOCKER_PNPM) lint

lint-php:
	$(DOCKER_API) "vendor/bin/pint"

phpstan:
	$(DOCKER_API) "vendor/bin/phpstan analyse -c phpstan.neon"

queue-work:
	docker compose exec webserver sh -c "runuser -u www-data -- php /home/site/wwwroot/api/artisan queue:work"

reverb-start:
	docker compose exec webserver sh -c "runuser -u www-data -- php /home/site/wwwroot/api/artisan reverb:start"

test:
	$(DOCKER_API) "php artisan test $(CMD)"

optimize-api:
	docker compose exec webserver sh -c "runuser -u www-data -- php /home/site/wwwroot/api/artisan optimize"

.PHONY: up down setup clean-modules refresh refresh-frontend refresh-api seed-fresh migrate artisan phpstan queue-work composer optimize-api dev-up dev-down dev-setup dev-logs

DOCKER_RUN=docker compose run --rm maintenance bash
DOCKER_API=docker compose run --rm -w /var/www/html/api maintenance sh -c
DOCKER_PNPM=docker compose run -w /var/www/html --rm maintenance pnpm

# Development environment commands (with hot reloading)
DOCKER_DEV_RUN=docker compose -f docker-compose.dev.yml run --rm maintenance bash
DOCKER_DEV_API=docker compose -f docker-compose.dev.yml run --rm -w /var/www/html/api maintenance sh -c

up:
	docker compose up --build --detach

down:
	docker compose down

# ============================================
# Development environment targets
# ============================================

dev-up:
	docker compose -f docker-compose.dev.yml up --build --detach

dev-down:
	docker compose -f docker-compose.dev.yml down

dev-setup:
	$(DOCKER_DEV_RUN) setup.sh

dev-logs:
	docker compose -f docker-compose.dev.yml logs -f

dev-logs-api:
	docker compose -f docker-compose.dev.yml logs -f api

dev-logs-web:
	docker compose -f docker-compose.dev.yml logs -f web

dev-seed-fresh:
	$(DOCKER_DEV_API) "php artisan migrate:fresh --seed"

dev-migrate:
	$(DOCKER_DEV_API) "php artisan migrate"

# ============================================
# Original production-like environment targets
# ============================================

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

test:
	$(DOCKER_API) "php artisan test $(CMD)"

optimize-api:
	docker compose exec webserver sh -c "runuser -u www-data -- php /home/site/wwwroot/api/artisan optimize"

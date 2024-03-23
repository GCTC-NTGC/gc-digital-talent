.PHONY: up down setup clean-modules refresh refresh-frontend refresh-api seed-fresh migrate artisan

DOCKER_RUN=docker-compose run --rm maintenance bash
DOCKER_EXEC=docker-compose exec -w /home/site/wwwroot/api webserver sh -c

up:
	docker-compose up --build --detach

down:
	docker-compose down

setup:
	$(DOCKER_RUN) bash setup.sh

refresh:
	$(DOCKER_RUN) refresh_all.sh

clean-modules:
	find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

refresh-frontend:
	$(DOCKER_RUN) refresh_frontend.sh

refresh-api:
	$(DOCKER_RUN) refresh_api.sh

seed-fresh:
	$(DOCKER_EXEC) "php artisan migrate:fresh --seed"

migrate:
	$(DOCKER_EXEC) "php artisan migrate"

artisan:
	$(DOCKER_EXEC) "php artisan $(CMD)"


API_IMAGE = gc_digital_talent_api
FRONTEND_IMAGE = gc_digital_talent_frontend
TAG = latest

.PHONY: help

build-api: ## Build the api docker image.
	docker build -t ${API_IMAGE}:${TAG} ./api

write-schema: build-api ## Compile the api graphql schema and output it to the frontend folder on the host machine.
	docker run --name ${API_IMAGE}_${TAG} ${API_IMAGE}:${TAG} /bin/bash -c "cd /var/www/html && php artisan lighthouse:print-schema --write"
	docker cp ${API_IMAGE}_${TAG}:/var/www/html/storage/app/lighthouse-schema.graphql ./frontend/lighthouse-schema.graphql
	docker rm -f ${API_IMAGE}_${TAG}

build-frontend: write-schema ## Build the frontend docker image.
	docker build -t ${FRONTEND_IMAGE}:${TAG} ./frontend

run: build-api build-frontend ## Run docker-compose
	docker-compose up -d

help:
	@echo 'Usage: make <command>'
	@echo
	@echo 'where <command> is one of the following:'
	@echo
	@grep -E '^[a-z0-9A-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help

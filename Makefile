API_IMAGE = gc_digital_talent_api
API_IMAGE_TAG = latest

.PHONY: help

build-api: ## Build the api docker image.
	docker build -t ${API_IMAGE}:${API_IMAGE_TAG} ./api

write-schema: build-api ## Compile the api graphql schema and output it to the frontend folder on the host machine.
	docker run --name ${API_IMAGE}_${API_IMAGE_TAG} ${API_IMAGE}:${API_IMAGE_TAG} /bin/bash -c "cd /var/www/html && php artisan lighthouse:print-schema --write"
	docker cp ${API_IMAGE}_${API_IMAGE_TAG}:/var/www/html/storage/app/lighthouse-schema.graphql ./frontend/lighthouse-schema.graphql
	docker rm -f ${API_IMAGE}_${API_IMAGE_TAG}

help:
	@echo 'Usage: make <command>'
	@echo
	@echo 'where <command> is one of the following:'
	@echo
	@grep -E '^[a-z0-9A-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help

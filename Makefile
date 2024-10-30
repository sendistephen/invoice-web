build:
	docker-compose -f local.yml up --build -d --remove-orphans
up:
	docker-compose  -f local.yml up -d

down:
	docker-compose -f local.yml down

down-v:
	docker-compose -f local.yml down -v

show-logs:
	docker-compose -f local.yml logs

show-logs-api:
	docker-compose -f local.yml logs api

show-logs-client:
	docker-compose -f local.yml logs client

# who is currently running the docker process
user:
	docker build -t invoice-generator -f ./docker/local/express/Dockerfile .
	docker run --rm invoice-generator whoami

volume:
	docker volume inspect invoice-web_mongodb-data
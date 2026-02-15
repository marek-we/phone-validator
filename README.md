# Setup

#### Start the containers
`docker compose up -d`

#### Install dependencies
`docker compose exec php composer install`

#### Compile assets
`docker compose exec php php bin/console asset-map:compile`

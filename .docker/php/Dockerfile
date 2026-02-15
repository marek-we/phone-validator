FROM php:8.5-fpm-alpine

RUN apk add --no-cache \
        $PHPIZE_DEPS \
        bash git unzip \
        icu-dev \
        zlib-dev \
        libzip-dev \
    && docker-php-ext-install intl zip \
    && apk del --no-cache $PHPIZE_DEPS

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

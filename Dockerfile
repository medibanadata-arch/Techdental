FROM php:8.4-cli-alpine

# Install required system packages
RUN apk add --no-cache \
    sqlite-dev \
    libpng-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    libzip-dev \
    zip \
    unzip

# Install PHP extensions for Laravel & SQLite
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo pdo_sqlite zip bcmath opcache

WORKDIR /app

# Copy application code (including pre-built vendor and public/build)
COPY . /app

# Ensure correct permissions for storage and database
RUN mkdir -p /app/storage/framework/cache /app/storage/framework/sessions /app/storage/framework/views /app/storage/logs \
    && chmod -R 777 /app/storage /app/bootstrap/cache /app/database

# Default port
ENV PORT=10000
EXPOSE 10000

# Production startup command: cache configs and start artisan server on dynamic $PORT
CMD php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache \
    && php artisan serve --host=0.0.0.0 --port=${PORT:-10000}


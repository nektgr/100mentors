#!/bin/bash

echo "Stopping all containers and removing volumes..."
docker-compose down -v

echo "Cleaning Docker cache..."
docker system prune -f

echo "Running project structure check..."
chmod +x ./check-project-structure.sh
./check-project-structure.sh

echo "Rebuilding everything with fresh containers..."
docker-compose build --no-cache

echo "Starting fresh containers..."
docker-compose up

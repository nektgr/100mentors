#!/bin/bash

echo "Stopping all containers..."
docker-compose down

echo "Removing unused volumes..."
docker-compose down -v

echo "Running project structure check..."
chmod +x ./check-project-structure.sh
./check-project-structure.sh

echo "Rebuilding containers..."
docker-compose build --no-cache

echo "Starting services..."
docker-compose up

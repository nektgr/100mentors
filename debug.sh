#!/bin/bash

echo "=== Docker Container Status ==="
docker-compose ps

echo -e "\n=== Docker Network Information ==="
docker network ls
docker network inspect 100mentors_microblog-network

echo -e "\n=== Container Logs ==="
echo "=== Backend Logs ==="
docker-compose logs --tail=50 backend

echo -e "\n=== Frontend Logs ==="
docker-compose logs --tail=50 frontend

echo -e "\n=== PostgreSQL Logs ==="
docker-compose logs --tail=50 postgres

echo -e "\n=== Testing Backend API ==="
echo "Health Check:"
curl -s http://localhost:5000/health || echo "Failed to connect to backend"

echo -e "\n=== Testing Network ==="
docker-compose exec backend ping -c 2 postgres || echo "Failed to ping postgres from backend"
docker-compose exec frontend ping -c 2 backend || echo "Failed to ping backend from frontend"

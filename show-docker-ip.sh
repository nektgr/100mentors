#!/bin/bash

echo "Docker container IP addresses:"
docker inspect -f '{{.Name}} - {{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $(docker ps -q)

echo -e "\nTry accessing your frontend container using the IP address shown above"
echo "For example: http://172.18.0.4:3000 (the actual IP may be different)"

echo -e "\nYou can also try accessing the backend health endpoint to check if it's working:"
echo "curl http://localhost:5000/health"

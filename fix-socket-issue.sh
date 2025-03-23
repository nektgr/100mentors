#!/bin/bash

echo "Installing socket.io in backend container..."
docker-compose exec backend npm install socket.io

echo "Restarting backend service..."
docker-compose restart backend

echo "Done! The backend should now have socket.io installed."

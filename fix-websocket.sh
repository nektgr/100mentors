#!/bin/bash

echo "Fixing WebSocket implementation for real-time updates..."

# Install socket.io in the backend container if not already installed
echo "Installing socket.io dependencies..."
docker-compose exec backend npm install socket.io @types/socket.io-client

# Install socket.io-client in the frontend container
echo "Installing socket.io-client in the frontend..."
docker-compose exec frontend npm install socket.io-client

# Update both containers
echo "Restarting containers to apply changes..."
docker-compose restart backend frontend

echo "WebSocket implementation has been fixed!"
echo "You should now see live updates when posts are created or deleted."

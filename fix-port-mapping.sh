#!/bin/bash

echo "Fixing port mapping issues and connection problems..."

# Update docker-compose.yml to ensure proper port mapping
cat > ./docker-compose.yml << 'EOF'
services:
  postgres:
    image: postgres:15
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: microblog
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - microblog-network

  backend:
    build:
      context: ./microblog-backend
    ports:
      - '5000:5000'
    depends_on:
      postgres:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/microblog
      JWT_SECRET: your-secret-key-change-in-production
      PORT: 5000
      FRONTEND_URL: "http://localhost:3000"
    volumes:
      - ./microblog-backend:/app
      - backend-node-modules:/app/node_modules
    networks:
      - microblog-network
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:5000/health || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 15s

  frontend:
    build:
      context: ./microblog-front
    ports:
      - '3000:3000'
    depends_on:
      backend:
        condition: service_healthy
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:5000
    volumes:
      - ./microblog-front:/app
      - frontend-node-modules:/app/node_modules
    networks:
      - microblog-network

networks:
  microblog-network:
    driver: bridge

volumes:
  postgres-data:
  backend-node-modules:
  frontend-node-modules:
EOF

# Update next.config.js for network connections
cat > ./microblog-front/next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    webpackBuildWorker: true,
    parallelServerCompiles: true,
    parallelServerBuildTraces: true,
  },
  // Allow connections from all hosts
  webpack: (config) => {
    return config;
  },
  // This is important for Docker
  webpackDevMiddleware: (config) => {
    // Required for HMR to work inside Docker
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
}

module.exports = nextConfig
EOF

# Add a custom package.json script for the frontend
cat > ./microblog-front/package-override.json << 'EOF'
{
  "scripts": {
    "dev": "next dev -H 0.0.0.0",
    "build": "next build",
    "start": "next start -H 0.0.0.0",
    "lint": "next lint"
  }
}
EOF

# Merge the custom scripts into the existing package.json
echo "Updating frontend package.json with proper host binding..."
jq -s '.[0].scripts = .[1].scripts | .[0]' \
  ./microblog-front/package.json \
  ./microblog-front/package-override.json > ./microblog-front/package.json.new \
  && mv ./microblog-front/package.json.new ./microblog-front/package.json \
  || echo "jq command failed, please update package.json manually"

echo "Restarting the containers with fixed configuration..."
docker-compose down
docker-compose build frontend
docker-compose up -d

echo "Done! Try accessing the application at:"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo ""
echo "If you still can't access the frontend, try these IP addresses instead:"
echo "Frontend at host.docker.internal:3000"
echo "Or at 127.0.0.1:3000"
echo ""
echo "If none of those work, check your Docker network settings"
echo "and try running 'docker-compose logs frontend' to see any errors."

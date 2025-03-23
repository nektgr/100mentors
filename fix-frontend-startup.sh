#!/bin/bash

echo "Fixing frontend startup issues..."

# Update the Dockerfile to use the correct command
cat > ./microblog-front/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Use legacy peer deps to avoid conflicts with date-fns
RUN npm install --legacy-peer-deps

COPY . .

# Explicitly remove app directory to prevent router conflict
RUN rm -rf ./app

EXPOSE 3000

# Use correct startup command (host is already in package.json)
CMD ["npm", "run", "dev"]
EOF

# Make sure package.json has the correct dev script
cat > ./microblog-front/package-fix.json << 'EOF'
{
  "scripts": {
    "dev": "next dev -H 0.0.0.0",
    "build": "next build",
    "start": "next start -H 0.0.0.0",
    "lint": "next lint"
  }
}
EOF

# Update the package.json scripts
echo "Updating package.json scripts..."
if command -v jq &> /dev/null; then
  jq -s '.[0].scripts = .[1].scripts | .[0]' \
    ./microblog-front/package.json \
    ./microblog-front/package-fix.json > ./microblog-front/package.json.new \
    && mv ./microblog-front/package.json.new ./microblog-front/package.json
else
  echo "jq command not found, updating package.json manually..."
  sed -i '' 's/"dev": ".*"/"dev": "next dev -H 0.0.0.0"/g' ./microblog-front/package.json
fi

rm -f ./microblog-front/package-fix.json

echo "Rebuilding the frontend container..."
docker-compose down
docker-compose build frontend
docker-compose up -d

echo "Waiting for services to start..."
sleep 5

echo "Frontend container logs:"
docker-compose logs --tail=20 frontend

echo "Try accessing the app at http://localhost:3000 now"
echo "You can also try http://127.0.0.1:3000"

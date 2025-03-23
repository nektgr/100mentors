#!/bin/bash

echo "==============================================="
echo "   Preparing MicroBlog for Render Deployment   "
echo "==============================================="

echo "1. Creating Render configuration files..."

# Create render.yaml for Blueprint deployment
cat > ./render.yaml << 'EOF'
services:
  # Backend API Service
  - type: web
    name: microblog-api
    env: node
    plan: free
    buildCommand: cd microblog-backend && npm install && npx prisma generate
    startCommand: cd microblog-backend && npm start
    healthCheckPath: /health
    envVars:
      - key: JWT_SECRET
        generateValue: true
      - key: DATABASE_URL
        fromDatabase:
          name: microblog-db
          property: connectionString

  # Frontend Service
  - type: web
    name: microblog-frontend
    env: node
    buildCommand: cd microblog-front && npm install --legacy-peer-deps && npm run build
    startCommand: cd microblog-front && npm start
    envVars:
      - key: NEXT_PUBLIC_API_URL
        value: https://microblog-api.onrender.com

databases:
  - name: microblog-db
    plan: free
EOF

# Create build specifications for backend
cat > ./microblog-backend/render.yaml << 'EOF'
services:
  - type: web
    name: microblog-api
    env: node
    plan: free
    buildCommand: npm install && npx prisma generate
    startCommand: npm start
    envVars:
      - key: JWT_SECRET
        generateValue: true
      - key: PORT
        value: 10000
EOF

# Create build specifications for frontend
cat > ./microblog-front/render.yaml << 'EOF'
services:
  - type: web
    name: microblog-frontend
    env: node
    plan: free
    buildCommand: npm install --legacy-peer-deps && npm run build
    startCommand: npm start
    envVars:
      - key: NEXT_PUBLIC_API_URL
        value: https://microblog-api.onrender.com
EOF

echo "2. Creating deploy documentation..."

cat > ./RENDER_DEPLOY.md << 'EOF'
# Deploying to Render Without Credit Card

Follow these steps to deploy the MicroBlog application to Render's free tier.

## 1. Set Up the Database

We'll use ElephantSQL for our PostgreSQL database (no credit card required):

1. Sign up at [ElephantSQL](https://www.elephantsql.com/)
2. Create a new instance (select "Tiny Turtle" - free plan)
3. Once created, copy the connection string from the instance details

## 2. Deploy the Backend

1. Sign up at [Render](https://render.com)
2. From the dashboard, click "New Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: `microblog-api`
   - Root Directory: `microblog-backend`
   - Environment: `Node`
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`
5. Add environment variables:
   - `DATABASE_URL`: Your ElephantSQL connection string
   - `JWT_SECRET`: Any secure random string (like `openssl rand -base64 32`)
   - `PORT`: Let Render set this automatically
6. Click "Create Web Service"

## 3. Run Database Migrations

After your backend is deployed:

1. Go to the Render dashboard > your backend service
2. Click "Shell" in the top navigation
3. Run:
   ```bash
   npx prisma migrate deploy
   npm run seed
   
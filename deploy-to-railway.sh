#!/bin/bash

echo "==============================================="
echo "   Preparing MicroBlog for Railway Deployment  "
echo "==============================================="

echo "1. Installing Railway CLI..."
npm install -g @railway/cli

echo "2. Login to Railway (a browser window will open)..."
railway login

echo "3. Creating deployment-ready files..."

# Update package.json in frontend to handle Railway deployment
cat > ./microblog-front/railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install --legacy-peer-deps && npm run build"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF

# Update package.json in backend to handle Railway deployment
cat > ./microblog-backend/railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npx prisma generate"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF

# Create a backend Procfile for Railway
cat > ./microblog-backend/Procfile << 'EOF'
web: npm start
EOF

# Create a frontend Procfile for Railway
cat > ./microblog-front/Procfile << 'EOF'
web: npm start
EOF

echo "4. Deployment instructions:"
echo "   Follow these steps to deploy your application to Railway:"
echo ""
echo "   a. Create a new project in Railway from the web interface"
echo "   b. Add a PostgreSQL database to your project"
echo "   c. Retrieve the connection string from the PostgreSQL service"
echo "   d. Link the repo or deploy the backend with:"
echo "      cd microblog-backend"
echo "      railway link    # Link to your project"
echo "      railway up      # Deploy to Railway"
echo "   e. Set environment variables for the backend:"
echo "      railway variables set DATABASE_URL=<your-connection-string>"
echo "      railway variables set JWT_SECRET=<random-string>"
echo "   f. Deploy the frontend with:"
echo "      cd ../microblog-front"
echo "      railway link    # Link to your project"
echo "      railway up      # Deploy to Railway"
echo "   g. Set the frontend environment variable:"
echo "      railway variables set NEXT_PUBLIC_API_URL=<backend-url>"
echo ""
echo "5. After deployment:"
echo "   a. Run database migrations:"
echo "      railway run npx prisma migrate deploy"
echo "   b. Seed the database:"
echo "      railway run npm run seed"
echo ""
echo "Files have been prepared for Railway deployment!"
echo "==============================================="

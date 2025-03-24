#!/bin/bash

echo "=========================================================="
echo "  Running Backend Tests"
echo "=========================================================="

# Navigate to backend directory
cd ./microblog-backend

# Install dependencies if needed
npm install --no-save @types/jest jest ts-jest supertest @types/supertest jest-mock-extended

echo "Running tests..."
npm test

# If you want coverage
# echo "Running tests with coverage..."
# npm run test:coverage

echo "=========================================================="
echo "  Tests Completed"
echo "=========================================================="

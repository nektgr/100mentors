#!/bin/sh
# filepath: /Users/nektariospapakonstantinopoulos/Projects/100mentors/100mentors/microblog-backend/startup.sh

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
until nc -z postgres 5432; do
  sleep 1
done
echo "Connection to postgres $(getent hosts postgres) 5432 port [tcp/postgresql] succeeded!"

# Run Prisma migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Start the application
echo "Starting the application..."
npm run dev
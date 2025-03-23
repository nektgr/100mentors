FROM node:18-alpine

WORKDIR /app

# Install OpenSSL and netcat for Prisma and network checks
RUN apk add --no-cache openssl netcat-openbsd

COPY package*.json ./

# Install all dependencies including socket.io
RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 5000

# Use a direct CMD with shell form instead of a separate script
CMD echo "Waiting for PostgreSQL to be ready..." && \
    timeout=60 && \
    while ! nc -z postgres 5432; do \
      timeout=$((timeout-1)); \
      if [ $timeout -eq 0 ]; then \
        echo "Timed out waiting for PostgreSQL to start"; \
        exit 1; \
      fi; \
      echo "PostgreSQL not ready yet, waiting..."; \
      sleep 1; \
    done && \
    echo "Installing missing dependencies..." && \
    npm install && \
    echo "Running Prisma migrations..." && \
    npx prisma migrate deploy && \
    echo "Seeding the database..." && \
    npm run seed && \
    echo "Starting the application..." && \
    npm run dev
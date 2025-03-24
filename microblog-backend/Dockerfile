FROM node:18-alpine

WORKDIR /app

# Install dependencies needed for build and health checks
RUN apk add --no-cache openssl netcat-openbsd curl

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Make the startup script executable
RUN chmod +x /app/startup.sh

# Expose the port
EXPOSE 5000

# Run the startup script
CMD ["/app/startup.sh"]

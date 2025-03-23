FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Use legacy peer deps to avoid conflicts with date-fns
RUN npm install --legacy-peer-deps

COPY . .

# Explicitly remove app directory to prevent router conflict
RUN rm -rf ./app

EXPOSE 3000

# Simply use the npm script without additional args
CMD ["npm", "run", "dev"]

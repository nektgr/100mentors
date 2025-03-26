# MicroBlog - Setup and Usage Instructions

This document provides detailed instructions for setting up, running, and testing the MicroBlog application.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start with Docker](#quick-start-with-docker)
- [Manual Setup](#manual-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Testing](#testing)
  - [Backend Tests](#backend-tests)
  - [Frontend Tests](#frontend-tests)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Ensure you have the following installed:

- [Docker](https://www.docker.com/get-started) and Docker Compose (for Docker setup)
- Node.js v16+ (for local setup)
- npm or yarn (for local setup)
- PostgreSQL (for local setup without Docker)

## Quick Start with Docker

The easiest way to run the application is using Docker Compose:

1. Clone the repository (if you haven't already)

2. Navigate to the project root directory:
   ```bash
   cd 100mentors
   ```

3. Start the application stack:
   ```bash
   docker-compose up
   ```

4. Access the applications:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health check: http://localhost:5000/health

5. Log in with test users:
   - Email: `alice@example.com`
   - Email: `bob@example.com`

6. To stop the application:
   ```bash
   docker-compose down
   ```

## Manual Setup

If you prefer to run the application without Docker, follow these steps:

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd microblog-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following content (adjust as needed):
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/microblog
   JWT_SECRET=your-secret-key-change-in-production
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

4. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

5. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

6. Seed the database with test data:
   ```bash
   npm run seed
   ```

7. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd microblog-front
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following content:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

5. Access the frontend application at http://localhost:3000

## Testing

The application includes a comprehensive test suite for both backend and frontend components.

### Backend Tests

1. Navigate to the backend directory:
   ```bash
   cd microblog-backend
   ```

2. Run tests:
   ```bash
   npm test
   ```

3. Run tests with coverage:
   ```bash
   npm run test:coverage
   ```

The backend tests include:
- Unit tests for controllers and middleware
- Integration tests for API endpoints
- Testing authentication flow
- Testing post creation and deletion

### Frontend Tests

1. Navigate to the frontend directory:
   ```bash
   cd microblog-front
   ```

2. Run tests:
   ```bash
   npm test
   ```

3. Run tests with coverage:
   ```bash
   npm run test:coverage
   ```

The frontend tests include:
- Component tests
- Context provider tests
- API service tests
- Page rendering tests

## API Documentation

### Authentication Endpoints

- **POST /api/auth/login**
  - Request: `{ "email": "alice@example.com" }`
  - Response: `{ "token": "jwt-token", "user": { "id": 1, "name": "Alice Johnson", "email": "alice@example.com" } }`

- **GET /api/auth/profile**
  - Headers: `Authorization: Bearer jwt-token`
  - Response: `{ "id": 1, "name": "Alice Johnson", "email": "alice@example.com" }`

### Posts Endpoints

- **GET /api/posts**
  - Response: Array of post objects
  - Example: `[{ "id": 1, "content": "Hello world!", "createdAt": "2023-01-01T00:00:00Z", "userId": 1, "author": { "name": "Alice Johnson" } }]`

- **POST /api/posts**
  - Headers: `Authorization: Bearer jwt-token`
  - Request: `{ "content": "My new post" }`
  - Response: Post object

- **DELETE /api/posts/:id**
  - Headers: `Authorization: Bearer jwt-token`
  - Response: `{ "message": "Post deleted successfully" }`

## Project Structure


# MicroBlog App - Instructions

This is a simple micro-blogging application built with TypeScript, React (Next.js), Express, and PostgreSQL.

## Prerequisites

- Node.js (v14 or higher) - only needed for local development
- npm or yarn - only needed for local development
- Docker and Docker Compose (for containerized setup)
- PostgreSQL (if running locally without Docker)

## Running the Application with Docker

The easiest way to run the application is using Docker Compose:

1. Clone the repository
2. Navigate to the root directory
3. Run the following command to build and start all services:

```bash
docker-compose up --build
```

Or to run it in detached mode (in the background):

```bash
docker-compose up --build -d
```

This will:
1. Build the Docker images for both frontend and backend
2. Start the PostgreSQL database
3. Start the backend API server
4. Start the frontend application

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

To view logs when running in detached mode:
```bash
# View all logs
docker-compose logs -f

# View logs for a specific service
docker-compose logs -f frontend
docker-compose logs -f backend
```

To stop the services:
```bash
# If running in foreground (with Ctrl+C)
# Or if running in background:
docker-compose down
```

### Docker Troubleshooting

If you encounter issues:

1. Make sure ports 3000, 5000, and 5432 are not already in use
2. Try removing existing containers and volumes:
```bash
docker-compose down -v
```
3. Rebuild the images:
```bash
docker-compose build --no-cache
```
4. If you encounter dependency issues with the frontend, you can try to build with legacy peer dependencies:
```bash
# For the frontend only
docker-compose build --build-arg NPM_FLAGS="--legacy-peer-deps" frontend
```

5. For MacOS users, ensure Docker Desktop is running before executing docker-compose commands

6. If PostgreSQL fails to start, you might need to increase the memory allocated to Docker in Docker Desktop settings

## Running the Application Locally

### Backend Setup

1. Navigate to the backend directory:

```bash
cd microblog-backend
```

2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables in a `.env` file:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/microblog
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Seed the database:

```bash
npm run seed
```

6. Start the backend server:

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

3. Set up your environment variables in a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the frontend development server:

```bash
npm run dev
```

5. Open your browser and go to: http://localhost:3000

## Features

- User authentication (login/logout)
- View all posts from all users
- Create new posts (authenticated users only)
- Delete your own posts (authenticated users only)
- Real-time updates via WebSockets (posts appear and disappear in real-time)

## Real-Time Functionality

This application implements real-time updates using Socket.IO. When a user creates or deletes a post, all connected clients will see the changes immediately without needing to refresh the page.

To see this in action:
1. Open the application in two different browser windows or devices
2. Log in with different users in each window
3. Create or delete a post in one window
4. Observe that the changes appear automatically in the other window

## Deployment Options

For deploying this application to production environments, see [DEPLOYMENT.md](./DEPLOYMENT.md) which includes instructions for free hosting options:
- Frontend: Vercel or Netlify
- Backend: Render or Railway
- Database: Neon or Supabase

## Test Users

The application comes with pre-seeded test users:

- Email: alice@example.com
- Email: bob@example.com

Since this is a simplified demo, there's no password authentication - just enter the email to log in.

## Test Plan

### Frontend Tests

- **Authentication**
  - `it.skip('should redirect unauthenticated users to login page when trying to create a post', () => {});`
  - `it.skip('should allow users to log in with a valid email', () => {});`
  - `it.skip('should show error when logging in with invalid email', () => {});`
  - `it.skip('should persist authentication between page refreshes', () => {});`
  - `it.skip('should allow users to log out', () => {});`

- **Posts Management**
  - `it.skip('should display list of posts on the home page', () => {});`
  - `it.skip('should allow authenticated users to create new posts', () => {});`
  - `it.skip('should show validation errors when post is empty', () => {});`
  - `it.skip('should display author name and timestamp on posts', () => {});`
  - `it.skip('should allow users to delete their own posts', () => {});`
  - `it.skip('should not show delete button on posts from other users', () => {});`
  - `it.skip('should show confirmation dialog before deleting a post', () => {});`

### Backend Tests

- **Authentication API**
  - `it.skip('should authenticate a user with valid email', () => {});`
  - `it.skip('should return 401 for non-existent user email', () => {});`
  - `it.skip('should return user profile when authenticated', () => {});`
  - `it.skip('should return 401 when accessing profile without authentication', () => {});`

- **Posts API**
  - `it.skip('should return all posts', () => {});`
  - `it.skip('should allow public access to get posts', () => {});`
  - `it.skip('should create a new post when authenticated', () => {});`
  - `it.skip('should return 401 when creating post without authentication', () => {});`
  - `it.skip('should delete a post when the user is the author', () => {});`
  - `it.skip('should return 403 when deleting another user\'s post', () => {});`

- **Integration Tests**
  - `it.skip('should perform the full lifecycle of creating and deleting a post', () => {});`
  - `it.skip('should handle concurrent post creation and deletion correctly', () => {});`

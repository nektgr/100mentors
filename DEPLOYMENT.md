# Deployment Guide

This guide provides instructions for deploying the MicroBlog application using free services.

## Free Deployment Options

### Frontend Deployment (Next.js)

#### Option 1: Vercel (Recommended)

Vercel is the easiest option for Next.js applications:

1. Sign up for a free account at [Vercel](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`
3. Run `vercel` from the `microblog-front` directory
4. Follow the prompts to deploy

Environment variables to set:
- `NEXT_PUBLIC_API_URL`: URL of your deployed backend API

#### Option 2: Netlify

1. Sign up for a free account at [Netlify](https://netlify.com)
2. Install Netlify CLI: `npm install -g netlify-cli`
3. Run `netlify deploy` from the `microblog-front` directory
4. Follow the prompts to deploy

### Backend Deployment (Node.js/Express)

#### Option 1: Render

Render offers a free tier for web services:

1. Sign up at [Render](https://render.com)
2. Create a new Web Service
3. Connect to your GitHub repository
4. Set the root directory to `microblog-backend`
5. Set build command: `npm install && npx prisma generate`
6. Set start command: `npm start`

Environment variables to set:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Usually set to `10000` automatically by Render

#### Option 2: Railway

Railway offers a free tier (with limitations):

1. Sign up at [Railway](https://railway.app)
2. Start a new project and select "Deploy from GitHub repo"
3. Connect to your repository and select the backend directory
4. Add a PostgreSQL database from the "New" menu
5. Set up environment variables as needed

### Database Deployment (PostgreSQL)

#### Option 1: Neon

Neon offers a generous free tier for PostgreSQL:

1. Sign up at [Neon](https://neon.tech)
2. Create a new project
3. Get the connection string from the dashboard
4. Use this connection string for your backend's `DATABASE_URL` environment variable

#### Option 2: Supabase

1. Sign up at [Supabase](https://supabase.com)
2. Create a new project
3. Go to Settings > Database to get your connection string
4. Update your backend's `DATABASE_URL` with this connection string

## Deployment Workflow

1. Deploy the database first
2. Update the backend's `DATABASE_URL` with the new connection string
3. Deploy the backend
4. Update the frontend's `NEXT_PUBLIC_API_URL` with the backend URL
5. Deploy the frontend

## Running Database Migrations in Production

After deploying the backend:

```bash
# For Render or Railway
# Use their console or CLI to run:
npx prisma migrate deploy
npx prisma db seed
```

## CORS Configuration

Make sure to update the CORS configuration in your backend to allow requests from your frontend domain:

```typescript
// In microblog-backend/src/index.ts
app.use(cors({
  origin: [process.env.FRONTEND_URL || "http://localhost:3000"]
}));
```

## Monitoring and Logs

- Vercel, Render, and Railway all provide logging interfaces in their dashboards
- For more advanced monitoring, consider free tiers of:
  - [Sentry](https://sentry.io) for error tracking
  - [LogTail](https://logtail.com) for log management

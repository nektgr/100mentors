# Free Deployment Without Credit Card

This guide provides deployment options that don't require a credit card for the MicroBlog application.

## Option 1: Railway.app (Recommended)

Railway offers a generous free tier without requiring payment information upfront.

### Deployment Steps

1. **Set up an account**:
   - Go to [Railway](https://railway.app/) and sign up with GitHub

2. **Deploy the PostgreSQL database**:
   - From the Railway dashboard, click "New Project" 
   - Select "PostgreSQL" from the options
   - Once created, click on the database and find your connection string in "Connect" -> "Prisma"

3. **Deploy the backend**:
   - Click "New Project" again
   - Select "Deploy from GitHub repo"
   - Select your repository and set the root directory to "microblog-backend"
   - Add environment variables:
     - `DATABASE_URL`: Your Railway PostgreSQL connection string
     - `JWT_SECRET`: Any secure random string
     - `PORT`: 5000
     - `FRONTEND_URL`: Leave blank for now (will update later)

4. **Run database migrations**:
   - Go to your backend deployment
   - Click "Settings" > "Generate Command"
   - Run: `npx prisma migrate deploy`
   - Then: `npm run seed`

5. **Deploy the frontend**:
   - Click "New Project" again
   - Select "Deploy from GitHub repo"
   - Choose your repository and set the root directory to "microblog-front"
   - Add environment variables:
     - `NEXT_PUBLIC_API_URL`: Your backend URL (find in backend deployment overview)

6. **Link services and finish setup**:
   - Go back to your backend service
   - Add another environment variable:
     - `FRONTEND_URL`: Your frontend URL (find in frontend deployment overview)
   - Redeploy the backend to apply changes

### Railway Limits

- Free tier includes $5 of usage credits per month
- 512MB RAM, 1GB disk, shared CPU
- Auto-sleep after inactivity to conserve credits

## Option 2: Adaptable.io

Adaptable offers a free tier without requiring payment information.

### Deployment Steps

1. **Sign up at [Adaptable](https://adaptable.io/)**:
   - Create an account using GitHub

2. **Deploy the backend**:
   - Create a new app
   - Connect your GitHub repository
   - Select "Custom" app type
   - Set the app directory to "microblog-backend"
   - Set the build command to `npm install && npx prisma generate`
   - Set the start command to `npm start`

3. **Set up database**:
   - Adaptable provides a PostgreSQL database by default
   - Find the connection string in the "Database" section

4. **Deploy the frontend**:
   - Create another app
   - Connect to the same repository
   - Select "Next.js" as the app type
   - Set the app directory to "microblog-front"
   - Add environment variables:
     - `NEXT_PUBLIC_API_URL`: Your backend URL (from step 2)

## Option 3: Render + ElephantSQL

This combination provides free services without requiring payment information.

### Setup Steps

1. **Deploy the database with ElephantSQL**:
   - Sign up at [ElephantSQL](https://www.elephantsql.com/)
   - Create a new instance (Tiny Turtle plan is free)
   - Copy the connection string

2. **Deploy the backend with Render**:
   - Sign up at [Render](https://render.com) (no credit card required for free web services)
   - Create a new Web Service
   - Connect your GitHub repository
   - Set the root directory to "microblog-backend"
   - Set build command: `npm install && npx prisma generate`
   - Set start command: `npm start`
   - Add environment variables:
     - `DATABASE_URL`: ElephantSQL connection string
     - `JWT_SECRET`: Any secure random string
     - `PORT`: 10000 (Render sets this automatically)

3. **Deploy the frontend with Render**:
   - Create a new Static Site
   - Connect your GitHub repository
   - Set the root directory to "microblog-front"
   - Set build command: `npm install && npm run build`
   - Set publish directory: `.next`
   - Add environment variables:
     - `NEXT_PUBLIC_API_URL`: Your backend URL from step 2

## Tips for Free Deployments

1. **Avoid service sleep**:
   - Most free tiers put applications to sleep after inactivity
   - Set up a free service like [UptimeRobot](https://uptimerobot.com/) to ping your application every 5 minutes

2. **Optimize for free tier limits**:
   - Minimize dependencies to reduce build time and memory usage
   - Use efficient code to stay within CPU limits

3. **Database considerations**:
   - Free PostgreSQL services typically have size limits (20-100MB)
   - Set up periodic database cleanup if needed

4. **Custom domains**:
   - Most free tiers allow connecting custom domains
   - Consider using a free domain from [Freenom](https://www.freenom.com/) if needed

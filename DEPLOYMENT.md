# Deployment Guide

## Vercel Deployment

### 1. Environment Variables
Add these environment variables in your Vercel dashboard:

```
DB_HOST=mysql-21c3073e-chandanapc1.b.aivencloud.com
DB_PORT=18448
DB_USER=avnadmin
DB_PASSWORD=your-database-password-here
DB_NAME=defaultdb
JWT_SECRET=your-secret-key-change-this-in-production
NODE_ENV=production
```

### 2. Backend Deployment
The backend server needs to be deployed separately. Options:
- Deploy to Vercel as serverless functions
- Deploy to Railway/Render/Heroku
- Use AWS Lambda

### 3. Frontend Deployment
The frontend is already configured for Vercel deployment with the `vercel.json` file.

### 4. CORS Configuration
The server is configured to accept requests from:
- `http://localhost:3000` (development)
- `https://netflix-login-chi.vercel.app` (production)

### 5. API Endpoints
- Registration: `POST /api/register`
- Login: `POST /api/login`
- Profile: `GET /api/profile`
- Test DB: `GET /api/test-db`

### 6. Troubleshooting
If registration fails on deployed version:
1. Check environment variables are set correctly
2. Verify database connection
3. Check CORS configuration
4. Review server logs for detailed error messages

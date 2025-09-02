# Purplogs - MERN Stack Blog Application

Purplogs is a full-featured blogging platform built with the MERN stack (MongoDB, Express, React, Node.js), featuring user authentication, blog creation/management, comments, and dark/light theme support.

## Table of Contents

- [Environment Setup](#environment-setup)
- [Development Guide](#development-guide)
- [Production Deployment Guide](#production-deployment-guide)
  - [Preparing for Deployment](#preparing-for-deployment)
  - [Backend Deployment (Option 1: Render)](#backend-deployment-option-1-render)
  - [Backend Deployment (Option 2: Railway)](#backend-deployment-option-2-railway)
  - [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
  - [Frontend Deployment (Netlify)](#frontend-deployment-netlify)
  - [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
  - [Media Storage (Cloudinary)](#media-storage-cloudinary)
- [Environment Variables Reference](#environment-variables-reference)
- [Testing Your Deployment](#testing-your-deployment)
- [Maintenance and Updates](#maintenance-and-updates)
- [Troubleshooting](#troubleshooting)

## Environment Setup

This document explains how the environment variables are set up for both development and production environments.

### Environment Files

#### Backend Environment Files

- `.env` - Used for development
- `.env.production` - Used for production

#### Frontend Environment Files

- `.env` - Used for development
- `.env.production` - Used for production

## Development Guide

1. Use the `.env` files provided in both frontend and backend directories
2. Start the backend with `npm run dev` or `node server.js`
3. Start the frontend with `npm run dev`

## Production Deployment Guide

### Preparing for Deployment

1. Make sure your code is in a GitHub repository
2. Ensure all dependencies are up-to-date
3. Create accounts on the following services:
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Database)
   - [Cloudinary](https://cloudinary.com/) (Media storage)
   - [Render](https://render.com/) or [Railway](https://railway.app/) (Backend hosting)
   - [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/) (Frontend hosting)

### Backend Deployment (Option 1: Render)

1. Login to [Render](https://render.com/) and connect your GitHub account
2. Click on "New" and select "Web Service"
3. Select your repository
4. Configure your web service:

   - **Name**: `purplogs-api` (or your preferred name)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `cd backend && NODE_ENV=production node server.js`
   - **Advanced**: Add all environment variables from your `.env.production` file

5. Under the Environment section, add these environment variables:

   ```
   PORT=10000 (Render will override this, but include it anyway)
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/purplogs
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   CLIENT_URL=https://purplogs.vercel.app (your frontend URL)
   NODE_ENV=production
   ```

6. Click "Create Web Service" and wait for the deployment to complete
7. Note the URL provided (e.g., `https://purplogs-api.onrender.com`)

### Backend Deployment (Option 2: Railway)

1. Login to [Railway](https://railway.app/) and connect your GitHub account
2. Create a new project and select "Deploy from GitHub repo"
3. Select your repository
4. Configure your project:

   - Add a MongoDB plugin from the Railway dashboard
   - Set up environment variables (same as listed for Render)
   - Add the start command: `cd backend && NODE_ENV=production node server.js`

5. Deploy the project and note the URL provided

### Frontend Deployment (Vercel)

1. Login to [Vercel](https://vercel.com/) and connect your GitHub account
2. Import your repository
3. Configure the project:

   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. Add environment variable:

   ```
   VITE_API_URL=https://purplogs-api.onrender.com (your backend URL)
   ```

5. Deploy and wait for completion
6. Your site will be available at a URL like `https://purplogs.vercel.app`

### Frontend Deployment (Netlify)

1. Login to [Netlify](https://www.netlify.com/) and connect your GitHub account
2. Import your repository
3. Configure the project:

   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

4. Add environment variable:

   ```
   VITE_API_URL=https://purplogs-api.onrender.com
   ```

5. Deploy and wait for completion

### Database Setup (MongoDB Atlas)

1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Set up database access:
   - Create a database user with password
   - Add your IP to the whitelist (or allow access from anywhere)
3. Get your connection string: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/purplogs`
4. Use this connection string in your backend environment variables

### Media Storage (Cloudinary)

1. Create an account on [Cloudinary](https://cloudinary.com/)
2. Navigate to Dashboard to get your cloud name, API key, and API secret
3. Add these to your backend environment variables

## Environment Variables Reference

### Backend Variables

- `PORT` - The port the server will run on
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT authentication
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `CLIENT_URL` - The URL of the frontend for CORS settings
- `NODE_ENV` - Set to 'development' or 'production'

### Frontend Variables

- `VITE_API_URL` - The base URL for API requests

## Testing Your Deployment

1. Visit your frontend URL (e.g., `https://purplogs.vercel.app`)
2. Test user registration and login
3. Create a blog post with an image
4. Add comments to ensure the full functionality is working

## Maintenance and Updates

1. To update your deployment:

   - Push changes to your GitHub repository
   - Vercel and Render will automatically detect changes and redeploy

2. Monitor your application:
   - Check server logs on Render/Railway dashboard
   - Set up monitoring with UptimeRobot or similar services

## Troubleshooting

- **CORS Issues**: Ensure `CLIENT_URL` in backend environment variables matches your frontend URL exactly
- **Database Connection Errors**: Verify MongoDB Atlas network access settings
- **Image Upload Fails**: Check Cloudinary credentials and permissions
- **API Request Errors**: Confirm `VITE_API_URL` points to the correct backend URL

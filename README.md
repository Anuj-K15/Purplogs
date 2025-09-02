# Purplogs - MERN Stack Blog Application

Purplogs is a full-featured blogging platform built with the MERN stack (MongoDB, Express, React, Node.js), featuring user authentication, blog creation/management, comments, dark/light theme support, and a responsive design.

[![Deployed Frontend](https://img.shields.io/badge/Frontend-Vercel-blue)](https://purplogs.vercel.app/)
[![Deployed Backend](https://img.shields.io/badge/Backend-Render-green)](https://purplogs.onrender.com/)

## 🚀 Live Demo

- **Frontend**: [https://purplogs.vercel.app/](https://purplogs.vercel.app/)
- **Backend API**: [https://purplogs.onrender.com/](https://purplogs.onrender.com/)

## ✨ Features

- **User Authentication**: Secure signup, login, and profile management
- **Blog Management**: Create, read, update, and delete blog posts
- **Rich Text Editor**: Format your content with a full-featured text editor
- **Comments System**: Engage with readers through comments
- **Search Functionality**: Find content easily with the search feature
- **Responsive Design**: Optimized for desktop and mobile devices
- **Theme Toggle**: Switch between light and dark modes
- **Image Upload**: Upload and manage images with Cloudinary integration
- **User Profiles**: Customize user profiles with avatars and personal information

## Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Screenshots](#-screenshots)
- [Environment Setup](#environment-setup)
- [Development Guide](#development-guide)
- [Production Deployment Guide](#production-deployment-guide)
  - [Preparing for Deployment](#preparing-for-deployment)
  - [Backend Deployment (Render)](#backend-deployment-render)
  - [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
  - [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
  - [Media Storage (Cloudinary)](#media-storage-cloudinary)
- [Environment Variables Reference](#environment-variables-reference)
- [Testing Your Deployment](#testing-your-deployment)
- [Maintenance and Updates](#maintenance-and-updates)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🛠 Technology Stack

### Frontend
- **React.js**: UI library for building the user interface
- **Redux Toolkit**: State management
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn UI**: Component library
- **TinyMCE**: Rich text editor
- **Axios**: HTTP client for API requests
- **Vite**: Build tool and development server

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: Authentication mechanism
- **Cloudinary**: Cloud-based image management
- **Multer**: File upload middleware

## Environment Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Environment Files

#### Backend Environment Files

- `.env` - Used for development
- `.env.production` - Used for production

#### Frontend Environment Files

- `.env` - Used for development
- `.env.production` - Used for production

## Development Guide

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Anuj-K15/Purplogs.git
   cd Purplogs
   ```

2. Install backend dependencies
   ```bash
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Running the Application

1. Start the backend server
   ```bash
   npm run dev
   ```

2. Start the frontend development server
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Production Deployment Guide

### Preparing for Deployment

1. Ensure your code is in a GitHub repository
2. Verify all dependencies are up-to-date
3. Set up accounts on the following services:
   - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Database)
   - [Cloudinary](https://cloudinary.com/) (Media storage)
   - [Render](https://render.com/) (Backend hosting)
   - [Vercel](https://vercel.com/) (Frontend hosting)

### Backend Deployment (Render)

1. Login to [Render](https://render.com/) and connect your GitHub account
2. Click on "New" and select "Web Service"
3. Select your repository
4. Configure your web service:

   - **Name**: `purplogs` (or your preferred name)
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
   CLIENT_URL=https://purplogs.vercel.app
   NODE_ENV=production
   ```

6. Click "Create Web Service" and wait for the deployment to complete
7. Your backend will be available at `https://purplogs.onrender.com`

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
   VITE_API_URL=https://purplogs.onrender.com
   ```

5. Deploy and wait for completion
6. Your site will be available at `https://purplogs.vercel.app`

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

- `PORT` - The port the server will run on (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT authentication
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `CLIENT_URL` - The URL of the frontend (for CORS settings)
- `NODE_ENV` - Environment mode ('development' or 'production')

### Frontend Variables

- `VITE_API_URL` - The base URL for API requests

## Testing Your Deployment

1. Visit your frontend URL: [https://purplogs.vercel.app/](https://purplogs.vercel.app/)
2. Test user registration and login
3. Create a blog post with an image
4. Add comments to ensure the full functionality is working
5. Test the search functionality
6. Switch between light and dark themes

## Maintenance and Updates

1. To update your deployment:
   - Push changes to your GitHub repository
   - Vercel and Render will automatically detect changes and redeploy

2. Monitor your application:
   - Check server logs on Render dashboard
   - Set up monitoring with UptimeRobot or similar services
   - Regularly check for security updates in your dependencies

## Troubleshooting

- **CORS Issues**: Ensure `CLIENT_URL` in backend environment variables matches your frontend URL exactly
- **Database Connection Errors**: Verify MongoDB Atlas network access settings
- **Image Upload Fails**: Check Cloudinary credentials and permissions
- **API Request Errors**: Confirm `VITE_API_URL` points to the correct backend URL
- **Render Deployment Issues**: Verify the start command is correct and includes the path to server.js

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ by [Anuj Karambalkar](https://github.com/Anuj-K15)

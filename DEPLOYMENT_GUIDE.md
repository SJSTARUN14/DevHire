# DevHire: LIVE Deployment Guide (GCP Free Tier)

This guide provides step-by-step instructions to deploy the **DevHire** MERN stack application live on Google Cloud using ONLY free-tier services.

---

## 1. Google Cloud Project Setup
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project named `devhire-live`.
3.  **Link Billing**: Even though we use the free tier, GCP requires a credit card on file for verification. You will not be charged unless you exceed the massive free limits.

## 2. Enable Required APIs
Open the Google Cloud Shell and run:
`gcloud services enable run.googleapis.com containerregistry.googleapis.com cloudbuild.googleapis.com`

## 3. MongoDB Atlas (Database Setup)
1.  Log in to [MongoDB Atlas](https://cloud.mongodb.com/).
2.  Ensure you have an **M0 (Free)** cluster.
3.  **Network Access**: Change IP whitelist to `0.0.0.0/0` (Allow access from anywhere). *Required because Cloud Run service IPs change dynamicallly.*
4.  Get your Connection String from **Connect > Drivers**.

## 4. Backend Deployment (Cloud Run)
1.  **Configure Environment Variables**:
    Create a file `.env.production` locally with:
    ```env
    MONGO_URI=mongodb+srv://... (Your Atlas Link)
    JWT_SECRET=...
    NODE_ENV=production
    GEMINI_API_KEY=...
    ```
2.  **Build & Deploy Command**:
    In your `backend` directory, run:
    `gcloud run deploy devhire-backend --source . --region us-central1 --allow-unauthenticated`
    
    *Note: When prompt asks for Artifact Registry, type 'y'.*

3.  **Copy the Backend URL**: Once done, you will get a URL like `https://devhire-backend-xyz.a.run.app`. **Save this.**

## 5. Frontend Preparation
1.  Install Firebase Tools: `npm install -g firebase-tools`
2.  Login: `firebase login`
3.  Initialize: `firebase init hosting` (Select your GCP project).
4.  **Update API URL**:
    In `frontend/src/utils/axiosConfig.js` (or wherever you define the base URL), change:
    `const API_URL = "https://devhire-backend-xyz.a.run.app/api";`

## 6. Frontend Deployment (Firebase Hosting)
1.  Build the React app: `npm run build`
2.  Deploy: `firebase deploy --only hosting`
3.  **Copy Frontend URL**: You will get a URL like `https://devhire-live.web.app`.

## 7. Final Step: Link CORS
Go back to your **Cloud Run Service > Variables** and update your CORS policy in the backend if needed, or simply ensure the backend allows the Firebase origin.

---

### Your Live Stack
- **Frontend**: https://devhire-live.web.app
- **Backend API**: https://devhire-backend-xyz.a.run.app
- **Database**: MongoDB Atlas M0 (Global)

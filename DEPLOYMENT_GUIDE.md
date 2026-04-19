# Global Deployment Guide

This guide will help you securely deploy the **Velocity Edge Simulator** to public hosting providers so anyone in the world can access it natively without `localhost`.

## 1. Deploying the Backend (Node/Express API)

We recommend using **Render** or **Railway** for the backend since they support native Node environments easily.

### Deployment on Render.com:
1. Create a free account at [Render](https://render.com).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository.
4. Setup the configuration:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Click **Create Web Service**. 
6. Once deployed, Render will provide a URL (e.g., `https://velocity-edge-api.onrender.com`). **Save this URL**.

---

## 2. Deploying the Frontend (Vite/React UI)

The frontend is a static React build, which is perfect for **Vercel** or **Netlify**.

### Deployment on Vercel:
1. Create a free account at [Vercel](https://vercel.com).
2. Create a new Project and import your GitHub repository.
3. Configure the Project:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
4. Expand **Environment Variables** and add the following:
   - **Name:** `VITE_API_BASE_URL`
   - **Value:** `[YOUR_RENDER_BACKEND_URL]` (e.g. `https://velocity-edge-api.onrender.com`)
5. Click **Deploy**.

---

## 3. Post Deployment Checks

Once both sides are deployed, open your Vercel public URL across multiple devices.
- Verify that caching works correctly between the Edge and the Backend.
- You can freely attach a custom domain to the Vercel project via the Vercel dashboard.

> **Note on CDN simulation:** Even when deployed live on a static provider like Vercel, the internal ping simulations inside our Express routing logic will mathematically simulate distances exactly as they appear locally!

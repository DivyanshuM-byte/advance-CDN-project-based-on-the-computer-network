# Velocity Edge — Deployment Guide

This guide covers the full production deployment of the **Velocity Edge Simulator**:

- **Frontend** (React/Vite) → [Vercel](https://vercel.com)
- **Backend** (Node/Express) → [Render](https://render.com) *(or Railway / Fly.io)*

---

## Why Two Separate Deployments?

The backend is a **long-running Express server** — not serverless — because:

1. It maintains a **stateful in-memory cache** (cache hits survive between requests).
2. It uses **`setTimeout`** to simulate realistic network latency (up to 2300 ms).
3. It reads binary files from the filesystem (`backend/public/`).

Serverless platforms like Vercel Functions reset state on every invocation, which would destroy the CDN simulation.

---

## Step 1 — Deploy the Backend to Render

1. Create a free account at [render.com](https://render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Fill in the settings:

   | Setting | Value |
   |---------|-------|
   | **Root Directory** | `backend` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |

5. Click **Create Web Service**.
6. Once deployed, Render gives you a URL:
   ```
   https://velocity-edge-api.onrender.com
   ```
   **Copy this URL — you will need it in Step 2.**

7. After completing Step 2, come back and add this **Environment Variable**:

   | Key | Value |
   |-----|-------|
   | `CORS_ORIGIN` | `https://your-project.vercel.app` |

---

## Step 2 — Deploy the Frontend to Vercel

1. Create a free account at [vercel.com](https://vercel.com).
2. Click **Add New** → **Project** and import your GitHub repository.
3. **Critical settings** — configure exactly as shown:

   | Setting | Value |
   |---------|-------|
   | **Framework Preset** | `Vite` |
   | **Root Directory** | `frontend` |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `dist` |
   | **Install Command** | `npm install` |

4. Expand **Environment Variables** and add:

   | Name | Value |
   |------|-------|
   | `VITE_API_BASE_URL` | `https://velocity-edge-api.onrender.com` *(your Render URL from Step 1)* |

5. Click **Deploy**.

---

## Step 3 — Post-Deployment Checks

Once both are live:

### Verify backend is responding
```bash
curl -I https://velocity-edge-api.onrender.com/cdn/edge-frankfurt/images/test1.png
# Expected: HTTP 200, X-Cache-Status: MISS (first), HIT (second)

curl -X DELETE https://velocity-edge-api.onrender.com/cdn/cache
# Expected: {"message":"CDN cache cleared successfully"}
```

### Verify frontend connects to backend
1. Open your Vercel URL in the browser.
2. Log in and go to **Edge Simulator**.
3. Click **Fetch Asset** — you should see:
   - A real image loading.
   - `Cache: MISS ❌` on the first load.
   - `Cache: HIT ✅` on the second load of the same asset.
   - Latency metrics matching the simulated edge config.

---

## Environment Variables Reference

### Frontend (set on Vercel)

| Variable | Example Value | Description |
|----------|--------------|-------------|
| `VITE_API_BASE_URL` | `https://your-backend.onrender.com` | Full URL of the deployed backend. **Required for production.** |

### Backend (set on Render)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | *(set by Render automatically)* | Do not set manually on Render. |
| `CORS_ORIGIN` | `*` | Your Vercel frontend URL to restrict CORS in production. |

---

## Local Development

```bash
# Terminal 1 — Backend
cd backend
npm install
npm start
# → Server running on port 3000

# Terminal 2 — Frontend
cd frontend
cp .env.example .env.local   # Uses http://localhost:3000 by default
npm install
npm run dev
# → Open http://localhost:5173
```

---

## Production Architecture

```
         USER BROWSER
               │
               ▼
    ┌──────────────────────┐
    │   Vercel (CDN)       │
    │   React + Vite SPA   │
    │   frontend/          │
    └──────────┬───────────┘
               │ HTTPS API calls
               │ /cdn/:edgeId/:resource
               │ /origin/:resource
               │ DELETE /cdn/cache
               ▼
    ┌──────────────────────┐
    │   Render.com         │
    │   Node.js + Express  │
    │   backend/           │
    │                      │
    │  ┌─────────────────┐ │
    │  │  MemoryCache    │ │  ← In-memory, survives between requests
    │  │  (24h TTL)      │ │
    │  └─────────────────┘ │
    │                      │
    │  ┌─────────────────┐ │
    │  │  public/        │ │  ← Binary assets (images, video)
    │  │  images/ video/ │ │
    │  └─────────────────┘ │
    └──────────────────────┘
               │
               ▼
    CDN cache simulation:
    edge-frankfurt / edge-newyork / edge-tokyo
    Simulated latency: 25–360ms (HIT) / 1135–1360ms (MISS)
```

---

> **Note on Render free tier cold starts**: Free Render services sleep after 15 minutes of inactivity. The first request after sleeping takes ~30–60 seconds. This is a Render infrastructure limitation, not a bug in the app. Upgrade to a paid instance or use Railway for always-on behavior.

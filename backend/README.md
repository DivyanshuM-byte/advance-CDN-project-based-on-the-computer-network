# Velocity Edge — Backend (Express API)

The backend simulates CDN behavior: edge-server routing, cache hit/miss cycles, simulated geographic latency, and origin-server delays. It serves binary assets (images, video) from `backend/public/`.

## Architecture

```
backend/
├── server.js          ← Entry point
├── routes/
│   ├── cdn.js         ← Edge simulation: cache + simulated latency
│   └── origin.js      ← Direct origin: no cache, high latency
├── cache/
│   └── memoryCache.js ← In-memory TTL cache (24-hour expiry)
└── public/
    ├── images/        ← test1.png, test2.png
    └── video/         ← test.mp4
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/cdn/:edgeId/:resource` | Serve via CDN edge. Returns `X-Cache-Status: HIT` or `MISS`. |
| `GET` | `/origin/:resource` | Serve directly from origin. Always slow (1150 ms simulated). |
| `DELETE` | `/cdn/cache` | Clear the in-memory CDN cache. |

**Edge IDs**: `edge-frankfurt`, `edge-newyork`, `edge-tokyo`

**Example**:
```bash
# First request — cache MISS (takes ~1360ms)
curl -I http://localhost:3000/cdn/edge-frankfurt/images/test1.png

# Second request — cache HIT (takes ~25ms)
curl -I http://localhost:3000/cdn/edge-frankfurt/images/test1.png
```

## Local Development

```bash
cd backend
npm install
npm start
# Server running on port 3000
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Port the server listens on. Set automatically by Render/Railway. |
| `CORS_ORIGIN` | `*` | Comma-separated list of allowed CORS origins. Set to your Vercel URL in production. |

Copy `.env.example` to `.env` for local development:
```bash
cp .env.example .env
```

## Deploying to Render.com (Recommended)

This backend **must** be a long-running server (not serverless) because:
- The in-memory `MemoryCache` is stateful — it must persist between requests.
- `setTimeout`-based latency simulation holds requests open for up to 2300 ms.

### Steps

1. Create a free account at [render.com](https://render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository: `DivyanshuM-byte/advance-CDN-project-based-on-the-computer-network`.
4. Configure the service:

   | Setting | Value |
   |---------|-------|
   | **Name** | `velocity-edge-api` (or any name) |
   | **Root Directory** | `backend` |
   | **Runtime** | `Node` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
   | **Instance Type** | Free |

5. Under **Environment Variables**, add:

   | Key | Value |
   |-----|-------|
   | `CORS_ORIGIN` | `https://your-frontend.vercel.app` (add after you deploy frontend) |

   > `PORT` is set automatically by Render — do **not** add it manually.

6. Click **Create Web Service**.
7. Wait for the deploy to complete. Render will give you a URL like:
   ```
   https://velocity-edge-api.onrender.com
   ```
   **Save this URL** — you will need it for the Vercel frontend environment variable.

### Post-Deploy Verification

```bash
# Check the server is alive
curl https://velocity-edge-api.onrender.com/cdn/edge-frankfurt/images/test1.png -I

# Expected headers:
# X-Cache-Status: MISS  (first request)
# X-Edge-Server: edge-frankfurt
# X-Simulated-Latency: 1135
```

## Deploying to Railway (Alternative)

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**.
2. Select your repo and set:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
3. Set the `CORS_ORIGIN` environment variable to your Vercel URL.
4. Railway sets `PORT` automatically.

## Deploying to Fly.io (Alternative)

```bash
cd backend
fly launch --name velocity-edge-api
fly secrets set CORS_ORIGIN=https://your-frontend.vercel.app
fly deploy
```

---

> **Note on free tiers**: Render free services spin down after 15 minutes of inactivity. The first request after spin-down will take ~30–60 seconds to cold-start. This does **not** affect the CDN simulation logic — only the initial wake-up. Consider upgrading to a paid tier or using Railway for always-on behavior.

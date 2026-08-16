<div align="center">
  <h1>🚀 Velocity Edge Simulator</h1>
  <p><b>Next-Generation Content Delivery Network (CDN) Performance Analyzer</b></p>
  <img src="https://img.shields.io/badge/UI-Gen%20Z%20Neon-00f0ff?style=for-the-badge&logo=react" alt="UI" />
  <img src="https://img.shields.io/badge/Backend-Node.js-39ff14?style=for-the-badge&logo=nodedotjs" alt="Node" />
  <img src="https://img.shields.io/badge/Frontend-Vite%20%2B%20React-8a2be2?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel" alt="Vercel" />
  <img src="https://img.shields.io/badge/Backend%20on-Render-46e3b7?style=for-the-badge&logo=render" alt="Render" />
</div>

<br />

## ✨ Overview

**Velocity Edge Simulator** is a full-stack simulation platform that demonstrates the real-world performance benefits of a **Content Delivery Network (CDN)**.

It provides a highly visual, interactive representation of how **edge caching** and **geographic routing** dramatically reduce latency compared to fetching directly from an origin server. Built with a dark-mode-first, glassmorphism aesthetic featuring neon data-flow animations and real-time metric tracking.

---

## 🎨 UI / Design

- **Neon Cyberpunk Palette**: Vibrant glowing cyan (`#00f0ff`), deep purple (`#8a2be2`), and toxic green (`#39ff14`) accents
- **Glassmorphism**: Deep background blurring (`backdrop-filter: blur(24px)`) creating a layered bento-box feel
- **Micro-Interactions**: Custom trailing cursor, animated data packets in the network topology map, and hover states
- **Typography**: [Outfit](https://fonts.google.com/specimen/Outfit) — geometric, bold, modern

---

## ⚡ Core Features

| Feature | Description |
|---------|-------------|
| 🌍 **CDN Edge Simulation** | Route requests through Frankfurt, New York, or Tokyo edge nodes vs. direct origin |
| ⏱️ **Real-Time Latency Metrics** | TTFB, total load time, and `HIT`/`MISS` cache status per request |
| 📈 **Live Latency Graph** | Visualizes latency collapse via Recharts as the cache warms up |
| 🎬 **Video Buffer Analysis** | Raw HTML5 video buffering time — edge vs. origin comparison |
| 🔍 **Interactive Flow Map** | Animated data packets trace the request path: Client → Edge → Origin |
| 📺 **YouTube Demo Mode** | Frontend-measurable real-world YouTube CDN buffering analysis |
| 🗑️ **Cache Control** | One-click CDN cache clear to repeat the cold-start experience |

---

## 🏗️ Architecture

```
         USER BROWSER
               │
               ▼
    ┌──────────────────────┐
    │   Vercel             │
    │   React + Vite SPA   │  frontend/
    │   VITE_API_BASE_URL  │
    └──────────┬───────────┘
               │ HTTPS API
               ▼
    ┌──────────────────────┐
    │   Render.com         │
    │   Node.js + Express  │  backend/
    │   (long-running)     │
    │                      │
    │  MemoryCache (24h)   │  ← Stateful: HIT in ~25ms, MISS in ~1135ms
    │  public/images/      │  ← Served binary assets
    │  public/video/       │
    └──────────────────────┘
               │
    Simulated edge latencies:
    edge-frankfurt: 25ms ping + 110ms to origin
    edge-newyork:   85ms ping + 20ms  to origin
    edge-tokyo:     140ms ping + 220ms to origin
```

> **Why two separate deployments?** The backend maintains a **stateful in-memory cache** and uses `setTimeout` to simulate realistic geographic latency. Serverless functions (like Vercel Functions) reset state on every cold start — which would break the cache-hit simulation entirely.

---

## 🚀 Local Development

```bash
# 1. Start the Backend
cd backend
cp .env.example .env     # optional — defaults to PORT=3000
npm install
npm start
# → Backend Server running on port 3000

# 2. Start the Frontend
cd frontend
cp .env.example .env.local   # uses http://localhost:3000 by default
npm install
npm run dev
# → Open http://localhost:5173
```

---

## 🌐 Production Deployment

> Full step-by-step instructions with exact settings: [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)

**Quick summary:**

| Part | Platform | Key Setting |
|------|----------|-------------|
| Frontend | [Vercel](https://vercel.com) | Root Directory = `frontend`; add `VITE_API_BASE_URL` env var |
| Backend | [Render](https://render.com) | Root Directory = `backend`; Build = `npm install`; Start = `npm start` |

**Environment Variables:**

| Variable | Where | Value |
|----------|-------|-------|
| `VITE_API_BASE_URL` | Vercel | `https://your-backend.onrender.com` |
| `CORS_ORIGIN` | Render | `https://your-project.vercel.app` |

---

## 📁 Project Structure

```
advance-CDN-project/
├── frontend/                  ← React + Vite SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx      ← Main simulator UI
│   │   │   ├── FlowVisualizer.jsx ← Animated request topology
│   │   │   ├── MetricsGraph.jsx   ← Recharts latency graph
│   │   │   ├── VideoVisualizer.jsx← HTML5 video buffer tracker
│   │   │   ├── YouTubeDemo.jsx    ← YouTube CDN analysis
│   │   │   ├── Auth.jsx           ← Login screen
│   │   │   ├── CustomCursor.jsx   ← Trailing neon cursor
│   │   │   └── NetworkBackground.jsx
│   │   └── App.jsx
│   ├── vercel.json                ← SPA routing fix for Vercel
│   └── .env.example
│
├── backend/                   ← Node.js + Express API
│   ├── routes/
│   │   ├── cdn.js             ← Edge simulation: cache + latency
│   │   └── origin.js          ← Direct origin: no cache, high latency
│   ├── cache/
│   │   └── memoryCache.js     ← In-memory TTL cache (24h)
│   ├── public/
│   │   ├── images/            ← test1.png, test2.png
│   │   └── video/             ← test.mp4
│   ├── server.js              ← Entry point
│   ├── .env.example
│   └── README.md              ← Backend-specific deploy guide
│
├── DEPLOYMENT_GUIDE.md        ← Full production deploy walkthrough
└── PROJECT_NOTES.md           ← Architecture deep-dive
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/cdn/:edgeId/:resource` | Serve via CDN edge (cached, simulated latency) |
| `GET` | `/origin/:resource` | Serve directly from origin (slow, no cache) |
| `DELETE` | `/cdn/cache` | Clear the in-memory CDN cache |

**Edge IDs**: `edge-frankfurt` · `edge-newyork` · `edge-tokyo`

---

## 🧠 Deep Dive

For full technical details on the caching algorithm, latency engine, and network routing logic, see [`PROJECT_NOTES.md`](./PROJECT_NOTES.md).

<br />

<div align="center">
  <i>Built to visualize the invisible speed of the modern web.</i>
</div>

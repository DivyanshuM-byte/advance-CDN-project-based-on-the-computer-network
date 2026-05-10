<div align="center">
  <h1>🚀 Velocity Edge Simulator</h1>
  <p><b>Next-Generation Content Delivery Network (CDN) Performance Analyzer</b></p>
  <img src="https://img.shields.io/badge/UI-Gen%20Z%20Neon-00f0ff?style=for-the-badge&logo=react" alt="UI" />
  <img src="https://img.shields.io/badge/Backend-Node.js-39ff14?style=for-the-badge&logo=nodedotjs" alt="Node" />
  <img src="https://img.shields.io/badge/Frontend-Vite%20%2B%20React-8a2be2?style=for-the-badge&logo=vite" alt="React" />
</div>

<br />

## ✨ Overview

**Velocity Edge Simulator** is a full-stack advanced simulation platform designed to demonstrate the real-world performance benefits of a **Content Delivery Network (CDN)**.

It provides a visceral, highly visual representation of how caching and edge computing drastically reduce latency compared to direct origin fetching. Recently updated with a stunning **Gen Z / Web3-inspired aesthetic**, the dashboard features frosted glassmorphism, neon data-flow animations, and real-time interactive metric tracking.

---

## 🎨 The "Gen Z" UI Experience
The platform has been completely overhauled to feature a modern, dark-mode-first aesthetic:
- **Neon Cyberpunk Palette**: Vibrant glowing cyan (`#00f0ff`), deep purple (`#8a2be2`), and toxic green (`#39ff14`) accents.
- **Glassmorphism Design**: Deep background blurring (`backdrop-filter: blur(24px)`) creating a multi-layered bento box feel.
- **Micro-Interactions**: Custom trailing cursor, animated data packets in the network topology map, and satisfying hover states on interactive buttons.
- **Typography**: Utilizing the beautiful **Outfit** font for a sleek, geometric, and bold layout.

---

## ⚡ Core Features

- 🌍 **Custom CDN Simulation:** Test data fetching speeds by routing requests through simulated localized Edge Nodes (Frankfurt, New York, Tokyo) vs. Direct Origin.
- ⏱️ **Real-Time Latency Metrics:** Automatically calculates Time To First Byte (TTFB), total load time, and cache status (`HIT`/`MISS`).
- 📈 **Live Graphing Engine:** Visualizes latency collapse via Recharts as the cache activates on repeated requests.
- 🎬 **Video Buffer Analysis:** Embeds raw HTML5 video to mathematically demonstrate how much buffering time is saved when served from edge memory.
- 🔍 **Interactive Flow Map:** Visually traces request paths as glowing data packets travel from the client, bouncing off the edge, or penetrating deep into the origin server.

---

## 🚀 Getting Started

### 1. Start the Backend (Origin & Edge Nodes)
```bash
cd backend
npm install
npm start
```
*The server will boot on port 3000.*

### 2. Start the Frontend Dashboard
```bash
cd frontend
npm install
npm run dev
```
*The Vite interface will start locally.*

---

## 🧠 Architecture Overview
For a deep dive into how the caching algorithm, artificial latency engine, and network routing operate under the hood, please refer to the [`PROJECT_NOTES.md`](./PROJECT_NOTES.md).

<br />

<div align="center">
  <i>Built to visualize the invisible speed of the modern web.</i>
</div>

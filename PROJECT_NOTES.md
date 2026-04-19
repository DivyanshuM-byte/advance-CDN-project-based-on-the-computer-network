# Velocity Edge Simulator: Project Architecture & Notes

This document provides a comprehensive breakdown of exactly what is happening under the hood of the Velocity Edge Simulator (CDN Performance Analyzer). 

## 🎯 What Does This Project Do?
This project is an advanced full-stack simulation of a **Content Delivery Network (CDN)**. A real CDN stores copies of heavy media (images, videos) physically closer to users around the world so they load instantly. 

This simulator proves how powerful a CDN is by letting you directly compare the speed of fetching assets from an un-cached **"Direct Origin"** vs. a **"CDN Edge Network"**.

---

## 🧠 How the Backend Simulator Works

The backend (Node.js/Express) is designed to fake massive geographical distances using intentional wait timers.

### 1. The Origin Server (`backend/routes/origin.js`)
Think of the Origin as a database sitting very far away (e.g., in Antarctica). 
- When you request an asset through "Direct Origin", the backend intentionally forces a **very high latency** penalty (simulating thousands of miles of cable travel + server processing time).
- It takes a long time to return the file, proving what happens if you don't use a CDN.

### 2. The Edge Network (`backend/routes/cdn.js`)
This represents servers located locally in major cities (e.g., Frankfurt, New York, Tokyo).
It uses a built-in memory cache system (`memoryCache.js`).
- **Cache MISS:** The very first time you click "Fetch", the edge node doesn't have the file. It is forced to go all the way to the Origin Server to get it. It passes the heavy latency to the user, but then **saves a copy in its RAM**.
- **Cache HIT:** The second time you click "Fetch", the edge node remembers the file! It skips the Origin entirely and delivers it to you almost instantaneously (simulating ultra-low local ping).

---

## 💻 What Happens on the Frontend (React)

The frontend is a futuristic visual dashboard designed to calculate these latencies in real-time.

1. **Dashboard (`Dashboard.jsx`)**
   - The nerve center. It dynamically builds the request URL based on the mode you select. 
   - If "Direct Origin" is chosen, it pings `localhost:3000/origin/...`
   - If "CDN" is chosen, it pings `localhost:3000/cdn/[chosen-city-node]/...`
   - It captures the start time and end time of the fetch request to calculate the **Time To First Byte (TTFB)**.

2. **Flow Visualizer (`FlowVisualizer.jsx`)**
   - Renders a Client ➔ Edge ➔ Origin visual pipeline.
   - When you click fetch, you can physically watch the CSS-animated glowing packet travel. On a "Hit", it stops at the Edge and returns. On a "Miss", it travels all the way to the red Origin node.

3. **Live Metrics Graph (`MetricsGraph.jsx`)**
   - Uses the `recharts` library to take your TTFB history arrays and plot them on a real-time line chart. This visibly shows latency collapsing from ~1200ms down to ~20ms once the cache activates.

4. **Video Stream Analysis (`VideoVisualizer.jsx`)**
   - Instead of fetching video bits manually, it embeds an HTML5 `<video>` tag linked straight to the Node routes.
   - It listens to the native `onWaiting` and `onCanPlay` browser hooks to mathematically prove how much less time a browser spends "Buffering" when connected to an Edge node.

5. **Logs Engine (`LogPanel.jsx`)**
   - Reads the hidden `X-Cache-Status` headers that the backend injects into the response to prove if a resource was actually served from Cache or not.

---

## 🛠️ Summary of the Tech Stack
- **Frontend Elements:** Vite, React, CSS Variables, Lucide-React (Icons), Recharts (Graphs), HTML5 Context Canvas (Animated node background).
- **Backend Elements:** Node.js, Express, Native FileSystem (`fs`), Custom In-memory TTL Cache logic.

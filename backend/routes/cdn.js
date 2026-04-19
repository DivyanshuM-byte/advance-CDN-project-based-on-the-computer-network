const express = require('express');
const path = require('path');
const fs = require('fs');
const cache = require('../cache/memoryCache');

const router = express.Router();

const getMimeType = (ext) => {
  const map = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.mp4': 'video/mp4',
    '.json': 'application/json'
  };
  return map[ext.toLowerCase()] || 'application/octet-stream';
};

// Simulated latencies for different edge locations
const EDGE_CONFIGS = {
  'edge-frankfurt': { clientPing: 25, edgeToOrigin: 110 },
  'edge-newyork': { clientPing: 85, edgeToOrigin: 20 },
  'edge-tokyo': { clientPing: 140, edgeToOrigin: 220 },
  'default': { clientPing: 50, edgeToOrigin: 100 }
};

// Clear cache endpoint
router.delete('/cache', (req, res) => {
  cache.clear();
  res.json({ message: 'CDN cache cleared successfully' });
});

router.get(/.*/, (req, res) => {
  const parts = req.path.split('/').filter(Boolean);
  const edgeId = parts[0] || 'default';
  const resourcePath = '/' + parts.slice(1).join('/');
  
  // Calculate relative paths regardless of execution dir, assuming public is next to routes
  const filePath = path.join(__dirname, '../public', resourcePath);
  
  const cacheKey = `${edgeId}:${resourcePath}`;
  const cachedData = cache.get(cacheKey);

  const edgeConfig = EDGE_CONFIGS[edgeId] || EDGE_CONFIGS['default'];
  
  // The client always pays the clientPing (time from browser to edge)
  const baseLatency = edgeConfig.clientPing;

  if (cachedData) {
    // CACHE HIT
    setTimeout(() => {
      res.setHeader('X-Cache-Status', 'HIT');
      res.setHeader('X-Edge-Server', edgeId);
      res.setHeader('X-Simulated-Latency', baseLatency);
      res.setHeader('Content-Type', getMimeType(path.extname(resourcePath)));
      res.setHeader('Cache-Control', 'max-age=3600, public');
      return res.end(cachedData); 
    }, baseLatency);
  } else {
    // CACHE MISS
    // Client Ping + Edge to Origin Ping + Origin Processing (1000ms sim)
    const originDelay = 1000;
    const totalMissLatency = baseLatency + edgeConfig.edgeToOrigin + originDelay;
    
    setTimeout(() => {
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const fileData = fs.readFileSync(filePath);
        
        // Save to cache
        cache.set(cacheKey, fileData);

        res.setHeader('X-Cache-Status', 'MISS');
        res.setHeader('X-Edge-Server', edgeId);
        res.setHeader('X-Simulated-Latency', totalMissLatency);
        res.setHeader('Content-Type', getMimeType(path.extname(resourcePath)));
        res.setHeader('Cache-Control', 'max-age=3600, public');
        return res.end(fileData);
      } else {
        res.status(404).send('CDN: Resource not found at origin');
      }
    }, totalMissLatency);
  }
});

module.exports = router;

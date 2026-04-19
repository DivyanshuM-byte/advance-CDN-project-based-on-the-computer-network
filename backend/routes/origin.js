const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Direct to Origin: high network latency + high processing delay
const ORIGIN_NETWORK_PING = 150;
const ORIGIN_PROCESSING_DELAY = 1000;

router.get(/.*/, (req, res) => {
  const resourcePath = req.path;
  const filePath = path.join(__dirname, '../public', resourcePath);

  const totalDelay = ORIGIN_NETWORK_PING + ORIGIN_PROCESSING_DELAY;

  setTimeout(() => {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.setHeader('Source', 'Origin-Server');
      res.setHeader('X-Simulated-Latency', totalDelay);
      res.sendFile(filePath);
    } else {
      res.status(404).send('Origin: Resource not found');
    }
  }, totalDelay);
});

module.exports = router;

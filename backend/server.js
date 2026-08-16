const express = require('express');
const cors = require('cors');
const path = require('path');

const originRouter = require('./routes/origin');
const cdnRouter = require('./routes/cdn');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS_ORIGIN can be a comma-separated list of allowed origins in production.
// Defaults to '*' so the public CDN demo works out of the box without configuration.
// Example for production: CORS_ORIGIN=https://your-frontend.vercel.app
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : '*';

app.use(cors({
  origin: allowedOrigins,
  exposedHeaders: ['X-Cache-Status', 'X-Edge-Server', 'Source', 'X-Simulated-Latency']
}));
app.use(express.static(path.join(__dirname, 'public')));

// Serve raw origin resources with simulated delay
app.use('/origin', originRouter);

// Serve resources via CDN cache
app.use('/cdn', cdnRouter);

app.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});

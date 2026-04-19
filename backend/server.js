const express = require('express');
const cors = require('cors');
const path = require('path');

const originRouter = require('./routes/origin');
const cdnRouter = require('./routes/cdn');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  exposedHeaders: ['X-Cache-Status', 'X-Edge-Server', 'Source', 'X-Simulated-Latency']
}));
app.use(express.static(path.join(__dirname, 'public')));

// Serve raw origin resources with simulated delay
app.use('/origin', originRouter);

// Serve resources via CDN cache
app.use('/cdn', cdnRouter);

app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});

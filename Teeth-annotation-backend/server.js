const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// ✅ Allow frontend to access backend and serve credentials/images
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static images from /uploads (with proper headers)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*'); // Helps avoid CORS for images
  }
}));

// ✅ Annotation Routes
const annotationsRoutes = require('./routes/annotations');
app.use('/api/annotations', annotationsRoutes);

// ❌ Unknown route fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

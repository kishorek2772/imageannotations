const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');

// Multer Storage Config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Upload annotation endpoint
router.post('/upload', upload.single('image'), (req, res) => {
  const { patientId, shapes } = req.body;

  if (!req.file || !patientId || !shapes) {
    return res.status(400).json({ error: 'Missing required data (image, patientId, shapes)' });
  }

  let parsedShapes;
  try {
    parsedShapes = JSON.parse(shapes);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid shapes JSON format' });
  }

  const imageUrl = req.file.filename;

  const sql = 'INSERT INTO annotations (patientId, imageUrl, shapes) VALUES (?, ?, ?)';
  db.query(sql, [patientId, imageUrl, JSON.stringify(parsedShapes)], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Annotation uploaded successfully' });
  });
});

// Fetch latest annotation by patientId
router.get('/patient/:patientId', (req, res) => {
  const { patientId } = req.params;

  const sql = 'SELECT * FROM annotations WHERE patientId = ? ORDER BY id DESC LIMIT 1';
  db.query(sql, [patientId], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: 'No annotation found' });

    const result = results[0];
    let shapes = [];

    try {
      shapes = JSON.parse(result.shapes);
    } catch (err) {
      console.error('Error parsing shapes JSON:', err);
    }

    res.json({
      imageUrl: `http://localhost:5000/uploads/${result.imageUrl}`,
      shapes,
    });
  });
});

module.exports = router;

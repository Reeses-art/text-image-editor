const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const TextImageEditor = require('./TextImageEditor');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif)'));
    }
  }
});

// Routes

/**
 * POST /api/extract - Extract text from an image
 */
app.post('/api/extract', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const result = await TextImageEditor.extractText(req.file.path);
    
    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/add-text - Add text to an image
 */
app.post('/api/add-text', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const { text, x, y, fontSize, color } = req.body;

    if (!text) {
      return res.status(400).json({ success: false, error: 'Text is required' });
    }

    const result = await TextImageEditor.addText(req.file.path, text, {
      x: parseInt(x) || 50,
      y: parseInt(y) || 50,
      fontSize: parseInt(fontSize) || 30,
      color: color || '#000000'
    });

    if (result.success) {
      res.set('Content-Type', 'image/png');
      res.send(result.buffer);
    } else {
      res.status(400).json(result);
    }

    // Clean up
    fs.unlinkSync(req.file.path);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/edit-text - Edit existing text in an image
 */
app.post('/api/edit-text', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const { findText, replaceText, color, backgroundColor } = req.body;

    if (!findText || !replaceText) {
      return res.status(400).json({ 
        success: false, 
        error: 'Both findText and replaceText are required' 
      });
    }

    const result = await TextImageEditor.editText(req.file.path, findText, replaceText, {
      color: color || '#000000',
      backgroundColor: backgroundColor || '#FFFFFF'
    });

    if (result.success) {
      res.set('Content-Type', 'image/png');
      res.send(result.buffer);
    } else {
      res.status(400).json(result);
    }

    // Clean up
    fs.unlinkSync(req.file.path);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/image-info - Get image information
 */
app.post('/api/image-info', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const result = await TextImageEditor.getImageInfo(req.file.path);
    
    // Clean up
    fs.unlinkSync(req.file.path);

    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Text Image Editor API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: err.message });
});

app.listen(PORT, () => {
  console.log(`🖼️  Text Image Editor running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});

const express = require('express');
const router = express.Router();
const { askSpiriter } = require('../controllers/spiriterController'); // Add this line

// Define your routes
router.get('/', (req, res) => {
  res.send('Spiriter route');
});

// Add POST route for chat functionality
router.post('/', askSpiriter);

module.exports = router;
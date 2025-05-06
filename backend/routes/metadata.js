const express = require('express');
const router = express.Router();
const metadataController = require('../controllers/metadataController');

// Route to read metadata from a file
router.post('/read', metadataController.readMetadata);

// Route to write metadata to a file
router.post('/write', metadataController.writeMetadata);

module.exports = router;

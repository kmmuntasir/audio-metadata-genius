const express = require('express');
const router = express.Router();
const metadataController = require('../controllers/metadataController');

router.post('/update', metadataController.updateMetadata);

module.exports = router;
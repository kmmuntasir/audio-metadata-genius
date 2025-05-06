const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

router.post('/scan', fileController.scanDirectory);

module.exports = router;
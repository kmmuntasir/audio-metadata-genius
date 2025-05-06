const express = require('express');
const cors = require('cors');
const fileRoutes = require('./routes/files');
const metadataRoutes = require('./routes/metadata');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/files', fileRoutes);
app.use('/api/metadata', metadataRoutes);

module.exports = app;

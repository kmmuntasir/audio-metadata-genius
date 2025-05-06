const express = require('express');
const cors = require('cors');
const app = express();
const filesRouter = require('./routes/files');
const metadataRouter = require('./routes/metadata');

app.use(express.json());
app.use(cors());
app.use('/api/files', filesRouter);
app.use('/api/metadata', metadataRouter);

module.exports = app;
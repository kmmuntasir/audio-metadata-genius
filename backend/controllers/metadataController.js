const fs = require('fs');
const { readMetadata } = require('../services/tagReader');
const { writeMetadata } = require('../services/tagWriter');

// Read metadata
exports.readMetadata = async (req, res) => {
    const { filePath } = req.body;

    if (!filePath || !fs.existsSync(filePath)) {
        return res.status(400).json({ error: 'Invalid or missing filePath' });
    }

    try {
        const metadata = await readMetadata(filePath);
        return res.json({ metadata });
    } catch (error) {
        console.error('Error reading metadata:', error);
        return res.status(500).json({ error: 'Failed to read metadata' });
    }
};

// Write metadata
exports.writeMetadata = async (req, res) => {
    const { filePath, tags } = req.body;

    if (!filePath || !fs.existsSync(filePath)) {
        return res.status(400).json({ error: 'Invalid or missing filePath' });
    }

    try {
        await writeMetadata(filePath, tags);
        return res.json({ message: 'Metadata written successfully' });
    } catch (error) {
        console.error('Error writing metadata:', error.message);
        return res.status(500).json({ error: 'Failed to write metadata' });
    }
};

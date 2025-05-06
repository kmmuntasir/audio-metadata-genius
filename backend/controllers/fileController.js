const scanner = require('../services/scanner');

exports.scanDirectory = async (req, res) => {
    const { path } = req.body;
    try {
        const files = await scanner.getAudioFilesRecursively(path);
        res.json({ files });
    } catch (error) {
        console.error('Scan error:', error);
        res.status(500).json({ error: 'Failed to scan directory.' });
    }
};

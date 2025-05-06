const scanner = require('../services/scanner');

exports.scanDirectory = async (req, res) => {
    const { albumPath } = req.body;

    if (!albumPath) {
        return res.status(400).json({ error: 'Missing albumPath' });
    }

    try {
        const audioFiles = await scanner.getAudioFilesRecursively(albumPath);
        res.json({ files: audioFiles });
    } catch (err) {
        console.error('Error scanning directory:', err);
        res.status(500).json({ error: 'Failed to scan directory' });
    }
};

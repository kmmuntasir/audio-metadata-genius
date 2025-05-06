const scanner = require('../services/scanner');
const tagReader = require('../services/tagReader');
const tagWriter = require('../services/tagWriter');
const aiHelper = require('../services/aiHelper');

exports.updateMetadata = async (req, res) => {
    const { albumPath } = req.body;

    if (!albumPath) {
        return res.status(400).json({ error: 'Missing albumPath' });
    }

    try {
        const files = await scanner.getAudioFilesRecursively(albumPath);

        for (const file of files) {
            const existingTags = await tagReader.readMetadata(file);
            const correctedTags = await aiHelper.getCorrectMetadata(existingTags, file);
            await tagWriter.writeMetadata(file, correctedTags);
        }

        res.json({ message: 'Metadata updated for all files.' });
    } catch (err) {
        console.error('Error updating metadata:', err);
        res.status(500).json({ error: 'Failed to update metadata' });
    }
};
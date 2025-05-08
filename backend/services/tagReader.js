const fs = require('fs');
const mm = require('music-metadata');
const path = require('path');

async function readMetadata(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error('File does not exist: ' + filePath);
    }

    try {
        const { common, format } = await mm.parseFile(filePath);

        // Helper to safely get field or fallback
        const safe = (val, fallback = null) => (val != null ? val : fallback);

        // Normalize multi-value fields
        const artists = safe(common.artists) || (common.artist ? [common.artist] : []);
        const composers = safe(common.composer, []);
        const genres = safe(common.genre, []);
        const labels = safe(common.label, []);

        let pictureBase64 = null;
        if (common.picture && common.picture.length > 0) {
            pictureBase64 = Buffer.from(common.picture[0].data).toString('base64');
        }

        // Return clean, predictable object (alphabetically sorted)
        return {
            album: safe(common.album, ''),
            albumArtist: safe(common.albumartist, ''),
            artists: artists.filter(Boolean),
            composers: composers.filter(Boolean),
            description: '',
            diskNumber: safe(common.disk?.no, null),
            genres: genres.filter(Boolean),
            labels: labels.filter(Boolean),
            picture: pictureBase64,
            title: safe(common.title, ''),
            totalDisks: safe(common.disk?.of, null),
            totalTracks: safe(common.track?.of, null),
            trackNumber: safe(common.track?.no, null),
            year: safe(common.year, null)
        };

    } catch (err) {
        throw new Error(`Failed to parse metadata for file: ${filePath}\nReason: ${err.message}`);
    }
}

module.exports = {
    readMetadata
};
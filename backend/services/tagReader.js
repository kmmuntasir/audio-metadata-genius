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
        const comments = safe(common.comment, []);

        // Return clean, predictable object (alphabetically sorted)
        return {
            album: safe(common.album, ''),
            albumArtist: safe(common.albumartist, ''),
            artists: artists.filter(Boolean),
            bitrate: safe(format.bitrate, null),
            comments: comments.filter(Boolean),
            composers: composers.filter(Boolean),
            disk: {
                no: safe(common.disk?.no, null),
                of: safe(common.disk?.of, null)
            },
            duration: format.duration != null ? Number(format.duration.toFixed(3)) : null,
            encodedBy: safe(common.encodedby, ''),
            // file: path.resolve(filePath),
            genres: genres.filter(Boolean),
            labels: labels.filter(Boolean),
            numberOfChannels: safe(format.numberOfChannels, null),
            picture: safe(common.picture, []),
            sampleRate: safe(format.sampleRate, null),
            title: safe(common.title, ''),
            track: {
                no: safe(common.track?.no, null),
                of: safe(common.track?.of, null)
            },
            year: safe(common.year, null)
        };

    } catch (err) {
        throw new Error(`Failed to parse metadata for file: ${filePath}\nReason: ${err.message}`);
    }
}

module.exports = {
    readMetadata
};

const NodeID3 = require('node-id3');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

function getExt(filePath) {
    return path.extname(filePath).toLowerCase();
}

function writeMp3Tags(filePath, tags) {
    const success = NodeID3.update(tags, filePath);
    if (!success) {
        throw new Error('Failed to write MP3 tags');
    }
}

function writeFfmpegTags(filePath, tags) {
    return new Promise((resolve, reject) => {
        const ext = getExt(filePath);
        const tempPath = filePath.replace(ext, `.temp${ext}`);

        ffmpeg(filePath)
            .outputOptions([
                `-metadata title=${tags.title || ''}`,
                `-metadata artist=${tags.artist || ''}`,
                `-metadata album=${tags.album || ''}`,
                `-metadata date=${tags.year || ''}`,
                `-metadata track=${tags.trackNumber || ''}`
            ])
            .on('end', () => {
                fs.renameSync(tempPath, filePath);
                resolve();
            })
            .on('error', reject)
            .save(tempPath);
    });
}

async function writeMetadata(filePath, tags) {
    const ext = getExt(filePath);

    if (!fs.existsSync(filePath)) {
        throw new Error('File not found: ' + filePath);
    }

    if (ext === '.mp3') {
        writeMp3Tags(filePath, tags);
    } else if (['.flac', '.wav', '.m4a', '.wma'].includes(ext)) {
        await writeFfmpegTags(filePath, tags);
    } else {
        throw new Error('Unsupported format: ' + ext);
    }
}

module.exports = {
    writeMetadata
};
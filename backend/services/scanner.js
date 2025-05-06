const fs = require('fs').promises;
const path = require('path');

const supportedExtensions = ['.mp3', '.flac', '.wav', '.m4a', '.wma'];

async function getAudioFilesRecursively(dir) {
    let results = [];
    const list = await fs.readdir(dir, { withFileTypes: true });

    for (const item of list) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            const subFiles = await getAudioFilesRecursively(fullPath);
            results = results.concat(subFiles);
        } else if (supportedExtensions.includes(path.extname(item.name).toLowerCase())) {
            results.push(fullPath);
        }
    }

    return results;
}

module.exports = {
    getAudioFilesRecursively
};
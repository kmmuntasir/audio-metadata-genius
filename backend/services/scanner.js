const fs = require('fs');
const path = require('path');

const supportedExtensions = ['.mp3', '.flac', '.wav', '.m4a'];

function getAudioFilesRecursively(dir) {
    const results = [];

    function scan(dirPath) {
        const list = fs.readdirSync(dirPath);
        list.forEach(file => {
            const fullPath = path.join(dirPath, file);
            const stat = fs.statSync(fullPath);

            if (stat && stat.isDirectory()) {
                scan(fullPath);
            } else if (supportedExtensions.includes(path.extname(fullPath).toLowerCase())) {
                results.push(fullPath);
            }
        });
    }

    scan(dir);
    return results;
}

module.exports = { getAudioFilesRecursively };

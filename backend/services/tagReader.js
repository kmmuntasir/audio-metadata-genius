const mm = require('music-metadata');
const fs = require('fs');

async function readMetadata(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error('File does not exist: ' + filePath);
    }

    const metadata = await mm.parseFile(filePath);
    return metadata.common;
}

module.exports = {
    readMetadata
};

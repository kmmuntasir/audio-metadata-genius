const fs = require('fs').promises;
const path = require('path');

const supportedExtensions = ['.mp3', '.flac', '.wav', '.m4a', '.wma'];

async function findLeafAudioFolders(dir) {
    const folderContents = {};

    async function scan(currentDir) {
        const items = await fs.readdir(currentDir, { withFileTypes: true });
        const audioFilesInCurrent = [];
        let hasSubdirectoriesWithAudio = false;

        for (const item of items) {
            const fullPath = path.join(currentDir, item.name);
            if (item.isDirectory()) {
                const subFolderHasAudio = await scan(fullPath);
                if (subFolderHasAudio) {
                    hasSubdirectoriesWithAudio = true;
                }
            } else if (supportedExtensions.includes(path.extname(item.name).toLowerCase())) {
                audioFilesInCurrent.push(fullPath);
            }
        }

        if (audioFilesInCurrent.length > 0) {
            if (!folderContents[currentDir]) {
                folderContents[currentDir] = [];
            }
            folderContents[currentDir] = folderContents[currentDir].concat(audioFilesInCurrent);
            return true;
        }

        return hasSubdirectoriesWithAudio;
    }

    await scan(dir);
    return Object.values(folderContents);
}

module.exports = {
    findLeafAudioFolders
};
const getAudioFilesRecursively = require('./services/scanner').getAudioFilesRecursively;
const tagReader = require('./services/tagReader').readMetadata;

const readTags = async (filePath) => {
    try {
        return await tagReader(filePath);
    } catch (error) {
        console.error('Error reading metadata:', error);
        throw error;
    }
};

// a function to receive the array of files and then call the readTags method for each file
const readTagsForFiles = async (files) => {
    const results = [];
    for (const file of files) {
        try {
            const tags = await readTags(file);
            results.push({ file, tags });
        } catch (error) {
            console.error('Error reading tags for file:', file, error);
        }
    }
    return results;
};


// sample usage
(async () => {
    const dir = '/app/music/M2M/Shades Of Purple';
    try {
        const audioFiles = await getAudioFilesRecursively(dir);
        console.log('Found audio files:', audioFiles);
        const tagsResults = await readTagsForFiles(audioFiles);
        console.log('Tags results:', JSON.parse(JSON.stringify(tagsResults)));
        console.log("Second File", tagsResults[1]);
        // console.log("Second File Comment", tagsResults[1].tags.comment);
    } catch (error) {
        console.error('Error scanning directory:', error);
    }
})();
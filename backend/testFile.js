const findLeafAudioFolders = require('./services/scanner').findLeafAudioFolders;
const tagReader = require('./services/tagReader').readMetadata;
const getAlbumDetails = require('./helpers/groqAiHelper').getAlbumDetails;

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
    // const dir = '/app/music/Collection/M2M/Shades Of Purple';
    const dir = '/app/music/Collection/M2M/';
    try {
        const audioFolders = await findLeafAudioFolders(dir);
        console.log('Found audio folders:', audioFolders);

        // iterate over each folder and read tags
        for (const singleFolder of audioFolders) {
            const tagsResults = await readTagsForFiles(singleFolder);
            // console.log('Tags results:', JSON.parse(JSON.stringify(tagsResults)));
            // console.log("Second File", tagsResults[1]);
            // console.log("Second File Comment", tagsResults[1].tags.comment);

            const enrichedMusicDetails = await getAlbumDetails(singleFolder);
            // const enrichedMusicDetails = await getAlbumDetails(audioFiles.slice(0, 2));
            // console.log('Enriched Music Details:', enrichedMusicDetails);

            // print tag results length
            console.log('Tags results length:', tagsResults.length);
            // print enriched music details length
            console.log('Enriched Music Details length:', enrichedMusicDetails.metadata.length);
        }
    } catch (error) {
        console.error('Error scanning directory:', error);
    }
})();
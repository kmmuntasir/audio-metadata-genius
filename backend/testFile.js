const findLeafAudioFolders = require('./services/scanner').findLeafAudioFolders;
const tagReader = require('./services/tagReader').readMetadata;
const getAlbumDetails = require('./helpers/groqAiHelper').getAlbumDetails;
const musicRepository = require('./repository/musicRepository'); // Import the music repository
const fs = require('fs').promises;


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
            results.push(tags);
        } catch (error) {
            console.error('Error reading tags for file:', file, error);
        }
    }
    return results;
};


// sample usage
(async () => {
    try {
        const dir = '/music/Collection/M2M/';
        try {
            const audioFolders = await findLeafAudioFolders(dir);
            console.log('Found audio folders:', audioFolders);

            // iterate over each folder and read tags
            for (const singleFolder of audioFolders) {
                const tagsResults = await readTagsForFiles(singleFolder);
                // console.log('Tags results:', tagsResults);


                const enrichedMusicDetails = await getAlbumDetails(singleFolder);
                // console.log('Enriched Music Details:', enrichedMusicDetails);

                let albumFolder = []; // Declare output using let, in case it needs to be re-assigned

                if (tagsResults.length === enrichedMusicDetails.metadata.length) {
                    albumFolder = singleFolder.map((filePath, index) => { // Assign the result of map to output
                        const matchingTagResult = tagsResults.find(tagResult => tagResult.file === filePath);
                        const matchingAiResult = enrichedMusicDetails.metadata.find(aiResult => aiResult.file === filePath);

                        const cleanedTagResult = matchingTagResult ? { ...matchingTagResult } : {};
                        const cleanedAiResult = matchingAiResult ? { ...matchingAiResult } : {};
                        delete cleanedTagResult.file;
                        delete cleanedAiResult.file;

                        return {
                            filePath: filePath,
                            existingMetadata: cleanedTagResult || {},
                            aiGenMetadata: cleanedAiResult || {},
                        };
                    });
                } else {
                    console.error(
                        "Error: tagsResults and enrichedMusicDetails.metadata have different lengths.",
                        "tagsResults length:",
                        tagsResults.length,
                        "enrichedMusicDetails length:",
                        enrichedMusicDetails.metadata.length
                    );
                    albumFolder = singleFolder.map(filePath => ({  // Assign the result of map to output
                        filePath: filePath,
                        existingMetadata: {},
                        aiGenMetadata: {},
                    }));
                }
                console.log("Final Output:", albumFolder);
                // Insert the albumFolder data into the database using the repository
                try {
                    const insertResult = await musicRepository.insertMany(albumFolder);
                    console.log("✅ Data inserted into database:", insertResult);
                } catch (dbError) {
                    console.error("❌ Error inserting data into database:", dbError);
                }

                // break; // Stop after processing the first folder for this example
            }
        } catch (error) {
            console.error('Error scanning directory:', error);
        }
    } catch (error) {
        console.error('Error during application operations', error);
    }
})();

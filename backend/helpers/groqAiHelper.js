const { Groq } = require('groq-sdk');
const fs = require('fs');
const path = require('path'); // Import the path module

const client = new Groq();

const musicPrompt = `
You are a music database API. You will be given some file names inside a folder. Return metadata information about 
the songs as an array, in the following JSON structure:

{
    "albumName": "string",
    "metadata": [
        {
            "file": "string", // Full path to the file
            "album": "string",
            "albumArtist": "string",
            "artists": ["string"], // List of Singers who performed this song
            "composers": ["string"], // List of composers
            "description": "string",  // Short description of the song (2-3 sentences)
            "diskNumber": number,
            "genres": ["string"],
            "labels": ["string"],
            "title": "string",
            "totalDisks": number,
            "totalTracks": number,
            "trackNumber": number,
            "year": number
        }
    ]
}

The response must:
1. Include ALL fields shown above
2. Use only the exact field names shown
3. Follow the exact data types specified
4. Contain ONLY the JSON object and nothing else

IMPORTANT: Do not include any explanatory text, markdown formatting, or code blocks.
`;

const getAlbumDetails = async (fileNameList, testMode = false) => {
    const userContent = `
File names:
${fileNameList.map(file => `- ${file}`).join('\n')}
`.trim();

    console.log('\nSending file names to Groq AI for enrichment...');

    if (testMode) {
        console.log("Test mode is ON. Returning static response.");
        // return JSON.parse(fs.readFileSync('./log/groqResponse-2025-05-11-11-07-23.json', 'utf-8'));
        return JSON.parse(fs.readFileSync('./log/groqResponse-2025-05-11-11-11-45.json', 'utf-8'));
    }


    try {
        const completion = await client.chat.completions.create({
            // model: "llama-3.3-70b-versatile",
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: musicPrompt },
                { role: "user", content: userContent },
            ],
        });

        const responseText = completion.choices[0]?.message?.content;

        if (!responseText) {
            throw new Error("Empty response from Groq AI");
        }

        const response = JSON.parse(responseText);

        // Generate timestamped filename
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');
        const timestamp = `${year}-${month}-${day}-${hour}-${minute}-${second}`;
        const logFileName = `./log/groqResponse-${timestamp}.json`;
        const logDir = path.dirname(logFileName); // Get the directory path

        // Create the directory if it doesn't exist
        if (!fs.existsSync(logDir)) {
            fs.mkdirSync(logDir, { recursive: true }); // Use recursive to create nested directories
        }

        fs.writeFileSync(logFileName, JSON.stringify(response, null, 2)); // Use the new filename
        return response;

    } catch (err) {
        console.error("Failed to parse AI response as JSON:", err);
        return { error: "Failed to parse response from AI", details: err.message };
    }
};

module.exports = { getAlbumDetails };

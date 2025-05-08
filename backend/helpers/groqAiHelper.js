const {Groq} = require('groq-sdk');

const client = new Groq();

const musicPrompt = `
You are a music database API. You will be given some file names inside a folder. Return metadata information about 
the songs as an array, in the following JSON structure:

{
    "albumName": "string",
    "metadata": [
        {
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

const getAlbumDetails = async (fileNameList) => {
    const userContent = `
File names:
${fileNameList.map(file => `- ${file}`).join('\n')}
`.trim();

    console.log('\nSending file names to Groq AI for enrichment...');

    try {
        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
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

        return JSON.parse(responseText);
        // return responseText;

    } catch (err) {
        console.error("Failed to parse AI response as JSON:", err);
        return { error: "Failed to parse response from AI", details: err.message };
    }
};


async function getMusicDetails(metadata) {
    const userContent = `
Song metadata:
- Title: ${metadata.title}
- Artist(s): ${metadata.artists.join(', ')}
- Album: ${metadata.album}
- Album Artist: ${metadata.albumArtist}
- Year: ${metadata.year}
- Genre(s): ${metadata.genres.join(', ')}
- Label(s): ${metadata.labels.join(', ')}
- Composer(s): ${metadata.composers.join(', ')}
- Duration (s): ${metadata.duration}
- Bitrate (bps): ${metadata.bitrate}
- Sample Rate (Hz): ${metadata.sampleRate}
- Number of Channels: ${metadata.numberOfChannels}
- Track: ${metadata.track.no} of ${metadata.track.of}
- Disk: ${metadata.disk.no} of ${metadata.disk.of}
- Cover Image Present: ${metadata.picture.length > 0 ? 'Yes' : 'No'}
`.trim();

    console.log('\nSending metadata to Groq AI for enrichment...');

    try {
        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            response_format: {type: "json_object"},
            messages: [
                {role: "system", content: musicPrompt},
                {role: "user", content: userContent},
            ],
        });

        const responseContent = completion.choices[0].message.content;
        console.log('\nRaw Groq Response:\n', responseContent);

        let musicData;
        try {
            musicData = JSON.parse(responseContent || "");
            console.log("\nSuccessfully parsed Groq response!");

            const expectedFields = [
                "title", "artist", "album", "album_artist", "year",
                "genre", "label", "composer", "duration_seconds",
                "bitrate_bps", "sample_rate_hz", "number_of_channels",
                "track_number", "total_tracks", "disk_number", "total_disks",
                "cover_present", "description", "similar_artists"
            ];

            const missingFields = expectedFields.filter(f => !(f in musicData));

            if (missingFields.length > 0) {
                console.warn(`⚠️ Missing fields in Groq response: ${missingFields.join(', ')}`);
            } else {
                console.log('✅ All expected fields are present!');
            }

            console.log('\n--- Enriched Music Details ---');
            console.dir(musicData, {depth: null});

            return musicData;
        } catch (parseError) {
            console.error('❌ Failed to parse Groq response as JSON:', parseError.message);
            return null;
        }

    } catch (err) {
        console.error('Groq API error:', err.message);
        return null;
    }
}

module.exports = {getMusicDetails, getAlbumDetails};

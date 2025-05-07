const { Groq } = require('groq-sdk');

const client = new Groq();

const musicPrompt = `
You are a music database API. Return enriched information about a song in the following JSON structure:

{
  "title": "string",
  "artist": "string",
  "album": "string",
  "album_artist": "string",
  "year": number,
  "genre": ["string"],
  "label": ["string"],
  "composer": ["string"],
  "duration_seconds": number,
  "bitrate_bps": number,
  "sample_rate_hz": number,
  "number_of_channels": number,
  "track_number": number,
  "total_tracks": number,
  "disk_number": number,
  "total_disks": number,
  "cover_present": boolean,
  "description": "string",  // Short description of the song (2-3 sentences)
  "similar_artists": ["string"]  // At least 3 similar artists
}

The response must:
1. Include ALL fields shown above
2. Use only the exact field names shown
3. Follow the exact data types specified
4. Contain ONLY the JSON object and nothing else

IMPORTANT: Do not include any explanatory text, markdown formatting, or code blocks.
`;

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
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: musicPrompt },
                { role: "user", content: userContent },
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
            console.dir(musicData, { depth: null });

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

module.exports = { getMusicDetails };

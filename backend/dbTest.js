const dbConnection = require("./db/connection");

const insertRecord = async (db) => {
    const collection = db.collection('music');  // Your collection name, e.g., 'music'

    // Record you want to insert
    const record = {
        file: '/app/music/Collection/M2M/Shades Of Purple/01 Don‘t Say You Love Me.mp3',
        album: 'Shades Of Purple',
        albumArtist: 'M2M',
        artists: ['M2M'],  // Example of an array for artists
        composers: [],
        description: 'Shades of Purple is an album by Norwegian duo M2M.',
        diskNumber: 1,
        genres: ['Pop'],  // Example genres array
        labels: ['Label1', 'Label2'],  // Example labels array
        title: 'Don‘t Say You Love Me',
        totalDisks: 1,
        trackNumber: 1,
        year: 2000
    };

    try {
        // Insert the document into the 'music' collection
        const result = await collection.insertOne(record);
        console.log("✅ Record inserted:", result);
    } catch (err) {
        console.error("❌ Error inserting record:", err);
    }
};

(async () => {
    let db;
    try {
        db = await dbConnection.open();
        const collection = await db.collection('music').find({}).toArray();

        console.log(collection);

        // await insertRecord(db);
    } catch (err) {
        console.error('Error during database operations', err);
    } finally {
        if (db) {
            await dbConnection.close();
        }
    }
})();
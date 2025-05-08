require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri);

const dbConnection = {
    open: async () => {
        try {
            await client.connect();
            console.log("✅ Connected to MongoDB");
            return client.db("audio_metadata_genius");
        } catch (err) {
            console.error("❌ Failed to connect to MongoDB:", err);
            process.exit(1);
        }
    },
    close: async () => {
        try {
            await client.close();
            console.log("✅ MongoDB connection closed");
        } catch (err) {
            console.error("❌ Failed to close MongoDB connection:", err);
        }
    },
}

module.exports = dbConnection;

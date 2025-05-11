const dbConnection = require('../db/connection'); // Adjust the path if needed

const MusicRepository = {
    /**
     * Inserts a single music record into the database.
     * @param {object} record - The music record to insert.
     * @returns {Promise<object>} - A Promise that resolves to the result of the insertOne operation.
     * @throws {Error} - If the database connection is not initialized or if the insertion fails.
     */
    async insertOne(record) {
        let db;
        try {
            db = await dbConnection.open();
            const collection = db.collection('music'); // Use your collection name
            const result = await collection.insertOne(record);
            console.log("✅ Record inserted:", result);
            return result;
        } catch (error) {
            console.error("❌ Error inserting record:", error);
            throw error; // Re-throw the error for the caller to handle
        } finally {
            if (db) {
                await dbConnection.close();
            }
        }
    },

    /**
     * Inserts multiple music records into the database.
     * @param {object[]} records - An array of music records to insert.
     * @returns {Promise<object>} - A Promise that resolves to the result of the insertMany operation.
     * @throws {Error} - If the database connection is not initialized or if the insertion fails.
     */
    async insertMany(records) {
        let db;
        try {
            db = await dbConnection.open();
            const collection = db.collection('music');
            const result = await collection.insertMany(records);
            console.log(`✅ Inserted ${result.insertedCount} records`);
            return result;
        } catch (error) {
            console.error("❌ Error inserting records:", error);
            throw error;
        } finally {
            if (db) {
                await dbConnection.close();
            }
        }
    },

    /**
     * Retrieves all music records from the database.
     * @returns {Promise<object[]>} - A Promise that resolves to an array of music records.
     * @throws {Error} - If the database connection is not initialized or if the retrieval fails.
     */
    async findAll() {
        let db;
        try {
            db = await dbConnection.open();
            const collection = db.collection('music');
            return await collection.find({}).toArray();
        } catch (error) {
            console.error("❌ Error finding records:", error);
            throw error;
        } finally {
            if (db) {
                await dbConnection.close();
            }
        }
    },

    /**
     * Retrieves a single music record by its file path.
     * @param {string} filePath - The file path of the music record to retrieve.
     * @returns {Promise<object | null>} - A Promise that resolves to the found music record or null if not found.
     * @throws {Error} - If the database connection is not initialized or if the retrieval fails.
     */
    async findOneByFilePath(filePath) {
        let db;
        try {
            db = await dbConnection.open();
            const collection = db.collection('music');
            return await collection.findOne({file: filePath});
        } catch (error) {
            console.error("❌ Error finding record by filePath:", error);
            throw error;
        } finally {
            if (db) {
                await dbConnection.close();
            }
        }
    },

    /**
     * Deletes all music records from the database.
     * @returns {Promise<object>} - A Promise that resolves to the result of the deleteMany operation.
     * @throws {Error} - If the database connection is not initialized or if the deletion fails.
     */
    async deleteAll() {
        let db;
        try {
            db = await dbConnection.open();
            const collection = db.collection('music');
            const result = await collection.deleteMany({});
            console.log(`✅ Deleted ${result.deletedCount} records`);
            return result;
        } catch (error) {
            console.error("❌ Error deleting all records:", error);
            throw error;
        } finally {
            if (db) {
                await dbConnection.close();
            }
        }
    }
};

module.exports = MusicRepository;

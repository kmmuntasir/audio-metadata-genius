const dbConnection = require("./db/connection");

(async () => {
    let db;
    try {
        db = await dbConnection.open();
        const collection = await db.collection('music').find({}).toArray();
        console.log(collection);
    } catch (err) {
        console.error('Error during database operations', err);
    } finally {
        if (db) {
            await dbConnection.close();
        }
    }
})();
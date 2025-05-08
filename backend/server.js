const app = require('./app');
const dbConnection = require('./db/connection');

const PORT = process.env.PORT || 3000;

dbConnection.open().then(db => {
    app.locals.db = db;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error("❌ Failed to connect to DB:", err);
    process.exit(1);
});
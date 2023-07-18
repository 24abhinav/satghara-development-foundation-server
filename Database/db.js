(async function() {
    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    });
    let isConnected = false;
    
    const dbConnection = async () => {
        try {
            await pool.connect();
            console.log('connected to DB');
            isConnected = true;
        } catch (err) {
            console.log(err);
        }
    };

    dbConnection();

    const runDBQuery = async (query) => {
        try {
            const data = await pool.query(query);
            return { ok: true, data };
        } catch (err) {
            console.log('error in query', err);
            return { ok: false, err };
        }
    };

    module.exports = { runDBQuery };
}());
(async function() {
    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.POSTGRES_URL + "?sslmode=require",
    });
    let isConnected = false;
    
    const dbConnection = async () => {
        try {
            console.log('start db connection');
            await pool.connect();
            console.log('connected to DB');
            isConnected = true;
        } catch (err) {
            console.log(err);
        }
    };

    pool.on('error', (err) => {
        console.log('pool error', err.message);
    });

    dbConnection();

    const runDBQuery = async (query) => {
        try {
            const { rows: response = [] } = await pool.query(query);
            return { ok: true, response };
        } catch (err) {
            console.log('error in query', err);
            return { ok: false, err };
        }
    };

    module.exports = { runDBQuery };
}());
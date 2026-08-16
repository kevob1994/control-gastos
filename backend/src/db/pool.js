const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('[db] DATABASE_URL no está definida. Configura tu archivo .env');
}

const isLocal =
  connectionString &&
  (connectionString.includes('localhost') ||
    connectionString.includes('127.0.0.1') ||
    process.env.PGSSL === 'disable');

const pool = new Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

module.exports = pool;

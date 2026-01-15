const { Pool } = require('pg');
const { database } = require('./index');

const pool = new Pool({
  connectionString: database.url,
  ssl: database.ssl,
  max: database.poolMax,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  connect: () => pool.connect(),
  end: () => pool.end(),
};

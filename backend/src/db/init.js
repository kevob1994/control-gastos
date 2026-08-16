const fs = require('fs');
const path = require('path');
const pool = require('./pool');

async function initDb() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
  console.log('[db] Esquema verificado/creado correctamente.');
}

if (require.main === module) {
  initDb()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('[db] Error inicializando el esquema:', err);
      process.exit(1);
    });
}

module.exports = initDb;

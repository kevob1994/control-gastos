const fs = require('fs');
const path = require('path');
const pool = require('./pool');

// Migra instalaciones previas que todavía tengan la columna duration_months
// (en meses) hacia la nueva columna duration_days (en días), sin perder datos.
async function migrateDurationToDays() {
  const { rows } = await pool.query(`
    SELECT
      EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='duration_months') AS has_months,
      EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='duration_days') AS has_days
  `);
  const { has_months, has_days } = rows[0];

  if (has_months && !has_days) {
    console.log('[db] Migrando duration_months -> duration_days...');
    await pool.query('ALTER TABLE products ADD COLUMN duration_days NUMERIC(6,1)');
    await pool.query('UPDATE products SET duration_days = ROUND(duration_months * 30)');
    await pool.query('ALTER TABLE products ALTER COLUMN duration_days SET NOT NULL');
    await pool.query('ALTER TABLE products DROP COLUMN duration_months');
    console.log('[db] Migración completada.');
  }
}

async function initDb() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
  await migrateDurationToDays();
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

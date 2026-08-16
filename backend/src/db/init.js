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

// Agrega la columna reference_month a instalaciones existentes que no la tengan.
async function migrateReferenceMonth() {
  const { rows } = await pool.query(`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name='settings' AND column_name='reference_month'
    ) AS has_reference_month
  `);
  if (!rows[0].has_reference_month) {
    console.log('[db] Agregando columna reference_month a settings...');
    await pool.query(
      "ALTER TABLE settings ADD COLUMN reference_month DATE NOT NULL DEFAULT date_trunc('month', CURRENT_DATE)::date"
    );
    console.log('[db] Columna reference_month agregada.');
  }
}

async function initDb() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
  await migrateDurationToDays();
  await migrateReferenceMonth();
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

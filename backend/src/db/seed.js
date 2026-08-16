const pool = require('./pool');
const initDb = require('./init');
const products = require('./seed_products.json');

async function seed() {
  await initDb();
  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM products');
  if (rows[0].count > 0) {
    console.log(`[seed] Ya existen ${rows[0].count} productos, no se insertan datos de ejemplo.`);
    return;
  }
  for (const p of products) {
    await pool.query(
      `INSERT INTO products (name, category, price_usd, duration_months, start_month, notes)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [p.name, p.category, p.price_usd, p.duration_months, p.start_month, p.notes]
    );
  }
  console.log(`[seed] Se insertaron ${products.length} productos desde el excel.`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[seed] Error:', err);
    process.exit(1);
  });

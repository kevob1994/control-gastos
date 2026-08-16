const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

function serialize(row) {
  return {
    ...row,
    price_usd: Number(row.price_usd),
    duration_days: Number(row.duration_days),
    start_month: row.start_month instanceof Date
      ? row.start_month.toISOString().slice(0, 10)
      : row.start_month,
  };
}

// GET /api/products
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM products ORDER BY name ASC');
    res.json(rows.map(serialize));
  } catch (err) {
    next(err);
  }
});

// POST /api/products
router.post('/', async (req, res, next) => {
  try {
    const { name, category = '', price_usd, duration_days, start_month, notes = '', active = true } = req.body;

    if (!name || price_usd == null || duration_days == null || !start_month) {
      return res.status(400).json({ error: 'Faltan campos requeridos: name, price_usd, duration_days, start_month' });
    }

    const { rows } = await pool.query(
      `INSERT INTO products (name, category, price_usd, duration_days, start_month, notes, active)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, category, price_usd, duration_days, start_month, notes, active]
    );
    res.status(201).json(serialize(rows[0]));
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, price_usd, duration_days, start_month, notes, active } = req.body;

    const { rows } = await pool.query(
      `UPDATE products SET
        name = COALESCE($1, name),
        category = COALESCE($2, category),
        price_usd = COALESCE($3, price_usd),
        duration_days = COALESCE($4, duration_days),
        start_month = COALESCE($5, start_month),
        notes = COALESCE($6, notes),
        active = COALESCE($7, active),
        updated_at = now()
       WHERE id = $8 RETURNING *`,
      [name, category, price_usd, duration_days, start_month, notes, active, id]
    );

    if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(serialize(rows[0]));
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

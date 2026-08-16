const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

function serialize(row) {
  return {
    dollar_rate: Number(row.dollar_rate),
    reference_month: row.reference_month instanceof Date
      ? row.reference_month.toISOString().slice(0, 10)
      : row.reference_month,
  };
}

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT dollar_rate, reference_month FROM settings WHERE id = 1');
    res.json(serialize(rows[0]));
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const { dollar_rate, reference_month } = req.body;

    if (dollar_rate != null && Number(dollar_rate) <= 0) {
      return res.status(400).json({ error: 'dollar_rate debe ser un número positivo' });
    }
    if (dollar_rate == null && reference_month == null) {
      return res.status(400).json({ error: 'Debes enviar dollar_rate y/o reference_month' });
    }

    const { rows } = await pool.query(
      `INSERT INTO settings (id, dollar_rate, reference_month, updated_at)
       VALUES (1, COALESCE($1, 1), COALESCE($2, date_trunc('month', CURRENT_DATE)::date), now())
       ON CONFLICT (id) DO UPDATE SET
         dollar_rate = COALESCE($1, settings.dollar_rate),
         reference_month = COALESCE($2, settings.reference_month),
         updated_at = now()
       RETURNING dollar_rate, reference_month`,
      [dollar_rate ?? null, reference_month ?? null]
    );
    res.json(serialize(rows[0]));
  } catch (err) {
    next(err);
  }
});

module.exports = router;

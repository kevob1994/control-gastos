const express = require('express');
const pool = require('../db/pool');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT dollar_rate FROM settings WHERE id = 1');
    res.json({ dollar_rate: Number(rows[0]?.dollar_rate ?? 1) });
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    const { dollar_rate } = req.body;
    if (dollar_rate == null || Number(dollar_rate) <= 0) {
      return res.status(400).json({ error: 'dollar_rate debe ser un número positivo' });
    }
    const { rows } = await pool.query(
      `INSERT INTO settings (id, dollar_rate, updated_at) VALUES (1, $1, now())
       ON CONFLICT (id) DO UPDATE SET dollar_rate = $1, updated_at = now()
       RETURNING dollar_rate`,
      [dollar_rate]
    );
    res.json({ dollar_rate: Number(rows[0].dollar_rate) });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const express = require('express');
const pool = require('../db/pool');
const { buildSummary } = require('../utils/expenses');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const monthsAhead = Number(req.query.months) || 12;
    const { rows } = await pool.query('SELECT * FROM products');
    const products = rows.map((r) => ({
      ...r,
      price_usd: Number(r.price_usd),
      duration_days: Number(r.duration_days),
    }));
    // El calendario siempre parte del mes real de hoy. Para "reiniciar" el
    // conteo, se reasigna el start_month de los productos (ver bulk-start-month).
    const summary = buildSummary(products, monthsAhead, new Date());
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

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
      duration_months: Number(r.duration_months),
    }));
    const summary = buildSummary(products, monthsAhead);
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

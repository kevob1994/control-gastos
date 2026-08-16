const express = require('express');
const pool = require('../db/pool');
const { buildSummary } = require('../utils/expenses');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const monthsAhead = Number(req.query.months) || 12;
    const [productsResult, settingsResult] = await Promise.all([
      pool.query('SELECT * FROM products'),
      pool.query('SELECT reference_month FROM settings WHERE id = 1'),
    ]);
    const products = productsResult.rows.map((r) => ({
      ...r,
      price_usd: Number(r.price_usd),
      duration_days: Number(r.duration_days),
    }));
    const referenceMonth = settingsResult.rows[0]?.reference_month || new Date();
    const summary = buildSummary(products, monthsAhead, new Date(referenceMonth));
    res.json(summary);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

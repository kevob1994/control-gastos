const express = require('express');
const cors = require('cors');
require('dotenv').config();

const initDb = require('./db/init');
const productsRouter = require('./routes/products');
const settingsRouter = require('./routes/settings');
const summaryRouter = require('./routes/summary');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/products', productsRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/summary', summaryRouter);

// Manejador de errores centralizado
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

async function start() {
  try {
    await initDb();
  } catch (err) {
    console.error('No se pudo inicializar la base de datos:', err.message);
  }
  app.listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
}

start();

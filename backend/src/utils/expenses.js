/**
 * Utilidades para calcular gastos mensuales a partir de productos recurrentes.
 * Cada producto tiene: price_usd, duration_months (puede ser decimal),
 * start_month (fecha, se usa el día 1 del mes de inicio del ciclo de compra).
 */

// Redondea la duración a un número entero de meses (mínimo 1) para poder
// ubicar las compras en un calendario mensual concreto.
function durationInWholeMonths(duration_months) {
  const rounded = Math.round(Number(duration_months));
  return rounded < 1 ? 1 : rounded;
}

// Costo mensual promedio de un producto (para presupuesto general).
function monthlyAverage(product) {
  const price = Number(product.price_usd);
  const duration = Number(product.duration_months) || 1;
  return price / duration;
}

function addMonths(date, months) {
  const d = new Date(date.getFullYear(), date.getMonth() + months, 1);
  return d;
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// Próxima fecha de compra (>= hoy) de un producto, a partir de start_month y duración.
function nextPurchase(product, from = new Date()) {
  const start = new Date(product.start_month);
  const duration = durationInWholeMonths(product.duration_months);
  const fromMonth = new Date(from.getFullYear(), from.getMonth(), 1);

  if (start >= fromMonth) return start;

  const monthsSinceStart =
    (fromMonth.getFullYear() - start.getFullYear()) * 12 +
    (fromMonth.getMonth() - start.getMonth());
  const cyclesPassed = Math.ceil(monthsSinceStart / duration);
  return addMonths(start, cyclesPassed * duration);
}

// Genera un calendario de gastos para los próximos `monthsAhead` meses,
// indicando qué productos se deben volver a comprar en cada mes y el total.
function buildCalendar(products, monthsAhead = 12, from = new Date()) {
  const startMonth = new Date(from.getFullYear(), from.getMonth(), 1);
  const months = [];
  for (let i = 0; i < monthsAhead; i++) {
    const date = addMonths(startMonth, i);
    months.push({ key: monthKey(date), date, items: [], total: 0 });
  }
  const monthsMap = new Map(months.map((m) => [m.key, m]));
  const horizonEnd = addMonths(startMonth, monthsAhead);

  for (const product of products) {
    if (product.active === false) continue;
    const start = new Date(product.start_month);
    const duration = durationInWholeMonths(product.duration_months);

    let purchaseDate = start;
    // Avanza hasta llegar dentro del horizonte visible (o antes si empieza más atrás).
    while (purchaseDate < startMonth) {
      purchaseDate = addMonths(purchaseDate, duration);
    }
    while (purchaseDate < horizonEnd) {
      const key = monthKey(purchaseDate);
      const bucket = monthsMap.get(key);
      if (bucket) {
        const price = Number(product.price_usd);
        bucket.items.push({
          id: product.id,
          name: product.name,
          price_usd: price,
        });
        bucket.total += price;
      }
      purchaseDate = addMonths(purchaseDate, duration);
    }
  }

  return months.map((m) => ({
    month: m.key,
    label: m.date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
    total: Math.round(m.total * 100) / 100,
    items: m.items,
  }));
}

function buildSummary(products, monthsAhead = 12, from = new Date()) {
  const active = products.filter((p) => p.active !== false);
  const totalMonthlyAverage = active.reduce((sum, p) => sum + monthlyAverage(p), 0);
  const calendar = buildCalendar(products, monthsAhead, from);
  const withNextPurchase = active.map((p) => ({
    id: p.id,
    name: p.name,
    next_purchase: nextPurchase(p, from).toISOString().slice(0, 10),
  }));

  return {
    total_monthly_average_usd: Math.round(totalMonthlyAverage * 100) / 100,
    total_products: active.length,
    calendar,
    next_purchases: withNextPurchase.sort((a, b) => a.next_purchase.localeCompare(b.next_purchase)),
  };
}

module.exports = { monthlyAverage, nextPurchase, buildCalendar, buildSummary, durationInWholeMonths };

/**
 * Utilidades para calcular gastos mensuales a partir de productos recurrentes.
 * Cada producto tiene: price_usd, duration_days (días exactos que dura una compra),
 * start_month (fecha del primer día en que se compra / empieza a consumirse).
 *
 * Lógica clave: cuando un producto se agota, se asume que se vuelve a comprar
 * COMPLETO (precio entero) en el mes calendario donde cae esa fecha de
 * agotamiento — nunca se prorratea el precio entre los días restantes.
 */

const DAYS_PER_MONTH = 30;

// Costo mensual promedio de un producto (referencia de presupuesto, no se usa
// para el calendario mes a mes).
function monthlyAverage(product) {
  const price = Number(product.price_usd);
  const durationDays = Number(product.duration_days) || DAYS_PER_MONTH;
  const durationMonths = durationDays / DAYS_PER_MONTH;
  return price / durationMonths;
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + Math.round(days));
  return d;
}

function monthKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function firstDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

// Próxima fecha de compra (>= hoy) de un producto, avanzando día a día por
// ciclos completos de duration_days a partir de start_month.
function nextPurchase(product, from = new Date()) {
  const duration = Number(product.duration_days) || DAYS_PER_MONTH;
  let purchaseDate = new Date(product.start_month);
  while (purchaseDate < from) {
    purchaseDate = addDays(purchaseDate, duration);
  }
  return purchaseDate;
}

// Genera un calendario de gastos para los próximos `monthsAhead` meses,
// indicando qué productos se deben volver a comprar en cada mes y el total.
// Cada compra se cuenta completa en el mes donde cae la fecha exacta de
// agotamiento (start_month + k * duration_days).
function buildCalendar(products, monthsAhead = 12, from = new Date()) {
  const startMonth = firstDayOfMonth(from);
  const months = [];
  for (let i = 0; i < monthsAhead; i++) {
    const date = new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1);
    months.push({ key: monthKey(date), date, items: [], total: 0 });
  }
  const monthsMap = new Map(months.map((m) => [m.key, m]));
  const horizonEnd = new Date(startMonth.getFullYear(), startMonth.getMonth() + monthsAhead, 1);

  for (const product of products) {
    if (product.active === false) continue;
    const duration = Number(product.duration_days) || DAYS_PER_MONTH;
    let purchaseDate = new Date(product.start_month);

    // Avanza hasta llegar dentro del horizonte visible (o antes si empieza más atrás).
    while (purchaseDate < startMonth) {
      purchaseDate = addDays(purchaseDate, duration);
    }
    while (purchaseDate < horizonEnd) {
      const key = monthKey(purchaseDate);
      const bucket = monthsMap.get(key);
      if (bucket) {
        const price = Number(product.price_usd);
        bucket.items.push({
          id: product.id,
          name: product.name,
          category: product.category || '',
          price_usd: price,
        });
        bucket.total += price;
      }
      purchaseDate = addDays(purchaseDate, duration);
    }
  }

  return months.map((m) => ({
    month: m.key,
    label: m.date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }),
    total: Math.round(m.total * 100) / 100,
    items: m.items.sort((a, b) => a.name.localeCompare(b.name)),
  }));
}

function buildSummary(products, monthsAhead = 12, from = new Date()) {
  const active = products.filter((p) => p.active !== false);
  const calendar = buildCalendar(products, monthsAhead, from);
  // Gasto real del mes de referencia: la suma completa de los productos que
  // tocan comprarse ese mes (no se prorratea por los días restantes).
  const currentMonthTotal = calendar[0]?.total ?? 0;
  const withNextPurchase = active.map((p) => ({
    id: p.id,
    name: p.name,
    next_purchase: nextPurchase(p, from).toISOString().slice(0, 10),
  }));

  return {
    total_current_month_usd: currentMonthTotal,
    current_month_label: calendar[0]?.label ?? '',
    total_products: active.length,
    calendar,
    next_purchases: withNextPurchase.sort((a, b) => a.next_purchase.localeCompare(b.next_purchase)),
  };
}

module.exports = { monthlyAverage, nextPurchase, buildCalendar, buildSummary };

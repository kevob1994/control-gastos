export default function SummaryCards({ summary, rate }) {
  if (!summary) return null;
  const usd = summary.total_monthly_average_usd;
  const bs = usd * rate;

  return (
    <div className="summary-grid">
      <div className="summary-card">
        <div className="label">📊 Gasto mensual promedio</div>
        <div className="value">${usd.toFixed(2)}</div>
        <div className="sub">≈ Bs {bs.toLocaleString('es-VE', { maximumFractionDigits: 2 })}</div>
      </div>
      <div className="summary-card">
        <div className="label">💊 Productos activos</div>
        <div className="value">{summary.total_products}</div>
        <div className="sub">registrados actualmente</div>
      </div>
      <div className="summary-card">
        <div className="label">🗓️ Próxima compra</div>
        <div className="value" style={{ fontSize: 18 }}>
          {summary.next_purchases[0]
            ? `${summary.next_purchases[0].name}`
            : 'Sin productos'}
        </div>
        <div className="sub">
          {summary.next_purchases[0]?.next_purchase || '—'}
        </div>
      </div>
    </div>
  );
}

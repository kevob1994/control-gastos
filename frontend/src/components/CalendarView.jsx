export default function CalendarView({ calendar, rate }) {
  if (!calendar?.length) return null;

  return (
    <div className="calendar-scroll">
      {calendar.map((m, i) => (
        <div key={m.month} className={`calendar-card ${i === 0 ? 'current' : ''}`}>
          <div className="month-label">{m.label}</div>
          <div className="month-total">
            ${m.total.toFixed(2)}
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-soft)' }}>
              Bs {(m.total * rate).toLocaleString('es-VE', { maximumFractionDigits: 0 })}
            </div>
          </div>
          {m.items.length === 0 ? (
            <div className="empty">Sin compras</div>
          ) : (
            <ul>
              {m.items.map((it) => (
                <li key={it.id}>• {it.name}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

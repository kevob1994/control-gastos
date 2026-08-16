export default function CalendarView({ calendar, rate }) {
  if (!calendar?.length) return null;

  return (
    <div className="calendar-scroll">
      {calendar.map((m, i) => (
        <div key={m.month} className={`calendar-card ${i === 0 ? 'current' : ''}`}>
          <div className="month-label">{m.label}</div>

          {m.items.length === 0 ? (
            <div className="empty">Sin compras este mes</div>
          ) : (
            <table className="calendar-table">
              <tbody>
                {m.items.map((it) => (
                  <tr key={it.id}>
                    <td>
                      {it.name}
                      {it.category ? <div className="calendar-item-category">{it.category}</div> : null}
                    </td>
                    <td className="calendar-item-price">${it.price_usd.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>Total</td>
                  <td className="calendar-item-price">${m.total.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={2} className="calendar-total-bs">
                    ≈ Bs {(m.total * rate).toLocaleString('es-VE', { maximumFractionDigits: 0 })}
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}

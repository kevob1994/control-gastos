export default function ProductTable({ products, rate, onEdit, onDelete }) {
  if (products.length === 0) {
    return (
      <div className="product-table-wrap">
        <div className="empty-state">
          <span className="emoji">🧴</span>
          Aún no has agregado productos. ¡Agrega el primero!
        </div>
      </div>
    );
  }

  return (
    <div className="product-table-wrap">
      <table className="product-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Duración</th>
            <th>Mes de inicio</th>
            <th>Mensual (USD/Bs)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const monthly = p.price_usd / (p.duration_months || 1);
            return (
              <tr key={p.id}>
                <td>
                  <strong>{p.name}</strong>
                  {p.notes ? <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>{p.notes}</div> : null}
                </td>
                <td>{p.category ? <span className="pill">{p.category}</span> : '—'}</td>
                <td>
                  ${p.price_usd.toFixed(2)}
                  <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>
                    Bs {(p.price_usd * rate).toLocaleString('es-VE', { maximumFractionDigits: 2 })}
                  </div>
                </td>
                <td>{p.duration_months} {p.duration_months === 1 ? 'mes' : 'meses'}</td>
                <td>{formatMonth(p.start_month)}</td>
                <td>
                  ${monthly.toFixed(2)}
                  <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>
                    Bs {(monthly * rate).toLocaleString('es-VE', { maximumFractionDigits: 2 })}
                  </div>
                </td>
                <td>
                  <div className="actions-cell">
                    <button className="btn-icon edit" title="Editar" onClick={() => onEdit(p)}>✏️</button>
                    <button className="btn-icon danger" title="Eliminar" onClick={() => onDelete(p)}>🗑️</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function formatMonth(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
}

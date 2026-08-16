import { useState, useEffect } from 'react';

export default function ReferenceMonthBar({ referenceMonth, onApply }) {
  const [value, setValue] = useState((referenceMonth || '').slice(0, 7));

  useEffect(() => setValue((referenceMonth || '').slice(0, 7)), [referenceMonth]);

  const handleApply = () => {
    if (!value) return;
    const confirmed = window.confirm(
      'Esto va a reasignar el mes de inicio de TODOS los productos a este mes. ¿Continuar?'
    );
    if (confirmed) onApply(`${value}-01`);
  };

  return (
    <div className="rate-bar">
      <label>🗓️ Reasignar mes de inicio a todos:</label>
      <input type="month" value={value} onChange={(e) => setValue(e.target.value)} />
      <button type="button" className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 13 }} onClick={handleApply}>
        Aplicar
      </button>
    </div>
  );
}

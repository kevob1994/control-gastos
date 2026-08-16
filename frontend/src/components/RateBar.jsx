import { useState, useEffect } from 'react';

export default function RateBar({ rate, onSave }) {
  const [value, setValue] = useState(rate);

  useEffect(() => setValue(rate), [rate]);

  const handleBlur = () => {
    const num = Number(value);
    if (num > 0 && num !== rate) onSave(num);
  };

  return (
    <div className="rate-bar">
      <label>💵 Tasa del dólar hoy:</label>
      <input
        type="number"
        step="0.01"
        min="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
      />
      <span style={{ fontSize: 12, color: 'var(--text-soft)', paddingRight: 6 }}>Bs/USD</span>
    </div>
  );
}

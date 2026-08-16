export default function ReferenceMonthBar({ referenceMonth, onSave }) {
  const value = (referenceMonth || '').slice(0, 7);

  const handleChange = (e) => {
    const newValue = e.target.value;
    if (newValue) onSave(`${newValue}-01`);
  };

  return (
    <div className="rate-bar">
      <label>🗓️ Mes de comienzo:</label>
      <input type="month" value={value} onChange={handleChange} />
    </div>
  );
}

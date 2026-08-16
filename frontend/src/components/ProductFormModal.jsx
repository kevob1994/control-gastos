import { useState } from 'react';

const emptyForm = {
  name: '',
  category: '',
  price_usd: '',
  duration_months: '',
  start_month: currentMonth(),
  notes: '',
};

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

export default function ProductFormModal({ initialData, onClose, onSubmit }) {
  const [form, setForm] = useState(
    initialData
      ? {
          name: initialData.name,
          category: initialData.category || '',
          price_usd: initialData.price_usd,
          duration_months: initialData.duration_months,
          start_month: initialData.start_month,
          notes: initialData.notes || '',
        }
      : emptyForm
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.price_usd || !form.duration_months || !form.start_month) {
      setError('Completa producto, precio, duración y mes de inicio.');
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        price_usd: Number(form.price_usd),
        duration_months: Number(form.duration_months),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>{initialData ? '✏️ Editar producto' : '➕ Nuevo producto'}</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Producto</label>
            <input type="text" placeholder="Ej. Euthyrox 50mcg" value={form.name} onChange={handleChange('name')} />
          </div>
          <div className="form-field">
            <label>Categoría (opcional)</label>
            <input type="text" placeholder="Ej. Tensión, Suplemento..." value={form.category} onChange={handleChange('category')} />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Precio (USD)</label>
              <input type="number" step="0.01" min="0" placeholder="0.00" value={form.price_usd} onChange={handleChange('price_usd')} />
            </div>
            <div className="form-field">
              <label>Duración (meses)</label>
              <input type="number" step="0.1" min="0.1" placeholder="1" value={form.duration_months} onChange={handleChange('duration_months')} />
            </div>
          </div>
          <div className="form-field">
            <label>Mes de inicio del ciclo</label>
            <input type="month" value={form.start_month.slice(0, 7)} onChange={(e) => setForm({ ...form, start_month: `${e.target.value}-01` })} />
          </div>
          <div className="form-field">
            <label>Notas (opcional)</label>
            <input type="text" placeholder="Nombre genérico, farmacia, etc." value={form.notes} onChange={handleChange('notes')} />
          </div>

          {error && <div style={{ color: 'var(--rose)', fontSize: 13, fontWeight: 600 }}>{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

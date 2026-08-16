import { useState } from 'react';

const CATEGORY_SUGGESTIONS = ['Medicinas', 'Mercado', 'Servicios', 'Transporte', 'Aseo personal', 'Otros'];

function nextMonth() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

const emptyForm = {
  name: '',
  category: '',
  price_usd: '',
  duration_days: '',
  start_month: nextMonth(),
  notes: '',
};

export default function ProductFormModal({ initialData, onClose, onSubmit }) {
  const [form, setForm] = useState(
    initialData
      ? {
          name: initialData.name,
          category: initialData.category || '',
          price_usd: initialData.price_usd,
          duration_days: initialData.duration_days,
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
    if (!form.name || !form.price_usd || !form.duration_days || !form.start_month) {
      setError('Completa producto, precio, duración y mes de inicio.');
      return;
    }
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        price_usd: Number(form.price_usd),
        duration_days: Number(form.duration_days),
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
        <h2>{initialData ? '✏️ Editar gasto' : '➕ Nuevo gasto'}</h2>
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="form-field">
            <label>Producto o gasto</label>
            <input type="text" placeholder="Ej. Euthyrox 50mcg, Mercado semanal, Gas..." value={form.name} onChange={handleChange('name')} />
          </div>
          <div className="form-field">
            <label>Categoría (opcional)</label>
            <input
              type="text"
              list="category-suggestions"
              placeholder="Ej. Medicinas, Mercado, Servicios..."
              value={form.category}
              onChange={handleChange('category')}
            />
            <datalist id="category-suggestions">
              {CATEGORY_SUGGESTIONS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Precio (USD)</label>
              <input type="number" step="0.01" min="0" placeholder="0.00" value={form.price_usd} onChange={handleChange('price_usd')} />
            </div>
            <div className="form-field">
              <label>Duración (días)</label>
              <input type="number" step="1" min="1" placeholder="30" value={form.duration_days} onChange={handleChange('duration_days')} />
            </div>
          </div>
          <div className="form-field">
            <label>Mes de inicio del ciclo</label>
            <input type="month" value={form.start_month.slice(0, 7)} onChange={(e) => setForm({ ...form, start_month: `${e.target.value}-01` })} />
          </div>
          <div className="form-field">
            <label>Notas (opcional)</label>
            <input type="text" placeholder="Nombre genérico, tienda, etc." value={form.notes} onChange={handleChange('notes')} />
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

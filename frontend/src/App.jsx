import { useEffect, useState, useCallback } from 'react';
import { api } from './lib/api';
import RateBar from './components/RateBar';
import SummaryCards from './components/SummaryCards';
import CalendarView from './components/CalendarView';
import ProductTable from './components/ProductTable';
import ProductFormModal from './components/ProductFormModal';
import ConfirmDialog from './components/ConfirmDialog';

export default function App() {
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [rate, setRate] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [toast, setToast] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  };

  const loadAll = useCallback(async () => {
    setLoadError('');
    try {
      const [p, s, r] = await Promise.all([api.getProducts(), api.getSummary(12), api.getSettings()]);
      setProducts(p);
      setSummary(s);
      setRate(r.dollar_rate);
    } catch (err) {
      setLoadError('No se pudo conectar con el servidor. ¿Está corriendo el backend?');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const refreshSummary = async () => {
    const s = await api.getSummary(12);
    setSummary(s);
  };

  const handleSaveRate = async (newRate) => {
    setRate(newRate);
    await api.updateSettings({ dollar_rate: newRate });
    showToast('Tasa actualizada 💵');
  };

  const handleCreateOrUpdate = async (data) => {
    if (editingProduct) {
      await api.updateProduct(editingProduct.id, data);
      showToast('Producto actualizado ✨');
    } else {
      await api.createProduct(data);
      showToast('Producto agregado 🎉');
    }
    setShowForm(false);
    setEditingProduct(null);
    const p = await api.getProducts();
    setProducts(p);
    await refreshSummary();
  };

  const handleDelete = async () => {
    await api.deleteProduct(deletingProduct.id);
    setDeletingProduct(null);
    showToast('Producto eliminado 🗑️');
    const p = await api.getProducts();
    setProducts(p);
    await refreshSummary();
  };

  if (loading) {
    return (
      <div className="app-shell">
        <div className="loading-state">Cargando gastos de la abuelita... 💛</div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-title">
          <span className="emoji">👵🏻💊</span>
          <div>
            <h1>Gastos de la Abuelita</h1>
            <p>Control mensual de medicinas, mercado y otros gastos</p>
          </div>
        </div>
        <RateBar rate={rate} onSave={handleSaveRate} />
      </header>

      {loadError && (
        <div className="card" style={{ marginBottom: 20, borderColor: 'var(--rose)', color: 'var(--rose)' }}>
          {loadError}
        </div>
      )}

      <SummaryCards summary={summary} rate={rate} />

      <div className="section-title">
        <h2>🗓️ Próximos meses</h2>
      </div>
      <CalendarView calendar={summary?.calendar} rate={rate} />

      <div className="section-title">
        <h2>🛒 Productos y gastos</h2>
        <button className="btn btn-primary" onClick={() => { setEditingProduct(null); setShowForm(true); }}>
          + Agregar gasto
        </button>
      </div>
      <ProductTable
        products={products}
        rate={rate}
        onEdit={(p) => { setEditingProduct(p); setShowForm(true); }}
        onDelete={(p) => setDeletingProduct(p)}
      />

      {showForm && (
        <ProductFormModal
          initialData={editingProduct}
          onClose={() => { setShowForm(false); setEditingProduct(null); }}
          onSubmit={handleCreateOrUpdate}
        />
      )}

      {deletingProduct && (
        <ConfirmDialog
          title="¿Eliminar producto?"
          message={`Se eliminará "${deletingProduct.name}" y dejará de contarse en los gastos mensuales.`}
          onCancel={() => setDeletingProduct(null)}
          onConfirm={handleDelete}
        />
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

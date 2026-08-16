export default function ConfirmDialog({ title, message, onCancel, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" style={{ maxWidth: 380 }} onClick={(e) => e.stopPropagation()}>
        <h2>{title}</h2>
        <p style={{ color: 'var(--text-soft)', marginTop: -6 }}>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-primary" style={{ background: 'var(--rose)' }} onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}

const ConfirmModal = ({ open, title, message, confirmLabel, confirmVariant, onConfirm, onCancel, loading }) => {
  if (!open) return null;
  const btnColor = confirmVariant === "danger"
    ? "bg-red-500/15 text-red-400 border-red-500/20 hover:bg-red-500/25"
    : "bg-brand-500/15 text-brand-300 border-brand-500/20 hover:bg-brand-500/25";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-surface-800 border border-surface-700/50 rounded-2xl p-6 w-full max-w-md shadow-glass animate-scale-in">
        <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-surface-400 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onCancel} disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-surface-300 hover:text-white hover:bg-surface-700 transition disabled:opacity-40">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={loading}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition border disabled:opacity-40 ${btnColor}`}>
            {loading ? "Processing..." : confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

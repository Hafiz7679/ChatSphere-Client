const DataTable = ({ columns, data, loading, emptyMessage, page, totalPages, onPageChange }) => {
  return (
    <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl shadow-glass animate-fade-in overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-700/30">
              {columns.map((col) => (
                <th key={col.key} className={`text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider ${col.hidden}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-700/20">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className={`px-5 py-4 ${col.hidden}`}>
                      <div className="h-4 bg-surface-700 rounded animate-pulse" style={{ width: col.width || "80%" }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center">
                  <p className="text-sm text-surface-500 font-medium">{emptyMessage || "No data found"}</p>
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={row._id || i} className="hover:bg-surface-800/30 transition">
                  {columns.map((col) => (
                    <td key={col.key} className={`px-5 py-4 ${col.hidden}`}>
                      {col.render ? col.render(row) : (
                        <span className="text-sm text-white">{row[col.key]}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-4 border-t border-surface-700/30">
          <p className="text-xs text-surface-500">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-surface-800/50 text-surface-300 border border-surface-700/30 hover:bg-surface-700/50 transition disabled:opacity-40 disabled:cursor-not-allowed">
              Previous
            </button>
            <button type="button" onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-surface-800/50 text-surface-300 border border-surface-700/30 hover:bg-surface-700/50 transition disabled:opacity-40 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;

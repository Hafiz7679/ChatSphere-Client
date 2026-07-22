const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500/10 to-accent-500/10 flex items-center justify-center">
          {typeof icon === "string" ? (
            <span className="text-3xl">{icon}</span>
          ) : (
            <div className="text-brand-500 w-8 h-8">{icon}</div>
          )}
        </div>
      )}
      <div>
        <p className="text-lg font-semibold text-white">{title}</p>
        {description && (
          <p className="text-sm text-surface-400 mt-1 max-w-xs">{description}</p>
        )}
      </div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white hover:from-brand-600 hover:to-accent-600 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-200"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

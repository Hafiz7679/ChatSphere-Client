const EmptyState = ({ icon, title, description, action, compact }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 px-6 text-center animate-fade-in ${compact ? "py-8" : "h-full"}`}>
      {icon && (
        <div className={`${compact ? "w-12 h-12" : "w-16 h-16"} rounded-full bg-gradient-to-br from-brand-500/10 to-accent-500/10 flex items-center justify-center`}>
          {typeof icon === "string" ? (
            <span className={compact ? "text-2xl" : "text-3xl"}>{icon}</span>
          ) : (
            <div className={`text-brand-500 ${compact ? "w-6 h-6" : "w-8 h-8"}`}>{icon}</div>
          )}
        </div>
      )}
      <div>
        <p className={`${compact ? "text-base" : "text-lg"} font-semibold text-white`}>{title}</p>
        {description && (
          <p className={`text-sm text-surface-400 mt-1 ${compact ? "max-w-64" : "max-w-xs"}`}>{description}</p>
        )}
      </div>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white hover:from-brand-600 hover:to-accent-600 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

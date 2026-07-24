const StatsCard = ({ label, value, icon, gradient, loading }) => (
  <div className={`relative overflow-hidden rounded-2xl p-5 ${gradient} shadow-lg animate-fade-in`}>
    <div className="absolute top-3 right-3 opacity-20">{icon}</div>
    {loading ? (
      <div className="space-y-2">
        <div className="h-3 w-20 bg-white/20 rounded animate-pulse" />
        <div className="h-8 w-16 bg-white/20 rounded animate-pulse" />
      </div>
    ) : (
      <>
        <p className="text-sm font-medium text-white/80">{label}</p>
        <p className="text-3xl font-bold text-white mt-1">
          {typeof value === "number" ? value.toLocaleString() : value ?? "—"}
        </p>
      </>
    )}
  </div>
);

export default StatsCard;

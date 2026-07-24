const LoadingScreen = ({ message }) => {
  return (
    <div className="fixed inset-0 z-[90] bg-navy-950/80 backdrop-blur-md flex items-center justify-center animate-fade-in">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-surface-700/50 border-t-brand-500 animate-spin" />
        {message && (
          <p className="text-sm text-surface-400 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;

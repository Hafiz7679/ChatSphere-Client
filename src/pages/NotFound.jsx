import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy-800 bg-grid flex items-center justify-center relative">
      <div className="fixed inset-0 bg-glow pointer-events-none" />
      <div className="relative text-center px-6 animate-fade-in">
        <h1 className="text-9xl font-black bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500 bg-clip-text text-transparent leading-none mb-4">
          404
        </h1>
        <p className="text-lg text-surface-400 font-medium mb-2">Page not found</p>
        <p className="text-sm text-surface-500 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:from-brand-600 hover:to-accent-600 transition-all active:scale-[0.98]"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;

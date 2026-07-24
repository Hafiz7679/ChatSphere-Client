import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      fetch("/api/log/error", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: error.message, stack: error.stack, url: window.location.href, userId: user?._id }),
      }).catch(() => {});
    } catch {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-red-400">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M12 8v4M12 16h.01" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-surface-400 text-sm mb-2">An unexpected error occurred. Please try refreshing the page.</p>
            <details className="text-left mb-4">
              <summary className="text-surface-400 text-xs cursor-pointer hover:text-surface-300">Error details</summary>
              <pre className="mt-2 p-3 bg-navy-900 rounded-lg text-red-300 text-xs overflow-auto max-h-40">{this.state.error?.message || "Unknown error"}</pre>
            </details>
            <button onClick={() => window.location.reload()} className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold hover:shadow-lg hover:shadow-brand-500/25 transition">
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

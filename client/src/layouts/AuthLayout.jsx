import ThemeToggle from "../components/ThemeToggle/ThemeToggle";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-navy-800 bg-grid flex items-center justify-center px-4 py-8">
      <div className="fixed inset-0 bg-glow pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-72 h-72 bg-brand-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 bg-accent-500/10 rounded-full blur-[140px]" />
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <div className="relative w-full max-w-[420px] animate-fade-in">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

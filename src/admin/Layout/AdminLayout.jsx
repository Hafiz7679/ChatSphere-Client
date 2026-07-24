import { useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { LayoutDashboard, Users, BarChart3, FileText, Zap, Settings, ShieldCheck, ArrowLeft, LogOut, Menu } from "lucide-react";

const NavItem = ({ href, label, icon: Icon, badge, active, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(href)}
    aria-label={label}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 ${
      active
        ? "bg-brand-500/15 text-brand-300 border border-brand-500/20"
        : "text-surface-400 hover:text-white hover:bg-surface-800/50 border border-transparent"
    }`}
  >
    {Icon && <Icon className="w-4 h-4 shrink-0" />}
    <span className="flex-1 text-left">{label}</span>
    {badge !== undefined && (
      <span className="px-1.5 py-0.5 rounded-md bg-brand-500/20 text-brand-300 text-[10px] font-bold">{badge}</span>
    )}
  </button>
);

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/admin/reports", label: "Reports", icon: FileText },
    { href: "/admin/health", label: "Server Health", icon: Zap },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ];

  const handleNav = (href) => {
    navigate(href);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  const pageTitle = navItems.find((i) => i.href === location.pathname)?.label || "Admin";

  return (
    <div className="min-h-screen bg-navy-800 flex">
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 min-h-screen bg-surface-900/50 border-r border-surface-700/30 p-5 flex flex-col shrink-0 transform transition-transform duration-200 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-600/20">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">Admin Panel</span>
        </div>

        <nav className="space-y-1 flex-1" role="navigation" aria-label="Admin navigation">
          {navItems.map((item) => (
            <NavItem key={item.href} {...item} active={location.pathname === item.href} onClick={handleNav} />
          ))}
        </nav>

        <div className="pt-4 border-t border-surface-700/30 space-y-1">
          <button type="button" onClick={() => navigate("/chat")} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-surface-400 hover:text-white hover:bg-surface-800/50 transition border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50">
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </button>
          <button type="button" aria-label="Logout" onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition border border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-navy-800/80 backdrop-blur-xl border-b border-surface-700/30 px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Open sidebar menu" onClick={() => setMobileOpen(true)} className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50">
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="text-lg font-bold text-white">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-brand-500/20 to-accent-500/20 text-brand-300 text-xs font-semibold border border-brand-500/20">Admin</span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

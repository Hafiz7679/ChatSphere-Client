import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminStats, getAdminHealth, getUsers } from "../api/api";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar/Avatar";

const StatCard = ({ label, value, icon, gradient, loading }) => (
  <div className={`relative overflow-hidden rounded-2xl p-5 ${gradient} shadow-lg animate-fade-in`}>
    <div className="absolute top-3 right-3 opacity-20">
      {icon}
    </div>
    {loading ? (
      <div className="space-y-2">
        <div className="h-3 w-20 bg-white/20 rounded animate-pulse" />
        <div className="h-8 w-16 bg-white/20 rounded animate-pulse" />
      </div>
    ) : (
      <>
        <p className="text-sm font-medium text-white/80">{label}</p>
        <p className="text-3xl font-bold text-white mt-1">{value}</p>
      </>
    )}
  </div>
);

const HealthBar = ({ label, value, color }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between text-xs">
      <span className="text-surface-400">{label}</span>
      <span className="text-white font-medium">{value}%</span>
    </div>
    <div className="h-2 bg-surface-700/50 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-1000 ${color}`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState("dashboard");

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  useEffect(() => {
    if (!user || user.role !== "admin") { navigate("/chat"); return; }
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const [statsRes, healthRes, usersRes] = await Promise.all([
          getAdminStats(),
          getAdminHealth(),
          getUsers({ page: 1, limit: 5 }),
        ]);
        setStats(statsRes.data);
        setHealth(healthRes.data);
        setRecentUsers(usersRes.data?.users || usersRes.data?.data || []);
      } catch (err) {
        setError(true);
        toast.error("Failed to load admin data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  const messagesData = stats?.messagesByDay || [];
  const maxMsg = Math.max(...messagesData.map((m) => m.count), 1);

  if (!user || user.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-navy-800">
      <div className="flex">
        <aside className="w-64 min-h-screen bg-surface-900/50 border-r border-surface-700/30 p-5 hidden lg:flex flex-col shrink-0">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-base font-bold text-white tracking-tight">Admin Panel</span>
          </div>
          <nav className="space-y-1 flex-1">
            {[
              { id: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
              { id: "users", label: "Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" },
              { id: "health", label: "Health", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  tab === id
                    ? "bg-brand-500/15 text-brand-300 border border-brand-500/20"
                    : "text-surface-400 hover:text-white hover:bg-surface-800/50 border border-transparent"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
                {label}
              </button>
            ))}
          </nav>
          <div className="pt-4 border-t border-surface-700/30">
            <button
              type="button"
              onClick={() => navigate("/chat")}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-surface-400 hover:text-white hover:bg-surface-800/50 transition border border-transparent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to App
            </button>
          </div>
        </aside>

        <div className="flex-1 min-h-screen">
          <header className="sticky top-0 z-30 bg-navy-800/80 backdrop-blur-xl border-b border-surface-700/30 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => navigate("/chat")} className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-800 transition">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-lg font-bold text-white capitalize">{tab}</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-brand-500/20 to-accent-500/20 text-brand-300 text-xs font-semibold border border-brand-500/20">
                Admin
              </span>
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  navigate("/login");
                }}
                className="px-4 py-2 rounded-xl text-sm text-surface-400 hover:text-red-400 hover:bg-red-500/10 transition border border-transparent"
              >
                Logout
              </button>
            </div>
          </header>

          <div className="p-6">
            {error && !loading ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 text-red-400">
                  <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" />
                </svg>
                <p className="text-surface-400 text-sm">Failed to load data</p>
                <button type="button" onClick={() => window.location.reload()} className="px-5 py-2 rounded-xl bg-brand-500/15 text-brand-300 text-sm font-medium hover:bg-brand-500/25 transition border border-brand-500/20">
                  Retry
                </button>
              </div>
            ) : tab === "dashboard" ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatCard
                    label="Total Users"
                    value={stats?.totalUsers ?? "—"}
                    loading={loading}
                    gradient="bg-gradient-to-br from-brand-600/80 to-brand-800/80"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>}
                  />
                  <StatCard
                    label="Online Users"
                    value={stats?.onlineUsers ?? "—"}
                    loading={loading}
                    gradient="bg-gradient-to-br from-emerald-600/80 to-emerald-800/80"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-16 h-16"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>}
                  />
                  <StatCard
                    label="Messages Sent"
                    value={stats?.totalMessages ?? "—"}
                    loading={loading}
                    gradient="bg-gradient-to-br from-violet-600/80 to-violet-800/80"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.06 0-2.077-.163-3.02-.463L3 21l1.395-3.72C3.512 16.014 3 14.56 3 13c0-4.418 4.03-8 9-8s9 3.582 9 7z" /></svg>}
                  />
                  <StatCard
                    label="Active Chats"
                    value={stats?.activeChats ?? "—"}
                    loading={loading}
                    gradient="bg-gradient-to-br from-amber-600/80 to-amber-800/80"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-6 shadow-glass animate-fade-in">
                    <h2 className="text-sm font-semibold text-white mb-5">Messages by Day</h2>
                    {loading ? (
                      <div className="flex items-end gap-2 h-32">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div key={i} className="flex-1 bg-surface-700/30 rounded-t animate-pulse" style={{ height: `${20 + Math.random() * 60}%` }} />
                        ))}
                      </div>
                    ) : messagesData.length === 0 ? (
                      <div className="flex items-center justify-center h-32 text-surface-500 text-sm">
                        No message data available
                      </div>
                    ) : (
                      <div className="flex items-end gap-2 h-32">
                        {messagesData.slice(-14).map((item, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[10px] text-surface-500 font-medium">{item.count}</span>
                            <div
                              className="w-full rounded-t bg-gradient-to-t from-brand-500 to-accent-400 transition-all duration-500 hover:from-brand-400 hover:to-accent-300"
                              style={{ height: `${(item.count / maxMsg) * 100}%`, minHeight: item.count > 0 ? "4px" : "0" }}
                            />
                            <span className="text-[9px] text-surface-600">
                              {new Date(item.date).toLocaleDateString([], { weekday: "short" })}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-6 shadow-glass animate-fade-in">
                    <h2 className="text-sm font-semibold text-white mb-5">Recent Users</h2>
                    {loading ? (
                      <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-surface-700 animate-pulse" />
                            <div className="flex-1 space-y-1.5">
                              <div className="h-3 w-28 bg-surface-700 rounded animate-pulse" />
                              <div className="h-2.5 w-20 bg-surface-700/50 rounded animate-pulse" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : recentUsers.length === 0 ? (
                      <div className="flex items-center justify-center h-32 text-surface-500 text-sm">
                        No users found
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {recentUsers.map((u) => (
                          <div key={u._id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-800/50 transition">
                            <Avatar src={u.avatar} name={u.name} size="sm" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">{u.name}</p>
                              <p className="text-xs text-surface-500 truncate">{u.email}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${
                              u.status === "online" ? "bg-emerald-500/15 text-emerald-400" : "bg-surface-700/50 text-surface-500"
                            }`}>
                              {u.status || "offline"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : tab === "users" ? (
              <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-6 shadow-glass animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-semibold text-white">All Users</h2>
                  <button
                    type="button"
                    onClick={() => navigate("/admin/users")}
                    className="px-4 py-2 rounded-xl bg-brand-500/15 text-brand-300 text-sm font-medium hover:bg-brand-500/25 transition border border-brand-500/20"
                  >
                    Manage Users
                  </button>
                </div>
                <p className="text-surface-500 text-sm">Go to the Users management page to search, suspend, and manage all users.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-6 shadow-glass animate-fade-in">
                  <h2 className="text-sm font-semibold text-white mb-5">Server Health</h2>
                  {loading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-1.5">
                          <div className="h-3 w-24 bg-surface-700 rounded animate-pulse" />
                          <div className="h-2 w-full bg-surface-700 rounded animate-pulse" />
                        </div>
                      ))}
                    </div>
                  ) : health ? (
                    <div className="space-y-4">
                      <HealthBar label="CPU Usage" value={health.cpu || 0} color="bg-gradient-to-r from-brand-500 to-accent-500" />
                      <HealthBar label="Memory Usage" value={health.memory || 0} color="bg-gradient-to-r from-emerald-500 to-cyan-500" />
                      <HealthBar label="Uptime (hours)" value={Math.min(Math.round((health.uptime || 0) / 36), 100)} color="bg-gradient-to-r from-violet-500 to-purple-500" />
                    </div>
                  ) : (
                    <p className="text-surface-500 text-sm">No health data available</p>
                  )}
                </div>

                <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-6 shadow-glass animate-fade-in">
                  <h2 className="text-sm font-semibold text-white mb-5">Database Status</h2>
                  {loading ? (
                    <div className="space-y-3">
                      <div className="h-4 w-32 bg-surface-700 rounded animate-pulse" />
                      <div className="h-3 w-48 bg-surface-700/50 rounded animate-pulse" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-800/50 border border-surface-700/30">
                        <span className={`w-3 h-3 rounded-full ${health?.mongodb ? "bg-emerald-500 shadow-lg shadow-emerald-500/30" : "bg-red-500 shadow-lg shadow-red-500/30"}`} />
                        <div>
                          <p className="text-sm font-medium text-white">MongoDB</p>
                          <p className="text-xs text-surface-500 mt-0.5">
                            {health?.mongodb ? "Connected and healthy" : "Disconnected"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-800/50 border border-surface-700/30">
                        <span className={`w-3 h-3 rounded-full ${health?.server ? "bg-emerald-500 shadow-lg shadow-emerald-500/30" : "bg-red-500 shadow-lg shadow-red-500/30"}`} />
                        <div>
                          <p className="text-sm font-medium text-white">API Server</p>
                          <p className="text-xs text-surface-500 mt-0.5">
                            {health?.server ? "Running" : "Down"}
                          </p>
                        </div>
                      </div>
                      {health?.uptime !== undefined && (
                        <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-800/50 border border-surface-700/30">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 text-surface-400">
                            <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-white">Uptime</p>
                            <p className="text-xs text-surface-500 mt-0.5">
                              {Math.floor((health.uptime || 0) / 3600)}h {Math.floor(((health.uptime || 0) % 3600) / 60)}m
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

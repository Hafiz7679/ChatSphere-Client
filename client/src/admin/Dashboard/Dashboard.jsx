import { useState, useEffect } from "react";
import { getAdminStats, getAdminHealth, getAdminReports } from "../../api/api";
import StatsCard from "../Components/StatsCard";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [health, setHealth] = useState(null);
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        const [statsRes, healthRes, reportsRes] = await Promise.all([
          getAdminStats(),
          getAdminHealth(),
          getAdminReports(),
        ]);
        setStats(statsRes.data.data);
        setHealth(healthRes.data.data);
        setReports(reportsRes.data.data);
      } catch (err) {
        console.error("[AdminDashboard] Failed to load data:", err.response?.status, err.response?.data || err.message);
        setError(true);
        const msg = err.response?.data?.message || "Failed to load admin data";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-12 h-12 text-red-400">
          <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" />
        </svg>
        <p className="text-surface-400 text-sm">Failed to load admin data</p>
        <button type="button" onClick={() => window.location.reload()} className="px-5 py-2 rounded-xl bg-brand-500/15 text-brand-300 text-sm font-medium hover:bg-brand-500/25 transition border border-brand-500/20">
          Retry
        </button>
      </div>
    );
  }

  const messagesData = stats?.messagesByDay || [];
  const maxMsg = Math.max(...messagesData.map((m) => m.count), 1);
  const registrationsData = stats?.registrationsByDay || [];
  const maxReg = Math.max(...registrationsData.map((m) => m.count), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Total Users" value={stats?.totalUsers} loading={loading} gradient="bg-gradient-to-br from-brand-600/80 to-brand-800/80"
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" /></svg>} />
        <StatsCard label="Online Users" value={stats?.onlineUsers} loading={loading} gradient="bg-gradient-to-br from-emerald-600/80 to-emerald-800/80"
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-16 h-16"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>} />
        <StatsCard label="Messages Sent" value={stats?.totalMessages} loading={loading} gradient="bg-gradient-to-br from-violet-600/80 to-violet-800/80"
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.06 0-2.077-.163-3.02-.463L3 21l1.395-3.72C3.512 16.014 3 14.56 3 13c0-4.418 4.03-8 9-8s9 3.582 9 7z" /></svg>} />
        <StatsCard label="Active Chats" value={stats?.totalChats} loading={loading} gradient="bg-gradient-to-br from-amber-600/80 to-amber-800/80"
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
        <StatsCard label="Group Chats" value={stats?.groupChats} loading={loading} gradient="bg-gradient-to-br from-pink-600/80 to-pink-800/80"
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
        <StatsCard label="Messages Today" value={stats?.messagesToday} loading={loading} gradient="bg-gradient-to-br from-cyan-600/80 to-cyan-800/80"
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.06 0-2.077-.163-3.02-.463L3 21l1.395-3.72C3.512 16.014 3 14.56 3 13c0-4.418 4.03-8 9-8s9 3.582 9 7z" /></svg>} />
        <StatsCard label="Active Today" value={stats?.activeToday} loading={loading} gradient="bg-gradient-to-br from-teal-600/80 to-teal-800/80"
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-16 h-16"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 6v6l4 2" /></svg>} />
        <StatsCard label="Suspended" value={stats?.suspendedCount} loading={loading} gradient="bg-gradient-to-br from-red-600/80 to-red-800/80"
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-16 h-16"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M15 9l-6 6m0-6l6 6" /></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-6 shadow-glass animate-fade-in">
          <h2 className="text-sm font-semibold text-white mb-5">Messages by Day</h2>
          {loading ? (
            <div className="flex items-end gap-2 h-32">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex-1 bg-surface-700/30 rounded-t animate-pulse" style={{ height: `${20 + Math.random() * 60}%` }} />
              ))}
            </div>
          ) : messagesData.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-surface-500 text-sm">No message data available</div>
          ) : (
            <div className="flex items-end gap-2 h-32">
              {messagesData.slice(-14).map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-surface-500 font-medium">{item.count}</span>
                  <div className="w-full rounded-t bg-gradient-to-t from-brand-500 to-accent-400 transition-all duration-500 hover:from-brand-400 hover:to-accent-300"
                    style={{ height: `${(item.count / maxMsg) * 100}%`, minHeight: item.count > 0 ? "4px" : "0" }} />
                  <span className="text-[9px] text-surface-600">{new Date(item._id).toLocaleDateString([], { weekday: "short" })}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-6 shadow-glass animate-fade-in">
          <h2 className="text-sm font-semibold text-white mb-5">Registrations by Day</h2>
          {loading ? (
            <div className="flex items-end gap-2 h-32">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="flex-1 bg-surface-700/30 rounded-t animate-pulse" style={{ height: `${20 + Math.random() * 60}%` }} />
              ))}
            </div>
          ) : registrationsData.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-surface-500 text-sm">No registration data available</div>
          ) : (
            <div className="flex items-end gap-2 h-32">
              {registrationsData.slice(-14).map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-surface-500 font-medium">{item.count}</span>
                  <div className="w-full rounded-t bg-gradient-to-t from-emerald-500 to-teal-400 transition-all duration-500 hover:from-emerald-400 hover:to-teal-300"
                    style={{ height: `${(item.count / maxReg) * 100}%`, minHeight: item.count > 0 ? "4px" : "0" }} />
                  <span className="text-[9px] text-surface-600">{new Date(item._id).toLocaleDateString([], { weekday: "short" })}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          ) : stats?.recentUsers?.length > 0 ? (
            <div className="space-y-2">
              {stats.recentUsers.slice(0, 5).map((u) => (
                <div key={u._id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-800/50 transition">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {u.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{u.name}</p>
                    <p className="text-xs text-surface-500 truncate">{u.email}</p>
                  </div>
                  <span className="text-[10px] text-surface-500">{new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-surface-500 text-sm">No users found</p>
          )}
        </div>

        <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-6 shadow-glass animate-fade-in">
          <h2 className="text-sm font-semibold text-white mb-5">Server Health</h2>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-24 bg-surface-700 rounded animate-pulse" />
                  <div className="h-2 w-full bg-surface-700 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <HealthBar label="CPU Usage" value={health?.cpuUsage ?? 0} color="bg-gradient-to-r from-brand-500 to-accent-500" />
              <HealthBar label="Memory Usage" value={health?.memoryUsage ?? 0} color="bg-gradient-to-r from-emerald-500 to-cyan-500" />
              <HealthBar label="Uptime (hours)" value={Math.min(Math.round((health?.uptime || 0) / 36), 100)} color="bg-gradient-to-r from-violet-500 to-purple-500" />
            </div>
          )}
        </div>

        <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-6 shadow-glass animate-fade-in">
          <h2 className="text-sm font-semibold text-white mb-5">Quick Summary</h2>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 bg-surface-700 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <SummaryRow label="Verified Users" value={stats?.verifiedCount} total={stats?.totalUsers} />
              <SummaryRow label="Suspended Users" value={stats?.suspendedCount} total={stats?.totalUsers} />
              <SummaryRow label="Images Shared" value={stats?.imagesSent} />
              <SummaryRow label="Files Shared" value={stats?.filesSent} />
              <SummaryRow label="Voice Messages" value={stats?.voiceMessages} />
              <div className="pt-3 border-t border-surface-700/20">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-surface-400">Database</span>
                  <span className={`font-medium ${health?.mongoStatus === "connected" ? "text-emerald-400" : "text-red-400"}`}>
                    {health?.mongoStatus === "connected" ? "Connected" : "Disconnected"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs mt-2">
                  <span className="text-surface-400">Environment</span>
                  <span className="text-surface-300 font-medium">{health?.environment || "—"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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

const SummaryRow = ({ label, value, total }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-surface-400">{label}</span>
    <span className="text-white font-medium">
      {value ?? "—"} {total !== undefined && <span className="text-surface-500 font-normal">/ {total}</span>}
    </span>
  </div>
);

export default Dashboard;

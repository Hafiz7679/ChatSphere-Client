import { useState, useEffect } from "react";
import { getAdminHealth, getAdminStats } from "../../api/api";
import toast from "react-hot-toast";

const ServerHealth = () => {
  const [health, setHealth] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hRes, sRes] = await Promise.all([getAdminHealth(), getAdminStats()]);
      setHealth(hRes.data.data);
      setStats(sRes.data.data);
    } catch (err) {
      console.error("[AdminHealth] Failed to load:", err.response?.status, err.response?.data || err.message);
      if (autoRefresh) toast.error(err.response?.data?.message || "Failed to load health data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (autoRefresh) {
      const iv = setInterval(fetchData, 15000);
      return () => clearInterval(iv);
    }
  }, [autoRefresh]);

  if (loading && !health) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map((i) => <div key={i} className="h-28 bg-surface-700/50 rounded-2xl animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1,2].map((i) => <div key={i} className="h-64 bg-surface-700/50 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  const statusColor = (ok) => ok ? "bg-emerald-500 shadow-lg shadow-emerald-500/30" : "bg-red-500 shadow-lg shadow-red-500/30";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-surface-400">Last updated: {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : "—"}</p>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-surface-400 cursor-pointer">
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} className="rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500/30" />
            Auto-refresh (15s)
          </label>
          <button type="button" onClick={fetchData} className="px-4 py-2 rounded-xl text-xs font-medium bg-brand-500/15 text-brand-300 border border-brand-500/20 hover:bg-brand-500/25 transition">
            Refresh Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard label="Database" status={health?.mongoStatus === "connected"} statusText={health?.mongoStatus || "Unknown"} loading={loading} />
        <StatusCard label="API Server" status={true} statusText="Running" loading={loading} />
        <StatusCard label="Socket.IO" status={true} statusText="Active" loading={loading} />
        <StatusCard label="Environment" status={true} statusText={health?.environment || "—"} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-6 shadow-glass animate-fade-in">
          <h2 className="text-sm font-semibold text-white mb-5">Resource Usage</h2>
          {loading ? (
            <div className="space-y-4">{[1,2,3].map((i) => <div key={i} className="space-y-1.5"><div className="h-3 w-24 bg-surface-700 rounded animate-pulse" /><div className="h-2 w-full bg-surface-700 rounded animate-pulse" /></div>)}</div>
          ) : (
            <div className="space-y-5">
              <ResourceBar label="CPU Usage" value={health?.cpuUsage ?? 0} color="from-brand-500 to-accent-500" />
              <ResourceBar label="RAM Usage" value={health?.memoryUsage ?? 0} color="from-emerald-500 to-cyan-500" />
              <ResourceBar label="Heap Usage" value={health?.heapTotal > 0 ? Math.round((health.heapUsed / health.heapTotal) * 100) : 0} color="from-violet-500 to-purple-500" />
            </div>
          )}
        </div>

        <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-6 shadow-glass animate-fade-in">
          <h2 className="text-sm font-semibold text-white mb-5">System Information</h2>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4,5,6].map((i) => <div key={i} className="h-4 bg-surface-700 rounded animate-pulse" />)}</div>
          ) : (
            <div className="space-y-3">
              <InfoRow label="Server Uptime" value={formatUptime(health?.uptime)} />
              <InfoRow label="Node Version" value={health?.nodeVersion} />
              <InfoRow label="Platform" value={`${health?.platform} (${health?.arch})`} />
              <InfoRow label="Hostname" value={health?.hostname} />
              <InfoRow label="CPU Cores" value={health?.cpuCount} />
              <InfoRow label="CPU Load" value={health?.cpuLoad?.join(", ")} />
              <InfoRow label="Total Memory" value={health?.memoryDetails ? `${health.memoryDetails.total} GB` : "—"} />
              <InfoRow label="Free Memory" value={health?.memoryDetails ? `${health.memoryDetails.free} GB` : "—"} />
              <InfoRow label="Heap (Used/Total)" value={health?.heapUsed != null && health?.heapTotal != null ? `${health.heapUsed} MB / ${health.heapTotal} MB` : "—"} />
              <InfoRow label="RSS" value={health?.rss != null ? `${health.rss} MB` : "—"} />
              <InfoRow label="MongoDB State" value={health?.mongoState === 1 ? "Connected (1)" : health?.mongoState === 2 ? "Connecting (2)" : `Disconnected (${health?.mongoState})`} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatusCard = ({ label, status, statusText, loading }) => (
  <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-5 shadow-glass animate-fade-in">
    <div className="flex items-center gap-3">
      <span className={`w-3 h-3 rounded-full ${status ? "bg-emerald-500 shadow-lg shadow-emerald-500/30" : "bg-red-500 shadow-lg shadow-red-500/30"}`} />
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-surface-500 mt-0.5">{statusText}</p>
      </div>
    </div>
  </div>
);

const ResourceBar = ({ label, value, color }) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between text-xs">
      <span className="text-surface-400">{label}</span>
      <span className="text-white font-medium">{value}%</span>
    </div>
    <div className="h-2.5 bg-surface-700/50 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-1000 bg-gradient-to-r ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-surface-400">{label}</span>
    <span className="text-white font-medium text-right">{value || "—"}</span>
  </div>
);

const formatUptime = (seconds) => {
  if (!seconds) return "—";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  parts.push(`${Math.floor(seconds % 60)}s`);
  return parts.join(" ");
};

export default ServerHealth;

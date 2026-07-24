import { useState, useEffect } from "react";
import { getAdminReports, getAdminStats } from "../../api/api";
import toast from "react-hot-toast";

const Reports = () => {
  const [reports, setReports] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [rRes, sRes] = await Promise.all([getAdminReports(), getAdminStats()]);
        setReports(rRes.data.data);
        setStats(sRes.data.data);
      } catch (err) {
        console.error("[AdminReports] Failed to load:", err.response?.status, err.response?.data || err.message);
        toast.error(err.response?.data?.message || "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const reportCards = [
    { label: "Suspended Users", value: reports?.suspendedUsers, desc: "Accounts currently suspended", color: "from-red-600/80 to-red-800/80" },
    { label: "Unverified Users", value: reports?.unverifiedUsers, desc: "Accounts not yet verified", color: "from-amber-600/80 to-amber-800/80" },
    { label: "Admin Accounts", value: reports?.adminCount, desc: "Administrator accounts", color: "from-purple-600/80 to-purple-800/80" },
    { label: "Spam Messages", value: reports?.spamMessages, desc: "Flagged as potential spam", color: "from-orange-600/80 to-orange-800/80" },
    { label: "Deleted Messages", value: reports?.deletedMessages, desc: "Soft-deleted messages", color: "from-slate-600/80 to-slate-800/80" },
    { label: "Total Messages", value: reports?.totalMessages, desc: "All-time message count", color: "from-brand-600/80 to-brand-800/80" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCards.map((card) => (
          <div key={card.label} className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${card.color} shadow-lg animate-fade-in`}>
            {loading ? (
              <div className="space-y-2">
                <div className="h-3 w-24 bg-white/20 rounded animate-pulse" />
                <div className="h-8 w-16 bg-white/20 rounded animate-pulse" />
                <div className="h-2.5 w-32 bg-white/10 rounded animate-pulse" />
              </div>
            ) : (
              <>
                <p className="text-sm font-medium text-white/80">{card.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{card.value?.toLocaleString() ?? "—"}</p>
                <p className="text-xs text-white/60 mt-1">{card.desc}</p>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-6 shadow-glass animate-fade-in">
          <h2 className="text-sm font-semibold text-white mb-5">User Reports Summary</h2>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4].map((i) => <div key={i} className="h-8 bg-surface-700 rounded animate-pulse" />)}</div>
          ) : (
            <div className="space-y-4">
              <ReportRow label="Total Users" value={stats?.totalUsers} total={stats?.totalUsers} />
              <ReportRow label="Suspended" value={reports?.suspendedUsers} total={stats?.totalUsers} />
              <ReportRow label="Unverified" value={reports?.unverifiedUsers} total={stats?.totalUsers} />
              <ReportRow label="Verified" value={stats?.verifiedCount} total={stats?.totalUsers} />
              <ReportRow label="Admins" value={reports?.adminCount} total={stats?.totalUsers} />
            </div>
          )}
        </div>

        <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-6 shadow-glass animate-fade-in">
          <h2 className="text-sm font-semibold text-white mb-5">Message Reports Summary</h2>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4].map((i) => <div key={i} className="h-8 bg-surface-700 rounded animate-pulse" />)}</div>
          ) : (
            <div className="space-y-4">
              <ReportRow label="Total Messages" value={reports?.totalMessages} total={reports?.totalMessages} />
              <ReportRow label="Spam Flagged" value={reports?.spamMessages} total={reports?.totalMessages} />
              <ReportRow label="Deleted" value={reports?.deletedMessages} total={reports?.totalMessages} />
              <ReportRow label="Images" value={stats?.imagesSent} total={reports?.totalMessages} />
              <ReportRow label="Files" value={stats?.filesSent} total={reports?.totalMessages} />
              <ReportRow label="Voice" value={stats?.voiceMessages} total={reports?.totalMessages} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ReportRow = ({ label, value, total }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-surface-400">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-white font-medium">{value?.toLocaleString() ?? "—"}</span>
        <span className="text-surface-500 text-xs w-10 text-right">{pct}%</span>
      </div>
    </div>
  );
};

export default Reports;

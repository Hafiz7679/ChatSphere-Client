import { useState, useEffect } from "react";
import { getAdminAnalytics, getMessageStats } from "../../api/api";
import StatsCard from "../Components/StatsCard";
import toast from "react-hot-toast";

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [msgStats, setMsgStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [aRes, mRes] = await Promise.all([getAdminAnalytics(), getMessageStats()]);
        setAnalytics(aRes.data.data);
        setMsgStats(mRes.data.data);
      } catch (err) {
        console.error("[AdminAnalytics] Failed to load:", err.response?.status, err.response?.data || err.message);
        toast.error(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const dailyReg = analytics?.dailyRegistrations || [];
  const monthlyReg = analytics?.monthlyRegistrations || [];
  const dailyMsg = analytics?.dailyMessages || [];
  const monthlyMsg = analytics?.monthlyMessages || [];
  const dailyActive = analytics?.dailyActiveUsers || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard label="Daily Registrations" value={dailyReg.reduce((s, d) => s + d.count, 0)} loading={loading}
          gradient="bg-gradient-to-br from-brand-600/80 to-brand-800/80"
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>} />
        <StatsCard label="Messages Today" value={msgStats?.messagesToday} loading={loading}
          gradient="bg-gradient-to-br from-violet-600/80 to-violet-800/80"
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.06 0-2.077-.163-3.02-.463L3 21l1.395-3.72C3.512 16.014 3 14.56 3 13c0-4.418 4.03-8 9-8s9 3.582 9 7z" /></svg>} />
        <StatsCard label="Weekly Messages" value={msgStats?.messagesThisWeek} loading={loading}
          gradient="bg-gradient-to-br from-amber-600/80 to-amber-800/80"
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatsCard label="Average Daily" value={msgStats?.avgMessagesPerDay} loading={loading}
          gradient="bg-gradient-to-br from-emerald-600/80 to-emerald-800/80"
          icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Daily Registrations (30 days)" data={dailyReg} max={Math.max(...dailyReg.map((d) => d.count), 1)}
          gradient="from-brand-500 to-accent-400" loading={loading} />
        <ChartCard title="Daily Messages (30 days)" data={dailyMsg} max={Math.max(...dailyMsg.map((d) => d.count), 1)}
          gradient="from-violet-500 to-purple-400" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Monthly Registrations (12 months)" data={monthlyReg} max={Math.max(...monthlyReg.map((d) => d.count), 1)}
          gradient="from-emerald-500 to-teal-400" loading={loading} />
        <ChartCard title="Monthly Messages (12 months)" data={monthlyMsg} max={Math.max(...monthlyMsg.map((d) => d.count), 1)}
          gradient="from-amber-500 to-orange-400" loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-6 shadow-glass animate-fade-in">
          <h2 className="text-sm font-semibold text-white mb-5">Most Active Users</h2>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4,5].map((i) => <div key={i} className="h-8 bg-surface-700 rounded animate-pulse" />)}</div>
          ) : msgStats?.mostActiveUsers?.length > 0 ? (
            <div className="space-y-2">
              {msgStats.mostActiveUsers.slice(0, 8).map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-800/50 transition">
                  <span className="w-6 text-center text-xs font-bold text-surface-500">#{i + 1}</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                    {item.user?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{item.user?.name || "Unknown"}</p>
                    <p className="text-[10px] text-surface-500">{item.count} messages</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-surface-500 text-sm">No data available</p>
          )}
        </div>

        <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-6 shadow-glass animate-fade-in">
          <h2 className="text-sm font-semibold text-white mb-5">Content Summary</h2>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4].map((i) => <div key={i} className="h-8 bg-surface-700 rounded animate-pulse" />)}</div>
          ) : (
            <div className="space-y-3">
              <ContentRow label="Total Messages" value={msgStats?.totalMessages} />
              <ContentRow label="Messages Today" value={msgStats?.messagesToday} />
              <ContentRow label="Messages This Week" value={msgStats?.messagesThisWeek} />
              <ContentRow label="Messages This Month" value={msgStats?.messagesThisMonth} />
              <div className="border-t border-surface-700/20 my-2" />
              <ContentRow label="Images Sent" value={msgStats?.imagesSent} />
              <ContentRow label="Files Sent" value={msgStats?.filesSent} />
              <ContentRow label="Voice Messages" value={msgStats?.voiceMessages} />
              <div className="border-t border-surface-700/20 my-2" />
              <ContentRow label="Current Online" value={analytics?.currentOnline} />
              <ContentRow label="Growth (12mo)" value={analytics?.growthStats?.totalNew} />
              <ContentRow label="Verified (12mo)" value={analytics?.growthStats?.verifiedNew} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const COLORS = [
  "from-brand-500 to-accent-400",
  "from-violet-500 to-purple-400",
  "from-emerald-500 to-teal-400",
  "from-amber-500 to-orange-400",
  "from-cyan-500 to-blue-400",
  "from-pink-500 to-rose-400",
];

const ChartCard = ({ title, data, max, gradient, loading }) => {
  const colorIdx = COLORS.indexOf(gradient);
  return (
    <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-6 shadow-glass animate-fade-in">
      <h2 className="text-sm font-semibold text-white mb-5">{title}</h2>
      {loading ? (
        <div className="flex items-end gap-2 h-32">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex-1 bg-surface-700/30 rounded-t animate-pulse" style={{ height: `${20 + Math.random() * 60}%` }} />
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-surface-500 text-sm">No data available</div>
      ) : (
        <div className="relative h-32">
          <div className="absolute inset-0 flex items-end gap-1">
            {data.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 justify-end">
                <span className="text-[9px] text-surface-500 font-medium">{item.count}</span>
                <div className={`w-full rounded-t transition-all duration-500 hover:opacity-80 ${
                  gradient ? `bg-gradient-to-t ${gradient}` : "bg-brand-500"
                }`}
                  style={{
                    height: `${(item.count / max) * 100}%`,
                    minHeight: item.count > 0 ? "4px" : "0",
                  }}
                />
                <span className="text-[7px] text-surface-600 truncate max-w-full">{item._id?.length > 7 ? item._id.slice(5) : item._id}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ContentRow = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-surface-400">{label}</span>
    <span className="text-white font-medium">{value?.toLocaleString() ?? "—"}</span>
  </div>
);

export default Analytics;

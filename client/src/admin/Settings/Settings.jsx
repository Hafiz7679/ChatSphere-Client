import { useState, useEffect } from "react";
import { getAdminSettings, getAdminHealth } from "../../api/api";
import toast from "react-hot-toast";

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sRes, hRes] = await Promise.all([getAdminSettings(), getAdminHealth()]);
        setSettings(sRes.data.data);
        setHealth(hRes.data.data);
      } catch {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const features = settings?.features || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-6 shadow-glass animate-fade-in">
          <h2 className="text-sm font-semibold text-white mb-5">Application Settings</h2>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4,5,6].map((i) => <div key={i} className="h-5 bg-surface-700 rounded animate-pulse" />)}</div>
          ) : (
            <div className="space-y-4">
              <SettingField label="Environment" value={settings?.environment} />
              <SettingField label="Version" value={settings?.version} />
              <SettingField label="JWT Expiry" value={settings?.jwtExpiry} />
              <SettingField label="Refresh Token Expiry" value={settings?.refreshTokenExpiry} />
              <SettingField label="Client URL" value={settings?.clientUrl} />
              <SettingField label="MongoDB URI" value={settings?.mongodbUri} />
              <div className="border-t border-surface-700/20 my-2" />
              <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Environment Details</h3>
              <SettingField label="Node Version" value={health?.nodeVersion} />
              <SettingField label="Platform" value={`${health?.platform || ""} ${health?.arch || ""}`} />
              <SettingField label="Hostname" value={health?.hostname} />
              <SettingField label="Server Uptime" value={formatUptime(health?.uptime)} />
            </div>
          )}
        </div>

        <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-6 shadow-glass animate-fade-in">
          <h2 className="text-sm font-semibold text-white mb-5">Feature Flags</h2>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4,5,6].map((i) => <div key={i} className="h-12 bg-surface-700 rounded-xl animate-pulse" />)}</div>
          ) : (
            <div className="space-y-3">
              <FeatureToggle label="Email Verification" enabled={features.emailVerification} />
              <FeatureToggle label="Password Reset" enabled={features.passwordReset !== false} />
              <FeatureToggle label="File Uploads" enabled={features.fileUploads} />
              <FeatureToggle label="Voice Messages" enabled={features.voiceMessages !== false} />
              <FeatureToggle label="Voice/Video Calls" enabled={features.calls !== false} />
              <FeatureToggle label="Push Notifications" enabled={features.pushNotifications !== false} />
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-surface-700/30">
            <h2 className="text-sm font-semibold text-white mb-4">Security</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-800/50 border border-surface-700/30">
                <span className="text-sm text-surface-300">Rate Limiting</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-800/50 border border-surface-700/30">
                <span className="text-sm text-surface-300">CSRF Protection</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-800/50 border border-surface-700/30">
                <span className="text-sm text-surface-300">Helmet Security Headers</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-800/50 border border-surface-700/30">
                <span className="text-sm text-surface-300">Input Validation</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-medium">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-800/50 border border-surface-700/30">
                <span className="text-sm text-surface-300">Security Logging</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-medium">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SettingField = ({ label, value }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-surface-400">{label}</span>
    <span className="text-white font-medium text-right max-w-[60%] truncate">{value || "—"}</span>
  </div>
);

const FeatureToggle = ({ label, enabled }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-surface-800/50 border border-surface-700/30">
    <span className="text-sm text-surface-300">{label}</span>
    <span className={`text-xs px-2 py-0.5 rounded font-medium ${enabled ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400"}`}>
      {enabled ? "Enabled" : "Disabled"}
    </span>
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

export default Settings;

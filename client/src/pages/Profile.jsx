import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getProfile, updateProfile, updatePassword, uploadAvatar, logoutUser } from "../api/api";
import useChatStore from "../store/useChatStore";
import { disconnectSocket } from "../socket/socket";
import Avatar from "../components/Avatar/Avatar";
import Button from "../components/Button/Button";
import ThemeToggle from "../components/ThemeToggle/ThemeToggle";
import useTheme from "../hooks/useTheme";

const Profile = () => {
  const navigate = useNavigate();
  const currentUser = useMemo(() => JSON.parse(localStorage.getItem("user") || "null"), []);
  const [user, setUser] = useState(currentUser || {});
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(user.bio || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState(user.settings || { darkMode: false, notifications: true, sound: true });
  const chatWallpaper = useChatStore((s) => s.chatWallpaper);
  const setChatWallpaper = useChatStore((s) => s.setChatWallpaper);
  const [wallpaperUrl, setWallpaperUrl] = useState(chatWallpaper || "");
  const fileInputRef = useRef(null);

  const WALLPAPER_PRESETS = [
    { name: "None", value: null },
    { name: "Abstract", value: "https://images.unsplash.com/photo-1614851099511-773084f6911d?w=400" },
    { name: "Ocean", value: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400" },
    { name: "Forest", value: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400" },
    { name: "Space", value: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400" },
    { name: "Gradient", value: "https://images.unsplash.com/photo-1557683311-eac922347aa1?w=400" },
  ];

  useEffect(() => {
    if (!currentUser) { navigate("/login"); return; }
    const load = async () => {
      try {
        const res = await getProfile();
        if (res.data?.user) {
          setUser(res.data.user);
          setName(res.data.user.name || "");
          setBio(res.data.user.bio || "");
          setAvatar(res.data.user.avatar || "");
          setSettings(res.data.user.settings || { darkMode: false, notifications: true, sound: true });
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch {}
    };
    load();
  }, [currentUser, navigate]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("avatar", file);
      const res = await uploadAvatar(fd);
      setAvatar(res.data.data?.url || res.data.url);
      toast.success("Avatar updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!name.trim()) { toast.error("Name is required"); return; }
    try {
      setLoading(true);
      const res = await updateProfile({ name: name.trim(), bio: bio.trim(), avatar });
      const updated = res.data.user || res.data.data;
      if (updated) { localStorage.setItem("user", JSON.stringify(updated)); setUser(updated); }
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) { toast.error("Fill all password fields"); return; }
    if (newPassword.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    try {
      setLoading(true);
      await updatePassword({ currentPassword, newPassword });
      toast.success("Password updated");
      setCurrentPassword(""); setNewPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleSetting = async (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    try { await updateProfile({ settings: updated }); } catch { setSettings(settings); }
  };

  const { themeMode, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-navy-800 bg-grid">
      <div className="fixed inset-0 bg-glow pointer-events-none" />
      <div className="relative max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate("/chat")} className="w-9 h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-800 transition">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-white">Profile</h1>
          </div>
          <ThemeToggle />
        </div>

        <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-8 shadow-glass mb-6 animate-fade-in">
          <div className="flex flex-col items-center">
            <div className="relative mb-5">
              <Avatar src={avatar} name={name || "U"} size="xl" />
              <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center cursor-pointer shadow-lg hover:shadow-brand-500/40 transition">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" />
                </svg>
                <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={uploading} />
              </label>
            </div>
            {uploading && <p className="text-xs text-brand-400 mb-3">Uploading...</p>}
            <div className="w-full space-y-4">
              <div>
                <label className="block text-xs font-medium text-surface-400 mb-1.5">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-800/50 border border-surface-700/30 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 transition" />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-400 mb-1.5">Bio</label>
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} placeholder="Tell us about yourself..."
                  className="w-full bg-surface-800/50 border border-surface-700/30 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 transition resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-surface-400 mb-1.5">Email</label>
                <input type="email" value={user.email || ""} disabled
                  className="w-full bg-surface-800/30 border border-surface-700/20 rounded-xl px-4 py-3 text-sm text-surface-500 cursor-not-allowed" />
              </div>
              <Button onClick={handleUpdateProfile} disabled={loading}>
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-8 shadow-glass mb-6 animate-fade-in">
          <h2 className="text-sm font-semibold text-white mb-5">Change Password</h2>
          <div className="space-y-3.5">
            <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-surface-800/50 border border-surface-700/30 rounded-xl px-4 py-3 text-sm text-white placeholder:text-surface-500 outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 transition" />
            <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-surface-800/50 border border-surface-700/30 rounded-xl px-4 py-3 text-sm text-white placeholder:text-surface-500 outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 transition" />
            <Button variant="secondary" onClick={handleUpdatePassword} disabled={loading}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </div>

        <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-8 shadow-glass mb-6 animate-fade-in">
          <h2 className="text-sm font-semibold text-white mb-5">Settings</h2>
          <div className="space-y-5">
            {[
              { key: "notifications", label: "Notifications", desc: "Receive message notifications" },
              { key: "sound", label: "Sound", desc: "Play sound for new messages" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{desc}</p>
                </div>
                <button type="button" onClick={() => toggleSetting(key)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${settings[key] ? "bg-brand-500" : "bg-surface-700"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${settings[key] ? "translate-x-5" : ""}`} />
                </button>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-surface-700/20">
              <div>
                <p className="text-sm font-medium text-white">Theme</p>
                <p className="text-xs text-surface-500 mt-0.5">Dark / Light / System</p>
              </div>
              <div className="flex items-center gap-2">
                {["dark", "light", "system"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTheme(mode)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition ${
                      themeMode === mode
                        ? "bg-brand-500/15 text-brand-300 border border-brand-500/20"
                        : "text-surface-400 hover:text-white border border-transparent"
                    }`}
                  >
                    {mode === "dark" ? "🌙" : mode === "light" ? "☀️" : "💻"} {mode}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-surface-700/20">
              <p className="text-sm font-medium text-white mb-2">Chat Wallpaper</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {["None","Abstract","Ocean","Forest","Space","Gradient"].map((name, i) => {
                  const presets = [null,"https://images.unsplash.com/photo-1614851099511-773084f6911d?w=400","https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400","https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400","https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400","https://images.unsplash.com/photo-1557683311-eac922347aa1?w=400"];
                  return (
                    <button key={name} type="button" onClick={() => { setWallpaperUrl(presets[i] || ""); setChatWallpaper(presets[i]); }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${(chatWallpaper || null) === presets[i] ? "bg-brand-500/15 text-brand-300 border border-brand-500/20" : "text-surface-400 hover:text-white border border-transparent"}`}>
                      {name}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="Image URL..." value={wallpaperUrl} onChange={(e) => setWallpaperUrl(e.target.value)}
                  className="flex-1 bg-surface-800/50 border border-surface-700/30 rounded-xl px-3 py-2 text-xs text-white placeholder:text-surface-500 outline-none focus:border-brand-500/50" />
                <button type="button" onClick={() => { setChatWallpaper(wallpaperUrl || null); toast.success("Wallpaper updated"); }}
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-brand-500/15 text-brand-300 border border-brand-500/20 hover:bg-brand-500/25 transition">Set</button>
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 rounded-xl text-xs font-medium bg-surface-800/50 text-surface-400 border border-surface-700/30 hover:text-white transition">Browse</button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const f = e.target.files?.[0]; if (!f) return;
                  const url = URL.createObjectURL(f);
                  setWallpaperUrl(url); setChatWallpaper(url); toast.success("Wallpaper set");
                }} />
              </div>
            </div>
          </div>
        </div>

        <button type="button" onClick={async () => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            disconnectSocket();
            useChatStore.getState().reset();
            try { await logoutUser(); } catch {}
            navigate("/login");
          }}
          className="w-full py-3.5 rounded-xl border border-red-500/20 text-red-400 font-medium text-sm hover:bg-red-500/10 transition">
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;

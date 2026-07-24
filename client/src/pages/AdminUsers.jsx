import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAdminUsers, suspendUser, deleteUser } from "../api/api";
import toast from "react-hot-toast";
import Avatar from "../components/Avatar/Avatar";

const ConfirmModal = ({ open, title, message, onConfirm, onCancel, loading }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4">
      <div className="bg-surface-800 border border-surface-700/50 rounded-2xl p-6 w-full max-w-md shadow-glass animate-scale-in">
        <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-surface-400 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-surface-300 hover:text-white hover:bg-surface-700 transition disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-medium bg-red-500/15 text-red-400 border border-red-500/20 hover:bg-red-500/25 transition disabled:opacity-40"
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminUsers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeToday, setActiveToday] = useState(0);
  const [suspendedCount, setSuspendedCount] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmSuspend, setConfirmSuspend] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  useEffect(() => {
    if (!user || user.role !== "admin") { navigate("/chat"); return; }
  }, [user, navigate]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (search.trim()) params.search = search.trim();
      const res = await getAdminUsers(params);
      const data = res.data;
      setUsers(data.users || data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalUsers(data.totalUsers || data.total || 0);
      setActiveToday(data.activeToday || 0);
      setSuspendedCount(data.suspendedCount || 0);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleSuspend = async (userId) => {
    try {
      setActionLoading(true);
      await suspendUser(userId);
      toast.success("User status updated");
      setConfirmSuspend(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      setActionLoading(true);
      await deleteUser(userId);
      toast.success("User deleted");
      setConfirmDelete(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

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
              { id: "/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
              { id: "/admin/users", label: "Users", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => navigate(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  location.pathname === id
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
              <button type="button" onClick={() => navigate("/admin")} className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-800 transition">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-lg font-bold text-white">User Management</h1>
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-brand-600/80 to-brand-800/80 rounded-2xl p-5 shadow-lg animate-fade-in">
                <p className="text-sm font-medium text-white/80">Total Users</p>
                <p className="text-3xl font-bold text-white mt-1">{totalUsers}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-600/80 to-emerald-800/80 rounded-2xl p-5 shadow-lg animate-fade-in">
                <p className="text-sm font-medium text-white/80">Active Today</p>
                <p className="text-3xl font-bold text-white mt-1">{activeToday}</p>
              </div>
              <div className="bg-gradient-to-br from-amber-600/80 to-amber-800/80 rounded-2xl p-5 shadow-lg animate-fade-in">
                <p className="text-sm font-medium text-white/80">Suspended</p>
                <p className="text-3xl font-bold text-white mt-1">{suspendedCount}</p>
              </div>
            </div>

            <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl shadow-glass animate-fade-in overflow-hidden">
              <div className="p-5 border-b border-surface-700/30">
                <div className="relative max-w-md">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none">
                    <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="m21 21-4.3-4.3" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-surface-800/50 border border-surface-700/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-surface-500 outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 transition-all"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-700/30">
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">User</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider hidden sm:table-cell">Email</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Status</th>
                      <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider hidden md:table-cell">Joined</th>
                      <th className="text-right px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-700/20">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-surface-700 animate-pulse" />
                              <div className="space-y-1.5">
                                <div className="h-3 w-24 bg-surface-700 rounded animate-pulse" />
                                <div className="h-2.5 w-16 bg-surface-700/50 rounded animate-pulse" />
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 hidden sm:table-cell"><div className="h-3 w-32 bg-surface-700 rounded animate-pulse" /></td>
                          <td className="px-5 py-4"><div className="h-5 w-16 bg-surface-700 rounded-lg animate-pulse" /></td>
                          <td className="px-5 py-4 hidden md:table-cell"><div className="h-3 w-20 bg-surface-700 rounded animate-pulse" /></td>
                          <td className="px-5 py-4"><div className="h-8 w-20 bg-surface-700 rounded-xl animate-pulse ml-auto" /></td>
                        </tr>
                      ))
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-surface-600">
                              <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="m21 21-4.3-4.3" />
                            </svg>
                            <p className="text-sm text-surface-500 font-medium">{search ? "No users match your search" : "No users found"}</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u._id} className="hover:bg-surface-800/30 transition">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar src={u.avatar} name={u.name} size="sm" />
                              <p className="text-sm font-medium text-white truncate max-w-[150px]">{u.name}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4 hidden sm:table-cell">
                            <p className="text-sm text-surface-400 truncate max-w-[200px]">{u.email}</p>
                          </td>
                          <td className="px-5 py-4">
                            <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                              u.status === "suspended"
                                ? "bg-red-500/15 text-red-400 border border-red-500/20"
                                : u.status === "online"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                : "bg-surface-700/50 text-surface-400 border border-surface-600/30"
                            }`}>
                              {u.status === "suspended" ? "Suspended" : u.status === "online" ? "Online" : "Offline"}
                            </span>
                          </td>
                          <td className="px-5 py-4 hidden md:table-cell">
                            <span className="text-sm text-surface-500">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => setConfirmSuspend(u._id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition border ${
                                  u.status === "suspended"
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                                }`}
                              >
                                {u.status === "suspended" ? "Unsuspend" : "Suspend"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDelete(u._id)}
                                className="px-3 py-1.5 rounded-xl text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-surface-700/30">
                  <p className="text-xs text-surface-500">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="px-4 py-2 rounded-xl text-xs font-medium bg-surface-800/50 text-surface-300 border border-surface-700/30 hover:bg-surface-700/50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="px-4 py-2 rounded-xl text-xs font-medium bg-surface-800/50 text-surface-300 border border-surface-700/30 hover:bg-surface-700/50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirmDelete !== null}
        title="Delete User"
        message="This action is irreversible. The user and all their data will be permanently deleted."
        onConfirm={() => handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
        loading={actionLoading}
      />
      <ConfirmModal
        open={confirmSuspend !== null}
        title="Suspend User"
        message="This user will be unable to access their account until unsuspended."
        onConfirm={() => handleSuspend(confirmSuspend)}
        onCancel={() => setConfirmSuspend(null)}
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminUsers;

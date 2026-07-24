import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getAdminUsers, getAdminUserById, suspendUser, deleteUser, changeUserRole, resetUserPassword, verifyUserEmail, disableAccount, getOnlineUsers } from "../../api/api";
import ConfirmModal from "../Components/ConfirmModal";
import toast from "react-hot-toast";

const FILTERS = [
  { value: "", label: "All Users" },
  { value: "active", label: "Active Today" },
  { value: "suspended", label: "Suspended" },
  { value: "verified", label: "Verified" },
  { value: "unverified", label: "Unverified" },
  { value: "admin", label: "Admins" },
];

const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [filter, setFilter] = useState(searchParams.get("filter") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page"), 10) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeToday, setActiveToday] = useState(0);
  const [suspendedCount, setSuspendedCount] = useState(0);
  const [summaryTab, setSummaryTab] = useState("all");
  const [onlineUsers, setOnlineUsers] = useState([]);

  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [confirmAction, setConfirmAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [roleModal, setRoleModal] = useState(null);
  const [newRole, setNewRole] = useState("user");

  const [passwordModal, setPasswordModal] = useState(null);
  const [newPassword, setNewPassword] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 10, filter };
      if (search.trim()) params.search = search.trim();
      const res = await getAdminUsers(params);
      const data = res.data.data || res.data;
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
      setTotalUsers(data.total || 0);
      setActiveToday(data.activeToday || 0);
      setSuspendedCount(data.suspendedCount || 0);
    } catch {
      console.error("[AdminUsers] Failed to load users:", err.response?.status, err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [page, search, filter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => { setPage(1); }, [search, filter]);

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (filter) params.filter = filter;
    if (page > 1) params.page = page;
    setSearchParams(params, { replace: true });
  }, [search, filter, page, setSearchParams]);

  const fetchOnlineUsers = async () => {
    try {
      const res = await getOnlineUsers();
      setOnlineUsers(res.data.data || []);
    } catch {}
  };
  useEffect(() => { fetchOnlineUsers(); const iv = setInterval(fetchOnlineUsers, 10000); return () => clearInterval(iv); }, []);

  const getDisplayUsers = () => {
    if (summaryTab === "online") return onlineUsers;
    return users;
  };

  const viewUserDetail = async (userId) => {
    setSelectedUser(userId);
    setDetailLoading(true);
    setUserDetail(null);
    try {
      const res = await getAdminUserById(userId);
      setUserDetail(res.data.data || res.data);
    } catch (err) {
      console.error("[AdminUsers] Failed to load user details:", err.response?.status, err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to load user details");
    } finally {
      setDetailLoading(false);
    }
  };

  const executeAction = async (action) => {
    setActionLoading(true);
    try {
      const { type, userId } = action;
      if (type === "suspend") {
        await suspendUser(userId);
        toast.success("User status toggled");
      } else if (type === "delete") {
        await deleteUser(userId);
        toast.success("User deleted");
      } else if (type === "verify") {
        await verifyUserEmail(userId);
        toast.success("Verification status toggled");
      } else if (type === "disable") {
        await disableAccount(userId);
        toast.success("Account disabled");
      }
      setConfirmAction(null);
      setSelectedUser(null);
      setUserDetail(null);
      fetchUsers();
      fetchOnlineUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRoleChange = async () => {
    if (!roleModal) return;
    setActionLoading(true);
    try {
      await changeUserRole(roleModal, newRole);
      toast.success(`Role changed to ${newRole}`);
      setRoleModal(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change role");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!passwordModal) return;
    if (newPassword.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setActionLoading(true);
    try {
      await resetUserPassword(passwordModal, newPassword);
      toast.success("Password reset successfully");
      setPasswordModal(null);
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setActionLoading(false);
    }
  };

  const displayUsers = getDisplayUsers();
  const isOnlineTab = summaryTab === "online";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: totalUsers, gradient: "from-brand-600/80 to-brand-800/80", tab: "all" },
          { label: "Active Today", value: activeToday, gradient: "from-emerald-600/80 to-emerald-800/80", tab: "active" },
          { label: "Suspended", value: suspendedCount, gradient: "from-red-600/80 to-red-800/80", tab: "suspended" },
          { label: "Online Now", value: onlineUsers.length, gradient: "from-cyan-600/80 to-cyan-800/80", tab: "online" },
        ].map((item) => (
          <button key={item.tab} type="button" onClick={() => { setSummaryTab(item.tab); setPage(1); }}
            className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br ${item.gradient} shadow-lg animate-fade-in transition-all hover:scale-[1.02] ${summaryTab === item.tab ? "ring-2 ring-white/20" : ""}`}>
            <p className="text-sm font-medium text-white/80">{item.label}</p>
            <p className="text-3xl font-bold text-white mt-1">{item.value}</p>
          </button>
        ))}
      </div>

      <div className="bg-surface-800/30 backdrop-blur-xl border border-surface-700/30 rounded-2xl shadow-glass animate-fade-in">
        <div className="p-5 border-b border-surface-700/30 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none">
                <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="m21 21-4.3-4.3" />
              </svg>
              <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface-800/50 border border-surface-700/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-surface-500 outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 transition-all" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {FILTERS.map((f) => (
                <button key={f.value} type="button" onClick={() => setFilter(f.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition border ${
                    filter === f.value
                      ? "bg-brand-500/15 text-brand-300 border-brand-500/20"
                      : "bg-surface-800/50 text-surface-400 border-surface-700/30 hover:text-white hover:bg-surface-700/50"
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-700/30">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider hidden md:table-cell">Joined</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-surface-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700/20">
              {loading && !isOnlineTab ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-surface-700 animate-pulse" /><div className="space-y-1.5"><div className="h-3 w-24 bg-surface-700 rounded animate-pulse" /><div className="h-2.5 w-16 bg-surface-700/50 rounded animate-pulse" /></div></div></td>
                    <td className="px-5 py-4 hidden sm:table-cell"><div className="h-3 w-32 bg-surface-700 rounded animate-pulse" /></td>
                    <td className="px-5 py-4"><div className="h-5 w-14 bg-surface-700 rounded-lg animate-pulse" /></td>
                    <td className="px-5 py-4"><div className="h-5 w-16 bg-surface-700 rounded-lg animate-pulse" /></td>
                    <td className="px-5 py-4 hidden md:table-cell"><div className="h-3 w-20 bg-surface-700 rounded animate-pulse" /></td>
                    <td className="px-5 py-4"><div className="h-8 w-24 bg-surface-700 rounded-xl animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : displayUsers.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center"><p className="text-sm text-surface-500 font-medium">{search ? "No users match your search" : "No users found"}</p></td></tr>
              ) : (
                displayUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-surface-800/30 transition">
                    <td className="px-5 py-4">
                      <button type="button" onClick={() => viewUserDetail(u._id)} className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <p className="text-sm font-medium text-white truncate max-w-[150px]">{u.name}</p>
                      </button>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell"><p className="text-sm text-surface-400 truncate max-w-[200px]">{u.email}</p></td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-semibold ${u.role === "admin" ? "bg-purple-500/15 text-purple-400" : "bg-surface-700/50 text-surface-400"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                        u.isSuspended ? "bg-red-500/15 text-red-400 border border-red-500/20"
                        : u.status === "online" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                        : "bg-surface-700/50 text-surface-400 border border-surface-600/30"
                      }`}>
                        {u.isSuspended ? "Suspended" : u.status === "online" ? "Online" : "Offline"}
                      </span>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell"><span className="text-sm text-surface-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 justify-end flex-wrap">
                        <button type="button" onClick={() => viewUserDetail(u._id)} className="px-2.5 py-1.5 rounded-xl text-[11px] font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20 hover:bg-brand-500/20 transition">View</button>
                        <button type="button" onClick={() => setConfirmAction({ type: "suspend", userId: u._id })}
                          className={`px-2.5 py-1.5 rounded-xl text-[11px] font-medium transition border ${u.isSuspended ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"}`}>
                          {u.isSuspended ? "Unsuspend" : "Suspend"}
                        </button>
                        {u.role !== "admin" && (
                          <button type="button" onClick={() => setConfirmAction({ type: "delete", userId: u._id })}
                            className="px-2.5 py-1.5 rounded-xl text-[11px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition">Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isOnlineTab && totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-surface-700/30">
            <p className="text-xs text-surface-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-surface-800/50 text-surface-300 border border-surface-700/30 hover:bg-surface-700/50 transition disabled:opacity-40 disabled:cursor-not-allowed">Previous</button>
              <button type="button" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-surface-800/50 text-surface-300 border border-surface-700/30 hover:bg-surface-700/50 transition disabled:opacity-40 disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4" onClick={() => { if (!detailLoading) { setSelectedUser(null); setUserDetail(null); } }}>
          <div className="bg-surface-800 border border-surface-700/50 rounded-2xl w-full max-w-lg shadow-glass animate-scale-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {detailLoading ? (
              <div className="p-8 space-y-4">
                <div className="flex items-center gap-4"><div className="w-16 h-16 rounded-full bg-surface-700 animate-pulse" /><div className="space-y-2"><div className="h-4 w-32 bg-surface-700 rounded animate-pulse" /><div className="h-3 w-24 bg-surface-700/50 rounded animate-pulse" /></div></div>
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-4 bg-surface-700 rounded animate-pulse" />)}
              </div>
            ) : userDetail ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xl font-bold">
                      {userDetail.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">{userDetail.name}</h2>
                      <p className="text-sm text-surface-400">{userDetail.email}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => { setSelectedUser(null); setUserDetail(null); }} className="text-surface-500 hover:text-white transition">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <DetailField label="Role" value={userDetail.role} />
                  <DetailField label="Status" value={userDetail.isSuspended ? "Suspended" : userDetail.status === "online" ? "Online" : "Offline"} />
                  <DetailField label="Verified" value={userDetail.isVerified ? "Yes" : "No"} />
                  <DetailField label="Joined" value={new Date(userDetail.createdAt).toLocaleDateString()} />
                  <DetailField label="Last Active" value={userDetail.lastActive ? new Date(userDetail.lastActive).toLocaleDateString() : "Never"} />
                  <DetailField label="Messages" value={userDetail.messageCount} />
                  <DetailField label="Chats" value={userDetail.chatCount} />
                  <DetailField label="Bio" value={userDetail.bio || "—"} />
                </div>

                <div className="flex flex-wrap gap-2 border-t border-surface-700/30 pt-4">
                  <button type="button" onClick={() => { setConfirmAction({ type: "suspend", userId: userDetail._id }); }}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition border ${userDetail.isSuspended ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"}`}>
                    {userDetail.isSuspended ? "Unsuspend" : "Suspend"}
                  </button>
                  <button type="button" onClick={() => { setRoleModal(userDetail._id); setNewRole(userDetail.role === "admin" ? "user" : "admin"); }}
                    className="px-4 py-2 rounded-xl text-xs font-medium bg-brand-500/10 text-brand-400 border border-brand-500/20 hover:bg-brand-500/20 transition">
                    Change Role
                  </button>
                  <button type="button" onClick={() => { setConfirmAction({ type: "verify", userId: userDetail._id }); }}
                    className="px-4 py-2 rounded-xl text-xs font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 transition">
                    Toggle Verify
                  </button>
                  <button type="button" onClick={() => { setPasswordModal(userDetail._id); setNewPassword(""); }}
                    className="px-4 py-2 rounded-xl text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition">
                    Reset Password
                  </button>
                  {userDetail.role !== "admin" && (
                    <button type="button" onClick={() => { setConfirmAction({ type: "delete", userId: userDetail._id }); }}
                      className="px-4 py-2 rounded-xl text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <ConfirmModal open={confirmAction?.type === "suspend"} title="Toggle User Suspension"
        message="This will toggle the user's suspended status. Suspended users cannot access their account."
        confirmLabel={users.find((u) => u._id === confirmAction?.userId)?.isSuspended ? "Unsuspend" : "Suspend"}
        confirmVariant="danger" onConfirm={() => executeAction(confirmAction)} onCancel={() => setConfirmAction(null)} loading={actionLoading} />

      <ConfirmModal open={confirmAction?.type === "delete"} title="Delete User"
        message="This action is irreversible. The user and all their data will be permanently deleted."
        confirmLabel="Delete" confirmVariant="danger"
        onConfirm={() => executeAction(confirmAction)} onCancel={() => setConfirmAction(null)} loading={actionLoading} />

      <ConfirmModal open={confirmAction?.type === "verify"} title="Toggle Email Verification"
        message="This will toggle the user's email verification status."
        confirmLabel="Toggle" onConfirm={() => executeAction(confirmAction)} onCancel={() => setConfirmAction(null)} loading={actionLoading} />

      <ConfirmModal open={confirmAction?.type === "disable"} title="Disable Account"
        message="This will immediately suspend the account and invalidate all sessions."
        confirmLabel="Disable" confirmVariant="danger"
        onConfirm={() => executeAction(confirmAction)} onCancel={() => setConfirmAction(null)} loading={actionLoading} />

      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4 ${roleModal ? "" : "hidden"}`}>
        <div className="bg-surface-800 border border-surface-700/50 rounded-2xl p-6 w-full max-w-sm shadow-glass animate-scale-in">
          <h3 className="text-base font-semibold text-white mb-4">Change User Role</h3>
          <div className="flex gap-3 mb-6">
            <button type="button" onClick={() => setNewRole("user")}
              className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition border ${newRole === "user" ? "bg-brand-500/15 text-brand-300 border-brand-500/20" : "bg-surface-800/50 text-surface-400 border-surface-700/30 hover:text-white"}`}>User</button>
            <button type="button" onClick={() => setNewRole("admin")}
              className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition border ${newRole === "admin" ? "bg-brand-500/15 text-brand-300 border-brand-500/20" : "bg-surface-800/50 text-surface-400 border-surface-700/30 hover:text-white"}`}>Admin</button>
          </div>
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => setRoleModal(null)} disabled={actionLoading}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-surface-300 hover:text-white hover:bg-surface-700 transition disabled:opacity-40">Cancel</button>
            <button type="button" onClick={handleRoleChange} disabled={actionLoading}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-brand-500/15 text-brand-300 border border-brand-500/20 hover:bg-brand-500/25 transition disabled:opacity-40">
              {actionLoading ? "Processing..." : "Change Role"}
            </button>
          </div>
        </div>
      </div>

      <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in p-4 ${passwordModal ? "" : "hidden"}`}>
        <div className="bg-surface-800 border border-surface-700/50 rounded-2xl p-6 w-full max-w-sm shadow-glass animate-scale-in">
          <h3 className="text-base font-semibold text-white mb-4">Reset User Password</h3>
          <input type="password" placeholder="New password (min 8 chars)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-surface-800/50 border border-surface-700/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-surface-500 outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 transition-all mb-6" />
          <div className="flex gap-3 justify-end">
            <button type="button" onClick={() => { setPasswordModal(null); setNewPassword(""); }} disabled={actionLoading}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-surface-300 hover:text-white hover:bg-surface-700 transition disabled:opacity-40">Cancel</button>
            <button type="button" onClick={handlePasswordReset} disabled={actionLoading || newPassword.length < 8}
              className="px-5 py-2.5 rounded-xl text-sm font-medium bg-brand-500/15 text-brand-300 border border-brand-500/20 hover:bg-brand-500/25 transition disabled:opacity-40">
              {actionLoading ? "Processing..." : "Reset Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailField = ({ label, value }) => (
  <div className="bg-surface-800/50 rounded-xl p-3">
    <p className="text-[10px] text-surface-500 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm text-white font-medium truncate">{value ?? "—"}</p>
  </div>
);

export default Users;

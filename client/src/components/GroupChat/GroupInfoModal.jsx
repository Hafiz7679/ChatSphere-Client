import { useState } from "react";
import { addToGroup, removeFromGroup, renameGroup } from "../../api/api";
import toast from "react-hot-toast";
import useChatStore from "../../store/useChatStore";
import Avatar from "../Avatar/Avatar";

const GroupInfoModal = ({ chat, allUsers, onClose }) => {
  const [newName, setNewName] = useState(chat.chatName || "");
  const [loading, setLoading] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = (chat.groupAdmin?._id || chat.groupAdmin) === currentUser?._id;
  const members = chat.users || [];
  const nonMembers = (allUsers || []).filter((u) => !members.find((m) => (m._id || m) === u._id));

  const handleRename = async () => {
    if (!newName.trim() || newName === chat.chatName) return;
    try { setLoading(true); const res = await renameGroup({ chatId: chat._id, chatName: newName.trim() }); useChatStore.getState().addChat(res.data.data); toast.success("Group renamed"); } catch (e) { toast.error(e.response?.data?.message || "Failed"); } finally { setLoading(false); }
  };

  const handleAdd = async (userId) => {
    try { setLoading(true); const res = await addToGroup({ chatId: chat._id, userId }); useChatStore.getState().addChat(res.data.data); toast.success("Member added"); } catch (e) { toast.error(e.response?.data?.message || "Failed"); } finally { setLoading(false); }
  };

  const handleRemove = async (userId) => {
    if (userId === currentUser?._id || !window.confirm("Remove this member?")) return;
    try { setLoading(true); const res = await removeFromGroup({ chatId: chat._id, userId }); useChatStore.getState().addChat(res.data.data); toast.success("Member removed"); } catch (e) { toast.error(e.response?.data?.message || "Failed"); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-navy-900 border border-surface-700/30 rounded-2xl shadow-glass w-full max-w-md max-h-[80vh] flex flex-col animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-surface-700/30">
          <h2 className="text-lg font-semibold text-white">Group Info</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div className="flex flex-col items-center gap-3">
            <Avatar name={chat.chatName || "G"} size="xl" />
            {isAdmin ? (
              <div className="flex items-center gap-2 w-full">
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 bg-surface-800/50 border border-surface-700/30 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 transition" />
                <button type="button" onClick={handleRename} disabled={loading || !newName.trim()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white text-sm font-medium hover:shadow-brand-500/30 transition disabled:opacity-50">Save</button>
              </div>
            ) : <h3 className="text-lg font-semibold text-white">{chat.chatName}</h3>}
            <p className="text-xs text-surface-500">{members.length} members</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Members</p>
            <div className="space-y-1">
              {members.map((member) => {
                const mId = member._id || member;
                const mName = member.name || "User";
                const isAdminUser = (chat.groupAdmin?._id || chat.groupAdmin) === mId;
                return (
                  <div key={mId} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-800/50">
                    <Avatar name={mName} size="sm" />
                    <div className="flex-1"><p className="text-sm font-medium text-white">{mName}{isAdminUser && <span className="text-[10px] text-brand-400 ml-2">Admin</span>}</p></div>
                    {isAdmin && !isAdminUser && <button type="button" onClick={() => handleRemove(mId)} className="text-xs text-red-400 hover:text-red-300 font-medium">Remove</button>}
                  </div>
                );
              })}
            </div>
          </div>
          {isAdmin && nonMembers.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-3">Add Members</p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {nonMembers.map((user) => (
                  <button key={user._id} type="button" onClick={() => handleAdd(user._id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-800/50 transition">
                    <Avatar name={user.name} size="sm" />
                    <div className="flex-1 text-left"><p className="text-sm font-medium text-white">{user.name}</p></div>
                    <span className="text-xs text-brand-400 font-medium">Add</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupInfoModal;

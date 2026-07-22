import { useState } from "react";
import { createGroupChat } from "../../api/api";
import toast from "react-hot-toast";
import useChatStore from "../../store/useChatStore";
import Button from "../Button/Button";
import Avatar from "../Avatar/Avatar";

const CreateGroupModal = ({ users, onClose }) => {
  const [name, setName] = useState("");
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggle = (id) => setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const handleCreate = async () => {
    if (!name.trim()) { toast.error("Group name is required"); return; }
    if (selected.length < 2) { toast.error("Select at least 2 members"); return; }
    try {
      setLoading(true);
      const res = await createGroupChat({ name: name.trim(), users: selected });
      useChatStore.getState().addChat(res.data.data);
      toast.success("Group created");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-navy-900 border border-surface-700/30 rounded-2xl shadow-glass w-full max-w-md max-h-[80vh] flex flex-col animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-surface-700/30">
          <h2 className="text-lg font-semibold text-white">New Group</h2>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-5 border-b border-surface-700/30">
          <input type="text" placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full bg-surface-800/50 border border-surface-700/30 rounded-xl px-4 py-3 text-sm text-white placeholder:text-surface-500 outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 transition" />
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <p className="text-xs font-medium text-surface-500 px-2 py-2">Select members ({selected.length})</p>
          {users.filter((u) => u._id).map((user) => {
            const sel = selected.includes(user._id);
            return (
              <button key={user._id} type="button" onClick={() => toggle(user._id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${sel ? "bg-brand-500/10" : "hover:bg-surface-800/50"}`}>
                <Avatar name={user.name} size="sm" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-surface-500">{user.email}</p>
                </div>
                <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition ${sel ? "bg-brand-500 border-brand-500" : "border-surface-600"}`}>
                  {sel && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
              </button>
            );
          })}
        </div>
        <div className="p-5 border-t border-surface-700/30">
          <Button onClick={handleCreate} disabled={loading || !name.trim() || selected.length < 2}>
            {loading ? "Creating..." : `Create Group (${selected.length})`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;

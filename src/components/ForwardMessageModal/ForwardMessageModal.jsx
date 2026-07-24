import { useState, useEffect, useMemo, useRef } from "react";
import { getUsers, createChat, sendMessage } from "../../api/api";
import useChatStore from "../../store/useChatStore";
import { getSocket } from "../../socket/socket";
import Loader from "../Loader/Loader";
import { X, Search, CheckCircle } from "lucide-react";

const ForwardMessageModal = ({ message, onClose }) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const currentUser = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "null"),
    []
  );
  const { setActiveChat, addChat, addMessage } = useChatStore();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    searchRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        const others = (res.data.users || []).filter((u) => u._id !== currentUser?._id);
        setUsers(others);
      } catch {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentUser]);

  const filtered = search.trim()
    ? users.filter((u) => u.name?.toLowerCase().includes(search.toLowerCase()))
    : users;

  const handleSend = async () => {
    if (!selected) return;
    setSending(true);
    try {
      const chatRes = await createChat(selected._id);
      const chatData = chatRes.data?.data || chatRes.data;
      if (chatData) {
        addChat(chatData);
      }
      const msgPayload = {
        sender: currentUser._id,
        receiver: selected._id,
        text: message.content || message.text || "",
        forwarded: true,
        attachments: message.attachments || [],
      };
      const tempId = `temp-${Date.now()}`;
      const tempMsg = {
        _id: tempId,
        sender: { _id: currentUser._id, name: currentUser.name, avatar: currentUser.avatar },
        content: msgPayload.text,
        text: msgPayload.text,
        attachments: msgPayload.attachments,
        chat: selected._id,
        status: "sending",
        forwarded: true,
        createdAt: new Date().toISOString(),
        receiver: selected._id,
      };
      addMessage(tempMsg);
      const res = await sendMessage(msgPayload);
      getSocket().emit("send_message", res.data.data);
      addMessage(res.data.data);
      setActiveChat(selected);
      onClose();
    } catch {
      onClose();
    } finally {
      setSending(false);
    }
  };

  return (
    <>
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Forward message" onClick={onClose}>
        <div
          className="bg-surface-800 border border-surface-700/30 rounded-2xl shadow-glass w-full max-w-md mx-4 animate-scale-in overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-700/30">
            <h3 className="text-base font-semibold text-white">Forward Message</h3>
            <button type="button" aria-label="Close forward message modal" onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                ref={searchRef}
                aria-label="Search users"
                className="w-full bg-surface-700/50 border border-surface-600/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-surface-500 outline-none focus:border-brand-500/50 transition"
              />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {loading ? (
                <Loader className="py-8" />
              ) : filtered.length === 0 ? (
                <p className="text-sm text-surface-500 text-center py-8">No users found</p>
              ) : (
                filtered.map((user) => (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => setSelected(user)}
                    aria-label={"Forward to " + user.name}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 ${
                      selected?._id === user._id
                        ? "bg-brand-500/15 text-white"
                        : "text-surface-300 hover:bg-surface-700/50 hover:text-white"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-semibold text-xs shrink-0">
                      {user.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <span className="truncate">{user.name}</span>
                    {selected?._id === user._id && (
                      <CheckCircle className="w-5 h-5 text-brand-400 ml-auto shrink-0" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-surface-700/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-surface-300 hover:text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={!selected || sending}
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white hover:from-brand-600 hover:to-accent-600 disabled:opacity-40 disabled:cursor-not-allowed transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForwardMessageModal;

import { useState, useEffect, useMemo } from "react";
import { getUsers, createChat, sendMessage } from "../../api/api";
import useChatStore from "../../store/useChatStore";
import { getSocket } from "../../socket/socket";
import Loader from "../Loader/Loader";

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
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center" onClick={onClose}>
        <div
          className="bg-surface-800 border border-surface-700/30 rounded-2xl shadow-glass w-full max-w-md mx-4 animate-scale-in overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-700/30">
            <h3 className="text-base font-semibold text-white">Forward Message</h3>
            <button type="button" onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <div className="relative mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
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
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
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
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-brand-400 ml-auto shrink-0">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
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
              className="px-4 py-2 text-sm font-medium text-surface-300 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={!selected || sending}
              className="px-5 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white hover:from-brand-600 hover:to-accent-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
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

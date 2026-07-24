import { memo, useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import useChatStore from "../../store/useChatStore";
import CreateGroupModal from "../GroupChat/CreateGroupModal";
import Avatar from "../Avatar/Avatar";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

const currentUser = (() => {
  try { return JSON.parse(localStorage.getItem("user")); }
  catch { return null; }
})();

const Sidebar = ({
  users,
  usersLoading,
  onlineUsers,
  selectedUser,
  onSelectUser,
  unreadCounts,
}) => {
  const [search, setSearch] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [tab, setTab] = useState("chats");
  const navigate = useNavigate();
  const chats = useChatStore((s) => s.chats);
  const rawArchived = useChatStore((s) => s.archivedChats);
  const rawPinned = useChatStore((s) => s.pinnedChats);
  const archivedChats = useMemo(() => rawArchived || [], [rawArchived]);
  const pinnedChats = useMemo(() => rawPinned || [], [rawPinned]);

  const chatConversations = useMemo(() => {
    return chats.filter((c) => !c.isGroupChat);
  }, [chats]);

  const pinnedConversations = useMemo(() => {
    return chatConversations.filter((c) => pinnedChats.includes(c._id));
  }, [chatConversations, pinnedChats]);

  const normalConversations = useMemo(() => {
    return chatConversations.filter((c) => !pinnedChats.includes(c._id) && !archivedChats.includes(c._id));
  }, [chatConversations, pinnedChats, archivedChats]);

  const archivedConversations = useMemo(() => {
    return chatConversations.filter((c) => archivedChats.includes(c._id));
  }, [chatConversations, archivedChats]);

  const [showArchived, setShowArchived] = useState(false);

  const lastMessageText = (chat) => {
    if (!chat.latestMessage) return "";
    return chat.latestMessage.content || chat.latestMessage.text || "Sent a message";
  };

  const getOtherUser = (chat) => {
    if (!chat.users || chat.users.length < 2) return null;
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    return chat.users.find((u) => (u._id || u) !== currentUser?._id) || chat.users[0];
  };

  const getDisplayUser = useCallback((chat) => {
    const other = getOtherUser(chat);
    if (typeof other === "object" && other !== null) return other;
    return users.find((u) => u._id === other) || null;
  }, [users]);

  const getChatTime = (chat) => {
    const date = chat.latestMessage?.createdAt || chat.updatedAt;
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getLastTime = (item) => {
    const date = item.latestMessage?.createdAt || item.updatedAt;
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const filteredUsers = useMemo(
    () => users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase())),
    [users, search]
  );

  const allDisplayChats = useMemo(
    () => [...pinnedConversations, ...normalConversations],
    [pinnedConversations, normalConversations]
  );

  const filteredChats = useMemo(
    () => allDisplayChats.filter((c) => {
      const other = getDisplayUser(c);
      return other ? other.name.toLowerCase().includes(search.toLowerCase()) : true;
    }),
    [allDisplayChats, search, getDisplayUser]
  );

  const filteredGroups = useMemo(
    () => chats.filter((c) => c.isGroupChat && c.chatName?.toLowerCase().includes(search.toLowerCase())),
    [chats, search]
  );

  const allOnlineUsers = onlineUsers;

  return (
    <div className="flex flex-col w-full h-full bg-navy-900 border-r border-surface-700/30">
      <div className="px-4 md:px-5 pt-4 md:pt-5 pb-2 md:pb-3 border-b border-surface-700/20">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-2.5">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-3.5 h-3.5 md:w-4 md:h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.06 0-2.077-.163-3.02-.463L3 21l1.395-3.72C3.512 16.014 3 14.56 3 13c0-4.418 4.03-8 9-8s9 3.582 9 7z" />
              </svg>
            </div>
            <span className="text-sm md:text-base font-bold text-white tracking-tight">ChatSphere</span>
          </div>
          <div className="flex items-center gap-0.5 md:gap-1">
            <button
              type="button"
              onClick={() => setShowCreateGroup(true)}
              className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-800 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 md:w-4 md:h-4">
                <path strokeLinecap="round" d="M12 5v14M5 12h14" />
              </svg>
            </button>
            {currentUser?.role === "admin" && (
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-brand-400 hover:text-brand-300 hover:bg-brand-500/10 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 md:w-4 md:h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-800 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <circle cx="12" cy="8" r="4" />
                <path strokeLinecap="round" d="M20 21a8 8 0 10-16 0" />
              </svg>
            </button>
            <ThemeToggle />
          </div>
        </div>
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 md:w-4 md:h-4 absolute left-3 md:left-3.5 top-1/2 -translate-y-1/2 text-surface-500 pointer-events-none">
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-800/50 border border-surface-700/30 rounded-xl pl-9 md:pl-10 pr-3 md:pr-4 py-2 md:py-2.5 text-xs md:text-sm text-white placeholder:text-surface-500 outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 transition-all"
          />
        </div>
        <div className="flex gap-1 mt-2 md:mt-3">
          {["chats", "users", "groups"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`flex-1 py-1 md:py-1.5 text-[10px] md:text-xs font-medium rounded-lg capitalize transition-all ${
                tab === t
                  ? "bg-brand-500/15 text-brand-300 border border-brand-500/20"
                  : "text-surface-400 hover:text-surface-300"
              }`}
            >
              {t} {t === "groups" && chats.filter((c) => c.isGroupChat).length > 0 && `(${chats.filter((c) => c.isGroupChat).length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {usersLoading ? (
          <div className="px-4 md:px-5 space-y-1 md:space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2.5 md:gap-3 px-2 md:px-3 py-2.5 md:py-3 rounded-xl">
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-surface-800 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 bg-surface-800 rounded animate-pulse" />
                  <div className="h-2.5 w-1/2 bg-surface-800/50 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : tab === "groups" ? (
          filteredGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-surface-500 gap-3 px-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-surface-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm font-medium">No groups yet</p>
              <button
                type="button"
                onClick={() => setShowCreateGroup(true)}
                className="text-xs text-brand-400 hover:text-brand-300 transition"
              >
                Create a group
              </button>
            </div>
          ) : (
            <div className="px-2 space-y-0.5">
              {filteredGroups.map((chat) => {
                const unread = unreadCounts?.[chat._id] || 0;
                return (
                  <button
                    key={chat._id}
                    type="button"
                    onClick={() => onSelectUser({ _id: chat._id, name: chat.chatName || "Group", isGroup: true, chat })}
                    className={`w-full flex items-center gap-2.5 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-left transition-all duration-200 ${
                      selectedUser?._id === chat._id ? "bg-brand-500/10 border border-brand-500/20" : "hover:bg-surface-800/50 border border-transparent"
                    }`}
                  >
                    <Avatar name={chat.chatName || "G"} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium text-sm text-white truncate">{chat.chatName}</h3>
                        <span className="text-[10px] text-surface-500 shrink-0">{getLastTime(chat)}</span>
                      </div>
                      <p className="text-xs text-surface-500 truncate mt-0.5">{chat.users?.length || 0} members</p>
                    </div>
                    {unread > 0 && (
                      <span className="shrink-0 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-brand-500 text-white text-[10px] font-bold">
                        {unread > 99 ? "99+" : unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )
        ) : tab === "users" ? (
          /* Users tab - show all discoverable users */
          filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-surface-500 gap-3 px-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-surface-600">
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="m21 21-4.3-4.3" />
              </svg>
              <p className="text-sm font-medium">{search ? "No results" : "No users yet"}</p>
              <p className="text-xs text-surface-500">Invite friends to start chatting</p>
            </div>
          ) : (
            <div className="px-2 space-y-0.5">
              {filteredUsers.map((user) => {
                const isOnline = allOnlineUsers.includes(user._id);
                const isSelected = selectedUser?._id === user._id;
                const unreadCount = unreadCounts?.[user._id] || 0;
                return (
                  <button
                    key={user._id}
                    type="button"
                    onClick={() => onSelectUser(user)}
                    className={`w-full flex items-center gap-2.5 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-left transition-all duration-200 ${
                      isSelected ? "bg-brand-500/10 border border-brand-500/20" : "hover:bg-surface-800/50 border border-transparent"
                    }`}
                  >
                    <Avatar src={user.avatar} name={user.name} size="sm" status={isOnline ? "online" : "offline"} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium text-sm text-white truncate">{user.name}</h3>
                      </div>
                      <p className="text-xs text-surface-500 truncate mt-0.5">
                        {isOnline ? <span className="text-emerald-400 font-medium">Online</span> : "Offline"}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <span className="shrink-0 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-brand-500 text-white text-[10px] font-bold">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )
        ) : (
          /* Chats tab - show actual conversations */
          filteredChats.length === 0 && !showArchived ? (
            <div className="flex flex-col items-center justify-center h-48 text-surface-500 gap-3 px-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-surface-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8-1.06 0-2.077-.163-3.02-.463L3 21l1.395-3.72C3.512 16.014 3 14.56 3 13c0-4.418 4.03-8 9-8s9 3.582 9 7z" />
              </svg>
              <p className="text-sm font-medium">No conversations yet</p>
              <p className="text-xs text-surface-500">Browse the Users tab to start a chat</p>
            </div>
          ) : showArchived ? (
            archivedConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-surface-500 gap-3 px-6 text-center">
                <p className="text-sm font-medium">No archived chats</p>
                <button type="button" onClick={() => setShowArchived(false)} className="text-xs text-brand-400 hover:text-brand-300 transition">Back to chats</button>
              </div>
            ) : (
              <div className="px-2 space-y-0.5">
                {archivedConversations.map((chat) => {
                  const otherUser = getDisplayUser(chat);
                  const chatId = chat._id;
                  const unread = unreadCounts?.[otherUser?._id || chatId] || 0;
                  const isOnline = otherUser ? allOnlineUsers.includes(otherUser._id) : false;
                  const isSelected = selectedUser?._id === (otherUser?._id || chatId);
                  return (
                    <button
                      key={chat._id}
                      type="button"
                      onClick={() => { if (otherUser) onSelectUser(otherUser); }}
                      className={`w-full flex items-center gap-2.5 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-left transition-all duration-200 ${isSelected ? "bg-brand-500/10 border border-brand-500/20" : "hover:bg-surface-800/50 border border-transparent"}`}
                    >
                      <Avatar src={otherUser?.avatar} name={otherUser?.name || "?"} size="sm" status={isOnline ? "online" : "offline"} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-medium text-sm text-white truncate">{otherUser?.name || "Unknown"}</h3>
                          <span className="text-[10px] text-surface-500 shrink-0">{getChatTime(chat)}</span>
                        </div>
                        <p className="text-xs text-surface-400 truncate mt-0.5">Archived</p>
                      </div>
                      {unread > 0 && (
                        <span className="shrink-0 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-surface-600 text-white text-[10px] font-bold">{unread > 99 ? "99+" : unread}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )
          ) : (
            <div className="px-2 space-y-0.5">
              {filteredChats.map((chat) => {
                const otherUser = getDisplayUser(chat);
                const chatId = chat._id;
                const unread = unreadCounts?.[otherUser?._id || chatId] || 0;
                const isOnline = otherUser ? allOnlineUsers.includes(otherUser._id) : false;
                const isSelected = selectedUser?._id === (otherUser?._id || chatId);
                const isPinned = pinnedChats.includes(chatId);
                return (
                  <button
                    key={chat._id}
                    type="button"
                    onClick={() => {
                      if (otherUser) onSelectUser(otherUser);
                    }}
                    className={`w-full flex items-center gap-2.5 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-left transition-all duration-200 ${isSelected ? "bg-brand-500/10 border border-brand-500/20" : "hover:bg-surface-800/50 border border-transparent"} ${isPinned ? "opacity-90" : ""}`}
                  >
                    <Avatar src={otherUser?.avatar} name={otherUser?.name || "?"} size="sm" status={isOnline ? "online" : "offline"} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-medium text-sm text-white truncate">{otherUser?.name || "Unknown"}</h3>
                        <span className="text-[10px] text-surface-500 shrink-0">{getChatTime(chat)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {isPinned && <span className="text-[10px] text-brand-400 shrink-0">📌</span>}
                        <p className="text-xs text-surface-500 truncate">{lastMessageText(chat)}</p>
                      </div>
                    </div>
                    {unread > 0 && (
                      <span className="shrink-0 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-brand-500 text-white text-[10px] font-bold">
                        {unread > 99 ? "99+" : unread}
                      </span>
                    )}
                  </button>
                );
              })}
              {archivedConversations.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowArchived(true)}
                  className="w-full flex items-center gap-2.5 md:gap-3 px-3 md:px-4 py-2.5 md:py-3 rounded-xl text-left transition-all duration-200 hover:bg-surface-800/50 border border-transparent"
                >
                  <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-surface-800 flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-surface-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-surface-300">Archived</h3>
                    <p className="text-xs text-surface-500 mt-0.5">{archivedConversations.length} chat{archivedConversations.length > 1 ? "s" : ""}</p>
                  </div>
                </button>
              )}
            </div>
          )
        )}
      </div>

      {showCreateGroup && <CreateGroupModal users={users} onClose={() => setShowCreateGroup(false)} />}

      <div className="px-4 md:px-5 py-2 md:py-3 border-t border-surface-700/20">
        <p className="text-[10px] text-surface-500 text-center tracking-wider">
          Powered by <span className="text-surface-400 font-medium">Hafiz</span>
        </p>
      </div>
    </div>
  );
};

export default memo(Sidebar);
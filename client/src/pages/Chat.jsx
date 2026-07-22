import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSocket } from "../socket/socket";
import { getUsers, getMessages, getChats, createChat, sendMessage } from "../api/api";
import useChatStore from "../store/useChatStore";
import useSocket from "../hooks/useSocket";
import useMessageSync from "../hooks/useMessageSync";
import useTheme from "../hooks/useTheme";
import usePushNotifications from "../hooks/usePushNotifications";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatHeader from "../components/ChatHeader/ChatHeader";
import ChatBody from "../components/ChatBody/ChatBody";
import MessageInput from "../components/MessageInput/MessageInput";
import CallHandler from "../components/CallUI/CallHandler";
import Loader from "../components/Loader/Loader";
import toast from "react-hot-toast";

const GifPicker = lazy(() => import("../components/GifPicker/GifPicker"));
const MediaGallery = lazy(() => import("../components/MediaGallery/MediaGallery"));
const MessageSearch = lazy(() => import("../components/MessageSearch/MessageSearch"));
const IncomingCallModal = lazy(() => import("../components/CallUI/IncomingCallModal"));
const OutgoingCallUI = lazy(() => import("../components/CallUI/OutgoingCallUI"));
const ActiveCallUI = lazy(() => import("../components/CallUI/ActiveCallUI"));
const ConnectingCallUI = lazy(() => import("../components/CallUI/ConnectingCallUI"));
const EmptyState = lazy(() => import("../components/EmptyState/EmptyState"));

const Chat = () => {
  const navigate = useNavigate();
  const currentUser = useMemo(
    () => JSON.parse(localStorage.getItem("user") || "null"),
    []
  );
  const currentUserId = currentUser?._id;

  const [replyTo, setReplyTo] = useState(null);
  const [users, setUsers] = useState([]);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);
  const [usersLoading, setUsersLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = useCallback((e) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!touchStart) return;
    const dx = e.changedTouches[0].clientX - touchStart.x;
    const dy = e.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 80 && Math.abs(dy) < 100) {
      if (dx > 0 && !mobileChatOpen) setMobileChatOpen(true);
      else if (dx < 0 && mobileChatOpen) setMobileChatOpen(false);
    }
    setTouchStart(null);
  }, [touchStart, mobileChatOpen]);

  const callActionsRef = useRef({});
  const activeChatRef = useRef(null);
  const usersRef = useRef([]);
  const soundEnabledRef = useRef(true);
  const isCallActiveRef = useRef(false);

  const onlineUsers = useChatStore((s) => s.onlineUsers);
  const activeChat = useChatStore((s) => s.activeChat);
  const messages = useChatStore((s) => s.messages);
  const isTyping = useChatStore((s) => s.isTyping);
  const unreadCounts = useChatStore((s) => s.unreadCounts);
  const soundEnabled = useChatStore((s) => s.soundEnabled);
  const isCallActive = useChatStore((s) => s.isCallActive);
  const callData = useChatStore((s) => s.callData);
  const callStatus = useChatStore((s) => s.callStatus);
  const setActiveChat = useChatStore((s) => s.setActiveChat);
  const setMessages = useChatStore((s) => s.setMessages);
  const addMessage = useChatStore((s) => s.addMessage);
  const replaceTempMessage = useChatStore((s) => s.replaceTempMessage);
  const updateMessage = useChatStore((s) => s.updateMessage);
  const setIsTyping = useChatStore((s) => s.setIsTyping);
  const setTypingUser = useChatStore((s) => s.setTypingUser);
  const clearUnread = useChatStore((s) => s.clearUnread);
  const setChats = useChatStore((s) => s.setChats);

  useSocket();
  useMessageSync();
  usePushNotifications();
  const { theme } = useTheme();

  useEffect(() => { activeChatRef.current = activeChat; }, [activeChat]);
  useEffect(() => { usersRef.current = users; }, [users]);
  useEffect(() => { soundEnabledRef.current = soundEnabled; }, [soundEnabled]);
  useEffect(() => { isCallActiveRef.current = isCallActive; }, [isCallActive]);

  useEffect(() => {
    if (!currentUserId) {
      navigate("/login");
      return;
    }
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    return () => {
      const socket = getSocket();
      socket.off("typing");
      socket.off("stop_typing");
      socket.off("message_reacted");
      socket.off("messages_read");
      socket.off("message_status_updated");
      socket.off("incoming_call");
      socket.off("call_accepted");
      socket.off("call_rejected");
      socket.off("call_ended");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice_candidate");
    };
  }, [currentUserId, navigate]);

  useEffect(() => {
    if (!currentUserId) return;
    const socket = getSocket();

    const handleTyping = ({ sender }) => {
      const active = activeChatRef.current;
      if (active && sender === active._id) {
        setTypingUser(sender);
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ sender }) => {
      const active = activeChatRef.current;
      if (active && sender === active._id) {
        setTypingUser(null);
        setIsTyping(false);
      }
    };

    const handleMessageReacted = ({ messageId, emoji, userId, remove }) => {
      const msgs = useChatStore.getState().messages;
      const msg = msgs.find((m) => m._id === messageId);
      if (msg) {
        let reactions = [...(msg.reactions || [])];
        if (remove) {
          reactions = reactions.filter(
            (r) => !(r.emoji === emoji && (r.user?._id || r.user) === userId)
          );
        } else {
          const existing = reactions.find(
            (r) => r.emoji === emoji && (r.user?._id || r.user) === userId
          );
          if (!existing) reactions.push({ emoji, user: userId });
        }
        updateMessage(messageId, { reactions });
      }
    };

    const handleMessagesRead = ({ chatId }) => {
      const msgs = useChatStore.getState().messages;
      msgs.forEach((msg) => {
        if (msg.sender?._id !== currentUserId && msg.status !== "read") {
          updateMessage(msg._id, { status: "read" });
        }
      });
    };

    const handleMessageStatusUpdated = ({ messageId, status }) => {
      const msgs = useChatStore.getState().messages;
      if (msgs.some((m) => m._id === messageId)) {
        updateMessage(messageId, { status });
      }
    };

    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);
    socket.on("message_reacted", handleMessageReacted);
    socket.on("messages_read", handleMessagesRead);
    socket.on("message_status_updated", handleMessageStatusUpdated);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
      socket.off("message_reacted", handleMessageReacted);
      socket.off("messages_read", handleMessagesRead);
      socket.off("message_status_updated", handleMessageStatusUpdated);
    };
  }, [currentUserId, setIsTyping, setTypingUser, updateMessage]);

  useEffect(() => {
    if (!currentUserId) return;
    let cancelled = false;
    const loadUsers = async () => {
      try {
        setUsersLoading(true);
        const [usersRes, chatsRes] = await Promise.all([
          getUsers().catch(() => ({ data: { users: [] } })),
          getChats().catch(() => ({ data: { data: [] } })),
        ]);
        if (cancelled) return;
        const otherUsers = (usersRes.data.users || []).filter(
          (u) => u._id !== currentUserId
        );
        setUsers(otherUsers);
        if (chatsRes.data?.data) setChats(chatsRes.data.data);
        const existingChats = chatsRes.data?.data || [];
        if (existingChats.length > 0 && !activeChatRef.current) {
          const sorted = [...existingChats].sort(
            (a, b) =>
              new Date(b.updatedAt || b.createdAt) -
              new Date(a.updatedAt || a.createdAt)
          );
          const latest = sorted[0];
          if (!latest.isGroupChat && latest.users) {
            const other = latest.users.find(
              (u) => (u._id || u) !== currentUserId
            );
            const otherUser =
              typeof other === "object"
                ? other
                : otherUsers.find((u) => u._id === other);
            if (otherUser) setActiveChat(otherUser);
          } else if (latest.isGroupChat) {
            setActiveChat({
              _id: latest._id,
              name: latest.chatName,
              isGroup: true,
              chat: latest,
            });
          }
        } else if (otherUsers.length > 0 && !activeChatRef.current) {
          setActiveChat(otherUsers[0]);
        }
      } catch {
      } finally {
        if (!cancelled) setUsersLoading(false);
      }
    };
    loadUsers();
    return () => { cancelled = true; };
  }, [currentUserId, setActiveChat, setChats]);

  useEffect(() => {
    if (!activeChat || !currentUserId) return;
    let cancelled = false;
    const loadMessages = async () => {
      try {
        setMessagesLoading(true);
        setPage(1);
        setHasMore(true);
        const response = await getMessages(currentUserId, activeChat._id, {
          page: 1,
          limit: 50,
        });
        if (cancelled) return;
        const data = response.data.data || [];
        setMessages(data);
        if (data.length < 50) setHasMore(false);
        clearUnread(activeChat._id);
        const socket = getSocket();
        socket.emit("mark_as_read", {
          chatId: activeChat._id,
          senderId: currentUserId,
        });
      } catch {
      } finally {
        if (!cancelled) setMessagesLoading(false);
      }
    };
    loadMessages();
    return () => { cancelled = true; };
  }, [activeChat, currentUserId, setMessages, clearUnread]);

  const handleLoadMore = useCallback(async () => {
    if (!activeChat || !currentUserId || !hasMore || messagesLoading) return;
    try {
      const nextPage = page + 1;
      const response = await getMessages(currentUserId, activeChat._id, {
        page: nextPage,
        limit: 50,
      });
      const data = response.data.data || [];
      if (data.length < 50) setHasMore(false);
      const existingIds = new Set(
        useChatStore.getState().messages.map((m) => m._id)
      );
      const newMessages = data.filter((m) => !existingIds.has(m._id));
      if (newMessages.length > 0) {
        setMessages([...newMessages, ...useChatStore.getState().messages]);
      }
      setPage(nextPage);
    } catch {
    }
  }, [activeChat, currentUserId, hasMore, messagesLoading, page, setMessages]);

  const handleSelectUser = useCallback(
    async (user) => {
      setActiveChat(user);
      setMobileChatOpen(true);
      setReplyTo(null);
      const chatsList = useChatStore.getState().chats;
      const existingChat = chatsList.find(
        (c) =>
          !c.isGroupChat &&
          c.users.some((u) => (u._id || u) === user._id)
      );
      if (!existingChat) {
        try {
          const res = await createChat(user._id);
          if (res.data) {
            useChatStore.getState().addChat(res.data.data || res.data);
          }
        } catch {}
      }
      clearUnread(user._id);
    },
    [clearUnread, setActiveChat]
  );

  const handleBack = useCallback(() => {
    setMobileChatOpen(false);
    setReplyTo(null);
  }, []);

  const handleReplyMessage = useCallback((message) => {
    setReplyTo(message);
  }, []);

  const handleAudioCall = useCallback(() => {
    if (activeChat && callActionsRef.current.startCall) {
      callActionsRef.current.startCall(activeChat._id, "audio");
    }
  }, [activeChat]);

  const handleVideoCall = useCallback(() => {
    if (activeChat && callActionsRef.current.startCall) {
      callActionsRef.current.startCall(activeChat._id, "video");
    }
  }, [activeChat]);

  const handleTogglePin = useCallback(() => {
    const { togglePinnedChat } = useChatStore.getState();
    if (activeChat) togglePinnedChat(activeChat._id);
  }, [activeChat]);

  const handleToggleArchive = useCallback(() => {
    const { toggleArchivedChat } = useChatStore.getState();
    if (activeChat) toggleArchivedChat(activeChat._id);
  }, [activeChat]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    async (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      const files = e.dataTransfer.files;
      if (!files.length || !activeChat) return;
      const file = files[0];
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File too large. Max 50MB.");
        return;
      }
      try {
        const fd = new FormData();
        fd.append("file", file);
        const { default: api } = await import("../api/api");
        const uploadRes = await api.post("/upload", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const attachmentData = uploadRes.data.data;
        const msgPayload = {
          sender: currentUserId,
          receiver: activeChat._id,
          text: "",
          attachments: [
            {
              url: attachmentData.url,
              type: attachmentData.type,
              name: attachmentData.name,
              size: attachmentData.size,
            },
          ],
        };
        const tempId = `temp-${Date.now()}`;
        const tempMsg = {
          _id: tempId,
          sender: {
            _id: currentUserId,
            name: currentUser.name,
            avatar: currentUser.avatar,
          },
          content: "",
          text: "",
          attachments: msgPayload.attachments,
          chat: activeChat._id,
          status: "sending",
          createdAt: new Date().toISOString(),
          receiver: activeChat._id,
        };
        addMessage(tempMsg);
        const response = await sendMessage(msgPayload);
        const socket = getSocket();
        socket.emit("send_message", response.data.data);
        replaceTempMessage(tempId, response.data.data);
      } catch {
        toast.error("Failed to upload file");
      }
    },
    [activeChat, currentUserId, currentUser, addMessage, replaceTempMessage]
  );

  const handleGifSelect = useCallback(
    async (url) => {
      setShowGifPicker(false);
      if (!activeChat) return;
      try {
        const msgPayload = {
          sender: currentUserId,
          receiver: activeChat._id,
          text: "",
          attachments: [{ url, type: "image/gif", name: "GIF", size: 0 }],
        };
        const tempId = `temp-${Date.now()}`;
        const tempMsg = {
          _id: tempId,
          sender: {
            _id: currentUserId,
            name: currentUser.name,
            avatar: currentUser.avatar,
          },
          content: "",
          text: "",
          attachments: msgPayload.attachments,
          chat: activeChat._id,
          status: "sending",
          createdAt: new Date().toISOString(),
          receiver: activeChat._id,
        };
        addMessage(tempMsg);
        const response = await sendMessage(msgPayload);
        const socket = getSocket();
        socket.emit("send_message", response.data.data);
        replaceTempMessage(tempId, response.data.data);
      } catch {
        toast.error("Failed to send GIF");
      }
    },
    [activeChat, currentUserId, currentUser, addMessage, replaceTempMessage]
  );

  if (!currentUserId) return null;

  const callerUser = callData?.callerId
    ? users.find((u) => u._id === callData.callerId)
    : null;

  return (
      <div
        className="flex h-screen w-full overflow-hidden bg-navy-950"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
      {dragOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-navy-900/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed border-brand-500/50 bg-navy-800/50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-brand-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm font-medium text-white">Drop file to send</p>
          </div>
        </div>
      )}

      {!isCallActive && (
        <>
          <div className={`${mobileChatOpen ? "hidden md:flex" : "flex"} w-full md:w-[380px] md:min-w-[320px] h-full`}>
            <Sidebar
              users={users}
              usersLoading={usersLoading}
              onlineUsers={onlineUsers}
              selectedUser={activeChat}
              onSelectUser={handleSelectUser}
              unreadCounts={unreadCounts}
            />
          </div>
          <div className={`${mobileChatOpen ? "flex" : "hidden md:flex"} flex-col flex-1 h-full min-w-0 bg-navy-950`}>
            {activeChat ? (
              <>
                <ChatHeader
                  selectedUser={activeChat}
                  onlineUsers={onlineUsers}
                  isTyping={isTyping}
                  onBack={handleBack}
                  onAudioCall={handleAudioCall}
                  onVideoCall={handleVideoCall}
                  onMediaGallery={() => setShowMediaGallery(true)}
                  onSearchToggle={() => setShowSearch((p) => !p)}
                  onTogglePin={handleTogglePin}
                  onToggleArchive={handleToggleArchive}
                />
                {showSearch && (
                  <Suspense fallback={null}>
                    <MessageSearch messages={messages} onClose={() => setShowSearch(false)} />
                  </Suspense>
                )}
                <ChatBody
                  messages={messages}
                  currentUser={currentUser}
                  loading={messagesLoading}
                  selectedUser={activeChat}
                  onReplyMessage={handleReplyMessage}
                  onLoadMore={handleLoadMore}
                  hasMore={hasMore}
                />
                <div className="relative">
                  {showGifPicker && (
                    <Suspense fallback={null}>
                      <GifPicker
                        onSelect={handleGifSelect}
                        onClose={() => setShowGifPicker(false)}
                      />
                    </Suspense>
                  )}
                  <MessageInput
                    selectedUser={activeChat}
                    replyTo={replyTo}
                    onClearReply={() => setReplyTo(null)}
                    onGifClick={() => setShowGifPicker((p) => !p)}
                  />
                </div>
              </>
            ) : (
              <Suspense fallback={null}>
                <EmptyState
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8-1.06 0-2.077-.163-3.02-.463L3 21l1.395-3.72C3.512 16.014 3 14.56 3 13c0-4.418 4.03-8 9-8s9 3.582 9 7z" />
                    </svg>
                  }
                  title="Select a conversation"
                  description="Choose a chat from the sidebar to start messaging"
                  action={{
                    label: "Toggle Theme",
                    onClick: () =>
                      useChatStore
                        .getState()
                        .setThemeMode(
                          theme === "dark" ? "light" : "dark"
                        ),
                  }}
                />
              </Suspense>
            )}
          </div>
        </>
      )}

      {usersLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 backdrop-blur-sm">
          <Loader size="lg" />
        </div>
      )}

      <CallHandler actionRef={callActionsRef} />

      {showMediaGallery && activeChat && (
        <Suspense fallback={null}>
          <MediaGallery
            chatId={activeChat._id || activeChat.chat?._id}
            onClose={() => setShowMediaGallery(false)}
          />
        </Suspense>
      )}

      {callData?.type === "incoming" && callStatus === "ringing" && (
        <Suspense fallback={null}>
          <IncomingCallModal
            callerName={callerUser?.name || "Unknown"}
            callType={callData.callType}
            onAccept={() => callActionsRef.current.acceptCall?.()}
            onReject={() => callActionsRef.current.rejectCall?.()}
          />
        </Suspense>
      )}

      {callData?.type === "outgoing" && callStatus === "ringing" && (
        <Suspense fallback={null}>
          <OutgoingCallUI
            userName={activeChat?.name || "Unknown"}
            callType={callData.callType}
            onCancel={() => callActionsRef.current.endCall?.()}
          />
        </Suspense>
      )}

      {callData?.type === "connecting" && callStatus === "connecting" && (
        <Suspense fallback={null}>
          <ConnectingCallUI
            userName={
              callData?.receiverId
                ? activeChat?.name
                : callerUser?.name || "Unknown"
            }
            callType={callData?.callType}
            onCancel={() => callActionsRef.current.endCall?.()}
          />
        </Suspense>
      )}

      {callData?.type === "active" && callStatus === "connected" && (
        <Suspense fallback={null}>
          <ActiveCallUI
            userName={
              callData?.receiverId
                ? activeChat?.name
                : callerUser?.name || "Unknown"
            }
            callType={callData.callType}
            actions={callActionsRef.current}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Chat;

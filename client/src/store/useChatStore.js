import { create } from "zustand";
import { persist } from "zustand/middleware";

const useChatStore = create(
  persist(
    (set, get) => ({
      // Socket
      socket: null,
      setSocket: (socket) => set({ socket }),
      isSocketConnected: false,
      setSocketConnected: (v) => set({ isSocketConnected: v }),

      // Online users
      onlineUsers: [],
      setOnlineUsers: (users) => set({ onlineUsers: users }),

      // Active chat
      activeChat: null,
      setActiveChat: (chat) => set({ activeChat: chat, messages: [] }),

      // Messages
      messages: [],
      setMessages: (messages) => set({ messages }),
      addMessage: (message) =>
        set((state) => {
          const exists = state.messages.some((m) => m._id === message._id);
          if (exists) return state;
          return { messages: [...state.messages, message] };
        }),
      removeMessage: (messageId) =>
        set((state) => ({
          messages: state.messages.filter((msg) => msg._id !== messageId),
        })),
      updateMessage: (messageId, updates) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg._id === messageId ? { ...msg, ...updates } : msg
          ),
        })),
      replaceTempMessage: (tempId, realMessage) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg._id === tempId ? realMessage : msg
          ),
        })),

      // Typing
      isTyping: false,
      setIsTyping: (v) => set({ isTyping: v }),
      typingUser: null,
      setTypingUser: (user) => set({ typingUser: user }),

      // Unread counts
      unreadCounts: {},
      incrementUnread: (userId) =>
        set((state) => ({
          unreadCounts: {
            ...state.unreadCounts,
            [userId]: (state.unreadCounts[userId] || 0) + 1,
          },
        })),
      clearUnread: (userId) =>
        set((state) => ({
          unreadCounts: { ...state.unreadCounts, [userId]: 0 },
        })),
      setUnreadCounts: (counts) => set({ unreadCounts: counts }),

      // Chats
      chats: [],
      setChats: (chats) => set({ chats }),
      addChat: (chat) =>
        set((state) => {
          const exists = state.chats.find((c) => c._id === chat._id);
          if (exists) {
            return {
              chats: state.chats.map((c) =>
                c._id === chat._id ? chat : c
              ),
            };
          }
          return { chats: [...state.chats, chat] };
        }),
      updateChat: (chatId, updates) =>
        set((state) => ({
          chats: state.chats.map((c) =>
            c._id === chatId ? { ...c, ...updates } : c
          ),
        })),
      removeChat: (chatId) =>
        set((state) => ({
          chats: state.chats.filter((c) => c._id !== chatId),
        })),

      // Settings
      soundEnabled: true,
      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
      notificationsEnabled: true,
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      themeMode: "dark",
      setThemeMode: (mode) => set({ themeMode: mode }),

      // Call state
      isCallActive: false,
      setIsCallActive: (active) => set({ isCallActive: active }),
      callData: null,
      setCallData: (data) => set({ callData: data }),
      localStream: null,
      setLocalStream: (stream) => set({ localStream: stream }),
      remoteStream: null,
      setRemoteStream: (stream) => set({ remoteStream: stream }),
      callStatus: null,
      setCallStatus: (status) => set({ callStatus: status }),

      // Message drafts
      messageDrafts: {},
      setMessageDraft: (chatId, draft) =>
        set((state) => ({
          messageDrafts: { ...state.messageDrafts, [chatId]: draft },
        })),
      clearMessageDraft: (chatId) =>
        set((state) => {
          const drafts = { ...state.messageDrafts };
          delete drafts[chatId];
          return { messageDrafts: drafts };
        }),

      // Pinned chats
      pinnedChats: [],
      setPinnedChats: (ids) => set({ pinnedChats: ids }),
      togglePinnedChat: (chatId) =>
        set((state) => ({
          pinnedChats: state.pinnedChats.includes(chatId)
            ? state.pinnedChats.filter((id) => id !== chatId)
            : [...state.pinnedChats, chatId],
        })),

      // Archived chats
      archivedChats: [],
      setArchivedChats: (ids) => set({ archivedChats: ids }),
      toggleArchivedChat: (chatId) =>
        set((state) => ({
          archivedChats: state.archivedChats.includes(chatId)
            ? state.archivedChats.filter((id) => id !== chatId)
            : [...state.archivedChats, chatId],
        })),

      // Reset
      reset: () =>
        set({
          messages: [],
          activeChat: null,
          isTyping: false,
          typingUser: null,
          isCallActive: false,
          callData: null,
          localStream: null,
          remoteStream: null,
          callStatus: null,
          isSocketConnected: false,
        }),
    }),
    {
      name: "chatsphere-store",
      partialize: (state) => ({
        soundEnabled: state.soundEnabled,
        notificationsEnabled: state.notificationsEnabled,
        themeMode: state.themeMode,
        pinnedChats: state.pinnedChats,
        archivedChats: state.archivedChats,
      }),
    }
  )
);

export default useChatStore;

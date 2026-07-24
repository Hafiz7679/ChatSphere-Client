import { lazy, memo, Suspense, useState } from "react";
import Avatar from "../Avatar/Avatar";
import useChatStore from "../../store/useChatStore";

const ChatSummary = lazy(() => import("../ChatSummary/ChatSummary"));

const ChatHeader = ({ selectedUser, isTyping, onlineUsers, onBack, onAudioCall, onVideoCall, onMediaGallery, onSearchToggle, onTogglePin, onToggleArchive }) => {
  const pinnedChats = useChatStore((s) => s.pinnedChats);
  const archivedChats = useChatStore((s) => s.archivedChats);
  const messages = useChatStore((s) => s.messages);
  const [showSummary, setShowSummary] = useState(false);
  const [showMore, setShowMore] = useState(false);
  if (!selectedUser) return null;
  const isOnline = onlineUsers.includes(selectedUser._id);
  const chatId = selectedUser._id;
  const isPinned = pinnedChats.includes(chatId);
  const isArchived = archivedChats.includes(chatId);

  return (
    <div className="relative flex items-center justify-between gap-2 md:gap-3 px-3 md:px-5 py-2.5 md:py-3.5 bg-navy-900 border-b border-surface-700/30">
      <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={onBack}
          className="md:hidden shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-800 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <Avatar src={selectedUser.avatar} name={selectedUser.name} size="sm" status={isOnline ? "online" : "offline"} />
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-white truncate">{selectedUser.name}</h2>
          {isTyping ? (
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex gap-0.5">
                <span className="w-1 h-1 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1 h-1 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1 h-1 rounded-full bg-brand-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-xs text-brand-400 font-medium">typing</span>
            </div>
          ) : (
            <p className={`text-[11px] md:text-xs mt-0.5 ${isOnline ? "text-emerald-400 font-medium" : "text-surface-500"}`}>
              {isOnline ? "Online" : "Offline"}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-0.5 md:gap-1 shrink-0">
        <div className="hidden md:flex items-center gap-0.5">
          <button type="button" onClick={() => setShowSummary(!showSummary)}
            className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center transition ${showSummary ? "text-brand-400 bg-brand-500/10" : "text-surface-400 hover:text-brand-400 hover:bg-surface-800"}`}
            title="Chat Summary">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 md:w-4 md:h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </button>
          <button type="button" onClick={onSearchToggle}
            className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-brand-400 hover:bg-surface-800 transition"
            title="Search Messages">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 md:w-4 md:h-4">
              <circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="m21 21-4.3-4.3" />
            </svg>
          </button>
          <button type="button" onClick={onMediaGallery}
            className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-brand-400 hover:bg-surface-800 transition"
            title="Media Gallery">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 md:w-4 md:h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </button>
          <button type="button" onClick={onTogglePin}
            className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center transition ${isPinned ? "text-brand-400 bg-brand-500/10" : "text-surface-400 hover:text-brand-400 hover:bg-surface-800"}`}
            title={isPinned ? "Unpin" : "Pin"}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isPinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 md:w-4 md:h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 4v12l-4 4-4-4V4m8 0H8m8 0h3M8 4H5" />
            </svg>
          </button>
          <button type="button" onClick={onToggleArchive}
            className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center transition ${isArchived ? "text-brand-400 bg-brand-500/10" : "text-surface-400 hover:text-brand-400 hover:bg-surface-800"}`}
            title={isArchived ? "Unarchive" : "Archive"}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 md:w-4 md:h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </button>
        </div>

        <div className="md:hidden relative">
          <button type="button" onClick={() => setShowMore(!showMore)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-800 transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
            </svg>
          </button>
          {showMore && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowMore(false)} />
              <div className="absolute right-0 top-full mt-1 z-40 w-44 bg-surface-800 border border-surface-700/50 rounded-xl shadow-xl py-1.5 animate-scale-in">
                <button type="button" onClick={() => { setShowSummary(p => !p); setShowMore(false); }} className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs transition ${showSummary ? "text-brand-400" : "text-surface-400 hover:text-white hover:bg-surface-700/50"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Summary
                </button>
                <button type="button" onClick={() => { onSearchToggle(); setShowMore(false); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-surface-400 hover:text-white hover:bg-surface-700/50 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0"><circle cx="11" cy="11" r="7" /><path strokeLinecap="round" d="m21 21-4.3-4.3" /></svg>
                  Search
                </button>
                <button type="button" onClick={() => { onMediaGallery(); setShowMore(false); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-surface-400 hover:text-white hover:bg-surface-700/50 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" /></svg>
                  Media
                </button>
                <hr className="border-surface-700/30 my-1" />
                <button type="button" onClick={() => { onTogglePin(); setShowMore(false); }} className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs transition ${isPinned ? "text-brand-400" : "text-surface-400 hover:text-white hover:bg-surface-700/50"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isPinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M16 4v12l-4 4-4-4V4m8 0H8m8 0h3M8 4H5" /></svg>
                  {isPinned ? "Unpin" : "Pin"}
                </button>
                <button type="button" onClick={() => { onToggleArchive(); setShowMore(false); }} className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs transition ${isArchived ? "text-brand-400" : "text-surface-400 hover:text-white hover:bg-surface-700/50"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  {isArchived ? "Unarchive" : "Archive"}
                </button>
              </div>
            </>
          )}
        </div>

        <button type="button" onClick={onAudioCall}
          className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-emerald-400 hover:bg-surface-800 transition">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 md:w-4 md:h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-1.93.965a11.042 11.042 0 005.516 5.516l.966-1.93a1 1 0 011.21-.502l4.492 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V6a1 1 0 010-1z" />
          </svg>
        </button>
        <button type="button" onClick={onVideoCall}
          className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-brand-400 hover:bg-surface-800 transition">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 md:w-4 md:h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 6h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
          </svg>
        </button>
      </div>
      {showSummary && messages.length > 0 && (
        <Suspense fallback={null}>
          <div className="absolute top-full left-0 right-0 z-40 mx-4 mt-2">
            <ChatSummary messages={messages} currentUser={null} onClose={() => setShowSummary(false)} />
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default memo(ChatHeader);

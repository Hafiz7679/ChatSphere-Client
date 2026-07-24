import { lazy, memo, Suspense, useState } from "react";
import { ChevronLeft, FileText, Search, Image, Pin, Archive, Ellipsis, Phone, Video } from "lucide-react";
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
          className="md:hidden shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
          aria-label="Back to chats"
        >
          <ChevronLeft className="w-4 h-4" />
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
            className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center             transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 ${showSummary ? "text-brand-400 bg-brand-500/10" : "text-surface-400 hover:text-brand-400 hover:bg-surface-800"}`}
            title="Chat Summary" aria-label={showSummary ? "Close summary" : "Show summary"}>
            <FileText className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
          <button type="button" onClick={onSearchToggle}
            className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-brand-400 hover:bg-surface-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
            title="Search Messages" aria-label="Search messages">
            <Search className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
          <button type="button" onClick={onMediaGallery}
            className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-brand-400 hover:bg-surface-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
            title="Media Gallery" aria-label="Media gallery">
            <Image className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
          <button type="button" onClick={onTogglePin}
            className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 ${isPinned ? "text-brand-400 bg-brand-500/10" : "text-surface-400 hover:text-brand-400 hover:bg-surface-800"}`}
            title={isPinned ? "Unpin" : "Pin"} aria-label={isPinned ? "Unpin conversation" : "Pin conversation"}>
            <Pin className="w-3.5 h-3.5 md:w-4 md:h-4" fill={isPinned ? "currentColor" : "none"} />
          </button>
          <button type="button" onClick={onToggleArchive}
            className={`w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 ${isArchived ? "text-brand-400 bg-brand-500/10" : "text-surface-400 hover:text-brand-400 hover:bg-surface-800"}`}
            title={isArchived ? "Unarchive" : "Archive"}>
            <Archive className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>

        <div className="md:hidden relative">
          <button type="button" onClick={() => setShowMore(!showMore)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
            aria-label="More options" aria-expanded={showMore}>
            <Ellipsis className="w-4 h-4" />
          </button>
          {showMore && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setShowMore(false)} aria-hidden="true" />
              <div className="absolute right-0 top-full mt-1 z-40 w-44 bg-surface-800 border border-surface-700/50 rounded-xl shadow-xl py-1.5 animate-scale-in" role="menu">
                <button type="button" onClick={() => { setShowSummary(p => !p); setShowMore(false); }} className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 ${showSummary ? "text-brand-400" : "text-surface-400 hover:text-white hover:bg-surface-700/50"}`} role="menuitem">
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  Summary
                </button>
                <button type="button" onClick={() => { onSearchToggle(); setShowMore(false); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-surface-400 hover:text-white hover:bg-surface-700/50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50" role="menuitem">
                  <Search className="w-3.5 h-3.5 shrink-0" />
                  Search
                </button>
                <button type="button" onClick={() => { onMediaGallery(); setShowMore(false); }} className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-surface-400 hover:text-white hover:bg-surface-700/50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50" role="menuitem">
                  <Image className="w-3.5 h-3.5 shrink-0" />
                  Media
                </button>
                <hr className="border-surface-700/30 my-1" />
                <button type="button" onClick={() => { onTogglePin(); setShowMore(false); }} className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 ${isPinned ? "text-brand-400" : "text-surface-400 hover:text-white hover:bg-surface-700/50"}`} role="menuitem">
                  <Pin className="w-3.5 h-3.5 shrink-0" fill={isPinned ? "currentColor" : "none"} />
                  {isPinned ? "Unpin" : "Pin"}
                </button>
                <button type="button" onClick={() => { onToggleArchive(); setShowMore(false); }} className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 ${isArchived ? "text-brand-400" : "text-surface-400 hover:text-white hover:bg-surface-700/50"}`} role="menuitem">
                  <Archive className="w-3.5 h-3.5 shrink-0" />
                  {isArchived ? "Unarchive" : "Archive"}
                </button>
              </div>
            </>
          )}
        </div>

        <button type="button" onClick={onAudioCall}
          className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-emerald-400 hover:bg-surface-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
          aria-label="Audio call">
          <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
        </button>
        <button type="button" onClick={onVideoCall}
          className="w-8 h-8 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-brand-400 hover:bg-surface-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
          aria-label="Video call">
          <Video className="w-3.5 h-3.5 md:w-4 md:h-4" />
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

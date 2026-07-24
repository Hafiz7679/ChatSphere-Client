import { lazy, Suspense, memo, useEffect, useMemo, useRef, useState } from "react";
import { formatTime, formatDate, shouldShowDateSeparator } from "../../utils/helpers";
import MessageActions from "../MessageActions/MessageActions";
import MessageReactions from "../MessageReactions/MessageReactions";
import useChatStore from "../../store/useChatStore";
import { reactToMessage } from "../../api/api";
import ScrollToBottom from "../ScrollToBottom/ScrollToBottom";

const ImageViewer = lazy(() => import("../ImageViewer/ImageViewer"));
const ForwardMessageModal = lazy(() => import("../ForwardMessageModal/ForwardMessageModal"));

const StatusIcon = ({ status }) => {
  if (status === "sending") {
    return (
      <svg viewBox="0 0 16 11" className="w-3 h-3 fill-current text-surface-400">
        <circle cx="8" cy="5.5" r="3" />
        <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0z" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-30" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 11" className={`w-3 h-3 fill-current ${status === "read" ? "text-accent-400" : status === "delivered" ? "text-emerald-400" : "text-surface-400"}`}>
      <path d="M11.07.65c-.19-.2-.5-.2-.7 0L5.1 5.9 3.62 4.4c-.2-.2-.5-.2-.7 0s-.2.5 0 .7l1.8 1.8c.1.1.23.15.35.15s.25-.05.35-.15l5.65-5.65c.2-.2.2-.5 0-.7z" />
      {status !== "sent" && <path d="M15.07.65c-.19-.2-.5-.2-.7 0L9.1 5.9 7.62 4.4c-.2-.2-.5-.2-.7 0s-.2.5 0 .7l1.8 1.8c.1.1.23.15.35.15s.25-.05.35-.15l5.65-5.65c.2-.2.2-.5 0-.7z" />}
    </svg>
  );
};

const EMOJI_QUICK = ["😀", "😂", "❤️", "👍", "🔥", "🎉", "😢", "😡"];

const AudioPlayer = ({ src, duration: attDuration, isOwn }) => {
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(attDuration || 0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (progressRef.current && audio.duration) {
        progressRef.current.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
      }
    };
    const onLoadedMetadata = () => {
      if (audio.duration && !attDuration) setDuration(audio.duration);
    };
    const onEnded = () => setPlaying(false);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.pause();
    };
  }, [attDuration]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setPlaying(true)).catch(() => { });
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
      <div className={`flex items-center gap-2 p-2 rounded-xl ${isOwn ? "bg-brand-500/20" : "bg-surface-700/50"} min-w-[160px] md:min-w-[200px]`}>
      <button type="button" onClick={togglePlay} className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 shrink-0">
        {playing ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />
      <div className="flex-1">
        <div className="h-1 rounded-full bg-white/20 overflow-hidden">
          <div ref={progressRef} className="h-full bg-brand-400 rounded-full" style={{ width: "0%" }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-white/50">{playing ? fmt(currentTime) : fmt(currentTime || duration)}</span>
          <span className="text-[10px] text-white/50">{fmt(duration)}</span>
        </div>
      </div>
    </div>
  );
};

const ChatBody = ({ messages, currentUser, loading, selectedUser, onReplyMessage, onLoadMore, hasMore }) => {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const prevLen = useRef(0);
  const isAtBottom = useRef(true);
  const [menuState, setMenuState] = useState(null);
  const [showReactions, setShowReactions] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [forwardMessage, setForwardMessage] = useState(null);
  const { activeChat } = useChatStore();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      isAtBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      if (el.scrollTop < 50 && onLoadMore && hasMore) {
        onLoadMore();
      }
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [onLoadMore, hasMore]);

  useEffect(() => {
    if (messages.length > prevLen.current && (isAtBottom.current || messages.length - prevLen.current === 1)) {
      requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }));
    }
    prevLen.current = messages.length;
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [selectedUser]);

  const handleReact = async (message, emoji) => {
    const socket = useChatStore.getState().socket;
    const msgId = message._id;
    const userId = currentUser._id;
    const existing = (message.reactions || []).find((r) => (r.user?._id || r.user) === userId && r.emoji === emoji);
    let updated;
    if (existing) {
      updated = (message.reactions || []).filter((r) => !(r.emoji === emoji && (r.user?._id || r.user) === userId));
      useChatStore.getState().updateMessage(msgId, { reactions: updated });
      socket?.emit("message_reacted", { messageId: msgId, chatId: activeChat?._id, emoji, remove: true, senderId: selectedUser?._id });
    } else {
      updated = [...(message.reactions || []).filter((r) => (r.user?._id || r.user) !== userId), { user: userId, emoji }];
      useChatStore.getState().updateMessage(msgId, { reactions: updated });
      socket?.emit("message_reacted", { messageId: msgId, chatId: activeChat?._id, emoji, remove: false, senderId: selectedUser?._id });
    }
    reactToMessage(msgId, emoji).catch(() => {});
    setShowReactions(null);
    setMenuState(null);
  };

  const handleEdit = (message) => {
    const text = prompt("Edit message:", message.content || message.text);
    if (text?.trim() && text !== (message.content || message.text)) {
      const socket = useChatStore.getState().socket;
      socket?.emit("edit_message", { messageId: message._id, text: text.trim(), chatId: activeChat?._id, senderId: selectedUser?._id });
    }
    setMenuState(null);
  };

  const handleDelete = (message) => {
    if (window.confirm("Delete this message?")) {
      const socket = useChatStore.getState().socket;
      socket?.emit("delete_message", { messageId: message._id, chatId: activeChat?._id, senderId: selectedUser?._id });
      useChatStore.getState().removeMessage(message._id);
    }
    setMenuState(null);
  };

  const chatWallpaper = useChatStore((s) => s.chatWallpaper);
  const wallpaperStyle = useMemo(() => chatWallpaper ? { backgroundImage: `url(${chatWallpaper})`, backgroundSize: "cover", backgroundPosition: "center" } : {}, [chatWallpaper]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-3 md:px-8 py-3 md:py-5 bg-navy-950 bg-grid" style={wallpaperStyle}>
      {loading ? (
        <div className="space-y-3 max-w-3xl mx-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
              <div className={`h-10 rounded-2xl bg-surface-800/50 animate-pulse ${i % 2 === 0 ? "w-48" : "w-40"}`} />
            </div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-surface-500 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500/10 to-accent-500/10 flex items-center justify-center text-3xl border border-brand-500/10">👋</div>
          <div>
            <p className="text-sm font-medium text-surface-400">No messages yet</p>
            <p className="text-xs text-surface-500 mt-1">Start the conversation with a hello</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col max-w-3xl mx-auto">
          {messages.map((message, index) => {
            const senderId = message.sender?._id || message.sender;
            const isOwn = senderId === currentUser._id;
            const prev = messages[index - 1];
            const showDate = shouldShowDateSeparator(message, prev);
            const reactions = message.reactions || [];

            return (
              <div key={message._id || index} className="animate-fade-in">
                {showDate && (
                  <div className="flex justify-center my-5">
                    <span className="px-4 py-1 text-[11px] font-medium text-surface-400 bg-surface-800/60 backdrop-blur-sm rounded-full border border-surface-700/30">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                )}
                <div className={`relative flex items-end gap-2 mb-1 ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div className="group relative max-w-[80%] md:max-w-[65%]">
                    {message.replyTo && (
                      <div className={`${isOwn ? "bg-brand-700/50" : "bg-surface-800"} rounded-t-xl px-4 pt-2.5 pb-1`}>
                        <p className="text-[10px] font-medium text-surface-400 uppercase tracking-wider">Reply</p>
                        <p className="text-xs truncate text-surface-300 mt-0.5">{message.replyTo.content || message.replyTo.text || ""}</p>
                      </div>
                    )}
                    <div className={`px-4 py-2.5 shadow-sm transition-all duration-200 ${isOwn
                        ? "bg-gradient-to-br from-brand-600 to-accent-600 text-white rounded-2xl rounded-br-md"
                        : "bg-surface-800/80 backdrop-blur-sm text-surface-100 rounded-2xl rounded-bl-md border border-surface-700/30"
                      } ${message.replyTo ? "rounded-t-none" : ""}`}>
                      {message.attachments?.length > 0 && message.attachments.map((att, i) => (
                        <div key={i} className="mb-1.5">
                          {att.type?.startsWith("image/") ? (
                            <img
                              src={att.url}
                              alt=""
                              className="max-w-full rounded-xl max-h-72 object-cover cursor-pointer hover:opacity-95 transition"
                              onClick={() => setPreviewImage(att.url)}
                              loading="lazy"
                            />
                          ) : att.type?.startsWith("video/") ? (
                            <video src={att.url} controls className="max-w-full rounded-xl max-h-64" />
                          ) : att.type?.startsWith("audio/") || att.type === "audio/webm" ? (
                            <AudioPlayer src={att.url} duration={att.duration} isOwn={isOwn} />
                          ) : (
                            <a href={att.url} target="_blank" rel="noreferrer" className={`flex items-center gap-2.5 p-2.5 rounded-xl ${isOwn ? "bg-brand-500/30" : "bg-surface-700/50"}`}>
                              <span className="text-lg">📎</span>
                              <span className="text-xs truncate flex-1">{att.name}</span>
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                              </svg>
                            </a>
                          )}
                        </div>
                      ))}
                      {(message.content || message.text) && (
                        <p className="text-[14px] leading-relaxed whitespace-pre-wrap break-words">{message.content || message.text}</p>
                      )}
                      <div className={`flex items-center justify-end gap-1 mt-0.5 ${isOwn ? "text-white/60" : "text-surface-500"}`}>
                        <span className="text-[10px] leading-none">{formatTime(message.createdAt)}</span>
                        {isOwn && <StatusIcon status={message.status} />}
                      </div>
                    </div>
                    {reactions.length > 0 && (
                      <div className={`${isOwn ? "text-right" : "text-left"} -mt-1`}>
                        <MessageReactions reactions={reactions} messageId={message._id} onReact={(emoji) => handleReact(message, emoji)} />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setShowReactions(showReactions === message._id ? null : message._id); }}
                      className={`absolute -bottom-2 opacity-0 group-hover:opacity-100 transition ${isOwn ? "left-0" : "right-0"
                        } w-5 h-5 rounded-full bg-surface-800 border border-surface-600 flex items-center justify-center shadow-sm hover:bg-surface-700 text-xs`}
                    >
                      😊
                    </button>
                    {showReactions === message._id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowReactions(null)} />
                        <div className={`absolute -bottom-10 z-50 flex gap-0.5 bg-surface-800 rounded-full border border-surface-600/50 shadow-lg p-1 animate-scale-in ${isOwn ? "left-0" : "right-0"}`}>
                          {EMOJI_QUICK.map((emoji) => (
                            <button key={emoji} type="button" onClick={() => handleReact(message, emoji)} className="w-7 h-7 flex items-center justify-center text-sm hover:bg-surface-700 rounded-full transition active:scale-90">
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0 -mt-1 -mr-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const rect = e.currentTarget.closest(".group").getBoundingClientRect();
                          setMenuState({ message, isOwn, x: isOwn ? "right" : "left", top: rect.top });
                        }}
                        className="w-6 h-6 rounded-full bg-surface-800 border border-surface-600 flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-700 shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                          <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
                        </svg>
                      </button>
                    </div>
                    {menuState?.message._id === message._id && (
                      <MessageActions
                        isOwn={isOwn}
                        onReply={() => { if (onReplyMessage) onReplyMessage(message); setMenuState(null); }}
                        onReact={() => setShowReactions(message._id)}
                        onForward={() => { setForwardMessage(message); setMenuState(null); }}
                        onEdit={() => handleEdit(message)}
                        onDelete={() => handleDelete(message)}
                        onCopy={() => { navigator.clipboard.writeText(message.content || message.text || ""); setMenuState(null); }}
                        onClose={() => setMenuState(null)}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      )}
      <ScrollToBottom containerRef={containerRef} bottomRef={bottomRef} />
      {previewImage && (
        <Suspense fallback={null}>
          <ImageViewer src={previewImage} onClose={() => setPreviewImage(null)} />
        </Suspense>
      )}
      {forwardMessage && (
        <Suspense fallback={null}>
          <ForwardMessageModal message={forwardMessage} onClose={() => setForwardMessage(null)} />
        </Suspense>
      )}
    </div>
  );
};

export default memo(ChatBody);

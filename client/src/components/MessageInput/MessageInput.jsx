import { useCallback, useEffect, useRef, useState } from "react";
import { getSocket } from "../../socket/socket";
import { sendMessage, uploadFile, getChats } from "../../api/api";
import useChatStore from "../../store/useChatStore";
import EmojiPicker from "../EmojiPicker/EmojiPicker";
import FilePreview from "../FilePreview/FilePreview";
import VoiceRecorder from "../VoiceRecorder/VoiceRecorder";

const MessageInput = ({ selectedUser, replyTo, onClearReply, onGifClick }) => {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const typingTimeout = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const resizeTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  const handleTyping = useCallback(
    (e) => {
      const value = e.target.value;
      setMessage(value);
      resizeTextarea();
      if (!value.trim()) {
        getSocket().emit("stop_typing", { sender: currentUser._id, receiver: selectedUser._id });
        clearTimeout(typingTimeout.current);
        return;
      }
      getSocket().emit("typing", { sender: currentUser._id, receiver: selectedUser._id });
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        getSocket().emit("stop_typing", { sender: currentUser._id, receiver: selectedUser._id });
      }, 2000);
    },
    [currentUser, selectedUser, resizeTextarea]
  );

  const handleSend = useCallback(async () => {
    if ((!message.trim() && !attachedFile) || sending || uploading) return;
    try {
      setSending(true);
      let attachmentData = null;
      if (attachedFile) {
        setUploading(true);
        const fd = new FormData();
        fd.append("file", attachedFile);
        const res = await uploadFile(fd);
        attachmentData = res.data.data;
        setUploading(false);
      }
      const msgData = {
        sender: currentUser._id,
        receiver: selectedUser._id,
        ...(message.trim() && { text: message.trim() }),
        ...(replyTo && { replyTo: replyTo._id }),
        ...(attachmentData && { attachments: [{ url: attachmentData.url, type: attachmentData.type, name: attachmentData.name, size: attachmentData.size }] }),
      };
      // Create temporary local message for better UX
      const tempId = `temp-${Date.now()}`;
      const tempMsg = {
        _id: tempId,
        sender: { _id: currentUser._id, name: currentUser.name, avatar: currentUser.avatar },
        content: message.trim() || "",
        text: message.trim() || "",
        attachments: msgData.attachments || [],
        chat: selectedUser._id,
        status: "sending",
        createdAt: new Date().toISOString(),
        replyTo: replyTo || null,
        receiver: selectedUser._id,
      };
      useChatStore.getState().addMessage(tempMsg);

      const response = await sendMessage(msgData);
      getSocket().emit("send_message", response.data.data);
      clearTimeout(typingTimeout.current);
      getSocket().emit("stop_typing", { sender: currentUser._id, receiver: selectedUser._id });
      // Refresh chats if this created a new conversation
      const chatId = response.data.data?.chat?._id || response.data.data?.chat;
      const currentChats = useChatStore.getState().chats;
      if (chatId && !currentChats.some((c) => c._id === chatId)) {
        getChats().then((res) => {
          if (res.data?.data) useChatStore.getState().setChats(res.data.data);
        }).catch(() => {});
      }
      setMessage("");
      setAttachedFile(null);
      if (onClearReply) onClearReply();
      useChatStore.getState().replaceTempMessage(tempId, response.data.data);
      requestAnimationFrame(resizeTextarea);
    } catch (error) {
      console.error(error);
    } finally {
      setSending(false);
      setUploading(false);
    }
  }, [message, attachedFile, sending, uploading, currentUser, selectedUser, replyTo, onClearReply, resizeTextarea]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }, [handleSend]);

  const handleVoiceSend = useCallback(async (blob, duration) => {
    try {
      setSending(true);
      setShowVoice(false);
      const fd = new FormData();
      fd.append("voice", blob, `voice-${Date.now()}.webm`);
      const { default: api } = await import("../../api/api");
      const uploadRes = await api.post("/upload/voice", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const attachData = [{
        url: uploadRes.data.data.url,
        type: "audio/webm",
        name: "Voice message",
        size: blob.size,
        duration: uploadRes.data.data.duration || duration,
      }];
      const msgData = {
        sender: currentUser._id,
        receiver: selectedUser._id,
        text: "",
        attachments: attachData,
      };
      // Temp local message for instant feedback
      const tempId = `temp-${Date.now()}`;
      const tempMsg = {
        _id: tempId,
        sender: { _id: currentUser._id, name: currentUser.name, avatar: currentUser.avatar },
        content: "",
        text: "",
        attachments: attachData,
        chat: selectedUser._id,
        status: "sending",
        createdAt: new Date().toISOString(),
        receiver: selectedUser._id,
      };
      useChatStore.getState().addMessage(tempMsg);

      const response = await sendMessage(msgData);
      getSocket().emit("send_message", response.data.data);
      useChatStore.getState().replaceTempMessage(tempId, response.data.data);
      const chatId = response.data.data?.chat?._id || response.data.data?.chat;
      const currentChats = useChatStore.getState().chats;
      if (chatId && !currentChats.some((c) => c._id === chatId)) {
        getChats().then((res) => {
          if (res.data?.data) useChatStore.getState().setChats(res.data.data);
        }).catch(() => {});
      }
    } catch (error) {
      console.error("Voice send error:", error);
    } finally {
      setSending(false);
    }
  }, [currentUser, selectedUser]);

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeout.current);
      if (selectedUser && currentUser) {
        getSocket().emit("stop_typing", { sender: currentUser._id, receiver: selectedUser._id });
      }
    };
  }, [selectedUser, currentUser]);

  return (
    <div className="px-4 md:px-6 pt-2 pb-4 bg-navy-900 border-t border-surface-700/30">
      {replyTo && (
        <div className="flex items-center gap-3 mb-2.5 bg-surface-800/50 rounded-xl px-4 py-2.5 border border-surface-700/30 animate-slide-up">
          <div className="w-0.5 h-9 rounded-full bg-brand-500 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium text-brand-400 uppercase tracking-wider">Reply</p>
            <p className="text-xs text-surface-400 truncate mt-0.5">{replyTo.content || replyTo.text || ""}</p>
          </div>
          <button type="button" onClick={onClearReply} className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-surface-500 hover:text-white hover:bg-surface-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
      {attachedFile && <div className="mb-2.5"><FilePreview file={attachedFile} onRemove={() => setAttachedFile(null)} /></div>}
      {showVoice && <div className="mb-2.5"><VoiceRecorder onSend={handleVoiceSend} onCancel={() => setShowVoice(false)} /></div>}
      <div className={`flex items-end gap-2 bg-surface-800/50 border border-surface-700/30 rounded-2xl px-3 py-1.5 transition-all focus-within:border-brand-500/50 focus-within:ring-2 focus-within:ring-brand-500/15 ${uploading ? "border-brand-500/50" : ""}`}>
        <button type="button" onClick={() => setShowEmoji(!showEmoji)} className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-700/50 transition">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <circle cx="12" cy="12" r="9" /><path strokeLinecap="round" d="M8.5 14.5s1.5 2 3.5 2 3.5-2 3.5-2" /><path strokeLinecap="round" d="M9 9h.01M15 9h.01" />
          </svg>
        </button>
        {showEmoji && <EmojiPicker onSelect={(e) => { setMessage((p) => p + e); setShowEmoji(false); textareaRef.current?.focus(); }} onClose={() => setShowEmoji(false)} />}
        <button type="button" onClick={onGifClick} className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-700/50 transition">
          <span className="text-base font-bold">GIF</span>
        </button>
        <button type="button" onClick={() => fileInputRef.current?.click()} className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-700/50 transition">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.44 11.05l-9.19 9.19a5 5 0 01-7.07-7.07l9.19-9.19a3.5 3.5 0 014.95 4.95l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
          </svg>
        </button>
        <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { if (f.size > 50 * 1024 * 1024) { alert("File too large. Max 50MB."); return; } setAttachedFile(f); } }} />
        <textarea ref={textareaRef} rows={1} placeholder="Type a message" value={message} onChange={handleTyping} onKeyDown={handleKeyDown}
          className="flex-1 resize-none bg-transparent outline-none text-sm py-2 px-1 max-h-32 leading-relaxed text-white placeholder:text-surface-500" />
        {!message.trim() && !attachedFile && (
          <button type="button" onClick={() => setShowVoice(true)} className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-700/50 transition">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
              <rect x="9" y="2" width="6" height="12" rx="3" /><path strokeLinecap="round" d="M5 11a7 7 0 0014 0M12 18v4" />
            </svg>
          </button>
        )}
        <button type="button" onClick={handleSend} disabled={(!message.trim() && !attachedFile) || sending || uploading}
          className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed">
          {uploading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 translate-x-[1px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default MessageInput;

import Avatar from "../Avatar/Avatar";

const ChatHeader = ({ selectedUser, isTyping, onlineUsers, onBack, onAudioCall, onVideoCall, onMediaGallery }) => {
  if (!selectedUser) return null;
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3.5 bg-navy-900 border-b border-surface-700/30">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          type="button"
          onClick={onBack}
          className="md:hidden shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-800 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <Avatar src={selectedUser.avatar} name={selectedUser.name} size="md" status={isOnline ? "online" : "offline"} />
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
            <p className={`text-xs mt-0.5 ${isOnline ? "text-emerald-400 font-medium" : "text-surface-500"}`}>
              {isOnline ? "Online" : "Offline"}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={onMediaGallery}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-brand-400 hover:bg-surface-800 transition"
          title="Media Gallery"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onAudioCall}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-emerald-400 hover:bg-surface-800 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-1.93.965a11.042 11.042 0 005.516 5.516l.966-1.93a1 1 0 011.21-.502l4.492 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V6a1 1 0 010-1z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onVideoCall}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-brand-400 hover:bg-surface-800 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 6h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;

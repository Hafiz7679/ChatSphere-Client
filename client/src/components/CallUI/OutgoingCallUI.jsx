const OutgoingCallUI = ({ userName, callType, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 bg-navy-950 flex flex-col items-center justify-center">
      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-5xl font-bold mb-6 shadow-xl shadow-brand-500/25 ring-4 ring-brand-500/15">
        {userName?.charAt(0)?.toUpperCase() || "?"}
      </div>

      <h2 className="text-2xl font-bold text-white mb-1">{userName}</h2>
      <p className="text-surface-400 text-sm mb-12">
        Calling{callType === "video" ? " video" : ""}...
      </p>

      <div className="flex items-center justify-center gap-2 mb-12">
        <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>

      <button type="button" onClick={onCancel}
        className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition active:scale-95 shadow-lg shadow-red-500/25 ring-4 ring-red-500/20">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
          <path strokeLinecap="round" d="M18.36 6.64a9 9 0 11-12.73 12.73M6.64 18.36A9 9 0 0118.36 6.64" />
        </svg>
      </button>

      <p className="text-surface-500 text-xs mt-4">Tap to cancel</p>
    </div>
  );
};

export default OutgoingCallUI;

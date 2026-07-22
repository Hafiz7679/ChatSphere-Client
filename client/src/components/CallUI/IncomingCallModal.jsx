const IncomingCallModal = ({ callerName, callType, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-navy-900 border border-surface-700/30 rounded-2xl shadow-glass w-full max-w-sm p-8 text-center animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25 ring-4 ring-green-500/20">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-10 h-10">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-1.93.965a11.042 11.042 0 005.516 5.516l.966-1.93a1 1 0 011.21-.502l4.492 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V6a1 1 0 010-1z" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-white mb-1">{callerName}</h2>
        <p className="text-surface-400 text-sm mb-8">
          Incoming {callType === "video" ? "video" : "audio"} call
        </p>

        <div className="flex items-center justify-center gap-6">
          <button type="button" onClick={onReject}
            className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition active:scale-95 shadow-lg shadow-red-500/25 ring-4 ring-red-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
              <path strokeLinecap="round" d="M18.36 6.64a9 9 0 11-12.73 12.73M6.64 18.36A9 9 0 0118.36 6.64" />
            </svg>
          </button>

          <button type="button" onClick={onAccept}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center hover:shadow-lg hover:shadow-green-500/30 transition active:scale-95 shadow-lg shadow-green-500/25 ring-4 ring-green-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-1.93.965a11.042 11.042 0 005.516 5.516l.966-1.93a1 1 0 011.21-.502l4.492 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V6a1 1 0 010-1z" />
            </svg>
          </button>
        </div>

        <p className="text-surface-500 text-xs mt-4">
          {callType === "video" ? "Camera and mic" : "Mic"} will be used
        </p>
      </div>
    </div>
  );
};

export default IncomingCallModal;

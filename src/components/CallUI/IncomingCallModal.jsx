import { Phone, PhoneOff } from "lucide-react";

const IncomingCallModal = ({ callerName, callType, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="bg-navy-900 border border-surface-700/30 rounded-2xl shadow-glass w-full max-w-sm p-8 text-center animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25 ring-4 ring-green-500/20">
          <Phone className="w-10 h-10 text-white" />
        </div>

        <h2 className="text-xl font-bold text-white mb-1">{callerName}</h2>
        <p className="text-surface-400 text-sm mb-8">
          Incoming {callType === "video" ? "video" : "audio"} call
        </p>

        <div className="flex items-center justify-center gap-6">
          <button type="button" onClick={onReject}
            className="w-16 h-16 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition active:scale-95 shadow-lg shadow-red-500/25 ring-4 ring-red-500/20">
            <PhoneOff className="w-7 h-7" />
          </button>

          <button type="button" onClick={onAccept}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center hover:shadow-lg hover:shadow-green-500/30 transition active:scale-95 shadow-lg shadow-green-500/25 ring-4 ring-green-500/20">
            <Phone className="w-7 h-7" />
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

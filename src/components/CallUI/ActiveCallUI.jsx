import { useEffect, useRef, useState } from "react";
import useChatStore from "../../store/useChatStore";
import { Mic, MicOff, Speaker, Video, VideoOff, Monitor, PictureInPicture2, PhoneOff } from "lucide-react";

const ActiveCallUI = ({ userName, callType, actions }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [callDuration, setCallDuration] = useState(0);
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(callType === "video");
  const [screenSharing, setScreenSharing] = useState(false);
  const [, setPipMode] = useState(false);

  const localStream = useChatStore((s) => s.localStream);
  const remoteStream = useChatStore((s) => s.remoteStream);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    const timer = setInterval(() => setCallDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const handleToggleMic = () => {
    const enabled = actions?.toggleMic();
    if (enabled !== undefined) setMicOn(enabled);
  };

  const handleToggleCamera = () => {
    const enabled = actions?.toggleCamera();
    if (enabled !== undefined) setCameraOn(enabled);
  };

  const handleScreenShare = async () => {
    await actions?.toggleScreenShare();
    setScreenSharing(!screenSharing);
  };

  const handleEndCall = () => actions?.endCall();

  const handleSpeaker = () => {
    if (remoteStream) {
      const audioTracks = remoteStream.getAudioTracks();
      if (audioTracks.length > 0) {
        try {
          const audioEl = document.querySelector("audio#remote-audio");
          if (!audioEl) {
            const el = document.createElement("audio");
            el.id = "remote-audio";
            el.srcObject = remoteStream;
            el.setAttribute("playsinline", "");
            document.body.appendChild(el);
            el.play();
          }
        } catch {}
      }
    }
  };

  const handlePiP = async () => {
    if (!remoteVideoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setPipMode(false);
      } else {
        await remoteVideoRef.current.requestPictureInPicture();
        setPipMode(true);
      }
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-navy-950 flex flex-col" style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      {/* Remote video (full background) */}
      {callType === "video" && remoteStream ? (
        <video ref={remoteVideoRef} autoPlay playsInline className="flex-1 w-full h-full object-cover" />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-5xl font-bold mx-auto mb-4 shadow-xl shadow-brand-500/25 ring-4 ring-brand-500/15">
              {userName?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <h2 className="text-2xl font-bold text-white">{userName}</h2>
            <p className="text-surface-400 text-sm mt-1">{formatDuration(callDuration)}</p>
          </div>
        </div>
      )}

      {/* Local video (PiP overlay) */}
      {localStream && (
        <div className={`absolute ${callType === "video" ? "top-4 right-4 w-32 h-44" : "bottom-32 right-4 w-24 h-32"} rounded-2xl overflow-hidden shadow-xl border border-surface-700/40 bg-navy-900`}>
          <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
        </div>
      )}

      {/* Audio call info overlay */}
      {callType === "audio" && (
        <div className="absolute top-8 left-0 right-0 text-center">
          <p className="text-surface-400 text-sm">Call active</p>
          <p className="text-surface-500 text-xs mt-1">{formatDuration(callDuration)}</p>
        </div>
      )}

      {/* Call controls */}
      <div className="bg-gradient-to-t from-navy-950 via-navy-950/95 to-transparent pt-16 pb-8 px-6">
        <div className="flex items-center justify-center gap-6">
          <button type="button" onClick={handleToggleMic}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition active:scale-95 shadow-lg ${micOn ? "bg-surface-800 text-white hover:bg-surface-700" : "bg-red-500 text-white ring-4 ring-red-500/20"}`}>
            {micOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>

          <button type="button" onClick={handleSpeaker}
            className="w-14 h-14 rounded-full bg-surface-800 text-white flex items-center justify-center hover:bg-surface-700 transition active:scale-95 shadow-lg">
            <Speaker className="w-5 h-5" />
          </button>

          {callType === "video" && (
            <>
              <button type="button" onClick={handleToggleCamera}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition active:scale-95 shadow-lg ${cameraOn ? "bg-surface-800 text-white hover:bg-surface-700" : "bg-red-500 text-white ring-4 ring-red-500/20"}`}>
                {cameraOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
              </button>

              <button type="button" onClick={handleScreenShare}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition active:scale-95 shadow-lg ${screenSharing ? "bg-green-500 text-white ring-4 ring-green-500/20" : "bg-surface-800 text-white hover:bg-surface-700"}`}>
                <Monitor className="w-5 h-5" />
              </button>

              <button type="button" onClick={handlePiP}
                className="w-14 h-14 rounded-full bg-surface-800 text-white flex items-center justify-center hover:bg-surface-700 transition active:scale-95 shadow-lg">
                <PictureInPicture2 className="w-5 h-5" />
              </button>
            </>
          )}

          <button type="button" onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white flex items-center justify-center hover:shadow-lg hover:shadow-red-500/30 transition active:scale-95 shadow-lg shadow-red-500/25 ring-4 ring-red-500/20">
            <PhoneOff className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveCallUI;
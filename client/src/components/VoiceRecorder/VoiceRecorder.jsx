import { useCallback, useEffect, useRef, useState } from "react";

const VoiceRecorder = ({ onSend, onCancel }) => {
  const [, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const mrRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported("audio/webm;codecs=opus") ? "audio/webm;codecs=opus" : "audio/webm",
      });
      mrRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setRecording(false);
        clearInterval(timerRef.current);
        streamRef.current?.getTracks().forEach((t) => t.stop());
      };
      mr.start(100);
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => (d >= 120 ? (mr.stop(), d) : d + 1)), 1000);
    } catch { console.error("Mic error"); }
  }, []);

  const stopRecording = useCallback(() => {
    if (mrRef.current && mrRef.current.state !== "inactive") mrRef.current.stop();
  }, []);

  const cancelRecording = useCallback(() => {
    mrRef.current?.stream?.getTracks().forEach((t) => t.stop());
    mrRef.current?.stop();
    clearInterval(timerRef.current);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    onCancel();
  }, [audioUrl, onCancel]);

  const sendRecording = useCallback(() => {
    if (audioBlob) onSend(audioBlob, duration);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    streamRef.current?.getTracks().forEach((t) => t.stop());
  }, [audioBlob, duration, audioUrl, onSend]);

  useEffect(() => { startRecording(); return () => { clearInterval(timerRef.current); streamRef.current?.getTracks().forEach((t) => t.stop()); }; }, [startRecording]);

  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (audioUrl) {
    return (
      <div className="flex items-center gap-3 bg-surface-800/50 rounded-xl p-3 border border-surface-700/30 animate-slide-up">
        <button type="button" onClick={cancelRecording} className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:bg-surface-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
        <div className="flex-1 flex items-center gap-2">
          <span className="text-lg">🎤</span>
          <audio src={audioUrl} controls className="h-8 flex-1" />
          <span className="text-xs text-surface-500 shrink-0">{fmt(duration)}</span>
        </div>
        <button type="button" onClick={sendRecording} className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 translate-x-[1px]">
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-surface-800/50 rounded-xl p-3 border border-surface-700/30 animate-slide-up">
      <button type="button" onClick={cancelRecording} className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-500/10 transition">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" /></svg>
      </button>
      <div className="flex-1 flex items-center gap-2.5">
        <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" /><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" /></span>
        <span className="text-sm font-medium text-red-400">Recording</span>
      </div>
      <span className="text-sm font-mono text-surface-400">{fmt(duration)}</span>
      <button type="button" onClick={stopRecording} className="shrink-0 w-9 h-9 rounded-xl bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition active:scale-95">
        <div className="w-3 h-3 rounded-sm bg-white" />
      </button>
    </div>
  );
};

export default VoiceRecorder;

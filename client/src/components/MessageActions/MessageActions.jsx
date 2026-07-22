import { useEffect, useRef } from "react";

const MessageActions = ({ isOwn, onReply, onReact, onEdit, onDelete, onCopy, onClose }) => {
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute z-50 bg-surface-800 backdrop-blur-xl rounded-xl border border-surface-700/30 py-1 min-w-[140px] shadow-glass animate-scale-in">
      {[
        { label: "Reply", icon: "↩️", action: onReply },
        { label: "React", icon: "😊", action: onReact },
        ...(isOwn ? [{ label: "Edit", icon: "✏️", action: onEdit }, { label: "Delete", icon: "🗑️", action: onDelete, danger: true }] : []),
        { label: "Copy", icon: "📋", action: onCopy },
      ].map((item) => (
        <button key={item.label} type="button" onClick={() => { item.action(); onClose(); }}
          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition ${
            item.danger ? "text-red-400 hover:bg-red-500/10" : "text-surface-300 hover:bg-surface-700/50 hover:text-white"
          }`}>
          <span className="text-base">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default MessageActions;

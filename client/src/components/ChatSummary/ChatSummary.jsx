import { useState, useMemo } from "react";
import { generateChatSummary } from "../../utils/chatSummary";

const ChatSummary = ({ messages, currentUser }) => {
  const [open, setOpen] = useState(false);

  const summary = useMemo(
    () => generateChatSummary(messages, currentUser),
    [messages, currentUser]
  );

  if (!messages || messages.length === 0) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-surface-500 hover:text-white hover:bg-surface-800 transition"
        title="Chat Summary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12l2 2 4-4" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-navy-900 border border-surface-700/30 rounded-2xl shadow-glass w-full max-w-md p-6 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white">Chat Summary</h3>
              <button type="button" onClick={() => setOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-800 transition">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-surface-400">Messages:</span>
                <span className="text-white font-semibold">{summary.messageCount}</span>
              </div>
              {summary.keyPoints.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {summary.keyPoints.map((topic) => (
                      <span key={topic} className="px-2.5 py-1 text-xs rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/20 capitalize">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Summary</p>
                <p className="text-sm text-surface-300 leading-relaxed">{summary.summary}</p>
              </div>
              {summary.suggestedReply && (
                <div className="bg-surface-800/50 rounded-xl p-3 border border-surface-700/30">
                  <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-1">Suggested Reply</p>
                  <p className="text-sm text-white">{summary.suggestedReply}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatSummary;

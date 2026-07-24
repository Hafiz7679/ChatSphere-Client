import { useMemo } from "react";
import { generateChatSummary } from "../../utils/chatSummary";

const SmartReply = ({ messages, currentUser, onSelectReply }) => {
  const summary = useMemo(
    () => generateChatSummary(messages, currentUser),
    [messages, currentUser]
  );

  if (!summary.suggestedReply || summary.messageCount === 0) return null;

  const replies = [summary.suggestedReply];
  if (summary.keyPoints.length > 0) {
    replies.push(`Tell me more about ${summary.keyPoints[0]}`);
  }
  replies.push("👍");

  return (
    <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto">
      <span className="text-[10px] text-surface-500 uppercase tracking-wider shrink-0">Smart Reply</span>
      {replies.slice(0, 3).map((reply, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelectReply(reply)}
          className="shrink-0 px-3 py-1.5 text-xs bg-surface-800/60 border border-surface-700/30 rounded-full text-surface-300 hover:bg-surface-700/50 hover:text-white transition whitespace-nowrap"
        >
          {reply.length > 30 ? reply.slice(0, 30) + "..." : reply}
        </button>
      ))}
    </div>
  );
};

export default SmartReply;

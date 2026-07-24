const MessageReactions = ({ reactions = [], messageId, onReact }) => {
  if (!reactions || reactions.length === 0) return null;

  const grouped = reactions.reduce((acc, r) => {
    const existing = acc.find((item) => item.emoji === r.emoji);
    if (existing) {
      existing.count += 1;
      existing.users.push(r.user?._id || r.user);
    } else {
      acc.push({ emoji: r.emoji, count: 1, users: [r.user?._id || r.user] });
    }
    return acc;
  }, []);

  const currentUserId = JSON.parse(localStorage.getItem("user") || "null")?._id;

  return (
    <div className="flex items-center gap-1 flex-wrap mt-1">
      {grouped.map(({ emoji, count, users }) => {
        const hasReacted = users.includes(currentUserId);
        return (
          <button
            key={emoji}
            type="button"
            onClick={() => onReact?.(emoji)}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border transition ${
              hasReacted
                ? "bg-brand-500/20 border-brand-500/40 text-brand-300"
                : "bg-surface-700/50 border-surface-600/30 text-surface-300 hover:bg-surface-700 hover:text-white"
            }`}
          >
            <span className="text-sm leading-none">{emoji}</span>
            <span className="font-medium">{count}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MessageReactions;

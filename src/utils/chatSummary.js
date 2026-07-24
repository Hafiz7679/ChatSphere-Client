export const generateChatSummary = (messages, userName) => {
  if (!messages || messages.length === 0) {
    return { summary: "No messages to summarize.", keyPoints: [], messageCount: 0 };
  }

  const userMessages = messages.filter((m) => {
    const senderId = m.sender?._id || m.sender;
    return senderId !== userName?._id;
  });

  const content = userMessages.map((m) => m.content || m.text || "").filter(Boolean);

  return {
    summary: content.length > 0
      ? `You had a conversation with ${content.length} messages. Topics discussed include: ${getTopics(content).join(", ") || "general chat"}.`
      : "No readable content to summarize.",
    keyPoints: getTopics(content),
    messageCount: content.length,
    suggestedReply: getSuggestedReply(content),
  };
};

function getTopics(messages) {
  const topicKeywords = {
    work: ["meeting", "project", "deadline", "task", "work", "office", "job"],
    personal: ["how are you", "feeling", "family", "weekend", "holiday", "vacation"],
    tech: ["code", "app", "website", "bug", "feature", "update", "software"],
    plans: ["plan", "going", "coming", "tonight", "tomorrow", "schedule"],
    food: ["eat", "lunch", "dinner", "food", "restaurant", "coffee"],
  };

  const found = new Set();
  const text = messages.join(" ").toLowerCase();

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some((kw) => text.includes(kw))) {
      found.add(topic);
    }
  }

  return Array.from(found);
}

function getSuggestedReply(messages) {
  const lastMsg = messages[messages.length - 1]?.toLowerCase() || "";
  if (lastMsg.includes("?")) {
    if (lastMsg.includes("how are")) return "I'm doing well, thanks! How about you?";
    if (lastMsg.includes("meet") || lastMsg.includes("call")) return "Sure, let me know the time.";
    if (lastMsg.includes("help")) return "Of course, what do you need help with?";
    return "That's interesting! Tell me more.";
  }
  if (lastMsg.includes("thanks") || lastMsg.includes("thank")) return "You're welcome! 😊";
  if (lastMsg.includes("bye") || lastMsg.includes("goodbye")) return "Goodbye! Talk to you later.";
  return "Got it! 👍";
}

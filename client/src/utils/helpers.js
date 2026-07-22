export const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const diff = now - date;
  if (diff < 86400000 && now.getDate() === date.getDate()) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  )
    return "Yesterday";
  return date.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

export const shouldShowDateSeparator = (msg, prevMsg) => {
  if (!prevMsg) return true;
  const curr = new Date(msg.createdAt);
  const prev = new Date(prevMsg.createdAt);
  return (
    curr.getDate() !== prev.getDate() ||
    curr.getMonth() !== prev.getMonth() ||
    curr.getFullYear() !== prev.getFullYear()
  );
};

export const EMOJI_LIST = [
  "😀", "😂", "🥰", "😍", "🤔", "😎", "🔥", "💯",
  "❤️", "👍", "👎", "🎉", "🙏", "💀", "🤡", "👀",
  "😢", "😡", "🥳", "😴", "💪", "🤝", "✨", "⭐",
  "🙈", "🚀", "💡", "📸", "🎵", "🎶", "✅", "❌",
];

export const getFileIcon = (type) => {
  if (type?.startsWith("image")) return "🖼️";
  if (type?.startsWith("video")) return "🎬";
  if (type?.startsWith("audio")) return "🎵";
  if (type?.includes("pdf")) return "📄";
  if (type?.includes("word") || type?.includes("document")) return "📝";
  if (type?.includes("excel") || type?.includes("spreadsheet")) return "📊";
  if (type?.includes("powerpoint") || type?.includes("presentation"))
    return "📽️";
  if (type?.includes("zip") || type?.includes("rar")) return "📦";
  return "📎";
};

export const formatFileSize = (bytes) => {
  if (!bytes) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
};

export const formatDuration = (seconds) => {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export function debounce(fn, delay) {
  let timer = null;
  const debounced = (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { fn(...args); timer = null; }, delay);
  };
  debounced.cancel = () => { if (timer) { clearTimeout(timer); timer = null; } };
  return debounced;
}

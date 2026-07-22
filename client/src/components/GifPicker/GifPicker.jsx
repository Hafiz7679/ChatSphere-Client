import { useState } from "react";

const SAMPLE_GIFS = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDZnNnQwazU4bmF5czZpdWR2aDR0dXNkZnVxeHJ5OXlhbjN1NzVzZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26Fxy3X8l9BQnC6F6/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcW5vYXB5ajc0bmhjYmcxdmhiemkxMTBuYmxjaDZlNmc5Zm8zb3RzdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oEjI6SIIHBdRxXI40/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExajVmeHp6ZzZva2NkN3l5Y2h3dTlocjZoYmp4MDZidDc3M2NkNTJzeSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26BRrB4PjrT0o7I4M/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExajl1MmdpZmY5ZXV4eThkbzBwMHN3eXhsdXlqM3NydW14YjN3bjN0YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3ohzdIsK4Rl4sdk2qM/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcjdjejVrNWFkajB2N2NqczdtdHRjaXJzYXljaDR4d3R2cnh6dHh1YSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKz9q9T5Oc6y6ZO/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDNmcDIwcDk3ZTZzajU0YnZ2N3NyczBmc2VzejNzdXJja3JkNGFwMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0HlTy9x8gW6zJ7IQ/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZzFmZzA3bGZiM3V0enVqNXFzYmt0dWJ2ZTVkcnFnYmV2MnJpMWV4YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qzMpE1vXv2F5e/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDNjNTYyM3l2d28ydHRjY2FmcjRhbnc5ejA5NDFxdXZ3eXJydDMzZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xUA7b6r2N3Q7u4bPq/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeDdiNTY4ajczZHVyNWplZHFyMXNheXAyZTI3d21vNnp4YXNoenlqYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPnAiaMCws8nDSE/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzFyeG1yYjNkOXBzN3ZiMmV4ZmVycHBoajUwZDlpdGp4ZWJzZWp2dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26ufnwz0QKJJeCZsM/giphy.gif",
];

const GifPicker = ({ onSelect, onClose }) => {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? SAMPLE_GIFS.filter((_, i) => i % 2 === 0 || i % 3 === 0)
    : SAMPLE_GIFS;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />
      <div className="absolute bottom-20 left-0 z-50 w-80 bg-surface-800 backdrop-blur-xl rounded-2xl border border-surface-700/30 shadow-glass animate-scale-in overflow-hidden">
        <div className="p-3 border-b border-surface-700/30">
          <div className="flex items-center gap-2 bg-surface-700/50 rounded-xl px-3 py-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-surface-400 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search GIFs..."
              className="bg-transparent text-sm text-white placeholder-surface-500 outline-none flex-1"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 p-3 max-h-64 overflow-y-auto">
          {filtered.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(url)}
              className="rounded-xl overflow-hidden aspect-video bg-surface-700/50 hover:ring-2 ring-brand-500 transition-all duration-200"
            >
              <img src={url} alt={`GIF ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default GifPicker;

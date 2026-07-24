import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";

const MessageSearch = ({ messages = [], onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const lower = query.toLowerCase();
    const filtered = messages.filter(
      (msg) => msg.text && msg.text.toLowerCase().includes(lower)
    );
    setResults(filtered);
  }, [query, messages]);

  const handleClear = () => setQuery("");

  return (
    <div className="bg-navy-900 border-b border-surface-700/30 px-4 py-3 animate-slide-down">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages..."
            className="w-full bg-surface-800/50 border border-surface-700/30 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-surface-500 outline-none focus:border-brand-500/50 focus:ring-1 focus:ring-brand-500/20 transition"
            aria-label="Search messages"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-white transition rounded-md p-0.5"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {results.length > 0 && (
          <span className="text-xs text-surface-400 font-medium shrink-0">
            {results.length} result{results.length !== 1 ? "s" : ""}
          </span>
        )}
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-800 transition shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
          aria-label="Close search"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {results.length > 0 && (
        <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
          {results.map((msg) => (
            <div key={msg._id} className="text-xs text-surface-400 bg-surface-800/30 rounded-lg px-3 py-2">
              {msg.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageSearch;

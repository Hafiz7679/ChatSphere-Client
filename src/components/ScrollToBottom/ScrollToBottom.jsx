import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const ScrollToBottom = ({ containerRef, bottomRef }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;
    const onScroll = () => {
      const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
      setVisible(!isNearBottom);
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [containerRef]);

  const scroll = () => {
    bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scroll}
      className="absolute bottom-20 right-4 md:right-8 z-30 w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/30 hover:bg-brand-600 transition active:scale-95 animate-fade-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
      aria-label="Scroll to bottom"
    >
      <ChevronDown className="w-5 h-5" />
    </button>
  );
};

export default ScrollToBottom;

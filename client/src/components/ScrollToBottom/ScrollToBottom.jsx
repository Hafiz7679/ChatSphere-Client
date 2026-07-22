import { useState, useEffect } from "react";

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
    <button onClick={scroll} className="absolute bottom-20 right-8 z-30 w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/30 hover:bg-brand-600 transition active:scale-95 animate-fade-in">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </button>
  );
};

export default ScrollToBottom;

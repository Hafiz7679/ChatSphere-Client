const Logo = ({ size = "md" }) => {
  const textSizes = { sm: "text-lg", md: "text-2xl", lg: "text-3xl" };
  const iconSizes = { sm: "w-5 h-5", md: "w-7 h-7", lg: "w-9 h-9" };

  return (
    <div className="flex items-center justify-center gap-2.5">
      <div className={`${iconSizes[size] || iconSizes.md} rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg shadow-brand-500/30 relative overflow-hidden`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className="w-3/4 h-3/4">
          <circle cx="50" cy="50" r="28" stroke="white" strokeWidth="2.5" opacity="0.3" />
          <circle cx="50" cy="50" r="18" stroke="white" strokeWidth="2" opacity="0.5" />
          <circle cx="50" cy="28" r="5" fill="white" />
          <circle cx="72" cy="50" r="5" fill="white" />
          <circle cx="50" cy="72" r="5" fill="white" />
          <circle cx="28" cy="50" r="5" fill="white" />
          <line x1="50" y1="28" x2="72" y2="50" stroke="white" strokeWidth="2" opacity="0.8" />
          <line x1="72" y1="50" x2="50" y2="72" stroke="white" strokeWidth="2" opacity="0.8" />
          <line x1="50" y1="72" x2="28" y2="50" stroke="white" strokeWidth="2" opacity="0.8" />
          <line x1="28" y1="50" x2="50" y2="28" stroke="white" strokeWidth="2" opacity="0.8" />
          <line x1="50" y1="28" x2="50" y2="72" stroke="white" strokeWidth="1.5" opacity="0.4" />
          <line x1="28" y1="50" x2="72" y2="50" stroke="white" strokeWidth="1.5" opacity="0.4" />
          <circle cx="50" cy="50" r="7" fill="white" />
          <path d="M44 48l4 4 8-8" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <span className={`${textSizes[size] || textSizes.md} font-bold text-white tracking-tight`}>
        ChatSphere
      </span>
    </div>
  );
};

export default Logo;

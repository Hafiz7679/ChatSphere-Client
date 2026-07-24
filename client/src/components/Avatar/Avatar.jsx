const sizes = {
  xs: "w-7 h-7 text-[10px]",
  sm: "w-9 h-9 text-sm",
  md: "w-11 h-11 text-base",
  lg: "w-14 h-14 text-lg",
  xl: "w-20 h-20 text-2xl",
};

const Avatar = ({ src, name, size = "md", className = "", status, onClick }) => {
  const getInitial = (n) => (n ? n.charAt(0).toUpperCase() : "?");
  const gradientColors = [
    "from-brand-500 to-accent-500",
    "from-emerald-500 to-cyan-500",
    "from-rose-500 to-orange-500",
    "from-violet-500 to-purple-500",
    "from-sky-500 to-indigo-500",
    "from-amber-500 to-rose-500",
  ];
  const colorIndex = name ? name.charCodeAt(0) % gradientColors.length : 0;

  return (
    <div className="relative shrink-0" onClick={onClick}>
      {src ? (
        <div
          className={`${sizes[size] || sizes.md} rounded-full shrink-0 bg-surface-800 ${className}`}
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ) : (
        <div
          className={`${sizes[size] || sizes.md} rounded-full bg-gradient-to-br ${
            gradientColors[colorIndex]
          } flex items-center justify-center text-white font-semibold shrink-0 ${className}`}
        >
          {getInitial(name)}
        </div>
      )}
      {status && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-navy-800 ${
            status === "online"
              ? "bg-emerald-500"
              : status === "away"
              ? "bg-amber-500"
              : "bg-surface-500"
          }`}
        />
      )}
    </div>
  );
};

export default Avatar;

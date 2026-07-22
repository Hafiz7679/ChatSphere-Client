const variants = {
  primary:
    "bg-gradient-to-r from-brand-500 to-accent-500 text-white hover:from-brand-600 hover:to-accent-600 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40",
  secondary:
    "bg-surface-700/50 text-surface-200 border border-surface-600/50 hover:bg-surface-700 hover:border-brand-500/30",
  ghost:
    "text-surface-400 hover:text-white hover:bg-surface-800/50",
  danger:
    "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40",
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  fullWidth = true,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${fullWidth ? "w-full" : ""}
        ${sizes[size]}
        ${variants[variant] || variants.primary}
        rounded-xl font-semibold transition-all duration-200
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none
        active:scale-[0.98]
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;

const sizes = {
  sm: "w-5 h-5 border-2",
  md: "w-8 h-8 border-[3px]",
  lg: "w-12 h-12 border-4",
};

const Loader = ({ size = "md", className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizes[size] || sizes.md} rounded-full border-surface-700/50 border-t-brand-500 animate-spin`}
      />
    </div>
  );
};

export default Loader;

import useTheme from "../../hooks/useTheme";

const MODES = [
  { key: "dark", label: "Dark", icon: "🌙" },
  { key: "light", label: "Light", icon: "☀️" },
  { key: "system", label: "System", icon: "💻" },
];

const ThemeToggle = ({ className = "" }) => {
  const { themeMode, cycleTheme } = useTheme();
  const current = MODES.find((m) => m.key === themeMode) || MODES[0];

  return (
    <button
      type="button"
      onClick={cycleTheme}
      className={`w-9 h-9 rounded-xl flex items-center justify-center text-surface-400 hover:text-white hover:bg-surface-800 transition ${className}`}
      aria-label={`Theme: ${current.label}. Click to switch.`}
      title={`Theme: ${current.label}`}
    >
      <span className="text-base leading-none">{current.icon}</span>
    </button>
  );
};

export default ThemeToggle;

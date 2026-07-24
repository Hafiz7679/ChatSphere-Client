import { Moon, Sun, Monitor } from "lucide-react";
import useTheme from "../../hooks/useTheme";

const MODES = [
  { key: "dark", label: "Dark", icon: Moon },
  { key: "light", label: "Light", icon: Sun },
  { key: "system", label: "System", icon: Monitor },
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
      {(() => { const Icon = current.icon; return <Icon className="w-4 h-4" />; })()}
    </button>
  );
};

export default ThemeToggle;

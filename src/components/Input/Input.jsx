import { useState } from "react";
import { EyeOff, Eye, Info } from "lucide-react";

const Input = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="mb-5">
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-surface-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full bg-surface-800/50 border rounded-xl px-4 py-3.5
            text-sm text-white placeholder:text-surface-500
            outline-none transition-all duration-200
            focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-800
            ${
              error
                ? "border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                : focused
                ? "border-brand-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                : "border-surface-700/50 hover:border-surface-600"
            }
          `}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-300 transition rounded-lg p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1">
          <Info className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;

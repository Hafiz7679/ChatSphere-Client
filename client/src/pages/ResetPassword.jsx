import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/api";
import AuthLayout from "../layouts/AuthLayout";
import Logo from "../components/Logo/Logo";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import { validatePasswordStrength } from "../utils/validation";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState({ score: 0, label: "", requirements: {} });
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setStrength(validatePasswordStrength(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error("Enter a new password");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("Password must contain an uppercase letter");
      return;
    }
    if (!/[0-9]/.test(password)) {
      toast.error("Password must contain a number");
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      toast.error("Password must contain a special character");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await API.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset successful. Please log in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-surface-800/40 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-8 shadow-glass max-w-md mx-auto">
        <div className="text-center mb-8">
          <Logo />
          <p className="text-surface-400 text-sm mt-3">Set a new password</p>
        </div>
        <form onSubmit={handleSubmit}>
          <Input
            label="New Password"
            name="password"
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={handlePasswordChange}
          />
          {password && (
            <div className="mb-4 -mt-3">
              <div className="flex gap-1.5 mb-1">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      i < strength.score ? (strength.score > 4 ? "bg-emerald-500" : ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-lime-500", "bg-emerald-500"][strength.score - 1]) : "bg-surface-700"
                    }`}
                  />
                ))}
              </div>
              {strength.score > 0 && (
                <p className="text-[11px] text-surface-500">{strength.label}</p>
              )}
            </div>
          )}
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
        <p className="text-center mt-7 text-surface-400 text-sm">
          <Link to="/login" className="text-brand-400 font-semibold hover:text-brand-300 transition">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;

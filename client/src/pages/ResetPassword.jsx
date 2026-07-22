import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/api";
import AuthLayout from "../layouts/AuthLayout";
import Logo from "../components/Logo/Logo";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await API.post(`/auth/reset-password/${token}`, { password });
      toast.success("Password reset successful");
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
            onChange={(e) => setPassword(e.target.value)}
          />
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

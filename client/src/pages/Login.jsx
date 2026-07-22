import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import API from "../api/api";
import AuthLayout from "../layouts/AuthLayout";
import Logo from "../components/Logo/Logo";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import { validateLogin } from "../utils/validation";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validateLogin(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const response = await API.post("/auth/login", formData);
      toast.success(response.data.message);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
      navigate("/chat");
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
      if (msg.includes("verify your email")) {
        setShowVerifyPrompt(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const [showVerifyPrompt, setShowVerifyPrompt] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const resendVerification = async () => {
    setVerifying(true);
    try {
      const res = await API.post("/auth/resend-verification", { email: formData.email });
      toast.success(res.data.message || "Verification email sent");
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to send verification email";
      toast.error(msg);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-surface-800/40 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-8 shadow-glass">
        <div className="text-center mb-8">
          <Logo />
          <p className="text-surface-400 text-sm mt-3">Welcome back to your conversations</p>
        </div>
        {showVerifyPrompt && (
          <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-amber-400 text-xs mb-2">
              Your email is not yet verified. Please check your inbox or request a new link.
            </p>
            <button
              onClick={resendVerification}
              disabled={verifying}
              className="text-xs text-brand-400 hover:text-brand-300 font-medium"
            >
              {verifying ? "Sending..." : "Resend verification email"}
            </button>
          </div>
        )}
        <form onSubmit={handleLogin}>
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          <div className="mt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </div>
        </form>
        <div className="text-center mt-4">
          <Link to="/forgot-password" className="text-sm text-surface-400 hover:text-surface-300 transition">
            Forgot password?
          </Link>
        </div>
        <p className="text-center mt-5 text-surface-400 text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-brand-400 font-semibold hover:text-brand-300 transition">
            Create one
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;

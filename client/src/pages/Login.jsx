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
      toast.error("Please fix the errors.");
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
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-surface-800/40 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-8 shadow-glass">
        <div className="text-center mb-8">
          <Logo />
          <p className="text-surface-400 text-sm mt-3">Welcome back to your conversations</p>
        </div>
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
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </div>
        </form>
        <div className="text-center mt-4">
          <Link
            to="/forgot-password"
            className="text-sm text-surface-400 hover:text-surface-300 transition"
          >
            Forgot password?
          </Link>
        </div>
        <p className="text-center mt-5 text-surface-400 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-brand-400 font-semibold hover:text-brand-300 transition"
          >
            Create one
          </Link>
        </p>
        <p className="text-center mt-6 text-[10px] text-surface-500 tracking-wider">
          Powered by <span className="text-surface-400 font-medium">Hafiz</span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;

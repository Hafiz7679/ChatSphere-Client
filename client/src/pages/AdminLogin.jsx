import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { HiShieldCheck } from "react-icons/hi";
import { adminLogin } from "../api/api";
import AuthLayout from "../layouts/AuthLayout";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const response = await adminLogin(formData);
      toast.success(response.data.message);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
      navigate("/admin");
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-surface-800/40 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-8 shadow-glass">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg shadow-brand-500/30 mb-4">
            <HiShieldCheck className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Admin Login</h1>
          <p className="text-surface-400 text-sm mt-1">Authorized personnel only</p>
        </div>
        <form onSubmit={handleLogin}>
          <Input
            label="Admin Email"
            name="email"
            type="email"
            placeholder="admin@example.com"
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
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500/30 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-xs text-surface-400 group-hover:text-surface-300 transition">Remember me</span>
            </label>
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In"}
          </Button>
        </form>
        <p className="text-center mt-5 text-surface-500 text-xs">
          Regular users{" "}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 transition font-medium">
            sign in here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default AdminLogin;
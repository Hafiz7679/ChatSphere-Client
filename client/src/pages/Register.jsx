import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/api";
import AuthLayout from "../layouts/AuthLayout";
import Logo from "../components/Logo/Logo";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      let score = 0;
      if (value.length >= 6) score++;
      if (value.length >= 10) score++;
      if (/[A-Z]/.test(value)) score++;
      if (/[0-9]/.test(value)) score++;
      if (/[^A-Za-z0-9]/.test(value)) score++;
      setPasswordStrength(score);
    }
  };

  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-lime-500", "bg-emerald-500"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong", "Very Strong"];

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const response = await API.post("/auth/register", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      toast.success(response.data.message);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);
      navigate("/chat");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-surface-800/40 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-8 shadow-glass">
        <div className="text-center mb-8">
          <Logo />
          <p className="text-surface-400 text-sm mt-3">Create your account</p>
        </div>
        <form onSubmit={handleRegister}>
          <Input
            label="Full Name"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
          />
          {formData.password && (
            <div className="mb-4 -mt-3">
              <div className="flex gap-1.5 mb-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i < passwordStrength
                        ? strengthColors[passwordStrength - 1] || "bg-emerald-500"
                        : "bg-surface-700"
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-surface-500">
                {strengthLabels[passwordStrength] || ""}
              </p>
            </div>
          )}
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
        <p className="text-center mt-7 text-surface-400 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-400 font-semibold hover:text-brand-300 transition"
          >
            Sign in
          </Link>
        </p>
        <p className="text-center mt-6 text-[10px] text-surface-500 tracking-wider">
          Powered by <span className="text-surface-400 font-medium">Hafiz</span>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;

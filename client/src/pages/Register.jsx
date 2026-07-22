import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api/api";
import AuthLayout from "../layouts/AuthLayout";
import Logo from "../components/Logo/Logo";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";
import { validateRegister, validatePasswordStrength } from "../utils/validation";
import { sanitizeHtml } from "../utils/sanitize";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: "", color: "", requirements: {} });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name === "password") {
      setPasswordStrength(validatePasswordStrength(value));
    }
  };

  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-lime-500", "bg-emerald-500", "bg-emerald-500"];
  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validateRegister(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the form errors");
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const response = await API.post("/auth/register", {
        name: sanitizeHtml(formData.name.trim()),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
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
            error={errors.name}
          />
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
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />
          {formData.password && (
            <div className="mb-4 -mt-3">
              <div className="flex gap-1.5 mb-1">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i < passwordStrength.score
                        ? strengthColors[passwordStrength.score - 1] || "bg-emerald-500"
                        : "bg-surface-700"
                    }`}
                  />
                ))}
              </div>
              {passwordStrength.score > 0 && (
                <p className="text-[11px] text-surface-500">{passwordStrength.label}</p>
              )}
              <div className="mt-2 grid grid-cols-2 gap-1">
                {[
                  { key: "length", label: "8+ characters" },
                  { key: "uppercase", label: "Uppercase letter" },
                  { key: "lowercase", label: "Lowercase letter" },
                  { key: "number", label: "Number" },
                  { key: "special", label: "Special character" },
                ].map((req) => (
                  <div key={req.key} className="flex items-center gap-1.5 text-[10px]">
                    <span className={`${passwordStrength.requirements[req.key] ? "text-emerald-400" : "text-surface-600"}`}>
                      {passwordStrength.requirements[req.key] ? "✓" : "○"}
                    </span>
                    <span className={`${passwordStrength.requirements[req.key] ? "text-surface-400" : "text-surface-600"}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
        <p className="text-center mt-4 text-[11px] text-surface-500">
          By creating an account, you agree to check your email for a verification link.
        </p>
        <p className="text-center mt-5 text-surface-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-brand-400 font-semibold hover:text-brand-300 transition">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;

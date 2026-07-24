import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import API from "../api/api";
import AuthLayout from "../layouts/AuthLayout";
import Logo from "../components/Logo/Logo";
import Input from "../components/Input/Input";
import Button from "../components/Button/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Enter your email address");
      return;
    }
    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email: email.trim().toLowerCase() });
      setSent(true);
      toast.success("Check your email for the reset link");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="bg-surface-800/40 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-8 shadow-glass max-w-md mx-auto">
        <div className="text-center mb-8">
          <Logo />
          <p className="text-surface-400 text-sm mt-3">
            {sent ? "Email sent" : "Reset your password"}
          </p>
        </div>
        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <p className="text-surface-300 text-sm">
              If an account exists for <strong className="text-white">{email}</strong>, a reset link has been sent.
            </p>
            <p className="text-surface-500 text-xs mt-2">
              Didn't receive it?{" "}
              <button onClick={() => setSent(false)} className="text-brand-400 hover:text-brand-300">
                Try again
              </button>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}
        <p className="text-center mt-7 text-surface-400 text-sm">
          Remember your password?{" "}
          <Link to="/login" className="text-brand-400 font-semibold hover:text-brand-300 transition">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;

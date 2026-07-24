import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api";
import AuthLayout from "../layouts/AuthLayout";
import Logo from "../components/Logo/Logo";
import { Check, CircleAlert } from "lucide-react";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    let cancelled = false;
    const verify = async () => {
      try {
        await API.get(`/auth/verify-email/${token}`);
        if (!cancelled) setStatus("success");
      } catch {
        if (!cancelled) setStatus("invalid");
      }
    };
    verify();
    return () => { cancelled = true; };
  }, [token]);

  return (
    <AuthLayout>
      <div className="bg-surface-800/40 backdrop-blur-xl border border-surface-700/30 rounded-2xl p-8 shadow-glass max-w-md mx-auto text-center">
        <Logo />
        <div className="mt-8">
          {status === "verifying" && (
            <>
              <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-surface-300">Verifying your email...</p>
            </>
          )}
          {status === "success" && (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Email Verified</h2>
              <p className="text-surface-400 text-sm mb-6">Your email has been verified successfully.</p>
              <Link to="/login" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 text-white font-semibold hover:shadow-lg hover:shadow-brand-500/25 transition">
                Sign In
              </Link>
            </>
          )}
          {status === "invalid" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <CircleAlert className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Invalid Link</h2>
              <p className="text-surface-400 text-sm mb-6">This verification link is invalid or expired.</p>
              <Link to="/login" className="text-brand-400 font-semibold hover:text-brand-300 transition">
                Back to sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmail;

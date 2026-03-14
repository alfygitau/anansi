import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Loader2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateEmail = (email) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
    return pattern.test(email);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    // Simulating API Call
    try {
      // await api.post("/customer/forgot-password", { email });
      setTimeout(() => {
        setLoading(false);
        setIsSubmitted(true);
        // In your real app: navigate("/auth/forgot-password-otp");
      }, 1500);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Something went wrong. Try again.",
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-[40px] shadow-xl shadow-blue-900/5 border border-slate-100 p-8"
      >
        {!isSubmitted ? (
          <>
            {/* ICON & HEADER */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
                <ShieldCheck size={32} className="text-[#4DB8E4]" />
              </div>
              <h1 className="text-2xl font-black text-[#042159] mb-2">
                Forgot Password?
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed max-w-[320px] mx-auto">
                No worries, it happens to the best of us. Enter the email
                address associated with your account and we'll send you a secure
                link with instructions to get you back in.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className={`w-full h-14 pl-12 pr-4 bg-slate-50 border rounded-2xl outline-none transition-all text-sm font-medium
                      ${error ? "border-rose-200 focus:border-rose-400" : "border-slate-100 focus:border-[#4DB8E4] focus:bg-white"}
                    `}
                  />
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-1.5 text-rose-500 text-xs font-bold mt-1 ml-1"
                  >
                    <AlertCircle size={14} />
                    {error}
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-[#042159] hover:bg-[#062d7a] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Reset Password"
                )}
              </button>

              {/* FOOTER INFO */}
              <p className="mt-10 text-center text-xs text-slate-400 font-medium">
                Didn't receive the email?{" "}
                <span className="text-[#4DB8E4] cursor-pointer font-bold hover:underline">
                  Resend code
                </span>
              </p>
            </form>
          </>
        ) : (
          /* SUCCESS STATE */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center mb-6 mx-auto">
              <CheckCircle2 size={32} className="text-emerald-500" />
            </div>
            <h1 className="text-2xl font-black text-[#042159] mb-2">
              Check your email
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              We've sent password reset instructions to <br />
              <span className="font-bold text-[#042159]">{email}</span>
            </p>
            <button
              onClick={() => navigate("/auth/login")}
              className="w-full h-14 border-2 border-slate-100 hover:bg-slate-50 text-[#042159] rounded-2xl font-black uppercase tracking-widest text-xs transition-all"
            >
              Back to Login
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

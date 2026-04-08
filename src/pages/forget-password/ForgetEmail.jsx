import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Loader2,
  ShieldCheck,
  AlertCircle,
  ShieldAlert,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import { forgetPassword } from "../../sdks/auth/auth";
import { useStore } from "../../store/useStore";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const { showToast } = useToast();
  const setForgetEmail = useStore((state) => state.setForgetEmail);

  const handleBlur = () => {
    setTouched(true);
    if (!email) {
      setError("Email is required.");
    } else if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
    } else {
      setError("");
    }
  };

  const validateEmail = (email) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
    return pattern.test(email);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    await forgetEmailMutate();
  };

  const { mutate: forgetEmailMutate, isLoading } = useMutation({
    mutationKey: ["forgot password"],
    mutationFn: () => forgetPassword(email),
    onSuccess: () => {
      setForgetEmail(email);
      navigate("/auth/forgot-password-verification");
    },
    onError: (error) => {
      showToast({
        title: "Authentication glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const isInvalid = !validateEmail(email);
  const isButtonDisabled = isLoading || isInvalid || !email;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-[40px] shadow-xl shadow-blue-900/5 border border-slate-100 p-8"
      >
        {/* ICON & HEADER */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
            <ShieldCheck size={32} className="text-secondary" />
          </div>
          <h1 className="text-2xl font-black text-primary mb-2">
            Forgot Password?
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-[320px] mx-auto">
            No worries, it happens to the best of us. Enter the email address
            associated with your account and we'll send you a secure link with
            instructions to get you back in.
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
                onBlur={handleBlur}
                placeholder="name@company.com"
                className={`w-full h-14 pl-12 pr-4 bg-slate-50 border rounded-2xl outline-none transition-all text-sm font-medium
                      ${error ? "border-rose-200 focus:border-rose-400" : "border-slate-100 focus:border-secondary focus:bg-white"}
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
            disabled={isButtonDisabled}
            className={`w-full h-14 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-lg 
    ${
      isButtonDisabled
        ? "opacity-50 cursor-not-allowed shadow-none bg-slate-400"
        : "bg-primary hover:bg-[#062d7a] hover:scale-[1.02] active:scale-[0.98] shadow-blue-900/20"
    }
  `}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100"
        >
          <div className="flex gap-3">
            <ShieldAlert size={18} className="text-secondary shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-primary">
                Security Notice
              </h4>
              <p className="text-[12px] text-slate-500 leading-relaxed">
                For your protection, this verification code will expire in{" "}
                <span className="font-bold text-primary">10 minutes</span>. If
                you didn't request this, please ignore this email or contact
                support if you suspect unauthorized activity.
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-2">
            <Info size={14} className="text-slate-400" />
            <p className="text-[10px] text-slate-400 font-medium">
              Check your <span className="font-bold">Spam</span> or{" "}
              <span className="font-bold">Promotions</span> folder if the email
              doesn't arrive.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

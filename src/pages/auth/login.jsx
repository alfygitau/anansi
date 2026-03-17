import { useState } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Fingerprint,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser, resendOtp } from "../../sdks/auth/auth";
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ memberId: "", password: "" });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();
  const { setAuth } = useAuth();

  const validateField = (name, value) => {
    let error = "";
    if (name === "memberId") {
      if (!value.trim()) error = "Member username is required";
    }
    if (name === "password") {
      if (!value) error = "Password is required";
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const isFormValid =
    formData.memberId &&
    formData.password &&
    !errors.memberId &&
    !errors.password;

  const { mutate: resendOtpMutate } = useMutation({
    mutationKey: ["send admin otp"],
    mutationFn: (id) => resendOtp(id),
    onSuccess: () => {
      navigate("/admin-customer/otp");
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

  const { mutate: loginMutate, isLoading } = useMutation({
    mutationKey: ["login"],
    mutationFn: () => loginUser(formData.memberId, formData.password),
    onSuccess: (data) => {
      setAuth(data?.data?.data);
      showToast({
        title: "Authentication Success",
        type: "success",
        position: "top-right",
        description:
          "Welcome back to Anansi.\nYour session is active for 24 hours.",
      });
      handleLoginLogic(data?.data?.data);
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

  const handleLogin = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    loginMutate();
  };

  const handleLoginLogic = (res) => {
    if (
      res?.user?.status === "Active" &&
      res?.user?.onboarding_stage.toLowerCase() === "completed" &&
      res?.user?.temporary_password === false
    ) {
      if (res?.tokens && Object.keys(res.tokens).length > 0) {
        navigate("/home");
      } else {
        navigate("/auth/one-time-password");
      }
    } else if (
      res?.user?.status === "Pending Payment" &&
      res?.user?.onboarding_stage.toLowerCase() === "completed" &&
      res?.user?.temporary_password === false
    ) {
      if (res?.tokens && Object.keys(res.tokens).length > 0) {
        navigate("/home");
      } else {
        navigate("/auth/one-time-password");
      }
    } else if (
      res?.user?.status === "Pending Verification" &&
      res?.user?.onboarding_stage.toLowerCase() === "completed" &&
      res?.user?.temporary_password === false
    ) {
      navigate(`/onboarding/pending-account`);
    } else if (
      res?.user?.onboarding_stage.toLowerCase() === "completed" &&
      res?.user?.temporary_password === true
    ) {
      resendOtpMutate(res?.user?.id);
    } else {
      navigate(`/onboarding/continue`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-sky-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-[440px]">
        {/* Logo / Brand Area */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-[#042159] rounded-[22px] flex items-center justify-center shadow-2xl shadow-blue-900/20 mb-6">
            <ShieldCheck className="text-[#4DB8E4]" size={32} />
          </div>
          <h1 className="text-2xl font-black text-[#042159] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
            Secure Member Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-blue-900/5">
          <form className="space-y-6" onSubmit={handleLogin}>
            {/* Member ID Input */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2 block">
                Username or Email
              </label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4DB8E4] transition-colors">
                  <User size={20} />
                </div>
                <input
                  name="memberId"
                  type="text"
                  placeholder="Enter ID number"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[24px] focus:ring-2 focus:ring-[#4DB8E4]/20 outline-none font-bold text-[#042159] transition-all"
                  value={formData.memberId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <AnimatePresence>
                {errors.memberId && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-rose-500 text-[11px] font-bold mt-2 ml-4 flex items-center gap-1"
                  >
                    <AlertCircle size={12} /> {errors.memberId}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-3 ml-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                  Security Password
                </label>
                <button
                  type="button"
                  onClick={() => navigate("/auth/forgot-password")}
                  className="text-[10px] font-black uppercase text-[#4DB8E4] hover:text-[#042159]"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4DB8E4] transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-14 py-5 bg-slate-50 border-none rounded-[24px] focus:ring-2 focus:ring-[#4DB8E4]/20 outline-none font-bold text-[#042159] transition-all"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#042159] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <AnimatePresence>
                {errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-rose-500 text-[11px] font-bold mt-2 ml-4 flex items-center gap-1"
                  >
                    <AlertCircle size={12} /> {errors.password}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full py-5 rounded-[24px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-3 shadow-xl transition-all mt-4 text-white overflow-hidden relative
    ${
      isFormValid || isLoading
        ? "bg-[#042159] hover:bg-[#062d7a] shadow-blue-900/20 cursor-pointer active:scale-[0.98]"
        : "bg-slate-300 shadow-none cursor-not-allowed opacity-70"
    } ${isLoading ? "animate-pulse" : ""}`}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <Loader2 className="animate-spin" size={20} />
                    <span>Authenticating...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="static"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    Sign In <ArrowRight size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </form>

          {/* Biometric Prompt (Optional Mobile Feature) */}
          <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col items-center">
            <button className="flex items-center gap-2 text-slate-400 hover:text-[#042159] transition-colors group">
              <Fingerprint
                size={24}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Use Biometrics
              </span>
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <p className="text-center mt-10 text-slate-400 text-[11px] font-bold uppercase tracking-tight">
          Not a member yet?{" "}
          <button onClick={() => navigate(`/`)} className="text-[#4DB8E4] ml-1">
            Open an account
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;

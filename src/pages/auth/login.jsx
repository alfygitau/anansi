import { useState } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Zap,
  TrendingUp,
  Shield,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser, resendOtp } from "../../sdks/auth/auth";
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import useAuth from "../../hooks/useAuth";
import { useStore } from "../../store/useStore";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ memberId: "", password: "" });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();
  const { setAuth } = useAuth();
  const setRegisteredUser = useStore((state) => state.setRegisteredUser);

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
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const isFormValid =
    formData.memberId &&
    formData.password &&
    !errors.memberId &&
    !errors.password;

  const { mutate: loginMutate, isLoading } = useMutation({
    mutationKey: ["login"],
    mutationFn: () => loginUser(formData.memberId, formData.password),
    onSuccess: (data) => {
      setAuth(data?.data?.data);
      setRegisteredUser(data?.data?.data?.user);
      showToast({
        title: "Welcome back",
        type: "success",
        position: "top-right",
        description:
          "Identity verified. You have been securely authenticated, and your encrypted session is now active.",
      });
      handleLoginLogic(data?.data?.data);
    },
    onError: (error) => {
      showToast({
        title: "Login failed",
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
      res?.tokens && Object.keys(res.tokens).length > 0
        ? navigate("/home")
        : navigate("/auth/one-time-password");
    } else {
      navigate(`/onboarding/continue`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 sm:p-2 antialiased">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 py-3 px-6 bg-white overflow-hidden">
        <div className="relative bg-white sm:hidden p-6 lg:p-6 flex flex-col justify-between overflow-hidden border-r border-slate-200">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 mb-12">
              <ShieldCheck className="text-primary" size={18} />
              <span className="text-primary text-xs font-black tracking-widest uppercase">
                ANANSI SACCO
              </span>
            </div>
            <h2 className="text-slate-900 text-2xl xl:text-3xl font-black leading-[1.1] mb-8">
              A faster, reliable way to manage{" "}
              <span className="text-primary">your money.</span>
            </h2>
            <div className="space-y-8">
              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Zap
                    className="text-primary group-hover:text-white transition-colors"
                    size={22}
                  />
                </div>
                <div>
                  <h4 className="text-slate-900 font-black text-lg">
                    Instant Access
                  </h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mt-1">
                    Submit loan applications and receive funds within minutes,
                    not days.
                  </p>
                </div>
              </div>
              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors">
                  <TrendingUp
                    className="text-primary group-hover:text-white transition-colors"
                    size={22}
                  />
                </div>
                <div>
                  <h4 className="text-slate-900 font-black text-lg">
                    Shares Management
                  </h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mt-1">
                    Track your shares and watch your wealth grow with automated
                    deposits.
                  </p>
                </div>
              </div>
              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Shield
                    className="text-primary group-hover:text-white transition-colors"
                    size={22}
                  />
                </div>
                <div>
                  <h4 className="text-slate-900 font-black text-lg">
                    Bank-Grade Security
                  </h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mt-1">
                    Your data and savings are protected by military-grade
                    encryption and SASRA compliance.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 pt-8 flex items-center justify-between">
            <span className="text-slate-400 text-[10px] uppercase font-black tracking-tighter">
              Anansi Sacco © 2026
            </span>
          </div>
        </div>
        <div className="p-6 lg:p-6 sm:p-2 flex items-center justify-center bg-white">
          <div className="w-full">
            <div className="mb-10">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Member Sign In
              </h1>
              <p className="text-slate-400 font-medium mt-2">
                Welcome back! Please enter your details.
              </p>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Member ID Field */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Username / Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                    <User
                      size={18}
                      className="text-slate-300 group-focus-within:text-blue-600 transition-colors"
                    />
                    <div className="w-[1.5px] h-5 bg-slate-200 ml-4 group-focus-within:bg-blue-200 transition-colors" />
                  </div>
                  <input
                    name="memberId"
                    type="text"
                    placeholder="Enter username or email"
                    value={formData.memberId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full pl-[74px] pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all placeholder:text-xs font-semibold text-slate-800"
                  />
                </div>
                <AnimatePresence>
                  {errors.memberId && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-rose-500 text-[11px] font-bold flex items-center gap-1 ml-1"
                    >
                      <AlertCircle size={12} /> {errors.memberId}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <p class="text-[12px] font-medium text-slate-500">
                If you have forgotten your credentials, please use the{" "}
                <span
                  onClick={() => navigate("/auth/forgot-password")}
                  class="text-blue-600 font-black cursor-pointer hover:text-blue-800 underline underline-offset-2"
                >
                  Account Recovery
                </span>{" "}
                portal to reset your access.
              </p>
              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Password
                  </label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                    <Lock
                      size={18}
                      className="text-slate-300 group-focus-within:text-blue-600 transition-colors"
                    />
                    <div className="w-[1.5px] h-5 bg-slate-200 ml-4 group-focus-within:bg-blue-200 transition-colors" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full pl-[74px] pr-14 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all font-semibold text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-6 text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-rose-500 text-[11px] font-bold flex items-center gap-1 ml-1"
                    >
                      <AlertCircle size={12} /> {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              <div className="h-5"></div>

              {/* Action Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all
                  ${
                    isFormValid && !isLoading
                      ? "bg-primary text-white shadow-xl shadow-slate-900/10 hover:bg-secondary active:shadow-none"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Sign In <ArrowRight size={18} />
                  </>
                )}
              </motion.button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-slate-400 text-[12px] font-medium">
                Not registered yet?{" "}
                <button
                  onClick={() => navigate("/")}
                  className="text-blue-600 font-bold hover:underline underline-offset-4"
                >
                  Create Account
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  Loader2,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { resendOtp, verifyUser } from "../../sdks/auth/auth";
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import useAuth from "../../hooks/useAuth";

const OtpVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading] = useState(false);
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const { showToast } = useToast();

  // Timer logic for Resend
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const maskPhoneNumber = (phone) => {
    if (!phone) return "********000";
    return phone.replace(/(\d{4})(\d{5})(\d{3})/, "$1*****$3");
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const { mutate: verifyUserMutate, isLoading } = useMutation({
    mutationKey: ["verify user"],
    mutationFn: () =>
      verifyUser(
        auth?.user?.id,
        otp.join(""),
        auth?.user?.email,
        auth?.user?.mobileno,
      ),
    onSuccess: (data) => {
      setAuth(data?.data?.data);
      showToast({
        title: "Authentication Success",
        type: "success",
        position: "top-right",
        description:
          "Welcome back to Anansi.\nYour session is active for 24 hours.",
      });
      navigate("/home");
    },
    onError: (error) => {
      showToast({
        title: "Authentication Error",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return;
    verifyUserMutate();
  };

  const { mutate: resendOtpMutate } = useMutation({
    mutationKey: ["send admin otp"],
    mutationFn: () => resendOtp(auth?.user?.id),
    onSuccess: () => {
      showToast({
        title: "OTP Synchronized",
        type: "success",
        position: "top-right",
        description: `A new security code has been dispatched.
    Check your registered device or email.
    Code expires in 5:00 minutes.`,
      });
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

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(60);
    setOtp(new Array(6).fill(""));
    resendOtpMutate();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white rounded-[40px] shadow-2xl shadow-blue-900/5 border border-slate-100 p-8 md:p-12 relative overflow-hidden"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-secondary">
            <ShieldCheck size={40} strokeWidth={1.5} />
          </div>

          <h2 className="text-2xl font-black text-primary">
            Security Verification
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-[280px] mx-auto">
            For additional security we just sent a verification code to your
            mobile <br />
            <span className="font-bold text-primary inline-flex items-center gap-1 mt-1">
              <Smartphone size={14} /> {maskPhoneNumber(auth?.user?.mobileno)}
            </span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="mt-12 space-y-10">
          {/* OTP Inputs */}
          <div className="flex justify-between gap-2 md:gap-4">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 md:w-16 md:h-16 text-center text-2xl font-black text-primary bg-slate-50 border-2 border-slate-200 rounded-2xl focus:border-secondary focus:bg-white focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              />
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-slate-400 font-medium">
              Didn't receive the code?
            </p>
            <button
              type="button"
              disabled={timer > 0}
              onClick={handleResend}
              className={`mt-2 flex items-center gap-2 mx-auto text-sm font-black uppercase tracking-widest transition-all ${
                timer > 0
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-secondary hover:text-primary"
              }`}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              {timer > 0 ? `Resend in ${timer}s` : "Resend SMS"}
            </button>
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading || otp.join("").length < 6}
            className="w-full h-16 bg-primary text-white rounded-3xl font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 hover:bg-[#072d7a] disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none transition-all"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Verify & Login
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="mt-12 text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">
          Secure Encrypted Verification by Anansi
        </p>
      </motion.div>
    </div>
  );
};

export default OtpVerification;

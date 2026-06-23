import { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  Loader2,
  Smartphone,
  Zap,
  TrendingUp,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { resendOtp, verifyUser } from "../../sdks/auth/auth";
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import useAuth from "../../hooks/useAuth";

const OtpVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const { showToast } = useToast();

  // Countdown timer logic for code resend
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
    const updatedOtp = [...otp.map((d, idx) => (idx === index ? element.value : d))];
    setOtp(updatedOtp);
    
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
        title: "Welcome Back!",
        type: "success",
        position: "top-right",
        description: "Your identity has been verified. You're now securely signed in.",
      });
      navigate("/home");
    },
    onError: (error) => {
      showToast({
        title: "Verification Failed",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.join("").length < 6) return;
    verifyUserMutate();
  };

  const { mutate: resendOtpMutate, isLoading: isResending } = useMutation({
    mutationKey: ["send admin otp"],
    mutationFn: () => resendOtp(auth?.user?.id),
    onSuccess: () => {
      showToast({
        title: "New Code Sent",
        type: "success",
        position: "top-right",
        description: "A fresh text verification code has been sent to your phone number.",
      });
    },
    onError: (error) => {
      showToast({
        title: "Resend Failed",
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

  const isFormValid = otp.join("").length === 6;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 sm:p-2 antialiased">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 py-3 px-6 bg-white overflow-hidden">
        
        {/* LEFT COLUMN: VISUAL BENCHMARKS & VALUE PROPS */}
        <div className="relative bg-white sm:hidden p-6 lg:p-6 flex flex-col justify-between overflow-hidden border-r border-slate-200">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 mb-12">
              <ShieldCheck className="text-primary" size={18} />
              <span className="text-primary text-xs font-medium tracking-widest uppercase">
                Anansi Sacco
              </span>
            </div>
            <h2 className="text-primary text-2xl xl:text-2xl font-medium leading-[1.1] mb-8">
              An extra layer of protection for your peace of{" "}
              <span className="text-primary">mind.</span>
            </h2>
            
            <div className="space-y-8">
              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50/60 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Zap className="text-primary group-hover:text-white transition-colors" size={22} />
                </div>
                <div>
                  <h4 className="text-primary font-medium text-md">Instant Code Delivery</h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mt-1">
                    We send a secure, temporary 6-digit confirmation code straight to your registered mobile device to ensure it's really you.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50/60 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors">
                  <TrendingUp className="text-primary group-hover:text-white transition-colors" size={22} />
                </div>
                <div>
                  <h4 className="text-primary font-medium text-md">Seamless Sessions</h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mt-1">
                    Once verified, you will stay smoothly signed in for up to 24 hours so you can manage your work without constant interruptions.
                  </p>
                </div>
              </div>

              <div className="flex gap-5 group">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50/60 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors">
                  <Shield className="text-primary group-hover:text-white transition-colors" size={22} />
                </div>
                <div>
                  <h4 className="text-primary font-medium text-md">Bank-Grade Compliance</h4>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed mt-1">
                    Your account safety and system actions perfectly align with global security frameworks and SASRA safety regulations.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative z-10 pt-8 flex items-center justify-between">
            <span className="text-slate-400 text-[10px] uppercase font-medium tracking-tighter">
              Anansi Sacco Platform © 2026
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: CODE CHALLENGE ENTRY PANEL */}
        <div className="p-6 lg:p-6 sm:p-2 flex items-center justify-center bg-white">
          <div className="w-full">
            <div className="mb-10">
              <h1 className="text-3xl font-medium text-primary tracking-tight">
                Verify Identity
              </h1>
              <p className="text-slate-400 font-medium mt-2 leading-relaxed">
                Please type the 6-digit verification text message code we just sent to your registered phone number:
                <span className="font-bold text-primary block mt-1 items-center gap-1.5 text-xs tracking-wide">
                  <Smartphone size={12} className="inline mr-1" /> {maskPhoneNumber(auth?.user?.mobileno)}
                </span>
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-8">
              
              {/* Box array values entries */}
              <div className="space-y-2">
                <label className="text-[11px] font-medium text-slate-400 uppercase tracking-widest ml-1">
                  Verification Code
                </label>
                <div className="flex gap-3 sm:gap-3">
                  {otp.map((data, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength={1}
                      ref={(el) => (inputRefs.current[index] = el)}
                      value={data}
                      onChange={(e) => handleChange(e.target, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      className="w-14 h-14 sm:size-11 text-center text-xl font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all"
                    />
                  ))}
                </div>
              </div>

              {/* Countdown panel mechanism strip */}
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col justify-center">
                <p className="text-[12px] font-medium text-slate-400">
                  Didn't receive your text message notification?
                </p>
                <button
                  type="button"
                  disabled={timer > 0 || isResending}
                  onClick={handleResend}
                  className={`mt-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest transition-all cursor-pointer ${
                    timer > 0
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-primary hover:text-blue-800"
                  }`}
                >
                  <RefreshCw size={12} className={isResending ? "animate-spin" : ""} />
                  {timer > 0 ? `Resend Code in ${timer}s` : "Resend Code"}
                </button>
              </div>

              <div className="h-1"></div>

              {/* Submit Trigger Action Anchor */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`w-full py-6 rounded-2xl font-medium uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all cursor-pointer
                  ${
                    isFormValid && !isLoading
                      ? "bg-primary text-white shadow-xl shadow-primary/10 hover:bg-secondary active:shadow-none"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    Verify & Log In <ArrowRight size={18} />
                  </>
                )}
              </motion.button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OtpVerification;
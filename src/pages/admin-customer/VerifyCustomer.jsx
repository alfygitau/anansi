import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  RefreshCw,
  ArrowRight,
  Loader2,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMutation } from "react-query";
import useAuth from "../../hooks/useAuth";

const AdminOtpVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const inputRefs = useRef([]);
  const { auth } = useAuth();

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const maskPhoneNumber = (phone) => {
    if (!phone) return "********000";
    // Formats as +254 **** 789
    return phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 **** $3");
  };

  const handleChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Take only the last character (handles overwrite)
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current is empty, move back and clear previous
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    const data = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(data)) return; // Only paste if it's exactly 6 digits

    const pasteData = data.split("");
    setOtp(pasteData);
    inputRefs.current[5].focus(); // Focus the last field
  };

  const { mutate: verifyUserMutate, isLoading } = useMutation({
    mutationKey: ["verify user"],
    // mutationFn logic remains the same...
  });

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.join("").length < 6) return;
    verifyUserMutate();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white rounded-[30px] shadow-xl shadow-blue-900/5 p-8 md:p-8 relative"
      >
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-50 rounded-[28px] flex items-center justify-center mx-auto mb-8 text-[#4DB8E4] shadow-inner">
            <ShieldCheck size={40} strokeWidth={1.5} />
          </div>

          <h2 className="text-3xl font-black text-[#042159] tracking-tight mb-3">
            Identity Check
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-[320px] mx-auto font-medium">
            We've sent a 6-digit secure code to your registered mobile number
            <span className="block font-bold text-[#042159] mt-2 flex items-center justify-center gap-2">
              <Smartphone size={14} className="text-[#4DB8E4]" />
              {maskPhoneNumber(auth?.user?.mobileno)}
            </span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="mt-8 space-y-8">
          {/* Enhanced OTP Inputs */}
          <div
            className="flex justify-between gap-2 md:gap-4"
            onPaste={handlePaste}
          >
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                ref={(el) => (inputRefs.current[index] = el)}
                value={data}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-16 h-16 md:h-18 text-center text-3xl font-black text-[#042159] bg-slate-100 border-2 rounded-[20px] focus:border-[#4DB8E4] focus:bg-white focus:ring-8 focus:ring-blue-400/10 outline-none transition-all shadow-sm"
              />
            ))}
          </div>

          <div className="text-center bg-slate-50/50 py-4 rounded-2xl border border-dashed border-slate-200">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-2">
              Didn't receive the code?
            </p>
            <button
              type="button"
              disabled={timer > 0}
              onClick={() => setTimer(60)}
              className={`flex items-center gap-2 mx-auto text-xs font-black uppercase tracking-widest transition-all ${
                timer > 0
                  ? "text-slate-300"
                  : "text-[#4DB8E4] hover:text-[#042159]"
              }`}
            >
              <RefreshCw
                size={14}
                className={timer === 0 ? "animate-pulse" : ""}
              />
              {timer > 0 ? `Retry in ${timer}s` : "Resend Verification SMS"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.join("").length < 6}
            className="w-full h-16 bg-[#042159] text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 hover:bg-[#072d7a] active:scale-[0.98] disabled:opacity-20 disabled:grayscale transition-all"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Verify & Secure Access <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-12 flex items-center justify-center gap-2 opacity-30">
          <div className="h-[1px] w-8 bg-slate-400" />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
            Anansi Security Layer
          </span>
          <div className="h-[1px] w-8 bg-slate-400" />
        </div>
      </motion.div>
    </div>
  );
};

export default AdminOtpVerification;

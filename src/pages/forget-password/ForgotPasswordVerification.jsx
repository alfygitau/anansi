import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  RefreshCcw,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const ForgotOTPVerification = ({ userEmail = "dev.alex@anansi.co.ke" }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);

  // Timer logic for Resend OTP
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Masking logic: dev.alex@anansi.co.ke -> ****alex@anansi.co.ke
  const maskEmail = (email) => {
    if (!email.includes("@")) return email;
    const [local, domain] = email.split("@");
    if (local.length <= 4) return "*".repeat(local.length) + "@" + domain;
    return "****" + local.slice(4) + "@" + domain;
  };

  // Handle OTP Input Changes
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) return;

    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      setLoading(false);
      navigate("/auth/passcode");
    }, 1500);
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(30);
    // Trigger resend API here
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-[40px] shadow-xl shadow-blue-900/5 border border-slate-100 p-10"
      >
        {/* HEADER */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
            <KeyRound size={32} className="text-[#4DB8E4]" />
          </div>
          <h1 className="text-2xl font-black text-[#042159] mb-2">
            Verify OTP
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed px-4">
            To ensure your account's security, we've sent a 6-digit verification
            code to <br />
            <span className="font-bold text-[#042159] tracking-tight">
              {maskEmail(userEmail)}
            </span>
          </p>
        </div>

        {/* OTP INPUTS */}
        <form onSubmit={handleVerify} className="space-y-8">
          <div className="flex justify-center gap-3 sm:gap-3">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-14 h-14 sm:w-14 sm:h-16 text-center text-xl font-black text-[#042159] bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-[#4DB8E4] focus:bg-white focus:ring-4 focus:ring-blue-100/50 transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join("").length < 6}
            className="w-full h-14 bg-[#042159] hover:bg-[#062d7a] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Verify & Continue"
            )}
          </button>
        </form>

        {/* RESEND SECTION */}
        <div className="mt-10 text-center">
          <p className="text-sm text-slate-400 font-medium">
            I didn't receive an email?
          </p>
          <button
            onClick={handleResend}
            disabled={timer > 0}
            className={`mt-2 flex items-center gap-2 mx-auto text-sm font-black uppercase tracking-wider transition-all
              ${timer > 0 ? "text-slate-300 cursor-not-allowed" : "text-[#4DB8E4] hover:text-[#042159]"}
            `}
          >
            <RefreshCcw
              size={16}
              className={timer > 0 ? "" : "animate-spin-slow"}
            />
            {timer > 0
              ? `Resend in 00:${timer.toString().padStart(2, "0")}`
              : "Resend Code Now"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotOTPVerification;

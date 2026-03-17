import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, KeyRound, ShieldAlert, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import { verifyEmailAddress } from "../../sdks/auth/auth";
import { useStore } from "../../store/useStore";

const ForgotOTPVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const { showToast } = useToast();
  const forgetEmail = useStore((state) => state.forgetEmail);

  const maskEmail = (email) => {
    if (!email.includes("@")) return email;
    const [local, domain] = email.split("@");
    if (local.length <= 4) return "*".repeat(local.length) + "@" + domain;
    return "****" + local.slice(4) + "@" + domain;
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
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
    verifyEmailMutate();
  };

  const { mutate: verifyEmailMutate, isLoading } = useMutation({
    mutationKey: ["verify forgot password"],
    mutationFn: () => verifyEmailAddress(otp.join(""), forgetEmail),
    onSuccess: () => {
      navigate("/auth/set-new-password");
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
              {maskEmail(forgetEmail)}
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
            disabled={isLoading || otp.join("").length < 6}
            className="w-full h-14 bg-[#042159] hover:bg-[#062d7a] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Verify & Continue"
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
            <ShieldAlert size={18} className="text-[#4DB8E4] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-[#042159]">
                Security Notice
              </h4>
              <p className="text-[12px] text-slate-500 leading-relaxed">
                For your protection, this verification link will expire in{" "}
                <span className="font-bold text-[#042159]">10 minutes</span>. If
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

export default ForgotOTPVerification;

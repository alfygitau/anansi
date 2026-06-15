import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  KeyRound,
  ShieldAlert,
  Info,
  ShieldCheck,
} from "lucide-react";
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 sm:p-2 antialiased">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-[28px] shadow-[0_12px_40px_-12px_rgba(7,64,115,0.06)] border border-slate-100 overflow-hidden"
      >
        {/* LEFT PANEL: Security & Context (Hidden on Mobile/Tablet) */}
        <div className="hidden lg:flex bg-primary/[0.02] border-r border-slate-100/80 flex-col justify-between p-12">
          <div className="space-y-8">
            {/* Sacco Branding Header Tag */}
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs">
                A
              </div>
              <span className="text-xs font-bold text-primary tracking-widest uppercase">
                Anansi Sacco
              </span>
            </div>

            {/* Core Security Value Proposition */}
            <div className="space-y-4 pt-4">
              <h1 className="text-3xl font-bold text-primary">
                Token Validation
              </h1>
              <p className="text-[13px] text-slate-500 font-normal">
                To ensure your account's perimeter remains completely insulated,
                we validate active multi-factor access arrays before granting
                profile clearance.
              </p>
            </div>

            {/* System Security Features Ledger */}
            <div className="space-y-4 pt-2">
              <SecurityFeatureRow
                icon={<ShieldCheck size={16} />}
                title="Cryptographic Token Delivery"
                desc="Outbound account restoration hashes are isolated through high-security transmission filters."
              />
              <SecurityFeatureRow
                icon={<KeyRound size={16} />}
                title="One-Time Token Vault"
                desc="Validation signatures are generated dynamically and map securely to single session profiles."
              />
              <SecurityFeatureRow
                icon={<ShieldAlert size={16} />}
                title="Automated Token Expiry"
                desc="Verification windows automatically self-destruct after 10 minutes to mitigate brute-force intercept vectors."
              />
            </div>
          </div>

          {/* Security Compliance Footer Label */}
          <p className="text-[10px] text-slate-400 font-medium tracking-wide pt-6">
            Anansi Sacco Security Core • System Version 2026.4
          </p>
        </div>

        {/* RIGHT PANEL: Forgot Password Workspace Area */}
        <div className="w-full flex flex-col justify-between p-6 sm:p-10 md:p-12">
          <div className="flex-grow">
            {/* ICON & HEADER */}
            <div className="flex items-center mb-4 gap-3">
              <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center">
                <KeyRound size={32} className="text-secondary" />
              </div>
              <h1 className="text-2xl font-medium text-primary mb-2">
                Verify OTP from Email
              </h1>
            </div>
            <div className="flex flex-col mb-8">
              <p className="text-slate-400 text-sm leading-relaxed mx-auto">
                To ensure your account's security, we've sent a 6-digit
                verification code to{" "}
                <span className="font-bold text-primary tracking-tight">
                  {maskEmail(forgetEmail)}
                </span>
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleVerify} className="space-y-8">
              <div className="flex justify-center gap-3 sm:gap-2">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    ref={(el) => (inputRefs.current[index] = el)}
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-14 h-14 sm:w-11 sm:h-14 text-center text-xl font-bold text-primary bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-secondary focus:bg-white focus:ring-4 focus:ring-blue-100/50 transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.join("").length < 6}
                className="w-full h-14 bg-primary hover:bg-[#062d7a] text-white rounded-2xl font-medium uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Verify & Continue"
                )}
              </button>
            </form>

            {/* NOTICES PANEL */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100"
            >
              <div className="flex gap-3">
                <div className="space-y-1">
                  <h4 className="text-[11px] font-medium uppercase tracking-widest text-primary">
                    Security Notice
                  </h4>
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    For your protection, this verification code will expire in{" "}
                    <span className="font-bold text-primary">10 minutes</span>.
                    If you didn't request this, please ignore this email or
                    contact support if you suspect unauthorized activity.
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-2">
                <p className="text-[10px] text-slate-400 font-medium">
                  Check your <span className="font-bold">Spam</span> or{" "}
                  <span className="font-bold">Promotions</span> folder if the
                  email doesn't arrive.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Internal supportive sub-row layout item template
const SecurityFeatureRow = ({ icon, title, desc }) => (
  <div className="flex items-start gap-3">
    <div className="size-7 rounded-md bg-white border border-slate-200/60 shadow-sm flex items-center justify-center text-primary shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="text-[12px] font-bold text-primary tracking-tight">
        {title}
      </h4>
      <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-normal">
        {desc}
      </p>
    </div>
  </div>
);

export default ForgotOTPVerification;

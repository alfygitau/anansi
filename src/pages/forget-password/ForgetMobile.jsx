import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  Smartphone,
  Loader2,
  ShieldCheck,
  AlertCircle,
  ShieldAlert,
  Info,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import { forgetPasswordMobile } from "../../sdks/auth/auth"; // Adjusted SDK hook counterpart
import { useStore } from "../../store/useStore";

const ForgetMobile = () => {
  const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  const { showToast } = useToast();
  const setForgetMobile = useStore((state) => state.setForgetMobile);

  const handleBlur = () => {
    setTouched(true);
    if (!mobile) {
      setError("Mobile number is required.");
    } else if (!validateMobile(mobile)) {
      setError("Please enter a valid mobile number.");
    } else {
      setError("");
    }
  };

  const validateMobile = (phoneNum) => {
    // Validates standard Kenyan mobile prefix configurations (e.g., 07..., 01...)
    const pattern = /^(?:254|\+254|0)?([71][0-9]{8})$/;
    return pattern.test(phoneNum.replace(/\s+/g, ""));
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!validateMobile(mobile)) {
      setError("Please enter a valid mobile number.");
      return;
    }
    await forgetMobileMutate();
  };

  const { mutate: forgetMobileMutate, isLoading } = useMutation({
    mutationKey: ["forgot password mobile"],
    mutationFn: () => forgetPasswordMobile(mobile),
    onSuccess: () => {
      setForgetMobile(mobile);
      navigate("/auth/forgot-mobile-verification");
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

  const isInvalid = !validateMobile(mobile);
  const isButtonDisabled = isLoading || isInvalid || !mobile;

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
                Identity Verification
              </h1>
              <p className="text-[13px] text-slate-500 font-normal">
                To preserve account shielding policies, we verify the presence
                of active communication endpoints before granting access
                modifications.
              </p>
            </div>

            {/* System Security Features Ledger */}
            <div className="space-y-6 pt-2">
              <SecurityFeatureRow
                icon={<ShieldCheck size={16} />}
                title="Cryptographic Token Delivery"
                desc="Outbound account restoration hashes are isolated through high-security transmission filters."
              />
              <SecurityFeatureRow
                icon={<Smartphone size={16} />}
                title="Secure SMS Gateway Routing"
                desc="Automated verification tokens are routed natively through direct telco pipelines to bypass delivery delays."
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

        {/* RIGHT PANEL: Forgot Mobile Workspace Area */}
        <div className="w-full flex flex-col justify-between p-6 sm:p-10 md:p-12">
          <div className="flex-grow">
            {/* ICON & HEADER */}
            <div className="flex items-center mb-4 gap-2">
              <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center">
                <ShieldCheck size={32} className="text-secondary" />
              </div>
              <h1 className="text-2xl font-medium text-primary mb-2">
                Forgot Password?
              </h1>
            </div>
            <div className="flex flex-col mb-8">
              <p className="text-slate-400 text-sm leading-relaxed mx-auto">
                No worries, it happens to the best of us. Enter the mobile phone
                number associated with your account and we'll send you a secure
                SMS verification code to get you back in.
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-medium uppercase tracking-widest text-slate-400 ml-1">
                  Mobile Phone Number
                </label>
                <div className="relative flex items-center group">
                  {/* Absolute Prefix Block with Icon & Vertical Divider */}
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <Phone
                      size={18}
                      className={`transition-colors ${
                        error
                          ? "text-rose-300 group-focus-within:text-rose-400"
                          : "text-slate-300 group-focus-within:text-secondary"
                      }`}
                    />
                    <div
                      className={`w-[1px] h-5 ml-3 transition-colors ${
                        error
                          ? "bg-rose-200 group-focus-within:bg-rose-400/20"
                          : "bg-slate-200 group-focus-within:bg-secondary/20"
                      }`}
                    />
                  </div>

                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    onBlur={handleBlur}
                    placeholder="e.g. 0712345678"
                    className={`w-full h-14 pl-[60px] pr-4 bg-white border border-slate-200 rounded-2xl outline-none transition-all text-sm font-medium
      ${
        error
          ? "border-rose-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/5"
          : "border-slate-100 focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/5"
      }
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
                className={`w-full h-14 text-white rounded-2xl font-medium uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-lg 
                  ${
                    isButtonDisabled
                      ? "opacity-50 cursor-not-allowed shadow-none bg-slate-400"
                      : "bg-primary hover:bg-[#062d7a] hover:scale-[1.01] active:scale-[0.99] shadow-blue-900/20"
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
                    If you didn't request this, please ignore this text or
                    contact support if you suspect unauthorized activity.
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-2">
                <p className="text-[10px] text-slate-400 font-medium">
                  Verify your cellular{" "}
                  <span className="font-bold">network signal</span> or carrier
                  settings if the message doesn't arrive within 60 seconds.
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

export default ForgetMobile;

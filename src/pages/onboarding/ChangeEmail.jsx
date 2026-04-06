import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useToast } from "../../contexts/ToastProvider";
import { useMutation } from "react-query";
import { updateCustomerEmail } from "../../sdks/customer/customer";
import useAuth from "../../hooks/useAuth";
import { newEmailOtp } from "../../sdks/auth/auth";

const ChangeEmail = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { auth } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (value) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
    if (!value) {
      setError("Email address is required");
      return false;
    } else if (!pattern.test(value)) {
      setError("Please enter a valid email address");
      return false;
    }
    setError("");
    return true;
  };

  const handleEmailChange = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return;
    await changeEmail();
  };

  const { mutate: changeEmail, isLoading } = useMutation({
    mutationKey: ["change email"],
    mutationFn: () => updateCustomerEmail(auth?.user?.id, email),
    onSuccess: () => {
      resendEmailOtpMutate();
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

  const { mutate: resendEmailOtpMutate } = useMutation({
    mutationKey: ["resend-email-otp"],
    mutationFn: () => newEmailOtp(email),
    onSuccess: () => {
      navigate("/onboarding/verify-email");
    },
    onError: (error) => {
      showToast({
        title: "Onboarding glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1100px] mx-auto px-4 py-12"
    >
      {/* Navigation */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-12 group"
      >
        <ChevronLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="text-xs font-black uppercase tracking-widest">
          Go Back
        </span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Left: Content */}
        <div className="lg:col-span-6">
          <header className="mb-10">
            <h1 className="text-3xl font-black text-primary uppercase tracking-tight leading-none mb-4">
              Update Your Email Address
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              This email will be used for two-factor authentication, account
              recovery, and official Anansi Sacco communications.
            </p>
          </header>

          <form onSubmit={handleEmailChange} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
                Official Email Address
              </label>
              <div className="relative">
                <Mail
                  className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${
                    error ? "text-red-400" : "text-slate-300"
                  }`}
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) validateEmail(e.target.value);
                  }}
                  onBlur={(e) => validateEmail(e.target.value)}
                  placeholder="e.g. name@example.com"
                  className={`w-full h-[62px] bg-slate-50 border-2 rounded-[24px] pl-14 pr-6 transition-all outline-none font-bold text-primary ${
                    error
                      ? "border-red-200 focus:border-red-400 bg-red-50/30"
                      : "border-slate-100 focus:border-secondary focus:bg-white"
                  }`}
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 ml-4 text-red-500">
                  <AlertCircle size={14} />
                  <span className="text-xs font-bold uppercase tracking-tighter">
                    {error}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !!error || !email}
              className={`w-full h-[72px] rounded-[28px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all shadow-xl mt-8 ${
                isLoading || !!error || !email
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-secondary hover:text-primary shadow-blue-900/20 active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Sending Code...
                </>
              ) : (
                <>
                  Change Email <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Verification Info */}
          <div className="mt-10 p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex gap-5 items-start relative overflow-hidden group">
            {/* Subtle background glow for the icon */}
            <div className="absolute -left-4 -top-4 w-20 h-20 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors" />

            <ShieldCheck
              className="text-secondary flex-shrink-0 mt-1"
              size={28}
            />

            <div className="space-y-3 relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                Security Protocol & Next Steps
              </h4>

              <div className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  Upon clicking{" "}
                  <span className="text-primary font-bold">"Verify Email"</span>
                  , our system will generate a unique, 6-digit secure
                  authentication code. This code will be dispatched immediately
                  to the email address provided above to confirm your identity
                  and secure your link to{" "}
                  <span className="font-bold">Anansi Sacco</span>.
                </p>

                <p className="text-[11px] text-slate-400 leading-relaxed italic border-t border-slate-200 pt-4">
                  <span className="font-bold text-slate-500">Note:</span> If you
                  do not see the email within 60 seconds, please check your{" "}
                  <span className="underline decoration-secondary/40">
                    Spam or Junk
                  </span>{" "}
                  folders before requesting a new code.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Illustration/Info Card */}
        <div className="lg:col-span-6 hidden lg:block">
          <div className="bg-primary rounded-[48px] p-12 text-white relative overflow-hidden h-[600px] flex flex-col justify-end">
            {/* Modern Icon Badge */}
            <div className="absolute top-6 left-12 w-10 h-10 bg-secondary/20 rounded-[32px] flex items-center justify-center border border-white/10 bg-slate-900/40">
              <Mail className="text-secondary" size={20} />
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-black uppercase tracking-tight mb-6 leading-tight">
                Secure Digital <br />
                <span className="text-secondary">Verification</span>
              </h3>

              <div className="space-y-6 mb-10 max-w-sm">
                {/* Explanation 1: Compliance */}
                <div className="space-y-2">
                  <p className="text-secondary font-black text-[10px] uppercase tracking-[0.2em]">
                    Compliance Standards
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    In alignment with{" "}
                    <span className="text-white font-bold">
                      SASRA Digital Banking Guidelines
                    </span>
                    , Anansi Sacco requires a verified email address to maintain
                    the integrity of your financial records. This ensures you
                    receive automated monthly statements and real-time
                    transaction alerts.
                  </p>
                </div>

                {/* Explanation 2: The OTP Process */}
                <div className="space-y-2">
                  <p className="text-secondary font-black text-[10px] uppercase tracking-[0.2em]">
                    Next Step: Instant OTP
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    To finalize this change, a{" "}
                    <span className="text-white font-bold">
                      One-Time Password (OTP)
                    </span>{" "}
                    will be dispatched immediately to your new email. This
                    6-digit secure code validates your ownership of the inbox
                    and activates your new communication channel.
                  </p>
                </div>

                {/* Explanation 3: Security */}
                <div className="space-y-2 border-l-2 border-secondary/30 pl-4">
                  <p className="text-white/50 text-[11px] italic leading-relaxed">
                    Forgot your password? This email will become your primary
                    recovery method to ensure you never lose access to your
                    savings.
                  </p>
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden"
                  >
                    {i === 1 && (
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        transition={{ duration: 1 }}
                        className="w-full h-full bg-secondary"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Refined Abstract Backgrounds */}
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
            <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-secondary/10 rounded-full blur-[80px]" />
            <div className="absolute left-1/2 top-1/4 w-32 h-32 bg-white/5 rounded-full blur-3xl opacity-50" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChangeEmail;

import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { useToast } from "../../contexts/ToastProvider";
import { useMutation } from "react-query";
import { updateCustomerMobile } from "../../sdks/customer/customer";
import useAuth from "../../hooks/useAuth";
import { newMobileOtp } from "../../sdks/auth/auth";

const ChangeMobile = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { auth } = useAuth();
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const validateMobile = (value) => {
    const pattern = /^(?:254|0)[17]\d{8}$/;
    if (!value) {
      setError("Mobile number is required");
      return false;
    } else if (!pattern.test(value.replace(/\s/g, ""))) {
      setError("Please enter a valid Kenyan mobile number");
      return false;
    }
    setError("");
    return true;
  };

  const handleMobileChange = async (e) => {
    e.preventDefault();
    if (!validateMobile(mobile)) return;
    await changeMobile();
  };

  const { mutate: changeMobile, isLoading } = useMutation({
    mutationKey: ["change mobile"],
    mutationFn: () => updateCustomerMobile(auth?.user?.id, mobile),
    onSuccess: () => {
      resendMobileOtpMutate();
    },
    onError: (error) => {
      showToast({
        title: "Registration glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const { mutate: resendMobileOtpMutate } = useMutation({
    mutationKey: ["resend-mobile-otp"],
    mutationFn: () => newMobileOtp(mobile),
    onSuccess: async () => {
      navigate("/onboarding/verify-mobile");
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
              Update Mobile Phone Number
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed">
              Your mobile number is your primary key for M-Pesa deposits,
              withdrawals, and receiving secure SMS alerts.
            </p>
          </header>

          <form onSubmit={handleMobileChange} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">
                Active Mobile Number
              </label>
              <div className="relative">
                <Smartphone
                  className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${
                    error ? "text-red-400" : "text-slate-300"
                  }`}
                  size={20}
                />
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                    if (error) validateMobile(e.target.value);
                  }}
                  onBlur={(e) => validateMobile(e.target.value)}
                  placeholder="e.g. 0712 345 678"
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
              disabled={isLoading || !!error || !mobile}
              className={`w-full h-[72px] rounded-[28px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all shadow-xl mt-8 ${
                isLoading || !!error || !mobile
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-secondary hover:text-primary shadow-blue-900/20 active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Sending SMS...
                </>
              ) : (
                <>
                  Change Number <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Verification Info */}
          <div className="mt-10 p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex gap-5 items-start relative overflow-hidden group">
            <div className="absolute -left-4 -top-4 w-20 h-20 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors" />

            <ShieldCheck
              className="text-secondary flex-shrink-0 mt-1"
              size={28}
            />

            <div className="space-y-3 relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                SMS Security Protocol
              </h4>

              <div className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  To authenticate this device, an SMS containing a{" "}
                  <span className="text-primary font-bold">6-digit PIN</span>{" "}
                  will be sent to the number above. This ensures that only you
                  can access mobile banking features for this account.
                </p>

                <p className="text-[11px] text-slate-400 leading-relaxed italic border-t border-slate-200 pt-4">
                  <span className="font-bold text-slate-500">Note:</span>{" "}
                  Standard SMS rates may apply. If you don't receive the code,
                  ensure your phone has a
                  <span className="font-bold"> stable cellular signal</span>{" "}
                  before retrying.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Info Card */}
        <div className="lg:col-span-6 hidden lg:block">
          <div className="bg-primary rounded-[48px] p-12 text-white relative overflow-hidden h-[600px] flex flex-col justify-end">
            <div className="absolute top-6 left-12 w-10 h-10 bg-secondary/20 rounded-[32px] flex items-center justify-center border border-white/10 bg-slate-900/40">
              <MessageSquare className="text-secondary" size={20} />
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-black uppercase tracking-tight mb-6 leading-tight">
                Mobile-First <br />
                <span className="text-secondary">Banking</span>
              </h3>

              <div className="space-y-6 mb-10 max-w-sm">
                <div className="space-y-2">
                  <p className="text-secondary font-black text-[10px] uppercase tracking-[0.2em]">
                    Instant Transactions
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    By verifying your mobile number, you enable seamless
                    <span className="text-white font-bold">
                      {" "}
                      M-Pesa integration
                    </span>
                    . This allows for one-tap savings deposits and
                    lightning-fast loan disbursements directly to your phone.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-secondary font-black text-[10px] uppercase tracking-[0.2em]">
                    Real-Time Notifications
                  </p>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Stay informed with instant SMS alerts for every transaction.
                    Monitoring your account activity in real-time is your first
                    line of defense against unauthorized access.
                  </p>
                </div>

                <div className="space-y-2 border-l-2 border-secondary/30 pl-4">
                  <p className="text-white/50 text-[11px] italic leading-relaxed">
                    This number will be used to generate your secure Anansi
                    Sacco mobile identity.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden"
                  >
                    {i === 2 && ( // Highlight second dot for variety
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

            <div className="absolute -right-20 -top-20 w-96 h-96 bg-white/5 rounded-full blur-[100px]" />
            <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-secondary/10 rounded-full blur-[80px]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChangeMobile;

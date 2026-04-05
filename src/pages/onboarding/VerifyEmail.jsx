import { useState, useEffect } from "react";
import {
  Mail,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  Edit3,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import useAuth from "../../hooks/useAuth";
import {
  resendEmailOtp,
  sendMobileOtp,
  verifyEmailAddress,
} from "../../sdks/auth/auth";
import { getCustomerById } from "../../sdks/customer/customer";

const VerifyEmail = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  useQuery({
    queryKey: ["get customer by id"],
    queryFn: async () => {
      const response = await getCustomerById(auth?.user?.id);
      return response.data.data;
    },
    onSuccess: (data) => {
      setEmail(data?.email);
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

  const { mutate: verifyEmailMutate, isLoading } = useMutation({
    mutationKey: ["verify-email"],
    mutationFn: () => verifyEmailAddress(otp.join(""), email),
    onSuccess: async () => {
      showToast({
        title: "Onboarding Success",
        type: "success",
        position: "top-right",
        description:
          "Verification complete. Welcome back to your secure Anansi portal.",
      });
      await mobileOtpMutate();
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

  const { mutate: resendEmailOtpMutate, isLoading: isResending } = useMutation({
    mutationKey: ["resend-email-otp"],
    mutationFn: () => resendEmailOtp(auth?.user?.id),
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
        title: "Onboarding glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const { mutate: mobileOtpMutate } = useMutation({
    mutationKey: ["resend-email-otp"],
    mutationFn: () => sendMobileOtp(auth?.user?.id),
    onSuccess: () => {
      showToast({
        title: "OTP Dispatched",
        type: "success",
        position: "top-right",
        description:
          "A 6-digit code has been sent to your mobile number. Please check your messages.",
      });
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

  const handleVerify = () => {
    verifyEmailMutate();
  };

  const onResend = () => {
    if (timer > 0) return;
    setTimer(60);
    setOtp(new Array(6).fill(""));
    resendEmailOtpMutate();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) setTimer(timer - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[500px] bg-white rounded-[40px] p-10 md:p-14 shadow-2xl shadow-blue-900/5 text-center">
        {/* Animated Icon Header */}
        <div className="relative w-20 h-20 bg-blue-50 rounded-[28px] flex items-center justify-center mx-auto mb-8">
          <Mail className="text-primary" size={32} />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full border-4 border-white flex items-center justify-center">
            <ShieldCheck size={14} className="text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-black text-primary tracking-tight mb-3">
          Check your inbox
        </h1>
        <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed px-4">
          We've sent a 6-digit verification code to <br />
          <span className="text-primary font-bold flex items-center justify-center gap-2 mt-1">
            {email}&nbsp;
            <Edit3
              onClick={() => navigate("/onboarding/change-email")}
              size={14}
              className="text-secondary cursor-pointer"
            />
          </span>
        </p>

        {/* Segmented OTP Input */}
        <div className="flex justify-between gap-2 mb-10">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="w-full h-16 sm:h-12 text-center text-2xl font-black text-primary bg-slate-50 border-2 rounded-2xl focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10 transition-all outline-none"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        {/* Primary Action */}
        <button
          disabled={isLoading || otp?.join("").length < 6}
          onClick={handleVerify}
          className="w-full h-[64px] bg-primary text-white rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-secondary transition-all shadow-xl shadow-blue-900/10 mb-8 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-primary"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" size={24} />
          ) : (
            <>
              Continue <ArrowRight size={20} />
            </>
          )}
        </button>

        {/* Resend Logic */}
        <div className="flex flex-col items-center gap-4">
          {timer > 0 ? (
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              Resend code in <span className="text-secondary">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={onResend}
              className="flex items-center gap-2 text-secondary hover:text-primary transition-colors group"
            >
              <RefreshCw
                size={16}
                className={`${isResending ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
              />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Resend Verification Code
              </span>
            </button>
          )}
        </div>

        {/* Footer Security Note */}
        <div className="mt-12 pt-8 border-t border-slate-50">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tight flex items-center justify-center gap-2">
            <ShieldCheck size={12} /> Secure 256-bit encrypted verification
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

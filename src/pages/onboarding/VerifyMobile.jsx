import { useState, useEffect } from "react";
import {
  Smartphone,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import useAuth from "../../hooks/useAuth";
import { sendMobileOtp, verifyMobile } from "../../sdks/auth/auth";
import {
  getCustomerById,
  updateCustomerVerification,
} from "../../sdks/customer/customer";

const VerifyMobile = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { showToast } = useToast();
  const [mobile, setMobile] = useState("");

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) setTimer(timer - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = () => {
    verifyMobileMutate();
  };

  const onChangeNumber = () => {
    navigate("/onboarding/change-mobile");
  };

  const onResend = () => {
    if (timer > 0) return;
    setTimer(60);
    setOtp(new Array(6).fill(""));
    resendMobileOtpMutate();
  };

  const { mutate: verifyMobileMutate, isLoading } = useMutation({
    mutationKey: ["verify-mobile"],
    mutationFn: () => verifyMobile(otp.join(""), mobile),
    onSuccess: async () => {
      await updateCustomerMutate();
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

  const { mutate: updateCustomerMutate } = useMutation({
    mutationKey: ["update-customer-verifications"],
    mutationFn: () => updateCustomerVerification(auth?.user?.id),
    onSuccess: async () => {
      showToast({
        title: "Onboarding Success",
        type: "success",
        position: "top-right",
        description:
          "Verification complete. Welcome back to your secure Anansi portal.",
      });
      navigate("/onboarding/account-success");
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

  const { mutate: resendMobileOtpMutate } = useMutation({
    mutationKey: ["resend-mobile-otp"],
    mutationFn: () => sendMobileOtp(auth?.user?.id),
    onSuccess: async () => {
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

  useQuery({
    queryKey: ["get customer by id"],
    queryFn: async () => {
      const response = await getCustomerById(auth?.user?.id);
      return response.data.data;
    },
    onSuccess: (data) => {
      setMobile(data?.mobileno);
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
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-[500px] relative">
        <div className="bg-white rounded-[40px] border border-slate-100 p-10 md:p-14 shadow-2xl shadow-blue-900/5 text-center">
          {/* Header Icon */}
          <div className="w-20 h-20 bg-blue-50 rounded-[28px] flex items-center justify-center mx-auto mb-8 relative">
            <Smartphone className="text-primary" size={32} />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
              <MessageSquare size={12} className="text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-primary tracking-tight mb-3">
            Verify Mobile Number
          </h1>

          <div className="mb-10">
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              We just sent a code to your phone
            </p>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="text-primary font-bold">{mobile}</span>
              <button
                onClick={onChangeNumber}
                className="text-[10px] font-black uppercase text-secondary hover:underline"
              >
                Edit
              </button>
            </div>
          </div>

          {/* OTP Input Fields */}
          <div className="flex justify-between gap-2 mb-10">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                className="w-full h-16 sm:h-12 text-center text-2xl font-black text-primary bg-slate-50 border-2 rounded-2xl focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/10 transition-all outline-none"
                value={data}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Backspace" &&
                    !otp[index] &&
                    e.target.previousSibling
                  ) {
                    e.target.previousSibling.focus();
                  }
                }}
              />
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={handleVerify}
            disabled={isLoading || otp.includes("")}
            className="w-full h-[64px] bg-primary text-white rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-secondary transition-all disabled:opacity-20 disabled:grayscale shadow-xl shadow-blue-900/10 mb-8"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                Continue <ArrowRight size={20} />
              </>
            )}
          </button>

          {/* Resend Logic */}
          <div className="pt-4 text-center">
            {timer > 0 ? (
              <p className="text-[10px] text-center font-black uppercase tracking-widest text-slate-300">
                Resend SMS in{" "}
                <span className="text-secondary font-bold">{timer}s</span>
              </p>
            ) : (
              <button
                onClick={onResend}
                className="flex items-center justify-center gap-2 text-secondary hover:text-primary transition-all mx-auto"
              >
                <RefreshCw size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Resend Code
                </span>
              </button>
            )}
          </div>

          {/* Floating Trust Badge */}
          <div className="mt-8 flex items-center justify-center gap-2 text-slate-300">
            <CheckCircle2 size={14} />
            <p className="text-[9px] font-bold uppercase tracking-widest">
              Identity Verified via Secure OTP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyMobile;

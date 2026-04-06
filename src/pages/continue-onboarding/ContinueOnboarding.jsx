import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ArrowRight,
  Info,
  CheckCircle,
  FileText,
  ExternalLink,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useMutation } from "react-query";
import { newEmailOtp } from "../../sdks/auth/auth";
import { useToast } from "../../contexts/ToastProvider";

const ProceedOnboarding = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { showToast } = useToast();

  const stageRoutes = {
    "facial-identity": "/onboarding/facial-identity",
    "review-identity": "/onboarding/verify-identity",
    registration: "/onboarding/verify-email",
    "terms-conditions": "/onboarding/terms-conditions",
    "personal-information": "/onboarding/personal-information",
    "income-information": "/onboarding/personal-information",
    nextOfKin: "/onboarding/next-of-kin",
    "verify-mobile": "/onboarding/verify-mobile",
    "account-success": "/onboarding/account-success",
  };

  const handleContinue = () => {
    const stage = auth?.user?.onboarding_stage;
    if (stage === "registration") {
      resendEmailOtpMutate();
    }
    navigate(stageRoutes[stage] || "/");
  };

  const { mutate: resendEmailOtpMutate } = useMutation({
    mutationKey: ["resend-email-otp"],
    mutationFn: () => newEmailOtp(auth?.user?.email),
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
    <div className="w-full flex items-center justify-center font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1300px] bg-white shadow-blue-900/5 overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Left Side: Visual & Progress */}
        <div className="lg:w-5/12 bg-primary p-10 lg:p-16 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-secondary rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center mb-8">
              <ShieldCheck className="text-secondary" size={32} />
            </div>
            <h2 className="text-3xl font-black leading-tight mb-4">
              Finish Your <br /> Registration
            </h2>
            <p className="text-blue-100/70 text-sm font-medium">
              You are only a few steps away from accessing your full member
              benefits.
            </p>
          </div>

          {/* Mini Progress List */}
          <div className="relative z-10 space-y-6 my-12">
            {[
              { label: "Basic Details", status: "complete" },
              { label: "Identity Verification", status: "pending" },
              { label: "Account Activation", status: "upcoming" },
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                    step.status === "complete"
                      ? "bg-secondary border-secondary"
                      : "border-blue-400"
                  }`}
                >
                  {step.status === "complete" ? (
                    <CheckCircle size={14} />
                  ) : (
                    <span className="text-[10px]">{i + 1}</span>
                  )}
                </div>
                <span
                  className={`text-xs font-bold uppercase tracking-widest ${step.status === "complete" ? "text-white" : "text-blue-300"}`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <div className="relative z-10 pt-8 border-t border-blue-800">
            <p className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">
              Secured by Anansi Systems
            </p>
          </div>
        </div>

        {/* Right Side: Content & Actions */}
        <div className="lg:w-7/12 p-10 lg:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <span className="inline-block px-4 py-1 rounded-full bg-blue-50 text-secondary text-[10px] font-black uppercase tracking-widest mb-4">
              Account Status: Partial Setup
            </span>
            <h1 className="text-3xl font-black text-primary mb-4">
              Welcome Back, {auth?.user?.firstname}!
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              To ensure compliance with financial regulations and to protect
              your assets, we require a complete profile. Your progress was
              saved at the
              <span className="text-primary font-bold">
                {" "}
                {auth?.user?.onboarding_stage?.replace(/-/g, " ")}{" "}
              </span>
              stage.
            </p>
          </div>

          {/* Informational Statements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <FileText size={16} />
                <span className="text-[11px] font-black uppercase tracking-wider">
                  KYC Compliance
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-normal">
                Mandatory identity verification as per the Data Protection Act
                and Anti-Money Laundering (AML) regulations.
              </p>
            </div>
            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 mb-2 text-primary">
                <Info size={16} />
                <span className="text-[11px] font-black uppercase tracking-wider">
                  Data Handling
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-normal">
                Your information is encrypted end-to-end and stored in
                high-security ISO-certified data centers.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <button
              onClick={handleContinue}
              className="w-full bg-primary hover:bg-[#062d7a] text-white py-5 rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98]"
            >
              Resume Registration <ArrowRight size={18} />
            </button>

            <p className="text-[10px] text-slate-400 text-center px-10 leading-relaxed">
              By clicking "Resume Registration," you agree to our
              <button className="text-secondary hover:underline mx-1">
                Terms of Service
              </button>
              and acknowledge our
              <button className="text-secondary hover:underline mx-1">
                Privacy Statement
              </button>
              .
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-primary"
            >
              Logout Session
            </button>
            <button className="flex items-center gap-1 text-secondary text-[10px] font-black uppercase tracking-widest hover:underline">
              Help Center <ExternalLink size={12} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProceedOnboarding;

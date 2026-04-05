import React, { useState } from "react";
import {
  CheckCircle,
  Fingerprint,
  Home,
  FileText,
  ArrowRight,
  Loader2,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AccountSuccess = ({
  user = { username: "Member" },
  onStartVerification,
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("/onboarding/verify-identity");
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 md:p-10 font-sans">
      <div className="w-full max-w-[1100px] flex flex-col lg:flex-row bg-white rounded-[40px] shadow-2xl shadow-blue-900/10 overflow-hidden border border-white">
        {/* Left Side: The Celebration */}
        <div className="lg:w-[50%] p-10 md:p-20 flex flex-col items-center justify-center text-center bg-gradient-to-br from-white to-blue-50/50 relative">
          <div className="relative mb-10">
            {/* Animated glow background */}
            <div className="absolute inset-0 bg-green-400 rounded-full scale-150 blur-[60px] opacity-20 animate-pulse"></div>
            <div className="relative w-32 h-32 bg-white rounded-[40px] shadow-xl flex items-center justify-center border border-slate-50">
              <CheckCircle
                className="text-green-500"
                size={64}
                strokeWidth={2.5}
              />
            </div>
          </div>

          <h1 className="text-3xl font-black text-primary tracking-tight mb-4">
            Welcome Aboard!
          </h1>
          <p className="text-slate-500 font-medium leading-relaxed max-w-[340px]">
            Your account is ready,{" "}
            <span className="text-secondary font-bold">{user.username}</span>.
            You're one step away from full access.
          </p>

          <div className="mt-12 flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-sm border border-slate-100">
            <ShieldCheck size={18} className="text-secondary" />
            <span className="text-[11px] font-black uppercase tracking-wider text-primary">
              Verified by SACCO Security
            </span>
          </div>
        </div>

        {/* Right Side: The Roadmap */}
        <div className="lg:w-[50%] bg-primary p-10 md:p-16 text-white flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-3">Complete Your Profile</h2>
            <p className="text-blue-200/60 text-sm leading-relaxed">
              Unlock the ability to send money, apply for instant loans, and
              manage your savings.
            </p>
          </div>

          <div className="space-y-4 mb-12">
            {/* Step Card 1 */}
            <div className="group flex items-center gap-5 p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[28px] transition-all cursor-pointer">
              <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/20">
                <Fingerprint size={24} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">Identity Verification</h3>
                <p className="text-blue-200/40 text-[11px] mt-0.5">
                  Upload a government-issued ID or passport and take a selfie to
                  complete the KYC process.
                </p>
              </div>
              <ChevronRight
                size={18}
                className="text-white/20 group-hover:text-white transition-colors"
              />
            </div>

            {/* Step Card 2 */}
            <div className="group flex items-center gap-5 p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[28px] transition-all cursor-pointer">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <Home size={24} className="text-blue-200" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">Personal Info</h3>
                <p className="text-blue-200/40 text-[11px] mt-0.5">
                  Provide your current residential address, employment and
                  verify tax details.
                </p>
              </div>
              <ChevronRight
                size={18}
                className="text-white/20 group-hover:text-white transition-colors"
              />
            </div>

            {/* Step Card 3 */}
            <div className="group flex items-center gap-5 p-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[28px] transition-all cursor-pointer">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                <FileText size={24} className="text-blue-200" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">Terms of Service</h3>
                <p className="text-blue-200/40 text-[11px] mt-0.5">
                  Review and accept your SACCO account type terms and conditions
                </p>
              </div>
              <ChevronRight
                size={18}
                className="text-white/20 group-hover:text-white transition-colors"
              />
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={loading}
            className="group w-full h-[68px] bg-secondary hover:bg-white text-white hover:text-primary rounded-[24px] font-black uppercase tracking-[2px] text-[13px] transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-950/40 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                Start Verification
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSuccess;

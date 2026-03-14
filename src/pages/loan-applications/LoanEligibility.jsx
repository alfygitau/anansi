import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Wallet,
  PieChart,
  Calendar,
  Lock,
  ArrowRight,
  RefreshCw,
  Shield,
  TrendingUp,
  Sparkles,
  Zap,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EligibilityCheck = () => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const loanLimitAmount = 450000;
  const loanLimit = `KES ${loanLimitAmount.toLocaleString()}`;

  const requirements = [
    {
      id: 1,
      label: "Membership Duration",
      desc: "Must be a member for 6+ months",
      status: "pass",
      value: "14 Months",
    },
    {
      id: 2,
      label: "Minimum Shares",
      desc: "Required: KES 50,000",
      status: "pass",
      value: "KES 55,000",
    },
    {
      id: 3,
      label: "Savings Deposits",
      desc: "Required: KES 20,000",
      status: "pass",
      value: "KES 22,500",
    },
    {
      id: 4,
      label: "Existing Loan Check",
      desc: "No active Development loans",
      status: "pass",
      value: "Clear",
    },
    {
      id: 5,
      label: "Loan Limit Availability",
      desc: "Must have a qualified limit > 0",
      status: loanLimitAmount > 0 ? "pass" : "fail",
      value: loanLimit,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setChecking(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-[#042159] pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <header className="py-6">
          <h1 className="text-3xl font-black tracking-tight">
            Loan Eligibility
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            We are verifying your account standing for the{" "}
            <span className="text-[#042159] font-bold">Development Loan</span>.
          </p>
        </header>

        {/* 1. Loan Limit Hero Card */}
        <LoanLimitHero loanLimit="KES 450,000" checking={checking} />

        {/* 2. Eligibility Checklist */}
        <section className="bg-white rounded-[40px] p-6 border border-slate-100 shadow-xl shadow-blue-900/5">
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
              Requirement Checklist
            </h3>
            {checking && (
              <div className="flex items-center gap-2 text-[#4DB8E4]">
                <RefreshCw size={14} className="animate-spin" />
                <span className="text-[10px] font-black uppercase">
                  Verifying...
                </span>
              </div>
            )}
          </div>

          <div className="space-y-8">
            {requirements.map((req) => (
              <RequirementRow key={req.id} req={req} checking={checking} />
            ))}
          </div>

          <div className="mt-12 flex flex-col md:flex-row gap-4">
            {/* Secondary Action: Cancel */}
            <button className="flex-1 py-5 rounded-[24px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border hover:border-red-100">
              Cancel
            </button>

            {/* Primary Action: Apply */}
            <button
              onClick={() => navigate("/apply-loan")}
              disabled={checking}
              className={`flex-[2] py-5 rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                checking
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-[#4DB8E4] text-white hover:bg-[#3ca8d4] shadow-xl shadow-sky-200 active:scale-95"
              }`}
            >
              Apply for Loan <ArrowRight size={20} />
            </button>
          </div>

          <p className="text-center text-[10px] text-slate-400 mt-6 px-10 leading-relaxed uppercase font-bold tracking-tight">
            By clicking apply, you confirm that the information provided above
            is accurate and you wish to proceed to the application form.
          </p>
        </section>
      </div>
    </div>
  );
};

const LoanLimitHero = ({ loanLimit, checking }) => {
  return (
    <div className="relative overflow-hidden bg-[#042159] rounded-[40px] p-10 mb-8 text-white shadow-[0_20px_50px_rgba(4,33,89,0.3)] border border-white/5">
      {/* Dynamic Background Accents */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#4DB8E4] opacity-20 rounded-full blur-[80px] animate-pulse"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600 opacity-10 rounded-full blur-[80px]"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Left: Amount & Label */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[#4DB8E4]/20 rounded-lg">
                <TrendingUp size={14} className="text-[#4DB8E4]" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4DB8E4]">
                Maximum Qualified Limit
              </p>
            </div>

            <div className="flex items-baseline gap-3">
              <h2
                className={`text-6xl font-black tracking-tighter transition-all duration-1000 ${
                  checking
                    ? "blur-xl opacity-30 scale-95"
                    : "blur-0 opacity-100 scale-100"
                }`}
              >
                {loanLimit}
              </h2>
              {!checking && (
                <div className="animate-bounce">
                  <Sparkles size={20} className="text-amber-400 opacity-80" />
                </div>
              )}
            </div>
          </div>

          {/* Right: Real-time Status/Disclaimer */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 md:max-w-[240px]">
            <div className="flex items-start gap-3">
              <div
                className={`mt-1 shrink-0 ${checking ? "animate-spin" : ""}`}
              >
                <Zap
                  size={16}
                  className={checking ? "text-slate-400" : "text-[#4DB8E4]"}
                />
              </div>
              <div>
                <p className="text-[10px] font-bold leading-relaxed text-slate-300 uppercase tracking-wide">
                  {checking
                    ? "Analyzing Credit Data..."
                    : "Limit Calculated Locally"}
                </p>
                <p className="text-[9px] text-white/40 mt-1 leading-tight font-medium">
                  Based on your current shares, deposits, and 6-month
                  transaction velocity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer Bar */}
        <div className="mt-10 pt-6 border-t border-white/5 flex items-center gap-2">
          <Info size={12} className="text-white/30" />
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/30">
            Disclaimer: This limit is an estimate. Final approval is subject to
            guarantor verification and credit committee review.
          </p>
        </div>
      </div>
    </div>
  );
};

/* --- Sub-Component: RequirementRow --- */
const RequirementRow = ({ req, checking }) => {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            checking
              ? "bg-slate-50 text-slate-200"
              : "bg-blue-50 text-[#042159]"
          }`}
        >
          {req.id === 1 && <Calendar size={20} />}
          {req.id === 2 && <PieChart size={20} />}
          {req.id === 3 && <Wallet size={20} />}
          {req.id === 4 && <Lock size={20} />}
          {req.id === 5 && <Shield size={20} />}
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#042159]">{req.label}</h4>
          <p className="text-[10px] text-slate-400 font-medium">{req.desc}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={`text-right transition-all duration-500 ${checking ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"}`}
        >
          <p className="text-[11px] font-black text-[#042159]">{req.value}</p>
          <span className="text-[9px] font-bold text-emerald-500 uppercase">
            Requirement Met
          </span>
        </div>
        <div
          className={`transition-all duration-700 ${checking ? "scale-0 rotate-90" : "scale-100 rotate-0"}`}
        >
          <CheckCircle2 className="text-emerald-500" size={24} />
        </div>
      </div>
    </div>
  );
};

export default EligibilityCheck;

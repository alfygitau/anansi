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
  Calculator,
  FileText,
  HelpCircle,
  AlertTriangle,
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
    <div className="bg-slate-50 text-[#042159] pb-20">
      <div className="max-w-6xl sm:px-4 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pt-3">
        {/* --- MAIN CONTENT --- */}
        <main className="lg:col-span-9">
          <header className="mb-5">
            <h1 className="text-4xl font-black tracking-tight">
              Loan Eligibility
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Verifying your standing for the{" "}
              <span className="text-[#042159] font-bold">Development Loan</span>
              .
            </p>
          </header>

          <LoanLimitHero loanLimit={loanLimit} checking={checking} />

          <section className="bg-white rounded-[40px] p-6 md:p-6 border border-slate-100 shadow-sm shadow-blue-900/5">
            <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-6">
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
              <button className="flex-1 border py-5 rounded-[24px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all hover:border-red-100">
                Cancel
              </button>
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
          </section>
        </main>

        {/* --- LEFT SIDEBAR: QUICK ACTIONS & DISCLAIMERS --- */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                Quick Actions
              </h3>
              <div className="space-y-2">
                <QuickActionButton
                  icon={<Calculator size={18} />}
                  label="Loan Calculator"
                />
                <QuickActionButton
                  icon={<FileText size={18} />}
                  label="My Statements"
                />
                <QuickActionButton
                  icon={<HelpCircle size={18} />}
                  label="Get Support"
                />
              </div>
            </div>

            {/* Detailed Disclaimers */}
            <div className="bg-[#042159] rounded-[32px] p-8 text-white relative overflow-hidden">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <Shield size={120} />
              </div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4DB8E4] mb-4">
                Important Notice
              </h3>
              <div className="space-y-4 relative z-10">
                <div className="flex gap-3">
                  <AlertTriangle
                    size={14}
                    className="text-amber-400 shrink-0"
                  />
                  <p className="text-[10px] leading-relaxed text-slate-300">
                    The displayed limit is a{" "}
                    <span className="text-white font-bold">pre-evaluation</span>
                    . Final disbursement depends on credit scoring.
                  </p>
                </div>
                <div className="flex gap-3 border-t border-white/10 pt-4">
                  <Lock size={14} className="text-emerald-400 shrink-0" />
                  <p className="text-[10px] leading-relaxed text-slate-300">
                    Calculations are based on Sacco Rule 4.2 regarding
                    deposit-to-loan ratios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const QuickActionButton = ({ icon, label }) => (
  <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100">
    <div className="text-slate-300 group-hover:text-[#4DB8E4] transition-colors">
      {icon}
    </div>
    <span className="text-xs font-bold text-[#042159]">{label}</span>
  </button>
);

const LoanLimitHero = ({ loanLimit, checking }) => (
  <div className="relative overflow-hidden bg-[#042159] rounded-[40px] p-10 mb-8 text-white shadow-[0_10px_20px_rgba(4,33,89,0.3)] border border-white/5">
    <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#4DB8E4] opacity-20 rounded-full blur-[80px]"></div>
    <div className="relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
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
              className={`text-6xl sm:text-4xl font-black tracking-tighter transition-all duration-1000 ${checking ? "blur-xl opacity-30" : "blur-0 opacity-100"}`}
            >
              {loanLimit}
            </h2>
            {!checking && (
              <Sparkles size={20} className="text-amber-400 animate-pulse" />
            )}
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5 md:max-w-[240px]">
          <div className="flex items-start gap-3">
            <Zap
              size={16}
              className={
                checking ? "animate-pulse text-slate-400" : "text-[#4DB8E4]"
              }
            />
            <div>
              <p className="text-[10px] font-bold text-slate-300 uppercase">
                {checking ? "Analyzing..." : "Real-time Limit"}
              </p>
              <p className="text-[9px] text-white/40 mt-1">
                Based on shares and 6-month transaction velocity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const RequirementRow = ({ req, checking }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${checking ? "bg-slate-50 text-slate-200" : "bg-slate-100 text-[#042159]"}`}
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
        className={`text-right transition-all duration-500 ${checking ? "opacity-0" : "opacity-100"}`}
      >
        <p className="text-[11px] font-black text-[#042159]">{req.value}</p>
        <span className="text-[9px] font-bold text-emerald-500 uppercase">
          Requirement Met
        </span>
      </div>
      <CheckCircle2
        className={`transition-all duration-700 ${checking ? "scale-0" : "scale-100 text-emerald-500"}`}
        size={24}
      />
    </div>
  </div>
);

export default EligibilityCheck;

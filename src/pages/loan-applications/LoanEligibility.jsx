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
  Calculator,
  FileText,
  HelpCircle,
  ChevronRight,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const EligibilityCheck = () => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const loanLimitAmount = 450000;
  const loanLimit = `KES ${loanLimitAmount.toLocaleString()}`;

  const requirements = [
    {
      id: 1,
      label: "Membership Duration",
      desc: "6+ months standing",
      status: "pass",
      value: "14 Months",
      icon: <Calendar size={20} />,
    },
    {
      id: 2,
      label: "Minimum Shares",
      desc: "Required: KES 50,000",
      status: "pass",
      value: "KES 55,000",
      icon: <PieChart size={20} />,
    },
    {
      id: 3,
      label: "Savings Deposits",
      desc: "Required: KES 20,000",
      status: "pass",
      value: "KES 22,500",
      icon: <Wallet size={20} />,
    },
    {
      id: 4,
      label: "Credit History",
      desc: "No active defaults",
      status: "pass",
      value: "Perfect",
      icon: <Shield size={20} />,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setChecking(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans selection:bg-blue-100">
      <div className="max-w-6xl sm:px-4 mx-auto mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
              <Zap size={12} fill="currentColor" />
              Instant Evaluation
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-slate-900">
              Loan <span className="text-blue-600">Eligibility</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium">
              Real-time analysis for your{" "}
              <span className="text-slate-900 font-semibold underline decoration-blue-200 underline-offset-4">
                Development Loan
              </span>{" "}
              standing.
            </p>
          </div>
          <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-semibold text-sm transition-colors group">
            <HelpCircle
              size={18}
              className="group-hover:rotate-12 transition-transform"
            />
            Policy Documents
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content */}
          <main className="lg:col-span-8 space-y-8">
            <LoanLimitCard loanLimit={loanLimit} checking={checking} />

            {/* Requirements Grid */}
            <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Verification Checklist
                  </h3>
                  <p className="text-sm text-slate-400">
                    Automated background standing check
                  </p>
                </div>
                {checking && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                    <RefreshCw
                      size={16}
                      className="animate-spin text-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">
                      Syncing Data
                    </span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {requirements.map((req) => (
                  <RequirementBox key={req.id} req={req} checking={checking} />
                ))}
              </div>

              {/* Action Area */}
              <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between gap-6">
                <button className="px-8 border rounded-2xl py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors">
                  Cancel Application
                </button>
                <button
                  disabled={checking}
                  onClick={() => navigate("/apply-loan")}
                  className={`relative group px-10 py-4 rounded-2xl font-bold text-white overflow-hidden transition-all shadow-lg hover:shadow-blue-200 active:scale-95 ${
                    checking
                      ? "bg-slate-200 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-3 uppercase tracking-wider text-sm">
                    Start Application <ArrowRight size={18} />
                  </span>
                </button>
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <PremiumSidebar
              actions={[
                {
                  icon: <Calculator />,
                  label: "Loan Calculator",
                  desc: "Estimate monthly repayments",
                },
                {
                  icon: <FileText />,
                  label: "Account Statements",
                  desc: "Download transaction history",
                },
                {
                  icon: <HelpCircle />,
                  label: "Talk to an Agent",
                  desc: "24/7 dedicated support",
                },
              ]}
            />

            {/* Notice Card */}
            <div className="bg-[#0F172A] rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Shield size={100} />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="p-3 bg-white/10 w-fit rounded-2xl backdrop-blur-md">
                  <Info size={20} className="text-blue-400" />
                </div>
                <h4 className="text-xl font-bold">Important Notice</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  This pre-qualification is based on your current data. Final
                  approval is subject to manual credit review and Sacco Rule 4.2
                  compliance.
                </p>
                <div className="pt-4 flex items-center gap-3 text-emerald-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                  <Lock size={12} /> Encrypted Session
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

/* --- PREMIUM SUB-COMPONENTS --- */

const LoanLimitCard = ({ loanLimit, checking }) => (
  <div className="relative group overflow-hidden bg-white rounded-[40px] p-10 border border-slate-100 shadow-[0_30px_60px_rgba(0,0,0,0.04)]">
    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none" />
    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
      <div className="space-y-4 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-3">
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
            <TrendingUp size={16} />
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
            Pre-Qualified Limit
          </span>
        </div>
        <div className="relative">
          <AnimatePresence mode="wait">
            {checking ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-16 flex items-center gap-2"
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [15, 40, 15] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      delay: i * 0.1,
                    }}
                    className="w-2 bg-slate-100 rounded-full"
                  />
                ))}
              </motion.div>
            ) : (
              <motion.h2
                key="limit"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-6xl font-bold tracking-tighter text-slate-900"
              >
                {loanLimit}
              </motion.h2>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full md:w-auto px-8 py-6 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col items-center">
        <Sparkles size={24} className="text-amber-400 mb-2" />
        <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">
          Status
        </span>
        <span
          className={`text-sm font-bold ${checking ? "text-slate-300" : "text-emerald-500"}`}
        >
          {checking ? "Analyzing..." : "Excellent"}
        </span>
      </div>
    </div>
  </div>
);

const RequirementBox = ({ req, checking }) => (
  <div className="relative group perspective-1000">
    <div className="relative flex flex-col h-full p-6 bg-white rounded-[30px] border border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all duration-500 group-hover:translate-y-[-4px]">
      {/* Top Section: Icon & Badge */}
      <div className="flex items-center justify-between mb-8">
        <div
          className={`relative flex items-center justify-center size-14 rounded-2xl transition-all duration-700 ${
            checking
              ? "bg-slate-50 text-slate-300"
              : "bg-gradient-to-br from-slate-50 to-blue-50/50 text-blue-600 shadow-sm"
          }`}
        >
          {req.icon}
          {/* Subtle pulse for active checking */}
          {checking && (
            <span className="absolute inset-0 rounded-2xl border-2 border-blue-400/20 animate-ping" />
          )}
        </div>

        <div
          className={`flex flex-col items-end transition-all duration-700 ${checking ? "opacity-30" : "opacity-100"}`}
        >
          <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-50/50 px-2.5 py-1 rounded-full border border-emerald-100/50">
            <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              Valid
            </span>
          </div>
        </div>
      </div>

      {/* Middle Section: Typography */}
      <div className="flex-grow space-y-1.5">
        <h4 className="text-[17px] font-bold text-slate-900 tracking-tight leading-tight">
          {req.label}
        </h4>
        <p className="text-xs text-slate-500 font-medium leading-relaxed italic opacity-80">
          "{req.desc}"
        </p>
      </div>

      {/* Bottom Section: The "Spec" Look */}
      <div className="mt-8">
        <div className="relative p-4 rounded-2xl bg-slate-50/50 border border-slate-100/50 overflow-hidden">
          {/* Subtle Glass Highlight */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50" />

          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.15em]">
              Verified Value
            </span>
            <div className="flex items-center justify-between">
              <span
                className={`text-lg font-black tracking-tight transition-all duration-1000 ${
                  checking ? "blur-md text-slate-300" : "text-slate-900"
                }`}
              >
                {req.value}
              </span>
              {!checking && (
                <CheckCircle2
                  size={18}
                  className="text-emerald-500"
                  strokeWidth={3}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PremiumSidebar = ({ actions }) => (
  <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
      Resources
    </h3>
    <div className="space-y-4">
      {actions.map((action, i) => (
        <button
          key={i}
          className="w-full flex items-center gap-4 rounded-2xl hover:bg-blue-50/50 transition-all group"
        >
          <div className="p-3 bg-slate-100 rounded-xl text-slate-400 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm transition-all">
            {action.icon}
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-900">{action.label}</p>
            <p className="text-[10px] text-slate-400 font-medium">
              {action.desc}
            </p>
          </div>
          <ChevronRight
            size={14}
            className="ml-auto text-slate-300 group-hover:text-blue-600 transition-colors"
          />
        </button>
      ))}
    </div>
  </div>
);

export default EligibilityCheck;

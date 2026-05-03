import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  Shield,
  Calculator,
  FileText,
  HelpCircle,
  ChevronRight,
  Info,
  AlertTriangle,
  Circle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const EligibilityCheck = () => {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const loanLimitAmount = 450000;
  const loanLimit = `KES ${loanLimitAmount.toLocaleString()}`;

  const loanRequirements = [
    {
      id: "req_1",
      title: "Membership Duration",
      desc: "You must be an active member for at least 6 consecutive months.",
      status: "Met",
      isMet: true,
      isWarning: false,
    },
    {
      id: "req_2",
      title: "Share Capital Minimum",
      desc: "Minimum share capital of KES 20,000 is required for this loan category.",
      status: "Met",
      isMet: true,
      isWarning: false,
    },
    {
      id: "req_3",
      title: "Guarantor Coverage",
      desc: "3 guarantors required. You currently have 1 confirmed guarantor.",
      status: "Pending",
      isMet: false,
      isWarning: true,
    },
    {
      id: "req_4",
      title: "Deposit Multiplier",
      desc: "Total loan requested must not exceed 3x your current deposits.",
      status: "Met",
      isMet: true,
      isWarning: false,
    },
    {
      id: "req_5",
      title: "Credit History",
      desc: "Internal and CRB credit check to ensure no outstanding defaults.",
      status: "Checking",
      isMet: false,
      isWarning: false,
    },
    {
      id: "req_6",
      title: "Repayment Capacity",
      desc: "The 1/3 take-home rule applies to your monthly net salary.",
      status: "Warning",
      isMet: false,
      isWarning: true,
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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Loan <span>Eligibility</span>
            </h1>
            <p className="text-slate-500 text-lg font-medium">
              Real-time analysis for your{" "}
              <span className="text-slate-900 font-semibold decoration-blue-200 underline-offset-4">
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
          <main className="lg:col-span-8 space-y-6">
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

              <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {loanRequirements.map((req) => (
                    <SaccoChecklistTile key={req.id} {...req} />
                  ))}
                </div>
              </div>
              {/* Action Area */}
              <div className="mt-4 pt-1 border-t border-slate-50 flex items-center justify-between gap-6">
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
            <div className="group relative overflow-hidden bg-[#0A192F] rounded-[16px] p-4 text-white shadow-2xl border border-white/5 transition-all hover:border-blue-500/30">
              {/* Abstract Background Glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] group-hover:bg-blue-600/20 transition-colors" />

              <div className="relative z-10 space-y-5">
                {/* Header: Glass Icon + Status */}
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-md">
                    <Shield size={22} className="text-blue-400" />
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                      System Live
                    </span>
                  </div>
                </div>

                {/* Typography */}
                <div>
                  <h4 className="text-lg font-black tracking-tight mb-2">
                    Institutional Security
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-medium">
                    Your data is protected via{" "}
                    <span className="text-white">AES-256 encryption</span>. This
                    analysis adheres to the Sacco Rule 4.2 Regulatory Framework
                    for automated credit scoring.
                  </p>
                </div>

                {/* Footer Info */}
                <div className="pt-4 flex items-center justify-between border-t border-white/5">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <Lock size={12} /> Encrypted
                  </div>
                  <span className="text-[10px] font-bold text-blue-400 hover:underline cursor-pointer">
                    Privacy Policy
                  </span>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-[16px] p-4 text-white shadow-2xl border border-slate-700/50">
              {/* Decorative Icon Watermark */}
              <div className="absolute -right-6 -bottom-6 text-white/5 rotate-12 transition-transform group-hover:scale-110 group-hover:rotate-0 duration-700">
                <Info size={140} strokeWidth={1} />
              </div>

              <div className="relative z-10 space-y-5">
                {/* Icon Wrapper */}
                <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                  <Calculator size={22} className="text-indigo-400" />
                </div>

                {/* Content */}
                <div>
                  <h4 className="text-lg font-black tracking-tight mb-2">
                    Capacity Logic
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-medium">
                    Limits are dynamically calculated based on a{" "}
                    <span className="text-indigo-300">
                      3x Deposit Multiplier
                    </span>
                    . Increasing your monthly deposits will instantly elevate
                    your borrowing ceiling.
                  </p>
                </div>

                {/* Action Link/Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer group/btn">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-200">
                    How is this calculated?
                  </span>
                  <ChevronRight
                    size={14}
                    className="text-slate-400 group-hover/btn:translate-x-1 transition-transform"
                  />
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

const LoanLimitCard = ({
  loanLimit,
  checking,
  deposits = "KES 150k",
  shares = "KES 25k",
  multiplier = "3.0x",
}) => {
  return (
    <div className="relative overflow-hidden rounded-[35px] p-3 shadow-2xl bg-gradient-to-br from-[#0A2351] to-[#1B3C73]">
      {/* Content Container */}
      <div className="flex flex-col items-center text-center">
        {/* Label - Teal Accent */}
        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#17C6C6] mb-4">
          Your Borrowing Capacity
        </span>

        {/* Main Amount */}
        <div className="relative h-[54px] flex items-center justify-center">
          {checking ? (
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-8 bg-white/20 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          ) : (
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
              {loanLimit || "KES 0.00"}
            </h2>
          )}
        </div>

        {/* Subtitle */}
        <p className="mt-2 text-xs font-semibold text-white/50">
          Based on 3x Deposit Multiplier
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 my-6" />

        {/* Stats Row */}
        <div className="w-full flex justify-between items-center px-2">
          <HeaderStat label="Total Deposits" value={deposits} />
          <div className="w-px h-8 bg-white/10" /> {/* Vertical Divider */}
          <HeaderStat label="Share Capital" value={shares} />
          <div className="w-px h-8 bg-white/10" /> {/* Vertical Divider */}
          <HeaderStat label="Multiplier" value={multiplier} />
        </div>
      </div>
    </div>
  );
};

// Internal Helper for the Stats
const HeaderStat = ({ label, value }) => (
  <div className="flex flex-col items-center">
    <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider mb-1">
      {label}
    </span>
    <span className="text-sm font-black text-white">{value}</span>
  </div>
);

const SaccoChecklistTile = ({ title, desc, status, isMet, isWarning }) => {
  // Logic for colors and icons based on status
  const iconColor = isMet ? "#17C6C6" : isWarning ? "#F59E0B" : "#94A3B8"; // Teal, Orange, or Slate-400

  const Icon = isMet ? CheckCircle2 : isWarning ? AlertTriangle : Circle;

  return (
    <div className="flex items-start p-5 mb-4 bg-white border-[1.5px] border-[#F1F4F8] rounded-[24px] transition-all hover:shadow-sm">
      {/* Circular Icon Container */}
      <div
        className="flex items-center justify-center min-w-[40px] h-[40px] rounded-full mr-4"
        style={{ backgroundColor: `${iconColor}15` }} // 15 = ~8% opacity for the background
      >
        <Icon
          size={20}
          color={iconColor}
          fill={isMet ? iconColor : "transparent"}
          fillOpacity={0.2}
        />
      </div>

      {/* Content Section */}
      <div className="flex-grow flex flex-col">
        <div className="flex items-center justify-between">
          <h4 className="text-[14px] font-black text-[#0A2351] tracking-tight">
            {title}
          </h4>

          <span
            className="text-[9px] font-black uppercase tracking-widest"
            style={{ color: iconColor }}
          >
            {status?.toUpperCase()}
          </span>
        </div>

        <p className="mt-1 text-[11px] font-medium text-slate-500 leading-[1.4]">
          {desc}
        </p>
      </div>
    </div>
  );
};

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

import React from "react";
import {
  FileText,
  Users,
  Info,
  ShieldCheck,
  Download,
  MessageCircle,
  UserPlus,
  Zap,
  FileSearch,
  Shield,
  Percent,
  Calendar,
  Repeat,
  Lock,
  Briefcase,
  CheckCircle2,
  UserCircle,
  Gauge,
  Box,
  PenTool,
  ChevronRight,
  Clock,
  ArrowRight,
} from "lucide-react";

const LoanApplicationDetails = ({ onBack }) => {
  const appData = {
    code: "APP-DEV-001",
    product: "Development Loan",
    requestedAmount: "KES 1,200,000",
    submissionDate: "Mar 12, 2026",
    status: "Under Review",
    requiredGuarantors: 3,
  };

  const requirements = [
    {
      title: "Identity Verification",
      subtitle: "National ID & Selfie",
      status: "Verified",
      isDone: true,
      icon: UserCircle,
    },
    {
      title: "Eligibility Check",
      subtitle: "Credit score & history",
      status: "Cleared",
      isDone: true,
      icon: Gauge,
    },
    {
      title: "Loan Details",
      subtitle: "Loan amount and loan period",
      status: "Cleared",
      isDone: true,
      icon: FileText,
    },
    {
      title: "Bank Statements",
      subtitle: "Last 3 months (PDF)",
      status: "Under Review",
      isDone: false,
      isPending: true,
      icon: FileSearch,
    },
    {
      title: "Guarantor Approval",
      subtitle: "2 guarantors required",
      status: "1/2 Approved",
      isDone: false,
      icon: Users,
    },
    {
      title: "Assets & Chattels",
      subtitle: "Logbook or Household items",
      status: "Action Required",
      isDone: false,
      icon: Box,
    },
    {
      title: "Legal Agreement",
      subtitle: "Sign loan contract",
      status: "Locked",
      isDone: false,
      icon: PenTool,
    },
  ];

  const isProcessing = [
    "Pending Approval",
    "Pending Disbursement",
    "Reviewing Customer Information",
  ].includes("Reviewing Customer Information");

  const getStatusTheme = (isDone, isPending, status) => {
    if (isDone) return { color: "#10B981", bg: "bg-emerald-500/10" }; // Success Green
    if (isPending) return { color: "#F59E0B", bg: "bg-amber-500/10" }; // Pending Amber
    if (status === "Action Required")
      return { color: "#EF4444", bg: "bg-red-500/10" }; // Alert Red
    return { color: "#94A3B8", bg: "bg-slate-500/10" }; // Default Grey
  };

  return (
    <div className="min-h-screen bg-slate-50 text-primary pb-20">
      <div className="max-w-6xl mx-auto sm:px-4">
        {/* Navigation & Header */}
        <header className="py-2">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight">
                {appData.product}
              </h1>
              <p className="text-slate-400 font-mono text-xs mt-1 uppercase tracking-widest">
                {appData.code}
              </p>
            </div>
            {/* Status Indicator */}
            <div className="bg-amber-500 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-200">
              {appData.status}
            </div>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 py-4 w-full items-stretch">
          {/* 1. Application Status Header (Left Side) */}
          <div className="flex-1 relative overflow-hidden rounded-[35px] bg-gradient-to-br from-[#0A2351] to-[#1A3A7A] shadow-xl">
            {/* Decorative Circle (Flutter's CircleAvatar radius: 60) */}
            <div className="absolute -right-5 -top-5 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

            <div className="p-7 flex flex-col h-full">
              {/* Top Bar */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-white/40 text-[9px] font-extrabold tracking-[1.2px] uppercase">
                    Application ID
                  </p>
                  <p className="text-white text-[12px] font-bold">
                    AN-8821-026
                  </p>
                </div>
                {/* Premium Status Badge */}
                <div className="bg-[#FFB300] px-3 py-1.5 rounded-full shadow-lg shadow-amber-900/20">
                  <span className="text-white text-[9px] font-black uppercase tracking-wider">
                    Under Review
                  </span>
                </div>
              </div>

              {/* Amount Section */}
              <div className="text-center mb-8">
                <p className="text-white/50 text-[10px] font-extrabold tracking-[1.5px] uppercase mb-1.5">
                  Loan Amount
                </p>
                <h1 className="text-white text-4xl font-black tracking-tighter">
                  KES 45,000.00
                </h1>
              </div>

              <hr className="border-white/10 mb-5" />

              {/* Info Footer */}
              <div className="flex items-start gap-3 mt-auto">
                <Info size={16} className="text-[#17C6C6] shrink-0 mt-0.5" />
                <p className="text-white/70 text-[11px] font-medium leading-relaxed">
                  Verification in progress. Expect a response within 24 hours.
                </p>
              </div>
            </div>
          </div>

          {/* 2. Potential Parameters (Right Side) */}
          <div className="flex-1 bg-white rounded-[28px] border-1.5 border-[#F1F4F8] p-6 shadow-[0_10px_20px_rgba(0,0,0,0.02)]">
            {/* Product Branding */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[#0A2351] flex items-center justify-center text-white">
                <Shield size={18} fill="currentColor" />
              </div>
              <div>
                <p className="text-slate-400 text-[9px] font-extrabold tracking-wider uppercase">
                  Loan Product
                </p>
                <p className="text-[#0A2351] text-[15px] font-black">
                  Emergency Fund Plus
                </p>
              </div>
            </div>

            <hr className="border-[#F1F4F8] mb-5" />

            {/* Data Grid (Replicating Flutter Table 2x3) */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <DetailCell
                icon={Percent}
                label="Interest Rate"
                value="1.5% / Mo"
              />
              <DetailCell
                icon={Calendar}
                label="Loan Period"
                value="6 Months"
              />
              <DetailCell icon={Repeat} label="Frequency" value="Monthly" />
              <DetailCell
                icon={FileText}
                label="Processing Fee"
                value="KES 500"
              />
              <DetailCell icon={Lock} label="Insurance Fee" value="KES 150" />
              <DetailCell
                icon={Briefcase}
                label="Excise Duty"
                value="KES 100"
              />
            </div>
          </div>
        </div>

        {/* Conditionally show the insight section */}
        {isProcessing && (
          <StatusInsight status="Reviewing Customer Information" />
        )}
        <div className="mb-2 mt-6 flex items-baseline justify-between">
          <h2 className="text-[11px] font-black uppercase tracking-[2px] text-slate-400">
            Application Milestones
          </h2>
          <span className="text-[10px] font-bold text-[#17C6C6]">
            3/7 COMPLETED
          </span>
        </div>

        {/* Container: Grid setup with responsive columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {requirements.map((req, index) => {
            const {
              isDone,
              isPending,
              status,
              title,
              subtitle,
              icon: Icon,
            } = req;
            const theme = getStatusTheme(isDone, isPending, status);

            return (
              <div
                key={index}
                className={`
          flex items-center p-5 rounded-[24px] border-1.5 transition-all duration-300
          ${
            isDone
              ? "bg-white/50 border opacity-70"
              : "bg-white border-[#F1F4F8] shadow-[0_8px_15px_rgba(0,0,0,0.02)]"
          }
        `}
              >
                {/* 1. Dynamic Icon Housing */}
                <div
                  className={`shrink-0 p-2.5 rounded-full ${theme.bg} flex items-center justify-center`}
                  style={{ color: theme.color }}
                >
                  {isDone ? (
                    <CheckCircle2 size={20} strokeWidth={3} />
                  ) : isPending ? (
                    <Clock size={20} strokeWidth={2.5} />
                  ) : (
                    <Icon size={20} strokeWidth={2.5} />
                  )}
                </div>

                {/* 2. Text Content */}
                <div className="flex-1 ml-4 flex flex-col min-w-0">
                  <h4
                    className={`
            text-[13px] font-black leading-tight truncate
            ${isDone ? "line-through text-slate-400" : "text-[#0A2351]"}
          `}
                  >
                    {title}
                  </h4>
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5 truncate uppercase tracking-tight">
                    {subtitle}
                  </p>
                </div>

                {/* 3. Status Badge - Compressed for Grid Layout */}
                <div className="flex items-center gap-2 ml-2">
                  <div
                    className={`
            px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider whitespace-nowrap
            ${theme.bg}
          `}
                    style={{ color: theme.color }}
                  >
                    {status}
                  </div>

                  {!isDone && !isPending && (
                    <ChevronRight
                      size={12}
                      className="text-slate-300"
                      strokeWidth={3}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* --- UI Sub-Components --- */
const DetailCell = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5">
      <Icon size={16} className="text-slate-300" />
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight truncate">
        {label}
      </span>
      <span className="text-[13px] font-black text-[#0A2351] truncate">
        {value}
      </span>
    </div>
  </div>
);

const DetailItem = ({ label, value, isHighlight }) => (
  <div>
    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-300 mb-1">
      {label}
    </p>
    <p
      className={`text-base font-bold ${isHighlight ? "text-secondary font-black" : "text-primary"}`}
    >
      {value}
    </p>
  </div>
);

const DocRow = ({ label }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100">
    <div className="flex items-center gap-3">
      <FileText size={18} className="text-secondary" />
      <span className="text-sm font-bold text-primary">{label}</span>
    </div>
    <Download size={16} className="text-slate-300 group-hover:text-primary" />
  </div>
);

const GuarantorCard = ({ guarantor }) => {
  const isPending = guarantor.status === "Pending";

  return (
    <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-4">
        {/* Avatar/Status Icon */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
            isPending
              ? "bg-amber-50 text-amber-500"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {isPending ? (
            <UserPlus size={22} className="animate-pulse" />
          ) : (
            <ShieldCheck size={22} />
          )}
        </div>

        {/* Amount Badge */}
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Guarantee
          </p>
          <p className="text-sm font-black text-primary">{guarantor.amount}</p>
        </div>
      </div>

      <div>
        <h4 className="font-bold text-primary text-sm truncate">
          {guarantor.name}
        </h4>
        <p className="text-[10px] font-mono text-slate-400 mt-0.5">
          {guarantor.phone}
        </p>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
        <span
          className={`text-[9px] font-black uppercase tracking-widest ${
            isPending ? "text-amber-500" : "text-emerald-500"
          }`}
        >
          {guarantor.status}
        </span>

        {isPending && (
          <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors">
            <MessageCircle size={12} />
            Nudge via SMS
          </button>
        )}
      </div>
    </div>
  );
};

const StatusInsight = ({ status, onContinue }) => {
  const insights = {
    Draft: {
      title: "Continue Application",
      description:
        "You have an unfinished application. Complete the remaining steps to submit your request for review.",
      icon: <FileSearch className="text-amber-600" />,
      bg: "bg-amber-50",
      border: "border-amber-100",
      actionLabel: "Resume Now",
      showButton: true,
    },
    "Pending Approval": {
      title: "Under Credit Review",
      description:
        "Our credit committee is currently reviewing your financial profile and guarantor commitments. This typically takes 24-48 hours.",
      icon: <ShieldCheck className="text-blue-600" />,
      bg: "bg-blue-50",
      border: "border-blue-100",
      actionLabel: "View Details",
      showButton: true,
    },
    "Reviewing Customer Information": {
      title: "Verification in Progress",
      description:
        "We are performing standard KYC checks on your provided identification and documents to ensure your security.",
      icon: <FileSearch className="text-indigo-600" />,
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      showButton: true,
    },
    "Pending Disbursement": {
      title: "Processing M-PESA Transfer",
      description:
        "Great news! Your loan is approved. We are currently queuing the funds for transfer to your registered mobile number.",
      icon: <Zap className="text-[#17C6C6]" />,
      bg: "bg-sky-50",
      border: "border-sky-100",
      showButton: false,
    },
  };

  const active = insights[status] || insights["Pending Approval"];

  return (
    <div
      className={`p-6 rounded-[40px] mt-4 border ${active.border} ${active.bg} mb-4 transition-all`}
    >
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        {/* Icon Housing */}
        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm shrink-0">
          {React.cloneElement(active.icon, { size: 32, strokeWidth: 2.5 })}
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <h3 className="text-lg font-black text-[#0A2351] tracking-tight">
            {active.title}
          </h3>
          <p className="text-sm text-[#0A2351]/70 leading-relaxed mt-1 max-w-2xl">
            {active.description}
          </p>
        </div>

        {/* Conditional Button or Live Indicator */}
        <div className="md:ml-auto shrink-0 w-full md:w-auto">
          {active.showButton ? (
            <button
              onClick={onContinue}
              className="group flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-[#0A2351] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:bg-[#152E5F] active:scale-95 transition-all"
            >
              {active.actionLabel}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          ) : status === "Pending Disbursement" ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-sky-200">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#17C6C6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#17C6C6]"></span>
              </span>
              <span className="text-[10px] font-black uppercase text-[#17C6C6]">
                System Live
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationDetails;

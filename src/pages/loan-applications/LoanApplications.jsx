import { useState } from "react";
import {
  XCircle,
  Search,
  Plus,
  Filter,
  Zap,
  ShieldCheck,
  ArrowRight,
  Gavel,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LoanApplications = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const loanApplications = [
    {
      reference: "AN-8821-026",
      title: "Emergency Fund Loan",
      date: "May 11, 2026",
      amount: "KES 45,000",
      status: "Approved",
    },
    {
      reference: "AN-8822-027",
      title: "Asset Finance (Logbook)",
      date: "May 10, 2026",
      amount: "KES 1,200,000",
      status: "Pending",
    },
    {
      reference: "AN-8823-028",
      title: "School Fees Loan",
      date: "May 08, 2026",
      amount: "KES 85,000",
      status: "Approved",
    },
    {
      reference: "AN-8824-029",
      title: "Business Biashara Loan",
      date: "May 05, 2026",
      amount: "KES 250,000",
      status: "Declined",
    },
    {
      reference: "AN-8825-030",
      title: "Agri-Input Credit",
      date: "May 02, 2026",
      amount: "KES 30,000",
      status: "Pending",
    },
    {
      reference: "AN-8826-031",
      title: "Home Improvement Loan",
      date: "Apr 28, 2026",
      amount: "KES 500,000",
      status: "Approved",
    },
    {
      reference: "AN-8825-032",
      title: "Agri-Input Credit",
      date: "May 02, 2026",
      amount: "KES 30,000",
      status: "Pending",
    },
    {
      reference: "AN-8826-033",
      title: "Home Improvement Loan",
      date: "Apr 28, 2026",
      amount: "KES 500,000",
      status: "Approved",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-primary pb-20">
      <div className="max-w-6xl sm:px-4 mx-auto">
        {/* Header Section */}
        <header className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              Loan Applications
            </h1>
            <p className="text-slate-400 text-sm font-medium">
              Monitor your credit requests through the vetting and disbursement
              pipeline.
            </p>
          </div>
        </header>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Search & List (8 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <section>
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search by product or application code..."
                    className="w-full pl-12 pr-4 py-4 bg-white border rounded-2xl focus:ring-2 focus:ring-secondary/20 outline-none text-sm font-bold transition-all"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="flex items-center gap-2 px-6 py-4 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">
                  <Filter size={18} /> Filter
                </button>
              </div>

              <div className="space-y-4">
                {loanApplications.length > 0 ? (
                  loanApplications.map((app) => (
                    <ApplicationItem
                      key={app.reference}
                      {...app}
                      onTap={() => navigate("/loan-application-details")}
                    />
                  ))
                ) : (
                  <div className="py-20 text-center text-slate-300 font-bold italic">
                    No matching applications found.
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT: Quick Actions & Sidebar (4 Columns) */}
          <aside className="lg:col-span-5 space-y-6">
            <ApplyLoanAction />
            {/* Action Required Card */}
            <div className="bg-primary rounded-[32px] p-4 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="text-secondary" size={20} />
                <h3 className="text-lg font-black tracking-tight">
                  Pending Action
                </h3>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-6">
                <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-1">
                  Attention Required
                </p>
                <p className="text-xs leading-relaxed text-white/80">
                  Your{" "}
                  <span className="text-white font-bold underline">
                    Biashara Loan
                  </span>{" "}
                  is waiting for guarantor signatures.
                </p>
              </div>
              <button className="w-full bg-secondary text-primary py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-sky-300 transition-colors flex items-center justify-center gap-2">
                Invite Guarantors <ArrowRight size={14} />
              </button>
            </div>

            {/* Vetting Process Card */}
            <div className="bg-white rounded-[32px] p-4 border border-slate-100 shadow-xl shadow-blue-900/5">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="text-emerald-500" size={20} />
                <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-400">
                  Approval Flow
                </h3>
              </div>
              <div className="space-y-4">
                <ProcessStep step="1" label="Member Vetting" active />
                <ProcessStep step="2" label="Guarantor Verification" active />
                <ProcessStep step="3" label="Credit Committee Review" />
                <ProcessStep step="4" label="Funds Disbursement" />
              </div>
            </div>

            {/* Disclaimers & Info */}
            <div className="bg-blue-50/50 rounded-[32px] p-4 border border-blue-100/100">
              <div className="flex items-center gap-3 mb-6">
                <Gavel className="text-secondary" size={20} />
                <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-400">
                  Legal Info
                </h3>
              </div>
              <ul className="space-y-4">
                <DisclaimerItem text="Disbursement: Approved loans are disbursed to your linked savings account within 24 hours of final approval." />
                <DisclaimerItem text="Processing Fees: A statutory 1% processing fee is deducted from the principal amount upon disbursement." />
                <DisclaimerItem text="Rejected Status: If an application is rejected, you may appeal or re-apply after 30 days of the decision date." />
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

/* --- Sub-Components --- */
const ApplyLoanAction = ({ onClick }) => {
  return (
    <div>
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -2 }}
        onClick={onClick}
        className="w-full text-left bg-white p-4 rounded-[24px] border border-[#0A2351]/10 flex items-center shadow-sm hover:shadow-md transition-all group"
      >
        {/* 1. Circle Icon (Matching darkBlue color) */}
        <div className="p-3 bg-[#0A2351] rounded-full text-white shrink-0 group-hover:scale-110 transition-transform duration-300">
          <Plus size={20} strokeWidth={3} />
        </div>

        {/* 2. Text Content */}
        <div className="flex-1 ml-4 flex flex-col justify-center">
          <span className="text-[#0A2351] font-black text-[15px] leading-tight">
            Apply for a new Loan
          </span>
          <span className="text-slate-400 text-[11px] font-medium mt-0.5">
            Instant processing for eligible members
          </span>
        </div>

        {/* 3. Right Chevron */}
        <ChevronRight
          size={16}
          className="text-slate-300 ml-6 group-hover:translate-x-1 transition-transform"
          strokeWidth={2.5}
        />
      </motion.button>
    </div>
  );
};

const ApplicationItem = ({ reference, title, date, amount, status, onTap }) => {
  // Logic to determine color and icon based on status
  const getStatusConfig = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return {
          color: "#10B981", // Emerald
          bg: "bg-emerald-500/10",
          icon: CheckCircle2,
        };
      case "declined":
        return {
          color: "#EF4444", // Rose
          bg: "bg-red-500/10",
          icon: XCircle,
        };
      case "pending":
      default:
        return {
          color: "#F59E0B", // Amber
          bg: "bg-amber-500/10",
          icon: Clock,
        };
    }
  };

  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onTap}
      className="group cursor-pointer select-none mb-4"
    >
      <div className="relative overflow-hidden bg-white rounded-[24px] p-4 border border-[#F1F5F9] border-b-2 shadow-sm hover:shadow-md transition-all">
        {/* Subtle Anansi Teal Splash Overlay on Hover */}
        <div className="absolute inset-0 bg-[#17C6C6]/0 group-hover:bg-[#17C6C6]/[0.02] transition-colors pointer-events-none" />

        <div className="relative flex items-center gap-4">
          {/* 1. Status Indicator Icon */}
          <div
            className={`shrink-0 w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}
            style={{ color: config.color }}
          >
            <StatusIcon size={20} strokeWidth={2.5} />
          </div>

          {/* 2. Main Details */}
          <div className="flex-1 min-w-0">
            <span className="block font-mono text-slate-400 text-[10px] font-bold tracking-wider uppercase leading-none mb-1">
              {reference}
            </span>
            <h3 className="font-black text-[14px] text-[#0A2351] leading-tight truncate">
              {title}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Calendar size={11} className="text-slate-400" />
              <span className="text-slate-400 text-[11px] font-medium">
                {date}
              </span>
            </div>
          </div>

          {/* 3. Amount and Status Badge */}
          <div className="flex flex-col items-end shrink-0">
            <span className="font-mono font-black text-[14px] text-[#0A2351] tracking-tighter">
              {amount}
            </span>
            <div
              className={`mt-2 px-2.5 py-1 rounded-lg ${config.bg}`}
              style={{ color: config.color }}
            >
              <span className="text-[9px] font-black uppercase tracking-widest leading-none">
                {status}
              </span>
            </div>
          </div>

          {/* Subtle Chevron indicator for desktop */}
          <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity translate-x-1">
            <ChevronRight size={16} className="text-slate-300" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProcessStep = ({ step, label, active = false }) => (
  <div className="flex items-center gap-3">
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${active ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"}`}
    >
      {step}
    </div>
    <span
      className={`text-xs font-bold ${active ? "text-primary" : "text-slate-400"}`}
    >
      {label}
    </span>
  </div>
);

const DisclaimerItem = ({ text }) => (
  <li className="flex gap-3 items-start">
    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
    <p className="text-[11px] text-slate-500 leading-normal font-medium">
      {text}
    </p>
  </li>
);

export default LoanApplications;

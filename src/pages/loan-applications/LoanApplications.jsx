import { useState } from "react";
import {
  XCircle,
  Search,
  Plus,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle2,
  ChevronDown,
  SlidersHorizontal,
  CircleGauge,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { getLoanApplications } from "../../sdks/applications/applications";
import useAuth from "../../hooks/useAuth";
import { useToast } from "../../contexts/ToastProvider";
import { useFormatAmount } from "../../hooks/useFormatAmount";

const LoanApplications = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { showToast } = useToast();
  const [loanApplications, setLoanApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const formatAmount = useFormatAmount();

  const limitData = {
    totalLimit: 25000,
    utilized: 4250,
    apr: "7.49%",
    term: "Up to 60 Months",
    nextReview: "Oct 15, 2026",
  };

  const { isFetching } = useQuery({
    queryKey: ["all loan applications", statusFilter],
    queryFn: async () => {
      const response = await getLoanApplications(auth?.user?.id, statusFilter);
      return response?.data?.data;
    },
    onSuccess: (data) => {
      setLoanApplications(data);
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
    <div className="bg-slate-50 text-primary">
      <div className="max-w-6xl sm:px-4 mx-auto">
        {/* Header Section */}
        <header className="flex mb-3 flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-medium tracking-tight">
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
                    className="w-full pl-12 pr-4 h-12 bg-white border rounded-2xl focus:ring-2 focus:ring-secondary/20 outline-none text-sm font-bold transition-all"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="relative flex items-center group max-w-[300px]">
                  {/* Left Filter Context Icon Prefix */}
                  <div className="absolute left-4 text-slate-400 border-r border-slate-200/60 pr-3 h-4 flex items-center pointer-events-none select-none">
                    <SlidersHorizontal size={14} strokeWidth={2.5} />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full h-12 pl-12 pr-10 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-slate-500 outline-none transition-all cursor-pointer appearance-none hover:bg-slate-50/50"
                  >
                    <option value="">All Records</option>
                    <option value="pending_guarantor">
                      Pending Guarantors
                    </option>
                    <option value="approved">Approved</option>
                    <option value="eligibility_failed">
                      Failed Eligibility
                    </option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <div className="absolute right-4 text-slate-400 pointer-events-none select-none group-focus-within:text-slate-900 transition-colors">
                    <ChevronDown size={14} strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {isFetching ? (
                  <div className="p-3 overflow-y-auto">
                    {Array.from({ length: 7 }).map((_, index) => (
                      <ApplicationSkeleton key={`skeleton-${index}`} />
                    ))}
                  </div>
                ) : loanApplications.length > 0 ? (
                  <div className="border border-slate-200/80 rounded-[24px] h-[650px] p-3 overflow-y-auto space-y-3 custom-scrollbar">
                    {loanApplications.map((app) => (
                      <ApplicationItem
                        key={app.reference}
                        title={app?.loan_product?.product_name}
                        date={app?.created_at}
                        amount={app?.applied_amount}
                        status={app?.status}
                        reference={app?.application_number}
                        onTap={() =>
                          navigate(`/loan-application-details/${app?.id}`)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-[650px] bg-white rounded-[24px] border border-slate-200/60 flex flex-col items-center justify-center p-8 text-center">
                    <div className="relative mb-6 flex items-center justify-center">
                      <div className="absolute w-20 h-20 bg-slate-50 rounded-full animate-pulse" />
                      <div className="relative w-16 h-16 bg-slate-100/80 border border-slate-200/30 rounded-2xl flex items-center justify-center text-slate-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-7 h-7"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            pathLength="360"
                            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="max-w-sm space-y-2 mb-8">
                      <h3 className="text-lg font-bold text-primary tracking-tight">
                        No matching applications found
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        We couldn't find any active or past credit applications
                        linked to your current search parameters. Try adjusting
                        your filters.
                      </p>
                    </div>
                    <button
                      onClick={() => window.location.reload()}
                      className="px-6 py-3 bg-primary hover:bg-secondary text-white font-semibold rounded-xl text-xs uppercase tracking-wider transition-all active:scale-[0.98] shadow-md shadow-slate-900/5"
                    >
                      Clear Active Filters
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
          <aside className="lg:col-span-5 space-y-6">
            <ApplyLoanAction onClick={() => navigate("/loan-products")} />
            <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-3 transition-all hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
              {/* Header */}
              <div className="flex items-start mb-2 gap-4">
                <div className="p-3 bg-primary rounded-2xl text-white shrink-0">
                  <CircleGauge className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Loan Limit Details
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">
                    Based on your current financial profile.
                  </p>
                </div>
              </div>

              {/* Main Limit Hero Section */}
              <div className="bg-slate-50/50 rounded-2xl p-2 border border-slate-50">
                <span className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight block">
                  {formatAmount(limitData.totalLimit)}
                </span>
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase mt-2 block">
                  Pre-Approved Limit
                </span>
              </div>
            </div>

            {/* Vetting Process Card */}
            <div className="bg-white rounded-[32px] p-4 border border-slate-100 shadow-xl shadow-blue-900/5">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-medium text-[11px] uppercase tracking-widest text-slate-400">
                  Approval Flow for Guarantor Loans
                </h3>
              </div>
              <div className="space-y-2">
                <ProcessStep step="1" label="Member Vetting" />
                <ProcessStep step="2" label="Guarantor Verification" />
                <ProcessStep step="3" label="Credit Committee Review" />
                <ProcessStep step="4" label="Funds Disbursement" />
              </div>
            </div>

            {/* Disclaimers & Info */}
            <div className="bg-blue-50/50 rounded-[32px] p-4 border border-blue-100/100">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-medium text-[11px] uppercase tracking-widest text-slate-400">
                  Legal Information
                </h3>
              </div>
              <ul className="space-y-4">
                <DisclaimerItem text="Disbursement: Approved loans are disbursed to your linked mobile number within 24 hours of final approval." />
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
          <span className="text-[#0A2351] font-medium text-[15px] leading-tight">
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
        case "disbursed":
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
  const formatAmount = useFormatAmount();

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
            <h3 className="font-medium text-[14px] text-[#0A2351] leading-tight truncate">
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
            <span className="font-medium text-[14px] text-[#0A2351] tracking-tighter">
              {formatAmount(amount)}
            </span>
            <div
              className={`mt-2 px-3 py-2 rounded-lg flex items-center justify-center ${config.bg}`}
              style={{ color: config.color }}
            >
              <span className="text-[9px] font-medium uppercase tracking-widest leading-none">
                {status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ApplicationSkeleton = () => {
  return (
    <div className="relative overflow-hidden bg-white rounded-[24px] p-4 border border-[#F1F5F9] border-b-2 shadow-sm animate-pulse mb-4">
      <div className="relative flex items-center gap-4">
        {/* 1. Status Indicator Circle Placeholder */}
        <div className="shrink-0 w-10 h-10 rounded-full bg-slate-100" />

        {/* 2. Main Details Stack */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Reference tag space */}
          <div className="h-3 bg-slate-100 rounded-md w-20" />
          {/* Title line space */}
          <div className="h-4 bg-slate-100 rounded-md w-1/2" />
          {/* Date row space */}
          <div className="h-3 bg-slate-100 rounded-md w-1/3" />
        </div>

        {/* 3. Amount and Status Badge Stack */}
        <div className="flex flex-col items-end shrink-0 space-y-2">
          {/* Amount tag space */}
          <div className="h-4 bg-slate-100 rounded-md w-24" />
          {/* Status badge block space */}
          <div className="h-6 bg-slate-100 rounded-lg w-16" />
        </div>
      </div>
    </div>
  );
};

const ProcessStep = ({ step, label, active = false }) => (
  <div className="flex items-center gap-3">
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium ${active ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"}`}
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

import React, { useState } from "react";
import {
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  Eye,
  Smartphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "react-query";
import useAuth from "../../hooks/useAuth";
import { useToast } from "../../contexts/ToastProvider";
import { getLoans } from "../../sdks/loans/loans";
import { useFormatAmount } from "../../hooks/useFormatAmount";

const MyLoans = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { showToast } = useToast();
  const [loans, setLoans] = useState([]);
  const formatAmount = useFormatAmount();
  const [statusFilter, setStatusFilter] = useState("");

  const { isFetching } = useQuery({
    queryKey: ["all loans", statusFilter],
    queryFn: async () => {
      const response = await getLoans(auth?.user?.id, statusFilter);
      return response?.data?.data;
    },
    onSuccess: (data) => {
      setLoans(data?.loan_data);
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

  const loanStats = React.useMemo(() => {
    return (loans || []).reduce(
      (acc, loan) => {
        const status = loan?.loan_status?.toLowerCase();

        if (status === "active") {
          acc.active++;
        } else if (status === "overdue") {
          acc.overdue++;
        } else if (status === "completed" || status === "settled") {
          acc.completed++;
        }

        return acc;
      },
      { active: 0, overdue: 0, completed: 0 },
    );
  }, [loans]);

  const getLoanStatusColor = (status = "") => {
    switch (status.toLowerCase().trim()) {
      case "active":
      case "approved":
      case "servicing":
        return "#10B981"; // Emerald Green
      case "pending":
      case "processing":
      case "under_review":
        return "#F59E0B"; // Amber/Yellow
      case "defaulted":
      case "overdue":
      case "arrears":
        return "#EF4444"; // Rose/Red
      case "closed":
      case "settled":
      case "fully_paid":
        return "#64748B"; // Slate Gray
      default:
        return "#94A3B8"; // Muted Light Gray (Fallback)
    }
  };

  const formatLabel = (str) => {
    if (!str) return "";
    const spaced = str.replace(/_/g, " ");
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };

  return (
    <div className="bg-slate-50 text-primary">
      <div className="max-w-6xl sm:px-4 mx-auto">
        {/* Header */}
        <header className="py-2">
          <h1 className="text-2xl font-medium tracking-tight">My Loans</h1>
          <p className="text-slate-400 text-sm font-medium">
            Manage your active credit lines and track your path to financial
            freedom.
          </p>
        </header>

        {/* 1. Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <StatMiniCard
            label="Active"
            count={loanStats.active}
            icon={<Clock className="text-secondary" />}
          />
          <StatMiniCard
            label="Overdue"
            count={loanStats.overdue}
            icon={<AlertCircle className="text-red-500" />}
          />
          <StatMiniCard
            label="Completed"
            count={loanStats.completed}
            icon={<CheckCircle2 className="text-emerald-500" />}
          />
        </div>
        <h1 className="text-xl mt-6 mb-1 font-medium tracking-tight">
          All Loans
        </h1>

        <section>
          <div className="w-full flex items-center mb-5 justify-between">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="relative w-full w-[500px]">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search loan code or type..."
                  className="w-full pl-12 pr-4 py-3 bg-white border rounded-2xl focus:ring-2 focus:ring-secondary/20 outline-none text-sm transition-all font-bold"
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="relative flex items-center group">
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
                  <option value="active">Active</option>
                  <option value="cleared">Cleared / Paid</option>
                  <option value="defaulted">Defaulted</option>
                </select>
                <div className="absolute right-4 text-slate-400 pointer-events-none select-none group-focus-within:text-slate-900 transition-colors">
                  <ChevronDown size={14} strokeWidth={2.5} />
                </div>
              </div>
            </div>
            <ApplyLoanAction onClick={() => navigate("/loan-products")} />
          </div>

          <div className="space-y-4">
            {isFetching ? (
              /* SKELETON LOADING GRID (Matches live layout height for stability) */
              <div className="border border-slate-200/40 rounded-[24px] h-[620px] p-3 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 content-start custom-scrollbar">
                {Array.from({ length: 4 }).map((_, index) => (
                  <LoanItemSkeleton key={`loan-skeleton-${index}`} />
                ))}
              </div>
            ) : loans.length > 0 ? (
              /* LIVE LOAN DATA GRID */
              <div className="border border-slate-200/80 rounded-[24px] h-[620px] p-3 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 content-start custom-scrollbar">
                {loans.map((loan) => (
                  <LoanItem
                    key={loan?.id}
                    title={formatLabel(loan?.loan_type)}
                    id={loan?.loan_code}
                    amount={formatAmount(loan?.loan_amount)}
                    balance={formatAmount(loan?.outstanding_balance)}
                    status={loan?.loan_status}
                    statusColor={getLoanStatusColor(loan?.loan_status)}
                    maturityDate={loan?.loan_due_date}
                    onTap={() => navigate(`/loan-details/${loan?.id}`)}
                  />
                ))}
              </div>
            ) : (
              /* EMPTY STATE (Kept centered in a single workspace box) */
              <div className="h-[620px] bg-white rounded-[24px] border border-slate-200/60 flex flex-col items-center justify-center p-8 text-center">
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
                    No matching loan
                  </h3>
                  <p className="text-primary text-sm leading-relaxed">
                    We couldn't find any active or past loan linked to your
                    current search parameters. Try adjusting your filters.
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

const LoanItem = ({
  title,
  id,
  amount,
  balance,
  status,
  statusColor,
  maturityDate,
  onTap,
}) => {
  return (
    <div
      onClick={onTap}
      className="mb-4 cursor-pointer rounded-[30px] bg-white transition-all active:scale-[0.99] shadow-sm shadow-[0_12px_32px_rgba(10,35,81,0.07)] hover:shadow-[0_12px_32px_rgba(10,35,81,0.07)]"
    >
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3.5">
          <div className="flex flex-col">
            <h3 className="text-[16px] font-medium text-[#0A2351] tracking-tight">
              {title}
            </h3>
            <span className="text-[13px] font-bold text-gray-500">{id}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-extrabold text-gray-400">
              MATURITY
            </span>
            <span className="text-[12px] font-bold text-[#0A2351]">
              {maturityDate}
            </span>
          </div>
        </div>

        {/* Stats Box */}
        <div className="mx-4 flex items-center justify-between rounded-[22px] bg-[#F8FAFC] px-5 py-2 border border-gray-100/50">
          <div>
            <span className="text-[9px] font-extrabold text-gray-400 tracking-widest">
              PRINCIPAL
            </span>
            <div className="text-[15px] font-medium font-outfit text-black">
              {amount}
            </div>
          </div>
          <div className="h-8 w-[1px] bg-gray-200" />
          <div className="text-right">
            <span className="text-[9px] font-extrabold text-gray-400 tracking-widest">
              CURRENT BALANCE
            </span>
            <div className="text-[15px] font-medium font-outfit text-[#0A2351]">
              {balance}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 pt-4 pb-5">
          <div
            className="flex items-center gap-2 rounded-full px-3 py-1.5"
            style={{ backgroundColor: `${statusColor}15` }}
          >
            <div
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: statusColor }}
            />
            <span
              className="text-[10px] font-medium uppercase"
              style={{ color: statusColor }}
            >
              {status}
            </span>
          </div>

          <div className="flex items-center gap-0.5 text-[#0A2351] group">
            <span className="text-[11px] font-bold">View Details</span>
            <ChevronRight
              size={14}
              strokeWidth={3}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const LoanItemSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-[24px] p-5 border border-slate-200/60 border-b-2 shadow-sm mb-4 w-full select-none pointer-events-none">
      {/* 12-Column Grid Matrix Tracking - Matches the LoanItem Geometry Exactly */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-5 items-start lg:items-center">
        {/* COLUMN 1: ACCOUNT REFERENCE & DEBTOR PROFILE TRACK (4 Columns) */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4 flex flex-col space-y-2">
          {/* Internal Title Label Placeholder */}
          <div className="h-2 bg-slate-200 rounded-sm w-24" />
          {/* Reference Badges Row */}
          <div className="flex items-center gap-2">
            <div className="h-4 bg-slate-200 rounded-md w-14" />
            <div className="h-3.5 bg-slate-100 rounded-md w-24" />
          </div>
          {/* Debtor Name Headline */}
          <div className="h-4.5 bg-slate-100 rounded-md w-3/4" />
          {/* Smartphone Mobile Number Subtext */}
          <div className="h-3 bg-slate-100 rounded-md w-1/2" />
        </div>

        {/* COLUMN 2: PRODUCT & YIELD PARAMETERS TRACK (2 Columns) */}
        <div className="col-span-1 lg:col-span-2 flex flex-col space-y-2">
          {/* Internal Title Label Placeholder */}
          <div className="h-2 bg-slate-200 rounded-sm w-20" />
          {/* Product Name String */}
          <div className="h-4 bg-slate-100 rounded-md w-28" />
          {/* Rate and Interest Method Metadata Block */}
          <div className="flex items-center gap-1.5">
            <div className="h-4 bg-slate-100 rounded w-10" />
            <div className="h-3 bg-slate-100 rounded w-24" />
          </div>
        </div>

        {/* COLUMN 3: FINANCIAL EXPOSURE PORTFOLIO MATRIX (3 Columns) */}
        <div className="col-span-1 lg:col-span-3 flex flex-col space-y-2">
          {/* Internal Title Label Placeholder */}
          <div className="h-2 bg-slate-200 rounded-sm w-24" />
          {/* Issued Loan Principal Data Line */}
          <div className="h-3.5 bg-slate-100 rounded w-32" />
          {/* Outstanding Remaining Debt Balance Data Line */}
          <div className="h-3.5 bg-slate-100 rounded w-28" />
        </div>

        {/* COLUMN 4: LIFESPAN STAGE STATUS TRACK (2 Columns) */}
        <div className="col-span-1 lg:col-span-2 flex flex-col space-y-2">
          {/* Internal Title Label Placeholder */}
          <div className="h-2 bg-slate-200 rounded-sm w-20" />
          {/* Status Pillar Capsule Token Shape */}
          <div className="h-4.5 bg-slate-100 rounded-md w-16" />
          {/* Maturity Due Date String */}
          <div className="h-3 bg-slate-100 rounded w-24" />
        </div>

        {/* COLUMN 5: OPERATIONAL ACTION TOOLBAR OVERLAY (1 Column) */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex items-center justify-start lg:justify-end pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto self-end lg:self-auto">
          {/* View Amortization Audit Target Action Button box */}
          <div className="size-8 rounded-xl bg-slate-200 shrink-0" />
        </div>
      </div>
    </div>
  );
};

const StatMiniCard = ({ label, count, icon }) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center justify-between">
    <div>
      <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="text-3xl font-medium mt-1 text-primary">{count}</p>
    </div>
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
      {React.cloneElement(icon, { size: 28 })}
    </div>
  </div>
);

export default MyLoans;

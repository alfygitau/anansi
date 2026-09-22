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
  Layers,
  XCircle,
  Percent,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
      setLoans(data?.loan_data || []);
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

  const formatLabel = (str) => {
    if (!str) return "";
    const spaced = str.replace(/_/g, " ");
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };

  const filteredLoans = loans.filter((loan) => {
    const query = searchQuery.toLowerCase();
    const title = formatLabel(loan?.loan_type).toLowerCase();
    const code = loan?.loan_code?.toLowerCase() || "";
    return title.includes(query) || code.includes(query);
  });

  return (
    <div className="bg-slate-50 min-h-full text-primary py-6">
      <div className="max-w-6xl sm:px-4 mx-auto space-y-5">
        {/* HEADER SECTION WITH APPLY BUTTON OPPOSITE */}
        <header className="flex mb-3 flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-medium tracking-tight">My Loans</h1>
            <p className="text-slate-400 text-sm font-medium">
              Manage your active credit lines and track your path to financial
              freedom.
            </p>
          </div>
          <ApplyLoanAction onClick={() => navigate("/loan-products")} />
        </header>

        {/* QUICK STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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

        {/* SEARCH & FILTER CONTROLS BAR */}
        <div className="flex items-center w-full justify-between gap-4 flex-wrap pt-2">
          <div className="flex gap-3 w-full">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                type="text"
                placeholder="Search loan code or type..."
                className="w-full pl-12 pr-4 h-12 bg-white border rounded-2xl focus:ring-2 focus:ring-secondary/20 outline-none text-sm font-bold transition-all text-slate-800 placeholder:text-slate-400"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative flex items-center group shrink-0">
              <div className="absolute left-4 text-slate-400 border-r border-slate-200/60 pr-3 h-4 flex items-center pointer-events-none select-none">
                <SlidersHorizontal size={14} strokeWidth={2.5} />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-12 pl-12 pr-10 bg-white border border-slate-200 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-slate-500 outline-none transition-all cursor-pointer appearance-none hover:bg-slate-50/50"
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
        </div>

        {/* DATA-DENSE COMPACT ROW CONTAINER */}
        <div className="w-full">
          {isFetching ? (
            <div className="bg-white border border-slate-200/60 rounded-[24px] p-3 space-y-2 shadow-sm">
              {Array.from({ length: 4 }).map((_, index) => (
                <LoanItemSkeleton key={`loan-skeleton-${index}`} />
              ))}
            </div>
          ) : filteredLoans.length > 0 ? (
            <div className="bg-white border border-slate-200/60 rounded-[24px] p-3 space-y-4 shadow-sm">
              <AnimatePresence>
                {filteredLoans.map((loan) => (
                  <DataDenseLoanRow
                    key={loan?.id}
                    title={formatLabel(loan?.loan_type)}
                    id={loan?.loan_code}
                    amount={formatAmount(loan?.loan_amount)}
                    balance={formatAmount(
                      loan?.loan_Balance || loan?.loan_principal_balance,
                    )}
                    installmentAmount={formatAmount(
                      loan?.loan_installment_amount,
                    )}
                    interestRate={loan?.loan_interest_per}
                    status={loan?.loan_status}
                    onTap={() => navigate(`/loan-details/${loan?.id}`)}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <EmptyState
              onReset={() => {
                setSearchQuery("");
                setStatusFilter("");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* --- Sub-Components --- */

const ApplyLoanAction = ({ onClick }) => {
  return (
    <div className="w-full md:w-auto">
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -2 }}
        onClick={onClick}
        className="w-full md:w-auto text-left bg-white p-3 px-5 rounded-[20px] border border-[#0A2351]/10 flex items-center shadow-sm hover:shadow-md transition-all group shrink-0"
      >
        <div className="p-2.5 bg-[#0A2351] rounded-full text-white shrink-0 group-hover:scale-110 transition-transform duration-300">
          <Plus size={16} strokeWidth={3} />
        </div>
        <div className="flex-1 ml-3.5 flex flex-col justify-center text-left">
          <span className="text-[#0A2351] font-semibold text-[13px] leading-tight">
            Apply for a new Loan
          </span>
          <span className="text-slate-400 text-[10px] font-medium mt-0.5">
            Instant processing
          </span>
        </div>
        <ChevronRight
          size={16}
          className="text-slate-300 ml-4 group-hover:translate-x-1 transition-transform"
          strokeWidth={2.5}
        />
      </motion.button>
    </div>
  );
};

const DataDenseLoanRow = ({
  title,
  id,
  amount,
  balance,
  installmentAmount,
  interestRate,
  status = "",
  onTap,
}) => {
  const getStatusConfig = (currentStatus) => {
    switch (currentStatus?.toLowerCase().trim()) {
      case "active":
      case "approved":
      case "servicing":
        return {
          color: "text-emerald-700 bg-emerald-50 border-emerald-200/60",
          icon: CheckCircle2,
        };
      case "defaulted":
      case "overdue":
      case "arrears":
        return {
          color: "text-rose-700 bg-rose-50 border-rose-200/60",
          icon: XCircle,
        };
      case "closed":
      case "settled":
      case "fully_paid":
      case "completed":
        return {
          color: "text-slate-700 bg-slate-100 border-slate-200",
          icon: CheckCircle2,
        };
      case "pending":
      case "processing":
      default:
        return {
          color: "text-amber-700 bg-amber-50 border-amber-200/60",
          icon: Clock,
        };
    }
  };

  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.995 }}
      onClick={onTap}
      className="group cursor-pointer select-none text-left"
    >
      <div className="bg-slate-50/40 hover:bg-slate-50 px-4 py-3 rounded-xl border border-slate-200/40 hover:border-blue-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        {/* Left: Icon, Title, ID, and Interest Rate */}
        <div className="flex items-center gap-3.5 w-full md:w-[240px] shrink-0 text-left">
          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-2xs shrink-0 group-hover:text-primary transition-colors">
            <Layers size={18} />
          </div>
          <div className="space-y-0.5 text-left min-w-0">
            <h4 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-sm leading-tight text-left truncate">
              {title || "Unnamed Loan"}
            </h4>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 text-left">
              <span>{id || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Middle: Strictly Locked Left-Aligned Columns */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 w-full md:w-[420px] shrink-0 text-left text-xs border-y md:border-y-0 py-2.5 md:py-0 border-slate-200/60">
          <div className="text-left">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5 text-left">
              Principal
            </span>
            <span className="font-semibold text-slate-800 text-left block truncate">
              {amount || "0.00"}
            </span>
          </div>
          <div className="text-left">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5 text-left">
              Installment
            </span>
            <span className="font-semibold text-slate-800 text-left block truncate">
              {installmentAmount || "0.00"}
            </span>
          </div>
          <div className="text-left">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5 text-left">
              Balance
            </span>
            <span className="font-bold text-rose-600 text-left block truncate">
              {balance || "0.00"}
            </span>
          </div>
        </div>

        {/* Right: Status Badge & Chevron Action */}
        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 text-left">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${config.color}`}
          >
            <StatusIcon size={12} />
            <span>{status || "Unknown"}</span>
          </div>

          <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-2xs">
            <ChevronRight size={14} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EmptyState = ({ onReset }) => (
  <div className="h-[340px] bg-white border border-slate-200/60 rounded-[24px] flex flex-col items-center justify-center p-6 text-center shadow-sm">
    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 mb-3">
      <Clock size={22} strokeWidth={1.5} />
    </div>
    <div className="max-w-xs space-y-1 mb-4">
      <h3 className="text-sm font-bold text-slate-900 tracking-tight">
        No matching loans found
      </h3>
      <p className="text-slate-400 text-xs font-medium">
        We couldn't find any loans matching your current search parameters.
      </p>
    </div>
    <button
      onClick={onReset}
      className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl text-[11px] uppercase tracking-wider transition-all shadow-xs"
    >
      Clear Filters
    </button>
  </div>
);

const LoanItemSkeleton = () => (
  <div className="animate-pulse bg-slate-50/40 rounded-xl p-3 border border-slate-200/40 w-full flex items-center justify-between text-left">
    <div className="flex items-center gap-3.5 text-left w-[240px]">
      <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
      <div className="space-y-1.5 text-left">
        <div className="h-3.5 bg-slate-200 rounded w-28" />
        <div className="h-2 bg-slate-200 rounded w-20" />
      </div>
    </div>
    <div className="hidden md:grid grid-cols-3 gap-6 w-[420px] text-left">
      <div className="h-4 bg-slate-200 rounded w-16" />
      <div className="h-4 bg-slate-200 rounded w-16" />
      <div className="h-4 bg-slate-200 rounded w-16" />
    </div>
    <div className="h-6 bg-slate-200 rounded w-20" />
  </div>
);

const StatMiniCard = ({ label, count, icon }) => (
  <div className="bg-white p-5 rounded-[24px] border border-slate-100 flex items-center justify-between shadow-sm text-left">
    <div className="text-left">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-left">
        {label}
      </p>
      <p className="text-2xl font-bold mt-0.5 text-primary text-left">
        {count}
      </p>
    </div>
    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
      {React.cloneElement(icon, { size: 24 })}
    </div>
  </div>
);

export default MyLoans;

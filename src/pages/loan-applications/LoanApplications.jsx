import { useState } from "react";
import {
  Search,
  Plus,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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

  const { isFetching } = useQuery({
    queryKey: ["all loan applications", statusFilter],
    queryFn: async () => {
      const response = await getLoanApplications(auth?.user?.id, statusFilter);
      return response?.data?.data;
    },
    onSuccess: (data) => {
      setLoanApplications(data?.applications || []);
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

  const filteredApplications = loanApplications.filter((app) => {
    const query = searchQuery.toLowerCase();
    const productName = app?.product?.product_name?.toLowerCase() || "";
    const referenceNum = app?.application_number?.toLowerCase() || "";
    const purpose = app?.loan_purpose?.toLowerCase() || "";
    return (
      productName.includes(query) ||
      referenceNum.includes(query) ||
      purpose.includes(query)
    );
  });

  return (
    <div className="bg-slate-50 h-full text-primary py-6">
      <div className="max-w-6xl sm:px-4 mx-auto space-y-5">
        {/* HEADER SECTION WITH APPLY BUTTON OPPOSITE */}
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
          <ApplyLoanAction onClick={() => navigate("/loan-products")} />
        </header>

        {/* SEARCH & FILTER CONTROLS BAR (Standalone) */}
        <div className="flex items-center w-full justify-between gap-4 flex-wrap">
          <div className="flex gap-3 w-full">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by product, application code or purpose..."
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
                <option value="pending_guarantor">Pending Guarantors</option>
                <option value="approved">Approved</option>
                <option value="disbursed">Disbursed</option>
                <option value="eligibility_failed">Failed Eligibility</option>
                <option value="cancelled">Cancelled</option>
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
              {Array.from({ length: 6 }).map((_, index) => (
                <ApplicationSkeleton key={`skeleton-${index}`} />
              ))}
            </div>
          ) : filteredApplications.length > 0 ? (
            <div className="bg-white border border-slate-200/60 rounded-[24px] p-3 space-y-4 shadow-sm">
              <AnimatePresence>
                {filteredApplications.map((app) => (
                  <DataDenseRow
                    key={app.id}
                    app={app}
                    onTap={() =>
                      navigate(`/loan-application-details/${app?.id}`)
                    }
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
        <div className="flex-1 ml-3.5 flex flex-col justify-center">
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

const DataDenseRow = ({ app, onTap }) => {
  const formatAmount = useFormatAmount();

  const getStatusConfig = (currentStatus) => {
    switch (currentStatus?.toLowerCase()) {
      case "approved":
      case "disbursed":
      case "completed":
        return {
          color: "text-emerald-700 bg-emerald-50 border-emerald-200/60",
          icon: CheckCircle2,
        };
      case "declined":
      case "eligibility_failed":
      case "cancelled":
        return {
          color: "text-rose-700 bg-rose-50 border-rose-200/60",
          icon: XCircle,
        };
      case "pending":
      case "pending_guarantor":
      default:
        return {
          color: "text-amber-700 bg-amber-50 border-amber-200/60",
          icon: Clock,
        };
    }
  };

  const config = getStatusConfig(app.status_label || app.status);
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.995 }}
      onClick={onTap}
      className="group cursor-pointer select-none text-left"
    >
      <div className="bg-slate-50/50 hover:bg-slate-50 p-3.5 sm:px-4 rounded-xl border border-slate-200/50 hover:border-blue-300 transition-all grid grid-cols-1 md:grid-cols-12 items-center gap-3 text-xs text-left">
        {/* Col 1: Reference & Product (Span 3) - Left Aligned */}
        <div className="md:col-span-3 min-w-0 flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-2xs shrink-0 group-hover:text-primary transition-colors">
            <Layers size={16} />
          </div>
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold text-slate-400 text-left">
              <span>{app.application_number}</span>
              <span>•</span>
              <span>{app.application_date}</span>
            </div>
            <h4 className="font-bold text-slate-900 truncate group-hover:text-primary transition-colors text-sm text-left">
              {app.product?.product_name || "Loan Product"}
            </h4>
          </div>
        </div>

        {/* Col 2: Purpose & Terms (Span 3) - Left Aligned */}
        <div className="md:col-span-3 flex flex-col justify-center min-w-0 text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-left">
            Purpose & Term
          </span>
          <p className="font-semibold text-slate-700 truncate block text-left">
            {app.loan_purpose || "General"}{" "}
            <span className="text-slate-400 font-normal">
              ({app.loan_period} {app.loan_interval})
            </span>
          </p>
        </div>

        {/* Col 3: Principal Amount (Span 2) - Left Aligned */}
        <div className="md:col-span-2 flex flex-col justify-center text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-left">
            Principal
          </span>
          <div className="font-bold text-slate-900 text-sm text-left block truncate">
            {formatAmount(app.applied_amount)}
          </div>
        </div>

        {/* Col 4: Status Badge & Arrow Pushed to the End (Span 4) */}
        <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-3 text-left">
          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${config.color}`}
          >
            <StatusIcon size={12} />
            <span>{app.status_label || app.status}</span>
          </div>

          <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-2xs shrink-0">
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
        No matching applications found
      </h3>
      <p className="text-slate-400 text-xs font-medium">
        We couldn't find any records matching your filters.
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

const ApplicationSkeleton = () => (
  <div className="animate-pulse bg-slate-50/40 rounded-xl p-3.5 border border-slate-200/40 w-full flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-slate-200 shrink-0" />
      <div className="space-y-1.5">
        <div className="h-2 bg-slate-200 rounded w-24" />
        <div className="h-3.5 bg-slate-200 rounded w-36" />
      </div>
    </div>
    <div className="space-y-1.5 hidden md:block">
      <div className="h-2 bg-slate-200 rounded w-16" />
      <div className="h-3 bg-slate-200 rounded w-28" />
    </div>
    <div className="space-y-1.5">
      <div className="h-2 bg-slate-200 rounded w-12" />
      <div className="h-3.5 bg-slate-200 rounded w-20" />
    </div>
    <div className="h-6 bg-slate-200 rounded w-20" />
  </div>
);

export default LoanApplications;

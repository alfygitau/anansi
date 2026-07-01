import { useState } from "react";
import {
  Search,
  Plus,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  Smartphone,
  X,
  Eye,
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

  const { isFetching } = useQuery({
    queryKey: ["all loan applications", statusFilter],
    queryFn: async () => {
      const response = await getLoanApplications(auth?.user?.id, statusFilter);
      return response?.data?.data;
    },
    onSuccess: (data) => {
      setLoanApplications(data?.applications);
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
    <div className="bg-slate-50 h-full text-primary">
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
        <div className="w-full">
          <section className="flex flex-col gap-5">
            <div className="flex items-center w-full justify-between">
              <div className="flex gap-3">
                <div className="relative w-[500px]">
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
              <ApplyLoanAction onClick={() => navigate("/loan-products")} />
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
                      key={app.id}
                      app={app}
                      formatAmount={formatAmount}
                      navigate={navigate}
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

const ApplicationItem = ({ app, formatAmount, navigate }) => {
  const isApprovedOrDisbursed =
    app.status_label?.toLowerCase() === "approved" ||
    app?.status_label?.toLowerCase() === "disbursed";

  return (
    <motion.div
      whileTap={{ scale: 0.995 }}
      className="group bg-white rounded-[24px] p-5 border border-slate-200/60 border-b-2 shadow-sm hover:shadow-md transition-all mb-4 w-full"
    >
      {/* 12-Column Responsive Matrix Grid Track Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-5 items-start lg:items-center text-xs">
        {/* COLUMN 1: APPLICANT IDENTITY DETAILS (Spans 3 Columns on Wide Screens) */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col space-y-1.5 min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 select-none">
            Applicant Details
          </span>
          <div className="flex items-center gap-2 select-none">
            <span className="font-sans font-bold text-[9px] tracking-wider uppercase px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200/40">
              {app.application_number}
            </span>
          </div>
          <span className="font-semibold text-slate-900 text-sm tracking-tight group-hover:text-primary transition-colors truncate">
            {app.applicant_name}
          </span>
          <span className="text-[11px] text-slate-400 font-normal flex items-center gap-1 font-mono">
            <Smartphone size={11} className="text-slate-300" />{" "}
            {app.applicant_mobile}
          </span>
        </div>

        {/* COLUMN 2: FINANCIAL PRODUCT TYPE (Spans 2 Columns on Wide Screens) */}
        <div className="col-span-1 lg:col-span-2 flex flex-col space-y-1.5 min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 select-none flex items-center gap-1">
            Credit Product
          </span>
          <span className="font-semibold text-slate-800 text-sm tracking-tight truncate">
            {app.product.product_name}
          </span>
          <div className="flex items-center gap-1.5 select-none">
            <span className="font-sans font-bold text-[9px] tracking-wider uppercase px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded border border-slate-200/40 font-mono">
              {app.product.product_code}
            </span>
          </div>
        </div>

        {/* COLUMN 3: FUNDING VALUATION DETAILS (Spans 2 Columns on Wide Screens) */}
        <div className="col-span-1 lg:col-span-2 flex flex-col space-y-1.5 min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 select-none">
            Applied Capital
          </span>
          <span className="font-semibold text-slate-900 text-sm tracking-tight font-mono">
            {formatAmount(app.applied_amount)}
          </span>
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-2 select-none">
            <span>
              Tenor:{" "}
              <span className="text-slate-700 font-semibold">
                {app.loan_period} Months
              </span>
            </span>
            <span className="size-1 bg-slate-200 rounded-full" />
            <span className="text-primary font-bold text-[9px] bg-primary/5 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">
              {app.loan_channel}
            </span>
          </div>
        </div>

        {/* COLUMN 4: INTEREST PROFILE CALCULATION (Spans 2 Columns on Wide Screens) */}
        <div className="col-span-1 lg:col-span-2 flex flex-col space-y-1 min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 select-none">
            Interest Settings
          </span>
          <span className="font-semibold text-slate-900 text-sm tracking-tight">
            {parseFloat(app?.product?.interest_rate)?.toFixed(1)}%{" "}
            <span className="text-[10px] text-slate-400 font-normal lowercase">
              p.m.
            </span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium capitalize truncate">
            {app?.product?.interest_method?.replace("_", " ") ??
              "Reducing Balance"}
          </span>
        </div>

        {/* COLUMN 5: PIPELINE PROGRESS STATUS (Spans 2 Columns on Wide Screens) */}
        <div className="col-span-1 lg:col-span-2 flex flex-col space-y-1.5 min-w-0">
          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 select-none">
            Workflow Progress
          </span>
          <span className="font-semibold text-slate-800 text-sm tracking-tight truncate">
            {app.current_stage_label}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border w-fit select-none ${
              isApprovedOrDisbursed
                ? "bg-success/5 border-success/10 text-success"
                : "bg-warning/5 border-warning/10 text-warning"
            }`}
          >
            {app.status_label}
          </span>
        </div>

        {/* COLUMN 6: CONTEXT CONTROL PANEL BUTTONS (Spans 1 Column on Wide Screens) */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex items-center justify-start lg:justify-end gap-1.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto self-end lg:self-auto">
          <button
            type="button"
            onClick={() => navigate(`/loan-application-details/${app?.id}`)}
            className="size-8 rounded-xl border border-slate-200/60 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-50 hover:border-slate-300 transition-all shadow-2xs bg-white cursor-pointer"
            title="View Application Audit File"
          >
            <Eye size={14} />
          </button>

          {app.status_label?.toLowerCase() !== "approved" ||
            (app.status_label?.toLowerCase() !== "disbursed" && (
              <button
                type="button"
                className="size-8 rounded-xl border border-rose-100 flex items-center justify-center text-error hover:bg-rose-50 hover:border-rose-200 transition-all shadow-2xs bg-white cursor-pointer"
                title="Log Disapproval Veto"
              >
                <X size={14} />
              </button>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

const ApplicationSkeleton = () => {
  return (
    <div className="animate-pulse bg-white rounded-[24px] p-5 border border-slate-200/60 border-b-2 shadow-sm mb-4 w-full select-none pointer-events-none">
      {/* 12-Column Responsive Matrix Grid Framework Track Alignment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-5 items-start lg:items-center">
        {/* COLUMN 1: APPLICANT IDENTITY TRACK (3 Columns) */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col space-y-2">
          {/* Internal Header Label */}
          <div className="h-2 bg-slate-200 rounded-sm w-20" />
          {/* Code & Number Badges Row */}
          <div className="flex items-center gap-2">
            <div className="h-4 bg-slate-200 rounded-md w-16" />
            <div className="h-3 bg-slate-200 rounded-md w-20" />
          </div>
          {/* Applicant Name Title Line */}
          <div className="h-4.5 bg-slate-200 rounded-md w-3/4" />
          {/* Mobile Phone Node Line */}
          <div className="h-3 bg-slate-200 rounded-md w-1/2" />
        </div>

        {/* COLUMN 2: CREDIT PRODUCT TYPE TRACK (2 Columns) */}
        <div className="col-span-1 lg:col-span-2 flex flex-col space-y-2">
          {/* Internal Header Label */}
          <div className="h-2 bg-slate-200 rounded-sm w-16" />
          {/* Product Name Title Line */}
          <div className="h-4 bg-slate-200 rounded-md w-28" />
          {/* Product Code Frame */}
          <div className="h-3.5 bg-slate-200 rounded w-14" />
        </div>

        {/* COLUMN 3: FUNDING VALUATION DETAILS TRACK (2 Columns) */}
        <div className="col-span-1 lg:col-span-2 flex flex-col space-y-2">
          {/* Internal Header Label */}
          <div className="h-2 bg-slate-200 rounded-sm w-16" />
          {/* Principal Capital Amount Line */}
          <div className="h-4 bg-slate-200 rounded-md w-24" />
          {/* Tenor Info Metadata String Line */}
          <div className="h-3 bg-slate-200 rounded-md w-28" />
        </div>

        {/* COLUMN 4: INTEREST PROFILE CALCULATION TRACK (2 Columns) */}
        <div className="col-span-1 lg:col-span-2 flex flex-col space-y-2">
          {/* Internal Header Label */}
          <div className="h-2 bg-slate-200 rounded-sm w-20" />
          {/* Interest Rate Value Line */}
          <div className="h-4 bg-slate-200 rounded-md w-16" />
          {/* Interest Amortization Method Line */}
          <div className="h-3 bg-slate-200 rounded-md w-24" />
        </div>

        {/* COLUMN 5: PIPELINE PROGRESS STATUS TRACK (2 Columns) */}
        <div className="col-span-1 lg:col-span-2 flex flex-col space-y-2">
          {/* Internal Header Label */}
          <div className="h-2 bg-slate-200 rounded-sm w-24" />
          {/* Stage Progress Title Line */}
          <div className="h-4 bg-slate-200 rounded-md w-20" />
          {/* Operational Colored Status Badge Wrapper Box */}
          <div className="h-5 bg-slate-200 rounded-md w-16" />
        </div>

        {/* COLUMN 6: CONTEXT CONTROL PANEL BUTTONS TRACK (1 Column) */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-1 flex items-center justify-start lg:justify-end gap-1.5 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto self-end lg:self-auto">
          {/* First Control Circle Block placeholder */}
          <div className="size-8 rounded-xl bg-slate-200 shrink-0" />
          {/* Second Control Circle Block placeholder */}
          <div className="size-8 rounded-xl bg-slate-200 shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default LoanApplications;

import { useState } from "react";
import {
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  Calculator,
  ChevronRight,
  AlertTriangle,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormatAmount } from "../../hooks/useFormatAmount";
import { useQuery } from "react-query";
import { checkEligibility } from "../../sdks/applications/applications";
import useAuth from "../../hooks/useAuth";
import { useToast } from "../../contexts/ToastProvider";
import { getLoanProduct } from "../../sdks/loans/loans";

const EligibilityCheck = () => {
  const [eligible, setEligible] = useState(true);
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [loanLimit, setLoanLimit] = useState(0);
  const [savings, setSavings] = useState(0);
  const [shares, setShares] = useState(0);
  const { productId } = useParams();
  const { showToast } = useToast();
  const [eligibilityChecklist, setEligibilityChecklist] = useState([]);
  const [blockageReasons, setblockageReasons] = useState([]);
  const formatAmount = useFormatAmount();
  const [loanProduct, setLoanProduct] = useState({});

  const { isLoading } = useQuery({
    queryKey: ["check eligibility"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await checkEligibility(auth?.user?.id, productId);
      return response?.data?.data;
    },
    onSuccess: (data) => {
      setEligibilityChecklist(data?.checks);
      setblockageReasons(data?.blocking_reasons);
      setSavings(data?.total_savings);
      setShares(data?.total_shares);
      setLoanLimit(data?.limit);
      setEligible(data?.passed);
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

  const { isFetching } = useQuery({
    queryKey: ["explore product", productId],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await getLoanProduct(productId);
      return response?.data?.data;
    },
    onSuccess: (data) => {
      setLoanProduct(data);
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

  const formatLabel = (str) => {
    if (!str) return "";
    const spaced = str.replace(/_/g, " ");
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };

  if (isLoading || isFetching) {
    return <EligibilityCheckSkeleton />;
  }

  return (
    <div className="bg-[#F8FAFC] text-[#0F172A] selection:bg-blue-100">
      <div className="max-w-6xl sm:px-4 mx-auto mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-6">
          <div>
            <h1 className="text-2xl font-medium tracking-tight text-primary">
              Loan <span>Eligibility</span>
            </h1>
            <p className="text-slate-500 text-md font-medium">
              Real-time analysis for your {loanProduct?.product_name} standing.
            </p>
          </div>
          <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-semibold text-sm transition-colors group">
            Terms & Conditions
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content */}
          <main className="lg:col-span-8 space-y-6">
            <LoanLimitCard
              loanLimit={formatAmount(loanLimit)}
              checking={isLoading}
              shares={formatAmount(shares)}
              deposits={formatAmount(savings)}
            />

            {/* Requirements Grid */}
            <div className="bg-white rounded-[22px] p-4 py-2 border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Verification Checklist
                  </h3>
                  <p className="text-sm text-slate-400">
                    Automated background standing check
                  </p>
                </div>
                {isLoading && (
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {eligibilityChecklist.map((req) => (
                    <SaccoChecklistTile
                      key={req.id}
                      title={formatLabel(req?.rule)}
                      desc={req?.description}
                      isMet={req?.passed}
                    />
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            {!eligible && (
              <div className="w-full space-y-3">
                <div className="bg-white rounded-3xl p-5 border border-rose-200 shadow-sm space-y-3">
                  {/* Header Segment */}
                  <div className="flex items-center">
                    <h4 className="text-xs font-black uppercase tracking-widest text-rose-600">
                      Eligibility Gaps Detected
                    </h4>
                  </div>

                  {/* ====== LIVE API ARRAYS MAPPING LAYER ====== */}
                  <div className="space-y-2">
                    {blockageReasons?.map((reason, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2.5 p-3 bg-rose-50/50 border border-rose-100/70 rounded-xl text-xs font-semibold text-rose-950 leading-relaxed"
                      >
                        {/* Bullet dot anchor */}
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                        <span>{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Notice Card */}
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 relative overflow-hidden">
                <div className="space-y-5">
                  {/* Header: Clean Icon + Status */}
                  <div className="flex items-center gap-2">
                    <div className="p-3 bg-white border border-slate-200/60 rounded-xl shadow-sm text-amber-500">
                      <AlertTriangle size={18} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Disbursement & Fees
                    </h4>
                  </div>

                  {/* Typography Content parsed directly from API */}
                  <div>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">
                      {loanProduct?.deduct_fee_from_principal && (
                        <>
                          An upfront processing fee of{" "}
                          <span className="text-slate-900 font-bold">
                            {Number(loanProduct?.processing_fee_value).toFixed(
                              0,
                            )}
                            %
                          </span>{" "}
                          will be deducted directly from your approved
                          principal.{" "}
                        </>
                      )}
                      {loanProduct?.has_penalty && (
                        <>
                          Late repayments trigger a monthly penalty of{" "}
                          <span className="text-rose-600 font-bold">
                            {Number(loanProduct?.penalty_value).toFixed(0)}%
                          </span>{" "}
                          of outstanding value, capped at a maximum ceiling rate
                          of {Number(loanProduct?.max_penalty_rate).toFixed(0)}
                          %.
                        </>
                      )}
                    </p>
                  </div>

                  {/* Footer Metrics */}
                  <div className="pt-4 flex items-center justify-between border-t border-slate-200/60 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <Lock size={12} /> Grace Period:{" "}
                      {loanProduct?.grace_period_days} Days
                    </div>
                    {loanProduct?.allows_topup && (
                      <span className="text-slate-500">
                        Topup Min:{" "}
                        {Number(
                          loanProduct?.min_repayment_percent_for_topup,
                        ).toFixed(0)}
                        % Paid
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ====== CARD 2: CAPACITY & PIPELINE LOGIC ====== */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 relative overflow-hidden">
                <div className="space-y-5">
                  {/* Icon Wrapper */}
                  <div className="flex items-center gap-2">
                    <div className="p-3 bg-white border border-slate-200/60 rounded-xl shadow-sm text-slate-500 w-fit">
                      <Calculator size={18} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">
                      Capacity & Approval Logic
                    </h4>
                  </div>
                  {/* Content */}
                  <div>
                    <p className="text-slate-500 text-xs leading-relaxed font-medium">
                      Your borrowing ceiling is restricted up to a strict{" "}
                      <span className="text-slate-900 font-bold">
                        {Number(loanProduct?.max_loan_to_shares_ratio).toFixed(
                          0,
                        )}
                        x Shares Multiplier
                      </span>
                      . This facility requires dynamic collateral evaluation and
                      an active lifecycle sign-off passing through{" "}
                      <span className="text-slate-900 font-bold">
                        {loanProduct?.committee_approvals_required} Credit
                        Committee signatures
                      </span>
                      .
                    </p>
                  </div>

                  {/* Action Link Anchor */}
                  <div className="inline-flex items-center gap-2 w-full px-2 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl transition-all hover:bg-slate-50 cursor-pointer shadow-sm group">
                    <Users size={12} className="text-slate-400" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Requires {loanProduct?.min_guarantors}-
                      {loanProduct?.max_guarantors} Guarantors
                    </span>
                    <ChevronRight
                      size={12}
                      className="text-slate-400 group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                </div>
              </div>

              <button
                disabled={isLoading || !eligible}
                onClick={() => navigate(`/apply-loan/${productId}`)}
                className={`relative group py-4 w-full rounded-2xl font-medium text-white overflow-hidden transition-all active:scale-95 ${
                  isLoading || !eligible
                    ? "bg-slate-200 cursor-not-allowed"
                    : "bg-primary hover:bg-secondary"
                }`}
              >
                <span className="relative z-10 w-full flex justify-center items-center gap-3 uppercase tracking-wider text-sm">
                  Start Application <ArrowRight size={18} />
                </span>
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

/* --- PREMIUM SUB-COMPONENTS --- */
const EligibilityCheckSkeleton = () => {
  return (
    <div className="bg-[#F8FAFC] min-h-screen animate-pulse select-none pb-20">
      <div className="max-w-6xl sm:px-4 mx-auto py-2">
        {/* Header Section Placeholder */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-6">
          <div className="space-y-2 w-full md:w-1/2">
            <div className="h-7 bg-slate-200 rounded-xl w-1/2" />
            <div className="h-4 bg-slate-200 rounded-lg w-3/4" />
          </div>
          <div className="h-4 bg-slate-100 rounded w-28 hidden md:block" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area Placeholder */}
          <main className="lg:col-span-8 space-y-6">
            {/* Borrowing Capacity Main Gradient Card Mock */}
            <div className="rounded-[35px] p-8 bg-slate-200 h-[190px] flex flex-col justify-between items-center">
              <div className="h-3 bg-slate-300 rounded w-36" />
              <div className="h-10 bg-slate-300 rounded-xl w-52" />
              <div className="w-full h-px bg-slate-300/60 my-2" />
              <div className="w-full flex justify-between items-center px-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center space-y-2">
                    <div className="h-2.5 bg-slate-300 rounded w-16" />
                    <div className="h-4 bg-slate-300 rounded w-20" />
                  </div>
                ))}
              </div>
            </div>

            {/* Verification Checklist Container Mock */}
            <div className="bg-white rounded-[22px] p-6 border border-slate-100 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 w-1/3">
                  <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-3 bg-slate-100 rounded-md w-full" />
                </div>
                <div className="h-8 bg-slate-100 rounded-2xl w-28" />
              </div>

              {/* 2-Column Grid Item Checklists Mocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-start p-5 bg-white border border-slate-100 rounded-[24px]"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0 mr-4" />
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="h-3.5 bg-slate-200 rounded-md w-1/2" />
                        <div className="h-2.5 bg-slate-100 rounded w-10" />
                      </div>
                      <div className="h-3 bg-slate-100 rounded-md w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Sidebar Area Placeholder */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Notice Card 1: Disbursement Mock */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white border border-slate-200/60 rounded-xl shrink-0" />
                <div className="h-3 bg-slate-200 rounded w-28" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-5/6" />
                <div className="h-3 bg-slate-100 rounded w-11/12" />
              </div>
              <div className="pt-4 border-t border-slate-200/60 flex justify-between">
                <div className="h-2.5 bg-slate-200 rounded w-24" />
                <div className="h-2.5 bg-slate-200 rounded w-16" />
              </div>
            </div>

            {/* Notice Card 2: Capacity & Committee Mock */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white border border-slate-200/60 rounded-xl shrink-0" />
                <div className="h-3 bg-slate-200 rounded w-36" />
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-4/5" />
              </div>
              <div className="h-9 bg-white border border-slate-200 rounded-xl w-full" />
            </div>

            {/* Primary Submit Button Action Mock */}
            <div className="w-full h-14 bg-slate-200 rounded-2xl" />
          </aside>
        </div>
      </div>
    </div>
  );
};

const LoanLimitCard = ({
  loanLimit,
  checking,
  deposits,
  shares,
  multiplier = "N/A",
}) => {
  return (
    <div className="relative overflow-hidden rounded-[35px] p-3 bg-gradient-to-br from-[#0A2351] to-[#1B3C73]">
      {/* Content Container */}
      <div className="flex flex-col items-center text-center">
        {/* Label - Teal Accent */}
        <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#17C6C6] mb-2">
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
            <h2 className="text-3xl md:text-3xl font-medium tracking-tighter text-white">
              {loanLimit || "KES 0.00"}
            </h2>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-white/10 my-6" />

        {/* Stats Row */}
        <div className="w-full flex justify-between items-center px-2">
          <HeaderStat label="Total Savings" value={deposits} />
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
    <span className="text-sm font-medium text-white">{value}</span>
  </div>
);

const SaccoChecklistTile = ({ title, desc, status, isMet }) => {
  // Logic for colors and icons based on status
  const iconColor = isMet ? "#17C6C6" : "#F59E0B";

  const Icon = isMet ? CheckCircle2 : AlertTriangle;

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
          <h4 className="text-[14px] font-semibold text-[#0A2351] tracking-tight">
            {title}
          </h4>

          <span
            className="text-[9px] font-medium uppercase tracking-widest"
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

export default EligibilityCheck;

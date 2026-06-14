import React, { useState } from "react";
import {
  Smartphone,
  Clock,
  CheckCircle2,
  CreditCard,
  FileStack,
  ClipboardList,
  LayoutGrid,
  ChevronRight,
  CalendarX,
  CircleCheck,
  AlertCircle,
  Receipt,
  RefreshCw,
} from "lucide-react";
import RepayAmount from "../../components/loans/RepayAmount";
import AddRepayAmount from "../../components/loans/AddRepayAmount";
import ConfirmRepayDetails from "../../components/loans/ConfirmRepayDetails";
import AwaitLoanPayment from "../../components/loans/AwaitLoanPayment";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import {
  getLoan,
  pollLoanRepaymentStatus,
  repayLoan,
} from "../../sdks/loans/loans";
import { useToast } from "../../contexts/ToastProvider";
import { useFormatAmount } from "../../hooks/useFormatAmount";
import useAuth from "../../hooks/useAuth";
import Schedule from "../../components/schedule/Schedule";

const LoanDetails = () => {
  const { id } = useParams();
  const [loan, setLoan] = useState({});
  const { showToast } = useToast();
  const formatAmount = useFormatAmount();
  const { auth } = useAuth();

  const { refetch, isFetching } = useQuery({
    queryKey: ["get loan", id],
    queryFn: async () => {
      const response = await getLoan(id);
      return response.data.data;
    },
    onSuccess: (data) => {
      setLoan(data);
    },
    onError: (error) => {
      showToast({
        title: "Application Failure",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const navigate = useNavigate();
  const [showRepayAmount, setShowRepayAmount] = useState(false);
  const [showAddRepayAmount, setShowAddRepayAmount] = useState(false);
  const [showConfirmRepayDetails, setShowConfirmRepayDetails] = useState(false);
  const [showAwaitLoanPayment, setShowAwaitLoanPayment] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState({});
  const [paymentId, setPaymentId] = useState("");

  const [formData, setFormData] = useState({
    phone: auth?.user?.mobileno,
    amount: "",
    accountType: "loan",
  });

  const generateUniqueId = () => {
    return crypto.randomUUID();
  };

  const { mutate, isLoading } = useMutation({
    mutationKey: ["repay loan"],
    mutationFn: async () => {
      const response = await repayLoan(
        loan?.id,
        formData?.amount,
        formData?.phone,
        loan?.loan_code,
        generateUniqueId(),
      );
      return response?.data?.data;
    },
    onSuccess: (data) => {
      setPaymentId(data?.id);
      setShowConfirmRepayDetails(false);
      setShowAwaitLoanPayment(true);
    },
    onError: (error) => {
      showToast({
        title: "Application Failure",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  useQuery({
    queryKey: ["poll loan repayment"],
    queryFn: async () => {
      const response = await pollLoanRepaymentStatus(paymentId);
      return response.data.data?.terminal;
    },
    enabled: !!showAwaitLoanPayment,
    onSuccess: async (data) => {
      if (data) {
        setShowAwaitLoanPayment(false);
        refetch();
      }
    },
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
    onErrors: (error) => {
      showToast({
        title: "Authentication glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  if (isFetching) {
    return <LoanDetailsSkeleton />;
  }

  return (
    <>
      <Schedule
        isOpen={showSchedule}
        onClose={() => setShowSchedule(false)}
        scheduleData={selectedSchedule}
        onPaymentTrigger={() => {
          setShowSchedule(false);
          setShowRepayAmount(true);
        }}
      />
      <RepayAmount
        isOpen={showRepayAmount}
        onClose={() => setShowRepayAmount(false)}
        loanData={loan}
        setFormData={setFormData}
        onProceed={() => {
          setShowRepayAmount(false);
          setShowConfirmRepayDetails(true);
        }}
        onCustomContinue={() => {
          setShowRepayAmount(false);
          setShowAddRepayAmount(true);
        }}
      />
      <AddRepayAmount
        isOpen={showAddRepayAmount}
        onClose={() => setShowAddRepayAmount(false)}
        formData={formData}
        setFormData={setFormData}
        onContinue={() => {
          setShowAddRepayAmount(false);
          setShowConfirmRepayDetails(true);
        }}
      />
      <ConfirmRepayDetails
        isOpen={showConfirmRepayDetails}
        onClose={() => setShowConfirmRepayDetails(false)}
        amount={formData?.amount ?? 0}
        phoneNumber={formData?.phone ?? ""}
        onConfirm={mutate}
        isProcessing={isLoading}
      />

      <AwaitLoanPayment
        isOpen={showAwaitLoanPayment}
        onClose={() => setShowAwaitLoanPayment(false)}
      />
      <div className="bg-slate-50 text-primary">
        <div className="max-w-6xl sm:px-4 mx-auto">
          {loan?.loan_status === "Overdue" && (
            <div className="w-full bg-white border border-rose-100/80 border-l-[10px] border-l-rose-600 mb-3 p-3 py-2 pl-5 flex flex-col gap-5">
              <div className="flex items-center gap-5 flex-1">
                {/* Premium Soft-Tinted Center-Aligned Icon */}
                <div className="bg-rose-50/80 border border-rose-100/50 p-3 rounded-[16px] text-rose-600 shrink-0 flex items-center justify-center self-center">
                  <AlertCircle className="w-5 h-5 stroke-[2.25]" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center">
                    <span className="text-[11px] font-bold tracking-widest text-rose-600 uppercase">
                      Overdue Notice
                    </span>
                  </div>
                  <p className="text-[14px] text-zinc-500 leading-relaxed w-full">
                    Your outstanding balance of{" "}
                    <span className="font-semibold text-zinc-900">
                      KES 14,200
                    </span>{" "}
                    for your active facility was due on{" "}
                    <span className="font-semibold text-zinc-900">
                      October 12, 2026
                    </span>
                    . To safeguard your excellent financial standing within the
                    Sacco, we kindly request that you settle this balance
                    promptly. Resolving this immediately will protect your
                    high-tier credit rating and continued borrowing.
                  </p>
                  <button
                    onClick={() => setShowRepayAmount(true)}
                    className="w-fit px-6 h-[40px] bg-primary hover:opacity-90 text-white text-[13px] font-medium rounded-[10px] flex items-center justify-center transition-all active:scale-[0.98] shadow-sm shadow-primary/10 tracking-wide mt-2"
                  >
                    Make Payment
                  </button>
                </div>
              </div>
            </div>
          )}

          <header>
            <div className="flex justify-between items-end">
              <h1 className="text-2xl font-medium tracking-tight">
                {loan?.loan_product?.product_name}
              </h1>
              {(() => {
                const getLoanStatusTheme = (status = "") => {
                  switch (status.toLowerCase().trim()) {
                    case "active":
                    case "approved":
                    case "servicing":
                    case "fully_paid":
                      return "bg-emerald-50 border-emerald-200/60 text-emerald-700";
                    case "pending":
                    case "processing":
                    case "under_review":
                      return "bg-amber-50 border-amber-200/60 text-amber-700";
                    case "defaulted":
                    case "overdue":
                    case "arrears":
                      return "bg-rose-50 border-rose-200/60 text-rose-700";
                    case "cancelled":
                    case "voided":
                    case "closed":
                      return "bg-slate-50 border-slate-200/60 text-slate-600";
                    default:
                      return "bg-slate-50 border-slate-200/60 text-slate-500";
                  }
                };
                const themeClasses = getLoanStatusTheme(loan?.loan_status);
                return (
                  <div
                    className={`px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-[0.1em] transition-all duration-300 select-none ${themeClasses}`}
                  >
                    <span>{loan?.loan_status || "Unknown"}</span>
                  </div>
                );
              })()}
            </div>
          </header>
          <div className="flex flex-col lg:flex-row gap-6 py-3 w-full">
            <div className="flex-1 min-w-[320px] bg-gradient-to-br from-[#0A2351] to-[#152E5F] rounded-[35px] p-7 shadow-[0_15px_30px_rgba(10,35,81,0.15)] text-white">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#17C6C6] text-[10px] font-medium tracking-[1.8px] uppercase">
                  {loan?.loan_product?.product_name}
                </span>
                {(() => {
                  const getTranslucentTheme = (status = "") => {
                    switch (status.toLowerCase().trim()) {
                      case "active":
                      case "approved":
                      case "servicing":
                      case "fully_paid":
                        return "bg-emerald-500/15 border-emerald-400/30 text-emerald-400";
                      case "pending":
                      case "processing":
                      case "under_review":
                        return "bg-amber-500/15 border-amber-400/30 text-amber-400";
                      case "defaulted":
                      case "overdue":
                      case "arrears":
                        return "bg-rose-500/15 border-rose-400/30 text-rose-400";
                      case "cancelled":
                      case "voided":
                      case "closed":
                      default:
                        return "bg-white/10 border-white/20 text-slate-300";
                    }
                  };
                  const dynamicTheme = getTranslucentTheme(loan?.loan_status);
                  return (
                    <div
                      className={`px-2.5 py-1 rounded-lg border flex items-center justify-center backdrop-blur-md transition-all duration-300 select-none ${dynamicTheme}`}
                    >
                      <span className="text-[8px] font-black uppercase tracking-wider leading-none">
                        {loan?.loan_status || "Unknown"}
                      </span>
                    </div>
                  );
                })()}
              </div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                  <span className="text-white/50 text-[10px] font-extrabold tracking-[1.2px] uppercase">
                    Current Balance
                  </span>
                  <h2 className="text-[28px] font-medium mt-1 leading-none">
                    {formatAmount(loan?.loan_Balance)}
                  </h2>
                </div>
                <div className="p-2.5 bg-white/10 rounded-full">
                  <LayoutGrid size={20} className="text-white" />
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white/70 text-[13px] font-semibold">
                    Repayment Progress
                  </span>
                  <span className="text-[#17C6C6] text-[13px] font-medium">
                    {Number(loan?.repayment_progress_percent).toFixed(2)}%
                  </span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#17C6C6] h-full rounded-full"
                    style={{
                      width: `${Number(loan?.repayment_progress_percent)}%`,
                    }}
                  />
                </div>
              </div>
              <hr className="border-white/10 my-4" />
              <div className="flex justify-between items-center">
                <MiniDetail label="Loan ID" value={loan?.loan_code} />
                <MiniDetail
                  label="Interest"
                  value={`${Number(loan?.loan_interest_per ?? 0)?.toFixed(0)}% / Month`}
                />
                <MiniDetail
                  label="Period"
                  value={`${loan?.loan_period} Month(s)`}
                />
              </div>
            </div>
            <div className="flex-1 min-w-[320px] bg-[#17C6C6]/5 border border-[#17C6C6]/10 rounded-[24px] p-6 flex flex-col justify-center">
              <div className="space-y-4">
                <PaymentRow
                  label="Principal Amount"
                  value={formatAmount(loan?.next_payment?.balance_due ?? 0)}
                />
                <PaymentRow
                  label="Interest Charged"
                  value={formatAmount(loan?.next_payment?.interest_due ?? 0)}
                />
                <PaymentRow label="Penalty" value="KES 0.00" />

                <hr className="border-black/10 my-3" />

                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-medium text-slate-900">
                    Total Due ({loan?.next_payment?.due_date})
                  </span>
                  <span className="text-[16px] font-medium text-teal-900">
                    {formatAmount(loan?.next_payment?.balance_due ?? 0)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowRepayAmount(true)}
                className="mt-6 w-full py-4 bg-secondary text-white rounded-xl font-medium text-[12px] uppercase tracking-widest active:scale-[0.98] transition-transform"
              >
                Pay Installment
              </button>
            </div>
          </div>

          <section className="mb-6 mt-4">
            {/* Modern full-width dashboard layout grid section wrapper */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
              <QuickActionButton
                icon={<CreditCard />}
                label="Pay Loan"
                sub="Direct M-PESA"
                description="Instant loan repayment via STK"
                onClick={() => setShowRepayAmount(true)}
                variant="blue"
              />
              <QuickActionButton
                icon={<FileStack />}
                label="Statements"
                sub="View Ledger"
                description="Export certified transaction history."
                onClick={() => navigate("/statements")}
                variant="blue"
              />
              <QuickActionButton
                icon={<ClipboardList />}
                label="Loans Applications"
                sub="Check Status"
                description="Track the real-time milestone"
                onClick={() => navigate("/all-loan-applications")}
                variant="blue"
              />
              <QuickActionButton
                icon={<LayoutGrid />}
                label="Other Products"
                sub="Explore More"
                description="Browse custom loan products."
                onClick={() => navigate("/loan-products")}
                variant="blue"
              />
            </div>
          </section>
          {/* 2. Split View: Schedule & Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-3">
            {/* Left Side: Schedule (Stepper) */}
            <div className="md:col-span-6">
              <h3 className="text-[13px] font-medium uppercase text-slate-400 mb-2">
                Repayment Progress
              </h3>
              {loan?.schedules?.length === 0 ? (
                <div className="flex h-[600px] flex-col items-center justify-center py-12 px-6 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-100">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center shadow-sm mb-4">
                    <CalendarX
                      size={32}
                      strokeWidth={1.5}
                      className="text-slate-300"
                    />
                  </div>
                  <h3 className="text-[16px] font-bold text-slate-900 mb-1">
                    No Schedule Found
                  </h3>
                  <p className="text-[13px] text-slate-500 max-w-[200px] leading-relaxed">
                    Your repayment schedule will appear here once the loan is
                    approved.
                  </p>
                </div>
              ) : (
                <div className="w-full h-[600px] border rounded-[32px] p-4 overflow-y-auto">
                  <LoanScheduleList
                    installments={loan?.schedules ?? []}
                    onSelectInstallment={(schedule) => {
                      setSelectedSchedule(schedule);
                      setShowSchedule(true);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Right Side: Transactions */}
            <div className="md:col-span-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-[13px] font-medium uppercase text-slate-400">
                  Transactions
                </h3>
                <button className="text-[13px] font-medium tracking-widest text-primary hover:underline flex items-center gap-1">
                  Download Statement
                </button>
              </div>
              <div className="space-y-3 w-full h-[600px] border p-2 rounded-[32px] overflow-y-auto custom-scrollbar">
                {loan?.repayments && loan.repayments.length > 0 ? (
                  loan.repayments.map((tx) => (
                    <MPesaTransactionRow
                      key={tx.id || tx.transaction_ref}
                      tx={tx}
                      loan={loan}
                    />
                  ))
                ) : (
                  <div className="h-full bg-white h-[600px] rounded-[32px] border border-slate-100 flex flex-col items-center justify-center text-center shadow-sm select-none animate-fade-in">
                    {/* Visual Asset Container */}
                    <div className="relative mb-6 flex items-center justify-center">
                      {/* Soft Ambient Background Pulse Ring */}
                      <div className="absolute w-24 h-24 bg-slate-50 rounded-full animate-pulse" />

                      {/* Central Card Housing */}
                      <div className="relative w-16 h-16 bg-slate-50 border border-slate-200/40 rounded-2xl flex items-center justify-center text-slate-400 shadow-inner">
                        <Receipt
                          size={28}
                          strokeWidth={1.75}
                          className="text-slate-400"
                        />

                        {/* Subtle Accent Notification Dot */}
                        <span className="absolute top-1 right-1 flex h-2 w-2">
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-300"></span>
                        </span>
                      </div>
                    </div>

                    {/* Typography Copy Stack */}
                    <div className="max-w-xs space-y-2 mb-6">
                      <h3 className="text-[16px] font-bold text-[#0A2351] tracking-tight">
                        No transactions recorded
                      </h3>
                      <p className="text-slate-400 text-[12px] font-medium leading-relaxed">
                        There are no mobile money repayments or processing logs
                        linked to this credit line facility yet.
                      </p>
                    </div>

                    {/* Interactive Activity Poll Action */}
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="group flex items-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-[#0A2351] border border-slate-200/80 font-semibold rounded-xl text-[11px] uppercase tracking-wider transition-all active:scale-[0.98]"
                    >
                      <RefreshCw
                        size={12}
                        className="text-slate-500 group-hover:rotate-180 transition-transform duration-500"
                      />
                      Refresh Ledger
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* --- Sub-Component: QuickActionButton --- */
const QuickActionButton = ({
  icon,
  label,
  sub,
  description,
  onClick,
  variant,
}) => {
  // Map your color tokens to match the premium dashboard accent states
  const themes = {
    emerald: {
      border:
        "hover:border-emerald-200 hover:shadow-[0_8px_24px_rgba(16,185,129,0.04)]",
      icon: "group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500",
      accent: "bg-emerald-500",
      text: "group-hover:text-emerald-600",
    },
    blue: {
      border:
        "hover:border-blue-200 hover:shadow-[0_8px_24px_rgba(59,130,246,0.04)]",
      icon: "group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500",
      accent: "bg-blue-500",
      text: "group-hover:text-blue-600",
    },
    purple: {
      border:
        "hover:border-purple-200 hover:shadow-[0_8px_24px_rgba(147,51,234,0.04)]",
      icon: "group-hover:bg-purple-500 group-hover:text-white group-hover:border-purple-500",
      accent: "bg-purple-500",
      text: "group-hover:text-purple-600",
    },
    slate: {
      border:
        "hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(100,116,139,0.04)]",
      icon: "group-hover:bg-slate-700 group-hover:text-white group-hover:border-slate-700",
      accent: "bg-slate-700",
      text: "group-hover:text-slate-700",
    },
  };

  const currentTheme = themes[variant] || themes.slate;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex items-center justify-between p-3.5 cursor-pointer bg-white border border-slate-200 rounded-xl transition-all duration-200 select-none overflow-hidden h-[76px] active:scale-[0.99] w-full text-left ${currentTheme.border}`}
    >
      {/* Content Cluster: Icon Plate + Text Wrapper Side-by-Side */}
      <div className="flex items-center gap-3 min-w-0 pl-1">
        {/* Compact Dynamic Icon Plate */}
        <div
          className={`w-10 h-10 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center border border-slate-100 transition-all duration-300 ${currentTheme.icon}`}
        >
          {React.cloneElement(icon, {
            size: 16,
            strokeWidth: 2.2,
            className:
              "shrink-0 transition-transform duration-200 group-hover:scale-105",
          })}
        </div>

        {/* Text Blocks (Safely truncated to protect layout grid scaling properties) */}
        <div className="flex flex-col min-w-0">
          {/* Tag Subheading line element above main label */}
          <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-400 leading-none mb-0.5">
            {sub}
          </span>
          <h4 className="block text-[12px] font-bold text-slate-800 tracking-tight leading-snug transition-colors group-hover:text-[#074073] truncate">
            {label}
          </h4>
          <p className="block text-[10px] text-slate-400 font-medium tracking-tight leading-normal truncate pr-2">
            {description}
          </p>
        </div>
      </div>

      {/* Fine Minimalist Trailing Arrow */}
      <div
        className={`text-slate-300 group-hover:translate-x-0.5 transition-all duration-200 shrink-0 pr-1 ${currentTheme.text}`}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
};

const MiniDetail = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-white/50 text-[9px] font-bold uppercase tracking-wider">
      {label}
    </span>
    <span className="text-[12px] font-medium text-white">{value}</span>
  </div>
);

const PaymentRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-[13px] font-medium text-slate-500">{label}</span>
    <span className="text-[13px] font-bold text-slate-900">{value}</span>
  </div>
);

const MPesaTransactionRow = ({ tx, loan }) => {
  const isDisbursement = tx?.type?.includes("Disbursement");
  const formatAmount = useFormatAmount();

  return (
    <div className="group cursor-pointer p-5 bg-white border border-slate-200 rounded-[28px] hover:border-[#3EB344]/30 transition-all flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* M-PESA Branded Icon Container */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
            isDisbursement
              ? "bg-blue-50 text-primary"
              : "bg-[#3EB344]/10 text-[#3EB344]"
          }`}
        >
          <Smartphone size={22} strokeWidth={2.5} />
        </div>

        <div>
          <span className="text-[12px] font-bold text-slate-500 rounded uppercase">
            {loan.loan_code}
          </span>
          <h4 className="text-sm text-primary">Loan Repayment</h4>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
              {tx.transaction_ref}
            </span>
            <span className="text-[10px] text-slate-300">•</span>
            <span className="text-[10px] text-slate-400 font-medium">
              {tx.payment_date}
            </span>
          </div>
        </div>
      </div>

      <div className="text-right">
        {/* Color polarity: Blue for money in, Green for repayments */}
        <p
          className={`text-sm font-medium ${isDisbursement ? "text-primary" : "text-[#3EB344]"}`}
        >
          {isDisbursement ? "+" : "-"}
          {formatAmount(tx.amount_paid)}
        </p>
        <div className="flex items-center justify-end gap-1 mt-0.5">
          <span className="text-[9px] font-medium uppercase text-slate-300 tracking-tighter">
            Verified
          </span>
          <CheckCircle2 size={10} className="text-[#3EB344]" />
        </div>
      </div>
    </div>
  );
};

const LoanScheduleList = ({ installments = [], onSelectInstallment }) => {
  const ordinals = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
  const formatAmount = useFormatAmount();

  return (
    <div className="flex flex-col gap-3">
      {installments.map((item, index) => {
        const isPaid = item.status === "PAID";
        const label = `${ordinals[index] || index + 1 + "th"} Installment`;
        const isOverdue = item.status === "OVERDUE";
        return (
          <div
            key={index}
            onClick={() => !isPaid && onSelectInstallment?.(item)}
            className={`
              group flex items-center p-[18px] rounded-[24px] bg-white border transition-all
              ${isPaid ? "opacity-60 border" : "opacity-100 border-[#F1F4F8] hover:border-[#17C6C6] cursor-pointer active:scale-[0.98] shadow-[0_4px_10px_rgba(0,0,0,0.02)]"}
            `}
          >
            {/* Status Marker */}
            <div className="z-10 mr-4 flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-100 shadow-sm">
              {isPaid ? (
                <CircleCheck
                  size={18}
                  className="text-[#17C6C6]"
                  strokeWidth={2.5}
                />
              ) : isOverdue ? (
                <AlertCircle size={18} className="text-red-500 animate-pulse" />
              ) : (
                <Clock size={16} className="text-slate-400" />
              )}
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col min-w-0">
              <span
                className={`
                text-[14px] font-medium truncate
                ${isPaid ? "line-through text-slate-400" : "text-[#0A2351]"}
              `}
              >
                {label}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Due: {item.due_date}
              </span>
            </div>

            {/* Amount & Status Badge */}
            <div className="flex flex-col items-end shrink-0 ml-4">
              <span
                className={`text-[14px] font-medium ${isPaid ? "text-slate-400" : "text-slate-900"}`}
              >
                {formatAmount(item.total_due ?? 0)}
              </span>
              {isPaid ? (
                <span className="text-[9px] font-medium text-[#17C6C6] tracking-wider uppercase">
                  SUCCESS
                </span>
              ) : (
                <span className="text-[9px] flex items-center">
                  PENDING &nbsp;
                  <ChevronRight size={14} className="text-slate-300" />
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const LoanDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 animate-pulse select-none pb-20">
      <div className="max-w-6xl sm:px-4 mx-auto py-2">
        {/* Navigation & Header Placeholder */}
        <header className="mb-4">
          <div className="flex justify-between items-end">
            <div className="space-y-2 w-full md:w-1/3">
              {/* Product Name Line */}
              <div className="h-7 bg-slate-200 rounded-xl w-3/4" />
              {/* Loan ID Subtext */}
              <div className="h-3.5 bg-slate-200 rounded-lg w-1/2" />
            </div>
            {/* Top Status Capsule Pill */}
            <div className="h-8 bg-slate-200 rounded-xl w-24" />
          </div>
        </header>

        {/* Top Feature Split Layout */}
        <div className="flex flex-col lg:flex-row gap-6 py-5 w-full">
          {/* Left Side: Gradient Card Shell Mock */}
          <div className="flex-1 min-w-[320px] bg-slate-200 h-[260px] rounded-[35px] p-7 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <div className="h-3.5 bg-slate-300 rounded w-1/3" />
              <div className="h-5 bg-slate-300 rounded-lg w-16" />
            </div>

            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <div className="h-3 bg-slate-300 rounded w-20" />
                <div className="h-8 bg-slate-300 rounded-xl w-40" />
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-300 shrink-0" />
            </div>

            {/* Progress Bar Mock */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="h-3 bg-slate-300 rounded w-28" />
                <div className="h-3 bg-slate-300 rounded w-8" />
              </div>
              <div className="w-full bg-slate-300/50 h-2 rounded-full" />
            </div>

            <hr className="border-slate-300/30" />

            <div className="flex justify-between items-center">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-2 bg-slate-300 rounded w-10" />
                  <div className="h-3 bg-slate-300 rounded w-14" />
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Quick Repay Invoice Mock */}
          <div className="flex-1 min-w-[320px] bg-white border border-slate-200/60 rounded-[24px] p-6 flex flex-col justify-between">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-3.5 bg-slate-100 rounded w-1/3" />
                  <div className="h-3.5 bg-slate-200 rounded w-24" />
                </div>
              ))}
              <hr className="border-slate-100 my-3" />
              <div className="flex justify-between items-center">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-5 bg-slate-200 rounded w-28" />
              </div>
            </div>
            {/* Pay Button Placeholder */}
            <div className="mt-6 w-full h-11 bg-slate-200 rounded-xl" />
          </div>
        </div>

        {/* 4x1 Dashboard Quick Action Buttons Grid */}
        <section className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="p-5 bg-white border border-slate-100 rounded-[32px] shadow-sm flex flex-col items-start relative h-[140px]"
              >
                <div className="w-12 h-12 rounded-[20px] bg-slate-100 mb-4" />
                <div className="space-y-2 w-3/4">
                  <div className="h-3.5 bg-slate-200 rounded w-full" />
                  <div className="h-2.5 bg-slate-100 rounded w-2/3" />
                </div>
                <div className="absolute right-6 bottom-6 w-4 h-4 bg-slate-100 rounded-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Split Pane Ledger View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-3">
          {/* Bottom Left Column: Stepper Milestones List */}
          <div className="md:col-span-6 space-y-3">
            <div className="h-3 bg-slate-200 rounded w-36 mb-4" />
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center p-[18px] bg-white rounded-[24px] border border-slate-100 shadow-sm"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 shrink-0 mr-4" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-3 bg-slate-100 rounded w-1/4" />
                </div>
                <div className="space-y-2 items-end flex flex-col shrink-0 ml-4">
                  <div className="h-4 bg-slate-200 rounded w-20" />
                  <div className="h-2.5 bg-slate-100 rounded w-12" />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Right Column: Ledger Transaction Items */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex justify-between items-center mb-4">
              <div className="h-3 bg-slate-200 rounded w-36" />
              <div className="h-3 bg-slate-200 rounded w-28" />
            </div>
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="p-5 bg-white border border-slate-200 rounded-[28px] flex items-center justify-between"
              >
                <div className="flex items-center gap-4 w-2/3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                    <div className="flex gap-2">
                      <div className="h-3.5 bg-slate-100 rounded w-16" />
                      <div className="h-3.5 bg-slate-100 rounded w-20" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5 flex flex-col items-end shrink-0">
                  <div className="h-4 bg-slate-200 rounded w-20" />
                  <div className="h-2.5 bg-slate-100 rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetails;

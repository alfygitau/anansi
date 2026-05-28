import { useState } from "react";
import {
  ArrowRight,
  Lock,
  ExternalLink,
  Scale,
  Info,
  X,
  FileSpreadsheet,
  AlertTriangle,
  HelpCircle,
  FileText,
  Users,
  ShieldAlert,
  FileCheck,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "react-query";
import { getLoanProduct } from "../../sdks/loans/loans";
import { useToast } from "../../contexts/ToastProvider";
import { createLoanApplication } from "../../sdks/applications/applications";
import useAuth from "../../hooks/useAuth";
import { useFormatAmount } from "../../hooks/useFormatAmount";

const ApplyLoan = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tenure, setTenure] = useState(0);
  const [minPeriod, setMinPeriod] = useState(0);
  const [maxPeriod, setMaxPeriod] = useState(0);
  const [frequency, setFrequency] = useState("Monthly");
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const { productId } = useParams();
  const [loanProduct, setLoanProduct] = useState({});
  const { showToast } = useToast();
  const [requireCollateral, setRequireCollateral] = useState(false);
  const [requireGuarantors, setRequireGuarantors] = useState(false);
  const [requireStatements, setRequireStatements] = useState(false);
  const { auth } = useAuth();
  const [errors, setErrors] = useState({ amount: "", tenure: "", purpose: "" });
  const formatAmount = useFormatAmount();

  const handleAmountBlur = () => {
    let errorMsg = "";

    if (!amount || amount <= 0) {
      errorMsg = "Please enter a valid principal request amount.";
    } else if (amount > Number(loanProduct?.max_amount)) {
      errorMsg = `Amount exceeds maximum structural product limit of ${formatAmount(loanProduct?.max_amount)}.`;
    } else if (amount < Number(loanProduct?.min_amount)) {
      errorMsg = `Amount is less than the minimum structural product limit of ${formatAmount(loanProduct?.min_amount)}.`;
    }

    setErrors((prev) => ({ ...prev, amount: errorMsg }));
  };

  // 2. Tenure Duration Validation
  const handleTenureBlur = () => {
    let errorMsg = "";

    if (tenure === "" || Number(tenure) < 1) {
      setTenure(1);
    } else if (Number(tenure) > tenure) {
      errorMsg = `Maximum duration framework is restricted to ${tenure} months.`;
    }
    setErrors((prev) => ({ ...prev, tenure: errorMsg }));
  };

  // 3. Loan Purpose Textarea Validation
  const handlePurposeBlur = () => {
    let errorMsg = "";
    const trimmedPurpose = purpose.trim();

    if (!trimmedPurpose) {
      errorMsg =
        "Usage statement explanation is mandatory for validation review.";
    } else if (trimmedPurpose.length < 1) {
      errorMsg =
        "Please supply a more detailed statement description (minimum 15 characters).";
    }
    setErrors((prev) => ({ ...prev, purpose: errorMsg }));
  };

  const annualRate = 0.144;
  const calculateInstallment = () => {
    const p = amount || 0;
    const r = annualRate / 12;
    const n = tenure;
    if (p === 0 || n === 0) return 0;
    return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const installment = calculateInstallment();

  const { isFetching } = useQuery({
    queryKey: ["explore product", productId],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await getLoanProduct(productId);
      return response?.data?.data;
    },
    onSuccess: (data) => {
      setLoanProduct(data);
      setMaxPeriod(data?.max_period);
      setMinPeriod(data?.min_period);
      setTenure(data?.min_period);
      setRequireGuarantors(data?.requires_guarantor);
      setRequireCollateral(data?.requires_collateral);
      setRequireStatements(data?.require_statement);
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

  const { mutate, isLoading } = useMutation({
    mutationKey: ["create loan application"],
    mutationFn: async (targetRoute) => {
      const combinedFullName =
        `${auth?.user?.firstname || ""} ${auth?.user?.lastname || ""}`.trim();
      const response = await createLoanApplication(
        auth?.user?.id,
        productId,
        combinedFullName,
        auth?.user?.mobileno,
        amount,
        tenure,
        purpose,
      );
      return {
        application: response.data.data,
        targetRoute,
      };
    },
    onSuccess: ({ application, targetRoute }) => {
      const applicationId = application?.id;
      navigate(`${targetRoute}/${applicationId}`);
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

  const isFormValid = () => {
    const numAmount = Number(amount);
    const numTenure = Number(tenure);
    const maxLimit = loanProduct?.max_period;

    const isAmountValid =
      !isNaN(numAmount) &&
      numAmount > 0 &&
      numAmount >= Number(loanProduct?.min_amount) &&
      numAmount <= Number(loanProduct?.max_amount);
    const isTenureValid =
      !isNaN(numTenure) && numTenure >= 1 && numTenure <= maxLimit;
    const isPurposeValid =
      purpose && purpose.trim().length >= 1 && purpose.trim().length <= 500;

    return !!(isAmountValid && isTenureValid && isPurposeValid);
  };

  const handleLoanApplication = (targetRoute) => {
    if (isLoading || !isFormValid()) return;
    mutate(targetRoute);
  };

  if (isFetching) {
    return <ApplyLoanSkeleton />;
  }

  return (
    <div className="w-full text-primary">
      <div className="max-w-6xl py-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Configuration (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <header className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-primary">
                Loan Configuration
              </h1>
              <div className="space-y-4">
                <p className="text-slate-500 leading-relaxed text-sm">
                  Configure your facility by adjusting the principal and
                  preferred repayment window. Your interest is calculated using
                  the {formatLabel(loanProduct?.interest_method)} Method ,
                  meaning you only pay interest on the remaining principal each
                  month, not the original loan amount.
                </p>
                <p className="text-slate-400 leading-relaxed text-xs">
                  This approach ensures that as you pay down your debt, your
                  interest burden decreases accordingly. Final approval and
                  exact disbursement values are subject to a standard credit
                  assessment and verification of your current monthly net
                  income.
                </p>
              </div>
            </header>

            <div className="space-y-6">
              {/* Enhanced Principal Amount Input */}
              <div className="group relative">
                {" "}
                {/* Added relative positioning context */}
                <div className="flex justify-between items-end mb-1">
                  <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    Desired Principal (KES)
                  </label>
                  <span className="text-xs font-bold text-slate-300">
                    Max: 2.5M
                  </span>
                </div>
                {/* Fixed Border Wrapper */}
                <div className="relative flex items-center bg-white border-2 border-slate-100 rounded-2xl h-16 transition-all duration-200">
                  {/* Prefix Section */}
                  <div className="pl-5 pr-4 flex items-center text-slate-400 text-sm font-bold border-r border-slate-200 h-6 my-auto select-none">
                    KES
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    onBlur={handleAmountBlur}
                    className="w-full bg-white border-none pl-4 pr-6 text-xl font-medium text-slate-900 outline-none focus:outline-none border-0 focus:border-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none placeholder:text-slate-200"
                    placeholder="0.00"
                    min={loanProduct?.min_amount}
                    max={loanProduct?.max_amount}
                  />
                </div>
                {/* ⚡ PRE-ALLOCATED ABSOLUTE ERROR SLOT */}
                <div className="absolute left-2 -bottom-5 h-4 overflow-visible">
                  <p
                    className={`text-[10px] font-bold text-rose-500 transition-opacity duration-200 ${errors.amount ? "opacity-100" : "opacity-0"}`}
                  >
                    {errors.amount}
                  </p>
                </div>
              </div>

              <div className="w-full space-y-1 relative">
                {" "}
                {/* Added relative positioning context */}
                <label className="text-[11px] font-medium uppercase tracking-wider text-slate-400 ml-2">
                  Tenure
                </label>
                <div className="relative flex items-center justify-between bg-white border-2 border-slate-100 rounded-2xl h-16 transition-all duration-200">
                  <button
                    type="button"
                    onClick={() => setTenure(Math.max(minPeriod, tenure - 1))}
                    className="h-full px-5 text-slate-400 hover:text-slate-900 border-r border-slate-200/60 font-medium text-lg transition-colors"
                  >
                    -
                  </button>
                  <div className="flex items-center justify-center flex-1 px-2 relative">
                    <input
                      type="number"
                      value={tenure}
                      placeholder="1"
                      onKeyDown={(e) => {
                        if (["e", "E", "-", "+", "."].includes(e.key))
                          e.preventDefault();
                      }}
                      onInput={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                          setTenure("");
                          return;
                        }
                        const numericVal = Number(val);
                        if (numericVal > maxPeriod) setTenure(maxPeriod);
                        else if (numericVal < minPeriod) setTenure(minPeriod);
                        else setTenure(numericVal);
                      }}
                      onBlur={handleTenureBlur}
                      className="w-14 text-right pr-1 bg-white border-0 outline-none p-0 focus:ring-0 text-sm font-semibold text-slate-900 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-sm font-medium text-slate-400 select-none uppercase tracking-wider pl-1.5">
                      Month(s)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setTenure(
                        Math.max(
                          1,
                          Math.min(maxPeriod, (Number(tenure) || 1) + 1),
                        ),
                      )
                    }
                    className="h-full px-5 text-slate-400 hover:text-slate-900 border-l border-slate-200/60 font-medium text-lg transition-colors"
                  >
                    +
                  </button>
                </div>
                {/* ⚡ PRE-ALLOCATED ABSOLUTE ERROR SLOT */}
                <div className="absolute left-2 -bottom-4 h-4 overflow-visible">
                  <p
                    className={`text-[10px] font-bold text-rose-500 transition-opacity duration-200 ${errors.tenure ? "opacity-100" : "opacity-0"}`}
                  >
                    {errors.tenure}
                  </p>
                </div>
              </div>

              {/* Frequency Selection */}
              <div className="space-y-1">
                <label className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
                  Payment Frequency
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {["Weekly", "Monthly", "Quarterly"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setFrequency(opt)}
                      className={`h-14 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all border-2 ${
                        frequency === opt
                          ? "border-slate-900 bg-primary text-white"
                          : "border-slate-100 text-slate-400 hover:border-slate-200 bg-white"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full relative">
                {" "}
                {/* Added relative positioning context */}
                <div className="flex justify-between items-end px-1 mb-1.5">
                  <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                    Detailed Loan Purpose
                  </label>
                  <span
                    className={`text-[11px] font-bold ${
                      purpose.length >= 500
                        ? "text-rose-500 animate-pulse"
                        : "text-slate-400"
                    }`}
                  >
                    {purpose.length} / {500}
                  </span>
                </div>
                <div className="relative rounded-[16px] bg-white border border-slate-200/80 p-0.5 transition-all duration-200">
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    onBlur={handlePurposeBlur}
                    rows={3}
                    placeholder="Briefly itemize your loan utilization requirements..."
                    className="w-full text-slate-800 text-sm placeholder-slate-300 font-medium bg-transparent border-0 resize-none outline-none focus:ring-0 p-2.5 min-h-[90px] leading-relaxed"
                  />
                </div>
                {/* ⚡ PRE-ALLOCATED ABSOLUTE ERROR SLOT */}
                <div className="absolute left-2 -bottom-5 h-4 overflow-visible">
                  <p
                    className={`text-[10px] font-bold text-rose-500 transition-opacity duration-200 ${errors.purpose ? "opacity-100" : "opacity-0"}`}
                  >
                    {errors.purpose}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Complete Statutory Disclaimers (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-12 bg-slate-50 rounded-[32px] space-y-6">
              {/* Header section with Modal Access Trigger */}
              <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-widest text-slate-400">
                    Regulatory Framework
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Statutory Disclaimers & Disclosures
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsScheduleOpen(true)}
                  className="p-2.5 rounded-xl bg-white border border-slate-200/60 shadow-sm text-slate-400 hover:text-slate-900 hover:border-slate-400 transition-all flex items-center justify-center gap-2 text-[10px] font-medium uppercase tracking-wider"
                  title="View calculations blueprint"
                >
                  <FileText size={14} />
                  <span>View Schedule</span>
                  <ExternalLink size={12} />
                </button>
              </div>

              {/* DETAILED STATUTORY LEGAL & DISBURSEMENT BLOCKS */}
              <div className="space-y-4">
                {/* Accordion Style Content Card 1 */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Scale size={14} className="text-slate-400" />
                    <h4 className="text-[10px] font-medium uppercase tracking-widest">
                      Legal Enforceability
                    </h4>
                  </div>
                  <p className="text-[10px] leading-relaxed text-slate-500">
                    By submitting this preliminary loan configuration, you
                    acknowledge that this is a statement of capability and
                    intent, not a binding offer. Final credit issuance is
                    subject to execution of full legal charges under the Sacco
                    Societies Act.
                  </p>
                </div>

                {/* Accordion Style Content Card 2 */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Info size={14} className="text-slate-400" />
                    <h4 className="text-[10px] font-medium uppercase tracking-widest">
                      Reducing Balance Math
                    </h4>
                  </div>
                  <p className="text-[10px] leading-relaxed text-slate-500">
                    Amortization structures rely entirely on a daily compound
                    interval applied strictly against the active residual
                    principal vector. Early liquidation or partial amortization
                    variants immediately reduce your overall finance overhead
                    load.
                  </p>
                </div>

                {/* Accordion Style Content Card 3 */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-800">
                    <AlertTriangle size={14} className="text-amber-500" />
                    <h4 className="text-[10px] font-medium uppercase tracking-widest text-slate-700">
                      Delinquency Covenants
                    </h4>
                  </div>
                  <p className="text-[10px] leading-relaxed text-slate-500">
                    Uncured arrears tracking beyond 15 business operations
                    cycles will automatically execute acceleration mechanisms
                    over total active liability channels, rendering guarantor
                    networks directly responsible for asset liquidation
                    protocols.
                  </p>
                </div>

                {/* Accordion Style Content Card 4 */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-800">
                    <HelpCircle size={14} className="text-slate-400" />
                    <h4 className="text-[10px] font-medium uppercase tracking-widest">
                      Variable Fees Disclaimer
                    </h4>
                  </div>
                  <p className="text-[10px] leading-relaxed text-slate-500">
                    Third-party regulatory overhead items, including excise
                    duties, statutory stamp values, and credit reference bureau
                    validation passes are volatile parameter metrics and are
                    pinned exactly to the actual time of execution.
                  </p>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="w-full">
                {(() => {
                  // Run the centralized form validity check
                  const isValid = isFormValid();

                  // 1. RULE CHECK: Requires Guarantors
                  if (requireGuarantors) {
                    return (
                      <button
                        type="button"
                        disabled={!isValid}
                        onClick={() =>
                          handleLoanApplication(
                            `/add-guarantor/${loanProduct?.id}`,
                          )
                        }
                        className={`w-full h-14 rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all group ${
                          isValid
                            ? "bg-primary hover:bg-secondary text-white shadow-md cursor-pointer"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                        }`}
                      >
                        <Users
                          size={16}
                          className={
                            isValid ? "text-white/70" : "text-slate-300"
                          }
                        />
                        Apply & Add Guarantors
                        <ArrowRight
                          size={16}
                          className={
                            isValid
                              ? "text-white/60 group-hover:translate-x-0.5 transition-transform ml-1"
                              : "text-slate-300 ml-1"
                          }
                        />
                      </button>
                    );
                  }

                  // 2. RULE CHECK: Requires Collateral
                  if (requireCollateral) {
                    return (
                      <button
                        type="button"
                        disabled={!isValid}
                        onClick={() => handleLoanApplication("/add-collateral")}
                        className={`w-full h-14 rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all group ${
                          isValid
                            ? "bg-primary hover:bg-secondary text-white shadow-md cursor-pointer"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                        }`}
                      >
                        <ShieldAlert
                          size={16}
                          className={
                            isValid ? "text-white/70" : "text-slate-300"
                          }
                        />
                        Apply & Upload Collateral
                        <ArrowRight
                          size={16}
                          className={
                            isValid
                              ? "text-white/60 group-hover:translate-x-0.5 transition-transform ml-1"
                              : "text-slate-300 ml-1"
                          }
                        />
                      </button>
                    );
                  }

                  // 3. RULE CHECK: Requires Account Statements
                  if (requireStatements) {
                    return (
                      <button
                        type="button"
                        disabled={!isValid}
                        onClick={() =>
                          handleLoanApplication("/upload-statements")
                        }
                        className={`w-full h-14 rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all group ${
                          isValid
                            ? "bg-primary hover:bg-secondary text-white shadow-md cursor-pointer"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                        }`}
                      >
                        <FileText
                          size={16}
                          className={
                            isValid ? "text-white/70" : "text-slate-300"
                          }
                        />
                        Apply & Attach Statements
                        <ArrowRight
                          size={16}
                          className={
                            isValid
                              ? "text-white/60 group-hover:translate-x-0.5 transition-transform ml-1"
                              : "text-slate-300 ml-1"
                          }
                        />
                      </button>
                    );
                  }

                  // 4. DEFAULT COMPLIANCE FALLBACK: Direct to Terms & Conditions
                  return (
                    <button
                      type="button"
                      disabled={!isValid}
                      onClick={() =>
                        handleLoanApplication("/loan-terms-conditions")
                      }
                      className={`w-full h-14 rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all group ${
                        isValid
                          ? "bg-primary hover:bg-secondary text-white shadow-md cursor-pointer"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                      }`}
                    >
                      <FileCheck
                        size={16}
                        className={isValid ? "text-white/70" : "text-slate-300"}
                      />
                      Review Terms & Apply
                      <ArrowRight
                        size={16}
                        className={
                          isValid
                            ? "text-white/60 group-hover:translate-x-0.5 transition-transform ml-1"
                            : "text-slate-300 ml-1"
                        }
                      />
                    </button>
                  );
                })()}
              </div>

              <div className="flex items-center justify-center gap-2 opacity-30">
                <Lock size={12} />
                <span className="text-[9px] font-medium uppercase tracking-widest">
                  End-to-End Encrypted Secure Core
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AMORTIZATION SCHEDULE SLIDE DRAWER */}
      <AmortizationScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        amount={amount}
        tenure={tenure}
        annualRate={annualRate}
        installment={installment}
      />
    </div>
  );
};

/**
 * FIXED RIGHT-SIDED DRAWER SCRIPT BREAKDOWN
 */
const AmortizationScheduleModal = ({
  isOpen,
  onClose,
  amount,
  tenure,
  annualRate,
  installment,
}) => {
  const generateScheduleRows = () => {
    let remainingPrincipal = amount;
    const monthlyRate = annualRate / 12;
    const rows = [];

    for (let i = 1; i <= Math.min(tenure, 12); i++) {
      const interestPayment = remainingPrincipal * monthlyRate;
      const principalPayment = installment - interestPayment;
      remainingPrincipal = Math.max(0, remainingPrincipal - principalPayment);

      rows.push({
        month: i,
        payment: installment,
        principal: principalPayment,
        interest: interestPayment,
        balance: remainingPrincipal,
      });
    }
    return rows;
  };

  const scheduleRows = generateScheduleRows();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex justify-end bg-slate-900/40"
        >
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 240 }}
            className="bg-white relative w-full max-w-[480px] h-full flex flex-col z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-500">
                  <FileSpreadsheet size={18} />
                </div>
                <div>
                  <h3 className="text-slate-900 text-sm font-medium uppercase tracking-wider">
                    Amortization Ledger
                  </h3>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                    Projected Schedule
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Scrollable Data Rows */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="border border-slate-100 overflow-hidden shadow-sm bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-medium uppercase tracking-wider text-slate-400">
                      <th className="p-3 text-center">Cycle</th>
                      <th className="p-3 text-right">Payment</th>
                      <th className="p-3 text-right">Principal</th>
                      <th className="p-3 text-right">Interest</th>
                      <th className="p-3 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-slate-600 font-medium">
                    {scheduleRows.map((row) => (
                      <tr
                        key={row.month}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="p-3 text-center text-slate-400 font-bold">
                          {row.month}
                        </td>
                        <td className="p-3 text-right text-slate-900 font-semibold">
                          {row.payment.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="p-3 text-right text-emerald-600">
                          {row.principal.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="p-3 text-right text-amber-600">
                          {row.interest.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="p-3 text-right text-slate-900 font-bold">
                          {row.balance.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {tenure > 12 && (
                <p className="text-[10px] text-slate-400 mt-4 text-left font-medium italic">
                  Showing initial 12 payment matrices of the configured {tenure}
                  -month period lifecycle.
                </p>
              )}
            </div>

            {/* Footer Control Panel */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto">
              <button
                type="button"
                onClick={onClose}
                className="w-full bg-slate-900 text-white py-5 rounded-xl text-[11px] font-medium uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-sm"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ApplyLoanSkeleton = () => {
  return (
    <div className="w-full text-primary animate-pulse select-none">
      <div className="max-w-6xl py-4 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Configuration Placeholder (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <header className="space-y-3">
              {/* Page Title */}
              <div className="h-7 bg-slate-200 rounded-xl w-1/3" />
              {/* Descriptive Copy Stacks */}
              <div className="space-y-2">
                <div className="h-3.5 bg-slate-100 rounded w-full" />
                <div className="h-3.5 bg-slate-100 rounded w-11/12" />
                <div className="h-3.5 bg-slate-100 rounded w-4/5" />
              </div>
              <div className="space-y-1.5 pt-2">
                <div className="h-2.5 bg-slate-100/60 rounded w-full" />
                <div className="h-2.5 bg-slate-100/60 rounded w-5/6" />
              </div>
            </header>

            <div className="space-y-6 pt-2">
              {/* Principal Amount Input Mock */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="h-2.5 bg-slate-200 rounded w-28" />
                  <div className="h-3 bg-slate-100 rounded w-12" />
                </div>
                <div className="w-full bg-white border border-slate-200/60 rounded-2xl h-16 flex items-center p-4 gap-4">
                  <div className="h-5 bg-slate-100 rounded w-8 border-r border-slate-200/60 pr-4 shrink-0" />
                  <div className="h-6 bg-slate-200 rounded-md w-32" />
                </div>
              </div>

              {/* Tenure Duration Input Mock */}
              <div className="space-y-2">
                <div className="h-2.5 bg-slate-200 rounded w-14" />
                <div className="w-full bg-white border border-slate-200/60 rounded-2xl h-16 flex items-center justify-between px-4">
                  <div className="w-6 h-6 bg-slate-100 rounded-md" />
                  <div className="h-4 bg-slate-200 rounded-md w-24" />
                  <div className="w-6 h-6 bg-slate-100 rounded-md" />
                </div>
              </div>

              {/* Frequency Multi-Option Selection Strip Mock */}
              <div className="space-y-2">
                <div className="h-2.5 bg-slate-200 rounded w-28" />
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="h-14 bg-white border border-slate-200/60 rounded-xl"
                    />
                  ))}
                </div>
              </div>

              {/* Textarea Utilization Statement Box Mock */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="h-2.5 bg-slate-200 rounded w-28" />
                  <div className="h-2.5 bg-slate-100 rounded w-10" />
                </div>
                <div className="w-full bg-white border border-slate-200/60 rounded-2xl h-[96px]" />
              </div>
            </div>
          </div>

          {/* Right Column: Complete Statutory Disclaimers (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-slate-50 rounded-[32px] space-y-6">
              {/* Header Panel with Right Action Button Mock */}
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <div className="space-y-2 w-1/2">
                  <div className="h-2.5 bg-slate-200 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-3/4" />
                </div>
                <div className="w-28 h-10 bg-white border border-slate-200 rounded-xl shrink-0" />
              </div>

              {/* Repeating Accordion Layout Info Panels */}
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white border border-slate-100 rounded-2xl space-y-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 bg-slate-100 rounded-full shrink-0" />
                      <div className="h-2.5 bg-slate-200 rounded w-1/3" />
                    </div>
                    <div className="space-y-1.5">
                      <div className="h-2 bg-slate-100 rounded w-full" />
                      <div className="h-2 bg-slate-100 rounded w-11/12" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Primary Application Submission Button Action Mock */}
              <div className="w-full h-14 bg-slate-200 rounded-xl" />

              {/* Footer Encryption Security Token */}
              <div className="flex items-center justify-center gap-2 opacity-20 pt-2">
                <div className="w-3 h-3 bg-slate-300 rounded" />
                <div className="h-2.5 bg-slate-300 rounded w-32" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplyLoan;

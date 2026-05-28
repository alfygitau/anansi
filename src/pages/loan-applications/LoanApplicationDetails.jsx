import React, { useState } from "react";
import {
  FileText,
  Info,
  ShieldCheck,
  Zap,
  FileSearch,
  Shield,
  Percent,
  Calendar,
  Repeat,
  Lock,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Clock,
  ArrowRight,
  XCircle,
  Users,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getLoanApplication } from "../../sdks/applications/applications";
import { useToast } from "../../contexts/ToastProvider";
import { useFormatAmount } from "../../hooks/useFormatAmount";

const LoanApplicationDetails = ({ onBack }) => {
  const { appId } = useParams();
  const { showToast } = useToast();
  const [loanApplication, setLoanApplication] = useState({});
  const formatAmount = useFormatAmount();
  const navigate = useNavigate();

  const getStatusTheme = (isDone, isPending, status) => {
    if (isDone) return { color: "#10B981", bg: "bg-emerald-500/10" }; // Success Green
    if (isPending) return { color: "#F59E0B", bg: "bg-amber-500/10" }; // Pending Amber
    if (status === "Action Required")
      return { color: "#EF4444", bg: "bg-red-500/10" }; // Alert Red
    return { color: "#94A3B8", bg: "bg-slate-500/10" }; // Default Grey
  };

  const { isFetching } = useQuery({
    queryKey: ["get loan application", appId],
    queryFn: async () => {
      const response = await getLoanApplication(appId);
      return response.data.data;
    },
    onSuccess: (data) => {
      setLoanApplication(data);
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

  const formatLabel = (str) => {
    if (!str) return "";
    const spaced = str.replace(/_/g, " ");
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  };

  const passedCount =
    loanApplication?.eligibility_result?.checks?.filter(
      (item) => item.passed === true,
    ).length || 0;
  const totalCount = loanApplication?.eligibility_result?.checks?.length || 0;

  const handleContinue = (status) => {
    if (status?.toLowerCase() === "pending_guarantor") {
      navigate(`/add-guarantor/${loanApplication?.loan_product?.id}/${appId}`);
    }
  };

  const formatGuarantorDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(dateString));
    } catch (e) {
      return "";
    }
  };

  if (isFetching) {
    return <LoanApplicationDetailsSkeleton />;
  }

  return (
    <div className="bg-slate-50 text-primary">
      <div className="max-w-6xl mx-auto sm:px-4">
        {/* Navigation & Header */}
        <header>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-2xl font-medium tracking-tight">
                {loanApplication?.loan_product?.product_name}
              </h1>
            </div>
            {(() => {
              // 1. Dynamic Configuration Mapping
              const getStatusStyles = (status = "") => {
                switch (status.toLowerCase().trim()) {
                  case "approved":
                  case "active":
                  case "disbursed":
                    return "bg-emerald-50 border-emerald-200/60 text-emerald-700 shadow-emerald-900/[0.04]";
                  case "declined":
                  case "rejected":
                  case "defaulted":
                  case "cancelled":
                    return "bg-rose-50 border-rose-200/60 text-rose-700 shadow-rose-900/[0.04]";
                  case "pending":
                  case "under_review":
                  case "processing":
                  default:
                    return "bg-amber-50 border-amber-200/60 text-amber-700 shadow-amber-900/[0.04]";
                }
              };

              const statusStyleClasses = getStatusStyles(
                loanApplication?.status,
              );

              return (
                <div
                  className={`px-3 py-1.5 rounded-full border shadow-md font-bold tracking-widest text-[9px] uppercase transition-all duration-300 backdrop-blur-sm select-none ${statusStyleClasses}`}
                >
                  <span>{loanApplication?.status || "Pending"}</span>
                </div>
              );
            })()}
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-6 py-2 w-full items-stretch">
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
                    {loanApplication?.application_number}
                  </p>
                </div>
                {/* Premium Status Badge */}
                {(() => {
                  // 1. Dynamic Configuration Mapping
                  const getStatusStyles = (status = "") => {
                    switch (status.toLowerCase().trim()) {
                      case "approved":
                      case "active":
                      case "disbursed":
                        return "bg-emerald-50 border-emerald-200/60 text-emerald-700 shadow-emerald-900/[0.04]";
                      case "declined":
                      case "rejected":
                      case "defaulted":
                      case "cancelled":
                        return "bg-rose-50 border-rose-200/60 text-rose-700 shadow-rose-900/[0.04]";
                      case "pending":
                      case "under_review":
                      case "processing":
                      default:
                        return "bg-amber-50 border-amber-200/60 text-amber-700 shadow-amber-900/[0.04]";
                    }
                  };

                  const statusStyleClasses = getStatusStyles(
                    loanApplication?.status,
                  );

                  return (
                    <div
                      className={`px-3 py-1.5 rounded-full border shadow-md font-bold tracking-widest text-[9px] uppercase transition-all duration-300 backdrop-blur-sm select-none ${statusStyleClasses}`}
                    >
                      <span>{loanApplication?.status || "Pending"}</span>
                    </div>
                  );
                })()}
              </div>

              {/* Amount Section */}
              <div className="text-center mb-8">
                <p className="text-white/50 text-[10px] font-extrabold tracking-[1.5px] uppercase mb-1.5">
                  Loan Amount
                </p>
                <h1 className="text-white text-4xl font-medium tracking-tighter">
                  {formatAmount(loanApplication?.applied_amount ?? 0)}
                </h1>
              </div>

              <hr className="border-white/10 mb-5" />

              {/* Info Footer */}
              {(() => {
                const getStatusNotification = (status = "") => {
                  switch (status.toLowerCase().trim()) {
                    case "approved":
                    case "active":
                    case "disbursed":
                      return {
                        message:
                          "Application approved! Your funds are being queued for disbursement via your chosen channel.",
                        iconColor: "text-emerald-400",
                        textColor: "text-emerald-100/80",
                      };
                    case "declined":
                    case "rejected":
                    case "defaulted":
                    case "cancelled":
                      return {
                        message:
                          "Application declined. Please review the credit committee decision or contact support for help.",
                        iconColor: "text-rose-400",
                        textColor: "text-rose-100/80",
                      };
                    case "pending":
                    case "under_review":
                    case "processing":
                    default:
                      return {
                        message:
                          "Verification in progress. Expect a full credit committee response within 24 hours.",
                        iconColor: "text-[#17C6C6]",
                        textColor: "text-white/70",
                      };
                  }
                };
                const config = getStatusNotification(loanApplication?.status);
                return (
                  <div className="flex items-start gap-3 mt-auto select-none transition-all duration-300">
                    <Info
                      size={16}
                      className={`shrink-0 mt-0.5 transition-colors ${config.iconColor}`}
                    />
                    <p
                      className={`text-[11px] font-medium leading-relaxed transition-colors ${config.textColor}`}
                    >
                      {config.message}
                    </p>
                  </div>
                );
              })()}
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
                <p className="text-[#0A2351] text-[15px] font-medium">
                  {loanApplication?.loan_product?.product_name}
                </p>
              </div>
            </div>

            <hr className="border-[#F1F4F8] mb-5" />

            {/* Data Grid (Replicating Flutter Table 2x3) */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <DetailCell
                icon={Percent}
                label="Interest Rate"
                value={`${Number(loanApplication?.loan_product?.interest_rate)?.toFixed(0)}% / Mo`}
              />
              <DetailCell
                icon={Calendar}
                label="Loan Period"
                value={`${loanApplication?.loan_period} Months`}
              />
              <DetailCell icon={Repeat} label="Frequency" value="Monthly" />
              <DetailCell
                icon={FileText}
                label="Processing Fee"
                value={`${formatAmount(loanApplication?.disbursement?.processing_fee_deducted ?? 0)}`}
              />
              <DetailCell
                icon={Lock}
                label="Insurance Fee"
                value={`${formatAmount(0)}`}
              />
              <DetailCell
                icon={Briefcase}
                label="Excise Duty"
                value={`${formatAmount(0)}`}
              />
            </div>
          </div>
        </div>

        {/* Conditionally show the insight section */}

        <StatusInsight
          status={loanApplication?.status}
          onContinue={() => handleContinue(loanApplication?.status)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          <div className="lg:col-span-8 space-y-4">
            <div className="mb-2 mt-6 flex items-baseline justify-between">
              <h2 className="text-[11px] font-medium uppercase tracking-[2px] text-slate-400">
                Application Milestones
              </h2>
              <span className="text-[10px] font-bold text-[#17C6C6]">
                {passedCount}/{totalCount} COMPLETED
              </span>
            </div>

            {/* Container: Grid setup with responsive columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loanApplication?.eligibility_result?.checks?.map(
                (req, index) => {
                  const {
                    passed: isDone,
                    isPending = false,
                    status = req?.passed ? "Cleared" : "Action Required",
                    rule: title,
                    description: subtitle,
                  } = req;
                  const theme = getStatusTheme(isDone, isPending, status);

                  return (
                    <div
                      key={index}
                      className={`
              flex items-center p-5 rounded-[24px] border transition-all duration-300
              ${
                isDone
                  ? "bg-white/50 border opacity-70"
                  : "bg-white border-[#F1F4F8] shadow-[0_8px_15px_rgba(0,0,0,0.02)]"
              }
            `}
                    >
                      <div
                        className={`shrink-0 p-2.5 rounded-full ${theme.bg} flex items-center justify-center`}
                        style={{ color: theme.color }}
                      >
                        {isDone ? (
                          <CheckCircle2 size={20} strokeWidth={3} />
                        ) : (
                          <Clock size={20} strokeWidth={2.5} />
                        )}
                      </div>

                      <div className="flex-1 ml-4 flex flex-col min-w-0">
                        <h4
                          className={`
                  text-[13px] font-medium leading-tight truncate
                  ${isDone ? "line-through text-slate-400" : "text-[#0A2351]"}
                `}
                        >
                          {formatLabel(title)}
                        </h4>
                        <p className="text-[10px] font-semibold text-slate-400 mt-0.5 truncate uppercase tracking-tight">
                          {subtitle}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 ml-2">
                        <div
                          className={`
                  px-2 py-0.5 rounded-md text-[8px] font-medium uppercase tracking-wider whitespace-nowrap
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
                },
              )}
            </div>
          </div>
          <div className="lg:col-span-4 space-y-4">
            <div className="mb-2 mt-6 flex items-baseline justify-between">
              <h2 className="text-[11px] font-medium uppercase tracking-[2px] text-slate-400">
                Assigned Guarantors
              </h2>
              <span className="text-[10px] font-bold text-purple-600">
                {loanApplication?.guarantors?.length || 0} LINKED
              </span>
            </div>

            {/* Guarantor Wrapper List Container */}
            <div className="space-y-3 h-[300px] overflow-y-auto pr-1">
              {loanApplication?.guarantors &&
              loanApplication.guarantors.length > 0 ? (
                loanApplication.guarantors.map((g) => (
                  <div
                    key={g.id}
                    className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between shadow-[0_4px_10px_rgba(0,0,0,0.01)] hover:border-slate-200 transition-all"
                  >
                    {/* Left Meta Group */}
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Initial Avatar */}
                      <div className="size-9 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-[#0A2351] font-bold text-xs shrink-0 select-none">
                        {g.guarantor_name?.charAt(0).toUpperCase()}
                      </div>

                      {/* Detail Copy Stack */}
                      <div className="min-w-0 space-y-0.5">
                        <h4 className="font-bold text-slate-900 text-xs tracking-tight truncate">
                          {g.guarantor_name}
                        </h4>
                        <p className="text-[9px] font-semibold text-slate-400 truncate tracking-wider">
                          {g.guarantor_mobile}
                        </p>

                        {/* ⚡ NEW: Formatted Date Sub-row */}
                        {g.created_at || g.createdAt ? (
                          <p className="text-[10px] font-medium text-slate-400 flex items-center gap-1 select-none">
                            <span>Date:</span>
                            <span className="text-slate-500 font-semibold">
                              {formatGuarantorDate(g.created_at || g.createdAt)}
                            </span>
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {/* Right Side Status Pill Badge */}
                    <span
                      className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shrink-0 select-none ${
                        g.status === "Approved"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100/50"
                          : "bg-amber-50 text-amber-600 border border-amber-100/50"
                      }`}
                    >
                      {g.status || "Pending"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="bg-white h-full rounded-2xl border border-dashed border-slate-200 p-8 flex flex-col items-center justify-center text-center select-none animate-fade-in">
                  {/* 1. DYNAMIC ICON HOUSING MESH */}
                  <div
                    className={`w-12 h-12 border rounded-2xl flex items-center justify-center mb-4 shadow-inner ${
                      loanApplication?.loan_product?.requires_guarantor
                        ? "bg-slate-50 border-slate-100 text-slate-400"
                        : "bg-emerald-50/50 border-emerald-100 text-emerald-500"
                    }`}
                  >
                    {loanApplication?.loan_product?.requires_guarantor ? (
                      <Users size={20} strokeWidth={1.75} />
                    ) : (
                      <ShieldCheck size={20} strokeWidth={1.75} />
                    )}
                  </div>

                  {/* 2. DYNAMIC TYPOGRAPHY COPY STACK */}
                  <div className="max-w-[200px] space-y-1">
                    <h4 className="text-[12px] font-bold text-slate-700 tracking-tight">
                      {loanApplication?.loan_product?.requires_guarantor
                        ? "No guarantors attached"
                        : "Guarantors Exempted"}
                    </h4>
                    <p className="text-[10px] font-medium text-slate-400 leading-normal">
                      {loanApplication?.loan_product?.requires_guarantor
                        ? "No guarantor invitation logs linked to this application setup yet."
                        : "This specific loan facility processes instantly without requiring third-party credit backing networks."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
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
      <span className="text-[13px] font-medium text-[#0A2351] truncate">
        {value}
      </span>
    </div>
  </div>
);

const StatusInsight = ({ status = "", onContinue }) => {
  // 1. Establish normalized data matrix mapping for dynamic rendering
  const insights = {
    draft: {
      title: "Continue Application",
      description:
        "You have an unfinished application. Complete the remaining steps to submit your request for review.",
      icon: <FileSearch className="text-amber-600" />,
      bg: "bg-amber-50",
      border: "border-amber-100",
      actionLabel: "Resume Now",
      showButton: true,
    },
    "pending approval": {
      title: "Under Credit Review",
      description:
        "Our credit committee is currently reviewing your financial profile and guarantor commitments. This typically takes 24-48 hours.",
      icon: <ShieldCheck className="text-blue-600" />,
      bg: "bg-blue-50",
      border: "border-blue-100",
      actionLabel: "View Details",
      showButton: true,
    },
    "reviewing customer information": {
      title: "Verification in Progress",
      description:
        "We are performing standard KYC checks on your provided identification and documents to ensure your security.",
      icon: <FileSearch className="text-indigo-600" />,
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      actionLabel: "Check Progress",
      showButton: true,
    },
    "pending disbursement": {
      title: "Processing M-PESA Transfer",
      description:
        "Great news! Your loan is approved. We are currently queuing the funds for transfer to your registered mobile number.",
      icon: <Zap className="text-[#17C6C6]" />,
      bg: "bg-sky-50",
      border: "border-sky-100",
      actionLabel: "",
      showButton: false,
    },
    approved: {
      title: "Loan Approved Successfully",
      description:
        "Congratulations! Your credit facility request has passed formal committee evaluations and is ready for onboarding clearance.",
      icon: <CheckCircle2 className="text-emerald-600" />,
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      actionLabel: "View Agreement",
      showButton: false,
    },
    cancelled: {
      title: "Application Cancelled",
      description:
        "This loan application was cancelled by you or voided automatically due to an expiration timeout. You can start a new request anytime.",
      icon: <XCircle className="text-slate-500" />,
      bg: "bg-slate-50",
      border: "border-slate-200",
      actionLabel: "Start New Application",
      showButton: true,
    },
    pending_guarantor: {
      title: "Guarantor Action Required",
      description:
        "Your application requires guarantor backing. Please send invitation requests to your chosen group, or ensure your selected guarantors accept and digitally sign their credit commitments to proceed.",
      icon: <Users className="text-purple-600" />,
      bg: "bg-purple-50",
      border: "border-purple-100",
      actionLabel: "Manage Guarantors",
      showButton: true,
    },
  };

  // 2. Normalize incoming state values to prevent uppercase case matches from failing
  const normalizedStatus = status.toLowerCase().trim();
  const active = insights[normalizedStatus] || insights["pending approval"];

  return (
    <div
      className={`p-3 rounded-[20px] mt-4 border ${active.border} ${active.bg} mb-4 transition-all duration-300`}
    >
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        {/* Icon Housing */}
        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm shrink-0">
          {active.icon &&
            React.cloneElement(active.icon, { size: 32, strokeWidth: 2.5 })}
        </div>

        {/* Text Content */}
        <div className="flex-1">
          <h3 className="text-lg font-medium text-[#0A2351] tracking-tight">
            {active.title}
          </h3>
          <p className="text-sm text-[#0A2351]/70 leading-relaxed">
            {active.description}
          </p>
        </div>

        {/* Conditional Button or Live Indicator */}
        <div className="md:ml-auto shrink-0 w-full md:w-auto">
          {active.showButton ? (
            <button
              onClick={onContinue}
              className="group flex items-center justify-center gap-2 w-full md:w-auto px-6 py-3 bg-[#0A2351] text-white rounded-2xl font-medium text-[11px] uppercase tracking-widest shadow-lg shadow-blue-900/20 hover:bg-[#152E5F] active:scale-95 transition-all"
            >
              {active.actionLabel}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          ) : normalizedStatus === "pending disbursement" ? (
            /* Ambient Pulsing Realtime Indicator */
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-sky-200 w-fit mx-auto md:mx-0">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#17C6C6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#17C6C6]"></span>
              </span>
              <span className="text-[10px] font-medium uppercase text-[#17C6C6] tracking-wider">
                System Live
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const LoanApplicationDetailsSkeleton = () => {
  return (
    <div className="bg-slate-50 animate-pulse select-none">
      <div className="max-w-6xl mx-auto sm:px-4">
        {/* Navigation & Header Placeholder */}
        <header className="py-2 mb-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2 w-full md:w-1/3">
              {/* Product Name Line */}
              <div className="h-7 bg-slate-200 rounded-xl w-3/4" />
              {/* Application ID Subtext */}
              <div className="h-3.5 bg-slate-200 rounded-lg w-1/2" />
            </div>
            {/* Top Status Capsule Pill */}
            <div className="h-7 bg-slate-200 rounded-full w-24" />
          </div>
        </header>

        {/* Asymmetric Split Layout Blocks */}
        <div className="flex flex-col lg:flex-row gap-6 py-4 w-full items-stretch">
          {/* Left Side: Premium Card Gradient Mask Profile */}
          <div className="flex-1 rounded-[35px] bg-slate-200 h-[320px] p-7 flex flex-col justify-between">
            <div className="flex justify-between items-start w-full">
              <div className="space-y-2">
                <div className="h-2.5 bg-slate-300 rounded w-20" />
                <div className="h-4 bg-slate-300 rounded w-28" />
              </div>
              <div className="h-7 bg-slate-300 rounded-full w-20" />
            </div>

            <div className="flex flex-col items-center justify-center space-y-2 my-auto">
              <div className="h-3 bg-slate-300 rounded w-24" />
              <div className="h-10 bg-slate-300 rounded-xl w-48" />
            </div>

            <div className="border-t border-slate-300/50 pt-4 flex gap-3 items-center">
              <div className="w-4 h-4 rounded-full bg-slate-300 shrink-0" />
              <div className="h-3 bg-slate-300 rounded w-5/6" />
            </div>
          </div>

          {/* Right Side: Parametric Feature Attributes List */}
          <div className="flex-1 bg-white rounded-[28px] border border-slate-200/60 p-6 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0" />
              <div className="space-y-2 w-1/3">
                <div className="h-2 bg-slate-100 rounded" />
                <div className="h-4 bg-slate-200 rounded" />
              </div>
            </div>
            <hr className="border-slate-100 mb-5" />

            {/* 2x3 Grid Parameters Framework */}
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-4 h-4 bg-slate-100 rounded shrink-0 mt-0.5" />
                  <div className="space-y-2 w-3/4">
                    <div className="h-2 bg-slate-100 rounded w-1/2" />
                    <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* StatusInsight Notification Banner Box Placeholder */}
        <div className="p-6 rounded-[40px] mt-4 bg-white border border-slate-200/60 flex gap-6 items-center">
          <div className="w-16 h-16 bg-slate-100 rounded-3xl shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-200 rounded-md w-1/4" />
            <div className="h-3 bg-slate-100 rounded-md w-3/4" />
          </div>
          <div className="h-10 bg-slate-200 rounded-2xl w-32 hidden md:block" />
        </div>

        {/* Milestones Header Divider */}
        <div className="mb-4 mt-8 flex justify-between items-center">
          <div className="h-3 bg-slate-200 rounded w-36" />
          <div className="h-4 bg-slate-200 rounded w-24" />
        </div>

        {/* Milestones 2-Column Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center p-5 bg-white rounded-[24px] border border-slate-100 shadow-sm"
            >
              <div className="w-10 h-10 rounded-full bg-slate-100 shrink-0" />
              <div className="flex-1 ml-4 space-y-2">
                <div className="h-3.5 bg-slate-200 rounded-md w-1/2" />
                <div className="h-2.5 bg-slate-100 rounded-md w-3/4" />
              </div>
              <div className="h-5 bg-slate-100 rounded-md w-12 ml-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoanApplicationDetails;

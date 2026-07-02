import { useState } from "react";
import {
  ShieldCheck,
  Wallet,
  History,
  Users,
  Clock,
  ChevronRight,
  Info,
  BellDot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "react-query";
import {
  acceptGuarantorRequest,
  getGuarantorRequests,
  getGuarantorshipSummary,
} from "../../sdks/guarantorship/guarantorship";
import { useToast } from "../../contexts/ToastProvider";
import ReviewRequest from "../../components/guarantorship/ReviewRequest";
import GuaranteeAmount from "../../components/guarantorship/Guarantee";
import DeclineRequest from "../../components/guarantorship/DeclineRequest";
import FinalConfirmation from "../../components/guarantorship/FinalConfirmation";
import AcceptRequestSuccess from "../../components/guarantorship/AcceptRequestSuccess";
import DeclineRequestSuccess from "../../components/guarantorship/DeclineRequestSuccess";
import useAuth from "../../hooks/useAuth";
import { useFormatAmount } from "../../hooks/useFormatAmount";
import { useFormattedDate } from "../../hooks/useFormattedDate";

const Guarantorship = () => {
  const [activeTab, setActiveTab] = useState("Requests");
  const [summary, setSummary] = useState({});
  const [requests, setRequests] = useState([]);
  const [showReviewRequest, setShowReviewRequest] = useState(false);
  const [showGuaranteeAmount, setShowGuaranteeAmount] = useState(false);
  const [showDeclineRequest, setShowDeclineRequest] = useState(false);
  const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);
  const [showAcceptRequestSuccess, setShowAcceptRequestSuccess] =
    useState(false);
  const [showDeclineRequestSuccess, setShowDeclineRequestSuccess] =
    useState(false);
  const { showToast } = useToast();
  const [requestDetails, setRequestDetails] = useState({});
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const { auth } = useAuth();
  const formatAmount = useFormatAmount();
  const formatDate = useFormattedDate();

  const { isFetching, refetch: refetchSummary } = useQuery({
    queryKey: ["guarantorship summary"],
    queryFn: async () => {
      const response = await getGuarantorshipSummary(auth?.user?.id);
      return response.data?.data;
    },
    onSuccess: (data) => {
      setSummary(data);
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

  const { refetch: refetchRequests } = useQuery({
    queryKey: ["guarantor requests"],
    queryFn: async () => {
      const response = await getGuarantorRequests(auth?.user?.id);
      return response.data.data?.requests;
    },
    onSuccess: (data) => {
      setRequests(data);
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

  const { mutate: acceptGuarantorMutate, isLoading: confirmingRequest } =
    useMutation({
      mutationKey: ["accept guarantor request"],
      mutationFn: () =>
        acceptGuarantorRequest(
          requestDetails?.id,
          amount,
          "I have a strong faith in the borrower ability to repay a loan",
          "approve",
          auth?.user?.id,
        ),
      onSuccess: () => {
        setAmount("");
        handeRefetch();
        setShowFinalConfirmation(false);
        setShowAcceptRequestSuccess(true);
      },
      onError: (error) => {
        showToast({
          title: "Error!",
          type: "error",
          position: "top-right",
          description: error?.response?.data?.message || error.message,
        });
      },
    });

  const { mutate: declineGuarantorMutate, isLoading: declingRequest } =
    useMutation({
      mutationKey: ["decline guarantor request"],
      mutationFn: () =>
        acceptGuarantorRequest(
          requestDetails?.id,
          0,
          reason,
          "decline",
          auth?.user?.id,
        ),
      onSuccess: () => {
        setReason("");
        handeRefetch();
        setShowDeclineRequest(false);
        setShowDeclineRequestSuccess(true);
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

  const getInitials = (name) => {
    if (!name) return "??";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handeRefetch = async () => {
    await refetchRequests();
    await refetchSummary();
  };

  const formatKES = (amount) => {
    // Handle cases where amount might be 0 or null
    const numericAmount = Number(amount) || 0;

    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      currencyDisplay: "code",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericAmount);
  };

  return (
    <>
      <ReviewRequest
        isOpen={showReviewRequest}
        onClose={() => setShowReviewRequest(false)}
        request={requestDetails}
        onContinue={() => {
          setShowReviewRequest(false);
          setShowGuaranteeAmount(true);
        }}
        onDecline={() => {
          setShowReviewRequest(false);
          setShowDeclineRequest(true);
        }}
      />
      <GuaranteeAmount
        isOpen={showGuaranteeAmount}
        onClose={() => setShowGuaranteeAmount(false)}
        onContinue={() => {
          setShowGuaranteeAmount(false);
          setShowFinalConfirmation(true);
        }}
        amount={amount}
        setAmount={setAmount}
      />

      <DeclineRequest
        isOpen={showDeclineRequest}
        onClose={() => setShowDeclineRequest(false)}
        reason={reason}
        setReason={setReason}
        isLoading={declingRequest}
        onFinalize={declineGuarantorMutate}
      />

      <FinalConfirmation
        isOpen={showFinalConfirmation}
        onClose={() => setShowFinalConfirmation(false)}
        request={requestDetails}
        guaranteeAmount={amount}
        isLoading={confirmingRequest}
        onFinalize={acceptGuarantorMutate}
      />

      <AcceptRequestSuccess
        isOpen={showAcceptRequestSuccess}
        onClose={() => setShowAcceptRequestSuccess(false)}
        loanCode={requestDetails?.loanInfo?.loancode}
      />

      <DeclineRequestSuccess
        isOpen={showDeclineRequestSuccess}
        onClose={() => setShowDeclineRequestSuccess(false)}
      />
      {isFetching ? (
        <div className="bg-slate-50 animate-pulse">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Skeleton */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="h-9 w-48 bg-slate-200 rounded-lg" />
                <div className="h-5 w-64 bg-slate-200 rounded-md" />
              </div>
              <div className="h-10 w-40 bg-slate-200 rounded-full" />
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 mb-4" />
                  <div className="h-3 w-24 bg-slate-100 rounded mb-2" />
                  <div className="h-7 w-32 bg-slate-200 rounded mb-2" />
                  <div className="h-2 w-20 bg-slate-100 rounded" />
                </div>
              ))}
            </div>

            {/* Main Content Card Skeleton */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-blue-900/5 min-h-[500px]">
              <div className="flex border-b border-slate-100 px-8 gap-8">
                <div className="py-4 w-24 h-12 border-b-4 border-slate-100" />
                <div className="py-4 w-32 h-12 border-b-4 border-slate-100" />
              </div>

              <div className="p-4 space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0" />
                    <div className="flex-grow space-y-3">
                      <div className="flex justify-between">
                        <div className="h-4 w-1/2 bg-slate-200 rounded" />
                        <div className="h-4 w-16 bg-slate-200 rounded-full" />
                      </div>
                      <div className="flex gap-4">
                        <div className="h-3 w-20 bg-slate-100 rounded" />
                        <div className="h-3 w-20 bg-slate-100 rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
          <div className="max-w-6xl sm:px-4 mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-mediuk text-primary">
                  Guarantorship
                </h1>
                <p className="text-slate-500 font-medium">
                  Manage and track your loan guarantees.
                </p>
              </div>
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${
                  Number(summary?.available_to_guarantee) !== 0
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                    : "bg-rose-50 border-rose-100 text-rose-700"
                }`}
              >
                <ShieldCheck size={18} />
                <span className="text-sm font-bold">
                  {Number(summary?.available_to_guarantee) !== 0
                    ? "Eligible to Guarantee"
                    : "Not Eligible"}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                icon={<History className="text-blue-500" />}
                label="Active Guarantees"
                value={summary?.guaranteed_loans?.length}
                sub="Current Loans"
              />
              <StatCard
                icon={<Wallet className="text-emerald-500" />}
                label="Available Balance"
                value={formatKES(summary?.available_to_guarantee)}
                sub="To guarantee"
              />
              <StatCard
                icon={<Users className="text-amber-500" />}
                label="Total Guaranteed"
                value={formatKES(summary?.currently_guaranteed_amount)}
                sub="Cumulative amount"
              />
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-blue-900/5 overflow-hidden min-h-[500px]">
              {/* Tab Navigation */}
              <div className="flex border-b border-slate-100 px-8">
                <button
                  onClick={() => setActiveTab("Requests")}
                  className={`py-4 px-4 text-sm font-medium uppercase tracking-widest transition-all relative ${activeTab === "Requests" ? "text-primary" : "text-slate-400"}`}
                >
                  Requests
                  {activeTab === "Requests" && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 w-full h-1 bg-secondary"
                    />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("Loans")}
                  className={`py-4 px-4 text-sm font-medium uppercase tracking-widest transition-all relative ${activeTab === "Loans" ? "text-primary" : "text-slate-400"}`}
                >
                  Guaranteed Loans
                  {activeTab === "Loans" && (
                    <motion.div
                      layoutId="tab-underline"
                      className="absolute bottom-0 left-0 w-full h-1 bg-secondary"
                    />
                  )}
                </button>
              </div>

              <div className="p-4">
                <AnimatePresence mode="wait">
                  {activeTab === "Requests" ? (
                    <motion.div
                      key="requests"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-4"
                    >
                      {requests?.length > 0 ? (
                        requests?.map((request) => {
                          // 1. Extract values with safe optional chaining fallbacks
                          const borrowerName =
                            request?.borrower?.name ?? "A borrower";
                          const amount = request?.application?.applied_amount
                            ? formatAmount(request.application.applied_amount)
                            : "$0";
                          const productName =
                            request?.product?.product_name ?? "Loan";

                          // 2. Build your dynamic "asking" string template literal
                          const generatedMessage = `Hi! ${borrowerName} has requested your support as a guarantor for a ${amount} ${productName}. Could you please review and confirm your authorization?`;

                          return (
                            <div
                              key={request.id}
                              className="group flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-3xl bg-white border border-slate-100 md:bg-slate-100/50 md:border-transparent hover:border-slate-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300"
                            >
                              {/* Avatar Section - Scaled slightly for larger card */}
                              <div className="w-14 h-14 rounded-full bg-blue-100 shrink-0 flex items-center justify-center text-primary font-bold text-base">
                                {getInitials(request?.borrower?.name)}
                              </div>

                              <div className="flex-grow items-center">
                                <div className="flex justify-between items-center mb-1">
                                  <div className="flex flex-col gap-1">
                                    {/* Borrower Name as a premium subtitle + Product details and App ID */}
                                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                                      Request from {borrowerName} •{" "}
                                      {productName}
                                    </span>
                                    {/* Large Message Body - Guaranteed 2 lines */}
                                    <p className="text-base font-medium text-slate-800 pr-8 leading-snug line-clamp-4">
                                      {request?.message || generatedMessage}
                                    </p>
                                  </div>
                                </div>

                                {/* Metadata & Actions */}
                                <div className="flex sm:mt-3 items-center justify-between">
                                  <div className="flex-col items-start md:flex gap-3">
                                    <span className="text-xs text-slate-400 sm:mb-2 flex flex-wrap items-center gap-1.5 font-medium">
                                      <Clock
                                        size={14}
                                        className="text-slate-300"
                                      />{" "}
                                      {new Date(
                                        request?.created_at,
                                      ).toLocaleDateString(undefined, {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                      <span className="text-slate-200 mx-0.5">
                                        •
                                      </span>
                                      <span className="text-slate-400 font-semibold">
                                        Target: {amount}
                                      </span>
                                    </span>

                                    <button
                                      onClick={() => {
                                        setRequestDetails(request);
                                        setShowReviewRequest(true);
                                      }}
                                      className="text-xs font-medium text-secondary uppercase tracking-wider hover:text-primary transition-colors flex items-center gap-1"
                                    >
                                      View Full Request Details
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* Chevron & Status badge utility wrapper */}
                              <div className="sm:w-full h-14 flex md:gap-3 justify-between items-center">
                                <StatusBadge
                                  status={(
                                    request?.status_label || request?.status
                                  )?.toLowerCase()}
                                />
                                <ChevronRight
                                  size={20}
                                  onClick={() => {
                                    setRequestDetails(request);
                                    setShowReviewRequest(true);
                                  }}
                                  className="text-slate-300 cursor-pointer group-hover:text-secondary transition-transform group-hover:translate-x-1"
                                />
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <EmptyState
                          icon={BellDot}
                          title="No Pending Requests"
                          description="You're all caught up! New guarantee requests will appear here."
                        />
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="loans"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                      {summary?.guaranteed_loans?.length > 0 ? (
                        summary?.guaranteed_loans.map((loan, idx) => (
                          <div
                            key={idx}
                            className="p-6 rounded-2xl border border-slate-100 bg-slate-100/50 flex justify-between items-center"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                                {getInitials(loan?.borrower?.name)}
                              </div>
                              <div>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                                  {loan?.application.application_number}
                                </p>
                                <p className="text-sm font-bold text-primary">
                                  {loan?.borrower?.name}
                                </p>
                                <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                                  {formatDate(loan?.created_at)}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-medium text-slate-400">
                                Guaranteed
                              </p>
                              <p className="text-sm font-medium text-emerald-600">
                                {formatKES(loan?.amount_guaranteed)}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full">
                          <EmptyState
                            icon={ShieldCheck}
                            title="No Active Guarantees"
                            description="You haven't guaranteed any loans yet. Active guarantees will show up here."
                          />
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Info Footer */}
            <div className="bg-blue-50/50 rounded-2xl p-4 flex items-center gap-4 border border-blue-100/50">
              <Info className="text-blue-500 shrink-0" size={20} />
              <p className="text-xs leading-relaxed text-blue-800 font-medium">
                <strong>Important:</strong> As a guarantor, you are legally
                responsible for the loan amount in case of default. Ensure you
                have a personal agreement with the borrower and keep track of
                their repayment schedules. Available balance is calculated based
                on your total deposits minus current liabilities.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Sub-components for cleaner structure
const StatCard = ({ icon, label, value, sub }) => (
  <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
      {icon}
    </div>
    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-[0.1em]">
      {label}
    </p>
    <h3 className="text-xl font-medium text-primary my-1">{value}</h3>
    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
      {sub}
    </p>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rejected: "bg-rose-50 text-rose-600 border-rose-100",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-tighter border ${styles[status]}`}
    >
      {status}
    </span>
  );
};

const EmptyState = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-4 text-center"
  >
    <div className="relative mb-6">
      {/* Decorative background pulse */}
      <div className="absolute inset-0 scale-150 bg-slate-100/50 rounded-full blur-2xl" />
      <div className="relative w-20 h-20 bg-white rounded-3xl shadow-xl shadow-slate-200/50 flex items-center justify-center border border-slate-50">
        <Icon size={40} className="text-secondary" />
      </div>
    </div>
    <h3 className="text-lg font-medium text-primary mb-2 tracking-tight">
      {title}
    </h3>
    <p className="text-sm text-slate-400 max-w-[240px] leading-relaxed">
      {description}
    </p>
  </motion.div>
);

export default Guarantorship;

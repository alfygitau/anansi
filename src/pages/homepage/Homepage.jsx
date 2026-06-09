import React, { useMemo, useState } from "react";
import {
  TrendingUp,
  Wallet,
  ArrowDownCircle,
  PieChart,
  PlusCircle,
  FilePlus2,
  LayoutList,
  ShieldAlert,
  RefreshCcw,
  Eye,
  EyeOff,
  Copy,
  Grid2X2,
  FileText,
  Folder,
  ArrowRight,
  ShieldCheck,
  Users,
  ChevronRight,
  Briefcase,
  Info,
  Check,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import InvestAmount from "../../components/quick-invest/InvestAmount";
import ConfirmInvest from "../../components/quick-invest/ConfirmInvest";
import AwaitingPayment from "../../components/quick-invest/AwaitPayment";
import SharesAmount from "../../components/buy-shares/SharesAmount";
import ConfirmShares from "../../components/buy-shares/ConfirmShares";
import AwaitSharesPayment from "../../components/buy-shares/AwaitSharesPayment";
import DepositAmount from "../../components/deposit-savings/DepositAmount";
import ReviewDeposit from "../../components/deposit-savings/ConfirmDeposit";
import AwaitDepositPayment from "../../components/deposit-savings/AwaitDepositPayment";
import { motion } from "framer-motion";
import StartMembership from "../../components/membership/StartMembership";
import { useQuery } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import { getCustomer } from "../../sdks/customer/customer";
import JoinMembership from "../../components/membership/JoinMembership";
import SaveAndInvest from "../../components/membership/SaveInvest";
import SetupContributions from "../../components/membership/Contribute";
import ReviewMembership from "../../components/membership/ReviewMembership";
import ReviewRegistrationOnly from "../../components/membership/ReviewRegistrationOnly";
import AwaitingMembershipPayment from "../../components/membership/AwaitMembershipPayment";
import FailedMembershipPayment from "../../components/membership/FailedPayment";
import HomeLoader from "../../skeletons/HomeLoader";
import { getSharesSummary } from "../../sdks/accounts/accounts";
import useAuth from "../../hooks/useAuth";
import { useStore } from "../../store/useStore";
import { useFormatAmount } from "../../hooks/useFormatAmount";
import LoanTerms from "../../components/loan-terms-conditions/TermsAndCobditions";
import { getActiveLoans, getLoanProducts } from "../../sdks/loans/loans";
import LoanProductsLoader from "../../skeletons/LoanProductsLoader";
import { getActiveLoanApplications } from "../../sdks/applications/applications";

const Homepage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const setStoreAccounts = useStore((state) => state.setAccounts);
  const [loans, setLoans] = useState([]);
  const [loanProducts, setLoanProducts] = useState([]);
  const [loanApplications, setLoanApplications] = useState([]);
  const quickActions = [
    {
      id: "invest",
      label: "Quick Invest",
      description: "Grow savings and equity shares.",
      icon: <TrendingUp size={24} />,
      onClick: () => setShowInvestAmount(true),
    },
    {
      id: "deposit",
      label: "Deposit Savings",
      description: "Instant mobile cash top-up.",
      icon: <ArrowDownCircle size={24} />,
      onClick: () => setShowDepositAmount(true),
    },
    {
      id: "shares",
      label: "Buy Shares",
      description: "Purchase cooperative equity capital.",
      icon: <PieChart size={24} />,
      onClick: () => setShowSharesAmount(true),
    },
    {
      id: "loans",
      label: "View All Loans",
      description: "Check balances and schedules.",
      icon: <LayoutList size={24} />,
      onClick: () => navigate("/all-loans"),
    },
    {
      id: "products",
      label: "Loan Products",
      description: "Browse instant financing lines.",
      icon: <Grid2X2 size={24} />,
      onClick: () => navigate("/loan-products"),
    },
    {
      id: "applications",
      label: "Loan Applications",
      description: "Track your pending credit lines.",
      icon: <FileText size={24} />,
      onClick: () => navigate("/all-loan-applications"),
    },
    {
      id: "statements",
      label: "Statements",
      description: "Export certified ledger histories.",
      icon: <Folder size={24} />,
      onClick: () => navigate("/statements"),
    },
    {
      id: "guarantorship",
      label: "Guarantorship",
      description: "Review member loan endorsements.",
      icon: <Users size={24} />,
      onClick: () => navigate("/guarantorship"),
    },
  ];
  const { auth } = useAuth();
  const [showInvestAmount, setShowInvestAmount] = useState(false);
  const [showConfirmInvestment, setShowConfirmInvestment] = useState(false);
  const [showAwaitPayment, setShowAwaitPayment] = useState(false);
  const [showAwaitSharesPayment, setShowAwaitSharesPayment] = useState(false);
  const [showConfirmShares, setShowConfirmShares] = useState(false);
  const [showSharesAmount, setShowSharesAmount] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [showDepositAmount, setShowDepositAmount] = useState(false);
  const [showReviewDeposit, setShowReviewDeposit] = useState(false);
  const [showAwaitDepositPayment, setShowAwaitDepositPayment] = useState(false);
  const [showStartMembership, setShowStartMembership] = useState(false);
  const [showJoinMembership, setShowJoinMembership] = useState(false);
  const [showSaveAndInvest, setShowSaveAndInvest] = useState(false);
  const [showMakeContribution, setShowMakeContribution] = useState(false);
  const [showReviewMembership, setShowReviewMembership] = useState(false);
  const [showFailedMembershipPayment, setShowFailedMembershipPayment] =
    useState(false);
  const [showReviewRegistrationOnly, setShowReviewRegistrationOnly] =
    useState(false);
  const [showAwaitMembershipPayment, setShowAwaitMembershipPayment] =
    useState(false);
  const formatAmount = useFormatAmount();
  const [showLoanTerms, setShowLoanTerms] = useState(false);

  const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "0";

    return new Intl.NumberFormat("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const [currentShares, setCurrentShares] = useState(0);
  const targetShares = 10;
  const shareValue = 1000;
  const percentage = Math.min((currentShares / targetShares) * 100, 100);
  const remainingShares = Math.max(targetShares - currentShares, 0);

  const { refetch: refetchCustomerDetails, isFetching } = useQuery({
    queryKey: ["get accounts"],
    queryFn: async () => {
      const response = await getCustomer();
      return response.data.data;
    },
    onSuccess: (data) => {
      setAccounts(data?.accounts);
      setStoreAccounts(data?.accounts || []);
      if (!data?.member) {
        setShowStartMembership(true);
      }
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

  const { refetch: refetchSharesSummary, isFetching: loadingShares } = useQuery(
    {
      queryKey: ["get shares summary"],
      queryFn: async () => {
        const response = await getSharesSummary(auth?.user?.public_id);
        return response.data.data;
      },
      onSuccess: (data) => {
        setCurrentShares(data?.numberOfShares);
      },
    },
  );

  const { isFetching: loadingProducts } = useQuery({
    queryKey: ["explore products"],
    queryFn: async () => {
      const response = await getLoanProducts();
      return response?.data?.data;
    },
    onSuccess: (data) => {
      setLoanProducts(data);
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

  const sortedAccounts = useMemo(() => {
    if (!accounts) return [];
    return [...accounts].sort((a, b) => {
      const isASavings = a?.product?.name === "Savings";
      const isBSavings = b?.product?.name === "Savings";
      return isASavings === isBSavings ? 0 : isASavings ? -1 : 1;
    });
  }, [accounts]);

  const { isFetching: loadingApplications } = useQuery({
    queryKey: ["all active applications"],
    queryFn: async () => {
      const response = await getActiveLoanApplications(auth?.user?.id);
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

  const { isFetching: loadingLoans } = useQuery({
    queryKey: ["all active loans"],
    queryFn: async () => {
      const response = await getActiveLoans(auth?.user?.id);
      return response?.data?.data;
    },
    onSuccess: (data) => {
      setLoans(data?.loans);
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
    <>
      <LoanTerms
        isOpen={showLoanTerms}
        onClose={() => setShowLoanTerms(false)}
      />

      <InvestAmount
        isOpen={showInvestAmount}
        onClose={() => setShowInvestAmount(false)}
        onConfirm={() => {
          setShowInvestAmount(false);
          setShowConfirmInvestment(true);
        }}
      />

      <ConfirmInvest
        isOpen={showConfirmInvestment}
        onClose={() => setShowConfirmInvestment(false)}
        onConfirm={() => {
          setShowConfirmInvestment(false);
          setShowAwaitPayment(true);
        }}
      />

      <AwaitingPayment
        isOpen={showAwaitPayment}
        onClose={() => setShowAwaitPayment(false)}
        onPaymentSuccess={() => {
          setShowAwaitPayment(false);
          refetchCustomerDetails();
          refetchSharesSummary();
        }}
      />

      <SharesAmount
        isOpen={showSharesAmount}
        onClose={() => setShowSharesAmount(false)}
        onConfirm={() => {
          setShowSharesAmount(false);
          setShowConfirmShares(true);
        }}
      />

      <ConfirmShares
        isOpen={showConfirmShares}
        onClose={() => setShowConfirmShares(false)}
        onConfirm={() => {
          setShowConfirmShares(false);
          setShowAwaitSharesPayment(true);
        }}
      />

      <AwaitSharesPayment
        isOpen={showAwaitSharesPayment}
        onClose={() => setShowAwaitSharesPayment(false)}
        onPaymentSuccess={() => {
          setShowAwaitSharesPayment(false);
          refetchCustomerDetails();
        }}
      />

      <DepositAmount
        isOpen={showDepositAmount}
        onClose={() => setShowDepositAmount(false)}
        onConfirm={() => {
          setShowDepositAmount(false);
          setShowReviewDeposit(true);
        }}
      />

      <ReviewDeposit
        isOpen={showReviewDeposit}
        onClose={() => setShowReviewDeposit(false)}
        onConfirm={() => {
          setShowReviewDeposit(false);
          setShowAwaitDepositPayment(true);
        }}
      />

      <AwaitDepositPayment
        isOpen={showAwaitDepositPayment}
        onClose={() => setShowAwaitDepositPayment(false)}
        onPaymentSuccess={() => {
          refetchCustomerDetails();
          setShowAwaitDepositPayment(false);
        }}
      />

      <StartMembership
        isOpen={showStartMembership}
        onPay={() => {
          setShowStartMembership(false);
          setShowJoinMembership(true);
        }}
        onLogout={() => {}}
      />

      <JoinMembership
        isOpen={showJoinMembership}
        onClose={() => {
          refetchCustomerDetails();
          setShowJoinMembership(false);
        }}
        onNext={() => {
          setShowJoinMembership(false);
          setShowSaveAndInvest(true);
        }}
      />

      <SaveAndInvest
        isOpen={showSaveAndInvest}
        onClose={() => {
          refetchCustomerDetails();
          setShowSaveAndInvest(false);
        }}
        onCombine={() => {
          setShowSaveAndInvest(false);
          setShowMakeContribution(true);
        }}
        onNext={() => {
          setShowSaveAndInvest(false);
          setShowReviewRegistrationOnly(true);
        }}
      />

      <SetupContributions
        isOpen={showMakeContribution}
        onClose={() => {
          refetchCustomerDetails();
          setShowMakeContribution(false);
        }}
        onNext={() => {
          setShowMakeContribution(false);
          setShowReviewMembership(true);
        }}
      />

      <ReviewMembership
        isOpen={showReviewMembership}
        onClose={() => {
          refetchCustomerDetails();
          setShowReviewMembership(false);
        }}
        onNext={() => {
          setShowReviewMembership(false);
          setShowAwaitMembershipPayment(true);
        }}
      />

      <ReviewRegistrationOnly
        isOpen={showReviewRegistrationOnly}
        onClose={() => {
          refetchCustomerDetails();
          setShowReviewRegistrationOnly(false);
        }}
        onNext={() => {
          setShowReviewRegistrationOnly(false);
          setShowAwaitMembershipPayment(true);
        }}
      />

      <AwaitingMembershipPayment
        isOpen={showAwaitMembershipPayment}
        onClose={() => {
          refetchCustomerDetails();
          setShowAwaitMembershipPayment(false);
        }}
        onNext={() => {
          setShowAwaitMembershipPayment(false);
        }}
        refetch={refetchCustomerDetails}
        onFail={() => {
          setShowAwaitMembershipPayment(false);
          setShowFailedMembershipPayment(true);
        }}
      />

      <FailedMembershipPayment
        isOpen={showFailedMembershipPayment}
        onClose={() => setShowFailedMembershipPayment(false)}
        onTryAgain={() => {
          setShowFailedMembershipPayment(false);
          setShowAwaitMembershipPayment(true);
        }}
        onConfirmManual={() => {
          setShowFailedMembershipPayment(false);
          setShowAwaitMembershipPayment(true);
        }}
      />

      <div className="max-w-6xl sm:px-4 mx-auto">
        <header className="flex justify-between mb-3 items-center">
          <div>
            <h1 className="text-2xl text-primary font-medium tracking-tight">
              Home
            </h1>
            <p className="text-sm text-slate-500">
              Welcome back to your financial overview.
            </p>
          </div>
        </header>
        {/*  */}
        {loadingShares ? (
          <div className="mb-6 w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-pulse">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Left Content Skeleton */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-200 rounded-xl" />
                  <div className="h-6 w-40 bg-slate-200 rounded-md" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-full max-w-[400px] bg-slate-100 rounded" />
                  <div className="h-4 w-full max-w-[350px] bg-slate-100 rounded" />
                </div>
                <div className="h-8 w-56 bg-slate-100 rounded-lg" />
              </div>

              {/* Right Progress Skeleton */}
              <div className="w-full lg:w-[340px] space-y-5">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className="h-3 w-20 bg-slate-200 rounded" />
                    <div className="h-3 w-10 bg-slate-200 rounded" />
                  </div>
                  <div className="h-4 w-full bg-slate-100 rounded-full" />
                  <div className="h-3 w-24 bg-slate-100 rounded ml-auto" />
                </div>
                <div className="h-14 w-full bg-slate-200 rounded-2xl" />
              </div>
            </div>
          </div>
        ) : Number(currentShares) < 10 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="mb-6 w-full mx-auto border border-cyan-100 bg-gradient-to-br from-[#F0FFFE] to-white p-4 shadow-sm shadow-cyan-900/5 rounded-2xl"
          >
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Text Content Area */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-secondary shadow-lg shadow-blue-900/20">
                    <ShieldCheck size={22} />
                  </div>
                  <h3 className="text-lg font-medium uppercase tracking-tight text-primary">
                    Membership Progress
                  </h3>
                </div>

                <p className="max-w-[550px] text-[15px] leading-relaxed text-slate-600">
                  To unlock{" "}
                  <span className="font-bold text-slate-900">
                    full membership benefits
                  </span>{" "}
                  and access various loan products, you need a minimum of{" "}
                  <span className="font-bold text-primary">
                    10 shares (KES 10,000)
                  </span>
                  .
                </p>

                {remainingShares > 0 && (
                  <div className="inline-flex items-center gap-2 rounded-lg bg-white/60 px-3 py-1.5 border border-cyan-100">
                    <Wallet size={14} className="text-cyan-600" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800">
                      {formatAmount(remainingShares * shareValue)}&nbsp;
                      remaining to reach goal
                    </span>
                  </div>
                )}
              </div>

              {/* Progress and Action Area */}
              <div className="w-full lg:w-[340px] space-y-5">
                <div className="space-y-2">
                  <div className="flex items-end justify-between px-1">
                    <span className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
                      Shares Acquired
                    </span>
                    <span className="text-[13px] font-medium text-primary">
                      {percentage.toFixed(1)}%
                    </span>
                  </div>

                  <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-100 p-1 shadow-inner border border-slate-200/50">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1.2, ease: "circOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-[#074073] relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                    </motion.div>
                  </div>

                  <p className="px-1 text-right text-[12px] font-bold text-slate-500">
                    {formatNumber(currentShares)}&nbsp;
                    <span className="text-slate-300">/</span> 10 Shares
                  </p>
                </div>

                <button
                  onClick={() => setShowSharesAmount(true)}
                  className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-primary px-8 text-xs font-medium uppercase tracking-widest text-white shadow-xl shadow-blue-900/20 transition-all hover:bg-[#062d7a] active:scale-[0.98]"
                >
                  Buy Shares
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1 text-secondary"
                  />
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}

        {/* Account Section */}
        {/* MASTER DASHBOARD COMPACT SECTION GRID GRID */}
        <div className="w-full space-y-8 mb-6">
          {/* TOP PANEL: FULL-WIDTH ACTIVE ACCOUNTS LIST */}
          <div className="w-full space-y-3">
            <h2 className="text-[12px] font-medium uppercase tracking-[0.2em] text-slate-400 pl-1">
              Active Accounts
            </h2>

            {/* Layout wrapper scales seamlessly into full-width configurations */}
            <div className="w-full space-y-4">
              {isFetching ? (
                Array.from({ length: 2 }).map((_, idx) => (
                  <AccountCardSkeleton key={idx} />
                ))
              ) : sortedAccounts?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedAccounts.map((account, index) => (
                    <AccountCard
                      key={account.id || index}
                      title={account?.product?.name || "Savings Account"}
                      accountNumber={account.account_number || "ACC-XXXXX"}
                      balance={formatAmount(account?.balance)}
                      isPrimary={account?.product?.name === "Savings"}
                      navigateToAccountDetails={() =>
                        navigate(
                          `/account-details/${account.id}/${account.account_number}`,
                        )
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-100 rounded-[28px] p-8 min-h-[180px] flex flex-col items-center justify-center text-center select-none">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 mb-3 shadow-inner">
                    <WalletCards size={20} strokeWidth={1.5} />
                  </div>
                  <div className="max-w-[280px] space-y-1">
                    <h4 className="text-[14px] font-bold text-slate-800 tracking-tight">
                      No active accounts found
                    </h4>
                    <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
                      There are no transactional ledger spaces or savings
                      portfolios linked to this profile registry yet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM PANEL: PREMIUM FULL-WIDTH BENTO QUICK ACTIONS */}
          <div className="w-full flex flex-col">
            {/* Micro-Header */}
            <h2 className="text-[12px] font-medium uppercase tracking-[0.15em] text-slate-400 mb-3 pl-0.5">
              Quick Actions
            </h2>

            {/* Updated Grid: Adaptive 1 column on mobile, 2 columns on tablet, 4 columns on large desktop */}
            {/* Premium Compact Matrix Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 w-full">
              {quickActions.map(({ id, label, description, icon, onClick }) => (
                <div
                  key={id}
                  onClick={onClick}
                  className="group relative flex items-center justify-between p-3.5 cursor-pointer bg-white border border-slate-200 rounded-xl transition-all duration-200 select-none overflow-hidden h-[76px] hover:border-slate-300 hover:shadow-[0_8px_20px_rgba(15,23,42,0.03)] active:scale-[0.99]"
                >
                  {/* Content Cluster: Icon Plate + Text Wrapper Side-by-Side */}
                  <div className="flex items-center gap-3 min-w-0 pl-1">
                    {/* Compact Icon Plate */}
                    <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center border border-slate-100 transition-all duration-300 group-hover:bg-[#074073] group-hover:text-white group-hover:border-[#074073] shrink-0">
                      {React.cloneElement(icon, {
                        size: 16,
                        strokeWidth: 2.2,
                        className:
                          "shrink-0 transition-transform duration-200 group-hover:scale-105",
                      })}
                    </div>

                    {/* Text Blocks (Truncated perfectly to ensure no text overflows) */}
                    <div className="flex flex-col min-w-0">
                      <span className="block text-[12px] font-bold text-slate-800 tracking-tight leading-snug group-hover:text-[#074073] transition-colors truncate">
                        {label}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium tracking-tight leading-normal mt-0.5 truncate pr-2">
                        {description}
                      </span>
                    </div>
                  </div>

                  {/* Fine Minimalist Trailing Arrow */}
                  <div className="text-slate-300 group-hover:text-[#074073] group-hover:translate-x-0.5 transition-all duration-200 shrink-0 pr-1">
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
                </div>
              ))}
            </div>
          </div>
        </div>

        <h2 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-1">
          Loans & Applications
        </h2>

        {/* Side-by-Side: Applications and Loans */}
        <div className="grid grid-cols-1 mb-3 lg:grid-cols-2 gap-8">
          {/* Right Side: Active Loans */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-primary font-medium">Recent Loans</h2>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                {loans?.length} Running
              </span>
            </div>
            {loadingLoans ? (
              <div className="p-3 overflow-y-auto">
                {Array.from({ length: 2 }).map((_, index) => (
                  <LoanItemSkeleton key={`loan-skeleton-${index}`} />
                ))}
              </div>
            ) : loans?.length > 0 ? (
              <div className="h-[450px] p-2 rounded-[18px] overflow-y-auto border">
                {loans?.map((loan) => (
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
              <div className="h-[450px] w-full">
                <EmptyState
                  message="No active loans found"
                  onApply={() => navigate("/loan-products")}
                />
              </div>
            )}
          </section>
          {/* Left Side: Pending Applications */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg text-primary font-medium">
                Loan Applications
              </h2>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                {loanApplications?.length} Pending
              </span>
            </div>
            {loadingApplications ? (
              <div className="p-3 overflow-y-auto">
                {Array.from({ length: 4 }).map((_, index) => (
                  <ApplicationSkeleton key={`skeleton-${index}`} />
                ))}
              </div>
            ) : loanApplications?.length > 0 ? (
              <div className="h-[450px] p-2 rounded-[18px] overflow-y-auto border">
                {loanApplications?.map((app, index) => (
                  <ApplicationItem
                    key={app.reference}
                    title={app?.product?.name}
                    date={app?.application_date}
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
              <div className="h-[450px] w-full">
                <EmptyState
                  message="No pending applications"
                  onApply={() => navigate("/loan-products")}
                />
              </div>
            )}
          </section>
        </div>

        {/* Smaller Quick Actions */}
        <section>
          <h2 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Explore Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
            {loadingProducts ? (
              <LoanProductsLoader />
            ) : loanProducts?.length > 0 ? (
              loanProducts?.map((product) => (
                <DetailedProductCard
                  key={product.id}
                  product={product}
                  onApply={() => navigate(`/loan-eligibility/${product?.id}`)}
                  onTerms={() => setShowLoanTerms(true)}
                  onNavigate={() => navigate(`/loan-products/${product?.id}`)}
                />
              ))
            ) : (
              <ProductsEmptyState />
            )}
          </div>
        </section>
      </div>
    </>
  );
};

/* --- Sub-Components --- */
const LoanItemSkeleton = () => {
  return (
    <div className="mb-4 rounded-[30px] bg-white border border-slate-100/60 shadow-sm animate-pulse select-none">
      <div className="flex flex-col">
        {/* Header Placeholder */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3.5">
          <div className="flex flex-col space-y-2 w-1/2">
            {/* Title Line */}
            <div className="h-4 bg-slate-100 rounded-md w-3/4" />
            {/* ID Subtext Line */}
            <div className="h-3 bg-slate-100 rounded-md w-1/3" />
          </div>
          <div className="flex flex-col items-end space-y-2 w-1/4">
            {/* MATURITY Label */}
            <div className="h-2.5 bg-slate-100 rounded-md w-14" />
            {/* Maturity Date Value */}
            <div className="h-3.5 bg-slate-100 rounded-md w-20" />
          </div>
        </div>

        {/* Stats Box Placeholder */}
        <div className="mx-4 flex items-center justify-between rounded-[22px] bg-[#F8FAFC] px-5 py-4 border border-gray-100/50">
          <div className="space-y-2">
            {/* PRINCIPAL Label */}
            <div className="h-2.5 bg-slate-200/60 rounded-md w-16" />
            {/* Principal Amount Value */}
            <div className="h-4 bg-slate-100 rounded-md w-24" />
          </div>

          {/* Vertical Separator Divider Line */}
          <div className="h-8 w-[1px] bg-slate-200" />

          <div className="flex flex-col items-end space-y-2">
            {/* CURRENT BALANCE Label */}
            <div className="h-2.5 bg-slate-200/60 rounded-md w-24" />
            {/* Balance Value */}
            <div className="h-4 bg-slate-100 rounded-md w-24" />
          </div>
        </div>

        {/* Footer Placeholder */}
        <div className="flex items-center justify-between px-6 pt-4 pb-5">
          {/* Status Capsule Pill */}
          <div className="h-6 bg-slate-100 rounded-full w-20" />

          {/* View Details Target Link */}
          <div className="h-3 bg-slate-100 rounded-md w-16" />
        </div>
      </div>
    </div>
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

const DetailedProductCard = ({ product, onApply, onTerms, onNavigate }) => {
  const {
    product_name,
    description,
    interest_rate,
    max_amount,
    max_period,
    interest_key,
  } = product;
  const formatAmount = useFormatAmount();
  return (
    <div
      onClick={onNavigate}
      className="group bg-white cursor-pointer rounded-[32px] border border-slate-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all overflow-hidden mb-6"
    >
      {/* Top Section: Icon, Rate, and Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-5">
          {/* Main Icon Box */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: `#0421591A`, color: "#042159" }}
          >
            <Briefcase size={28} strokeWidth={1.5} />
          </div>

          {/* Rate Badge */}
          <span className="text-[11px] font-medium uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
            {Number(interest_rate)?.toFixed(1)}% {interest_key}
          </span>
        </div>

        {/* Title and Description */}
        <div className="mb-6">
          <h3 className="text-xl font-medium text-slate-900 tracking-tight mb-2 group-hover:text-secondary transition-colors">
            {product_name}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed max-w-md">
            {description}
          </p>
        </div>

        {/* Info Grid (Mimicking the Flutter _buildInfoColumn) */}
        <div className="flex items-center justify-between py-4 border-t border-slate-50">
          <InfoColumn label="MAX AMOUNT" value={formatAmount(max_amount)} />
          <div className="h-8 w-px bg-slate-100" /> {/* Vertical Divider */}
          <InfoColumn label="TENURE" value={max_period} />
          <div className="h-8 w-px bg-slate-100" /> {/* Vertical Divider */}
          <InfoColumn label="REPAYMENT" value="Monthly" />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
        <div
          onClick={(event) => {
            event.stopPropagation();
            onTerms();
          }}
          className="flex items-center cursor-pointer gap-1 text-[10px] font-semibold text-slate-400"
        >
          <Info size={12} />
          <span>Terms & Conditions apply</span>
        </div>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onApply();
          }}
          className="px-6 py-2.5 bg-[#042159] text-white text-[11px] font-medium uppercase tracking-widest rounded-xl shadow-lg shadow-blue-900/10 hover:bg-secondary transition-all active:scale-95"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

const InfoColumn = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[9px] font-medium text-slate-400 tracking-wider uppercase">
      {label}
    </span>
    <span className="text-xs font-bold text-slate-700">{value}</span>
  </div>
);

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

const AccountCard = ({
  title,
  balance,
  accountNumber,
  isPrimary,
  navigateToAccountDetails,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const maskedBalance = isVisible ? balance : "KES *********";
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(accountNumber);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text into buffer framework: ", err);
    }
  };
  return (
    <div
      onClick={navigateToAccountDetails}
      className={`p-5 py-6 cursor-pointer rounded-[25px] transition-all relative overflow-hidden group ${
        isPrimary ? "bg-primary text-white" : "bg-white border border-slate-200"
      }`}
    >
      {/* Header Row */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p
            className={`text-[10px] font-medium uppercase tracking-widest ${
              isPrimary ? "text-blue-300/70" : "text-slate-400"
            }`}
          >
            {title}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <p
              className={`text-xs font-mono ${isPrimary ? "text-white/60" : "text-slate-500"}`}
            >
              {accountNumber}
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className={`transition-all duration-200 focus:outline-none focus:ring-0 ${
                isCopied ? "opacity-100" : "opacity-0 group-hover:opacity-100" // Hidden until row hover
              }`}
            >
              {isCopied ? (
                <Check
                  size={10}
                  className="text-emerald-500 animate-in zoom-in duration-200"
                />
              ) : (
                <Copy
                  size={10}
                  className={
                    isPrimary
                      ? "text-slate-400 hover:text-white"
                      : "text-slate-300 hover:text-slate-600"
                  }
                />
              )}
            </button>
          </div>
        </div>
        <div className="p-2">
          <Wallet
            size={20}
            className={isPrimary ? "text-blue-300" : "text-slate-300"}
          />
        </div>
      </div>

      {/* Balance Row */}
      <div className="flex justify-between items-end">
        <div>
          <h3 className="text-3xl font-bold tracking-tight transition-all duration-300">
            {isVisible ? balance : maskedBalance}
          </h3>
        </div>

        {/* Visibility Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(!isVisible);
          }}
          className={`p-2 rounded-full transition-colors ${
            isPrimary ? "hover:bg-white/10" : "hover:bg-slate-100"
          }`}
        >
          {isVisible ? (
            <EyeOff
              size={20}
              className={isPrimary ? "text-blue-300" : "text-slate-400"}
            />
          ) : (
            <Eye
              size={20}
              className={isPrimary ? "text-blue-300" : "text-slate-400"}
            />
          )}
        </button>
      </div>
    </div>
  );
};

const AccountCardSkeleton = () => {
  return (
    <div className="p-5 py-5 rounded-[25px] border border-slate-100 bg-white animate-pulse select-none flex flex-col justify-between">
      {/* Header Row Placeholder */}
      <div className="flex justify-between items-start mb-6">
        <div className="space-y-2 flex-1">
          {/* Account Title Label (e.g. Savings Account) */}
          <div className="h-2.5 bg-slate-200 rounded w-1/3" />

          {/* Account Number Block */}
          <div className="h-3.5 bg-slate-100 rounded w-1/2" />
        </div>

        {/* Wallet Icon Housing */}
        <div className="w-9 h-9 rounded-xl bg-slate-100 shrink-0 mt-1" />
      </div>

      {/* Balance Footer Row Placeholder */}
      <div className="flex justify-between items-end">
        <div>
          {/* Main Account Balance String Line */}
          <div className="h-8 bg-slate-200 rounded-xl w-44" />
        </div>

        {/* Eye Visibility Action Circle Badge */}
        <div className="w-9 h-9 rounded-full bg-slate-100 shrink-0" />
      </div>
    </div>
  );
};

const ProductsEmptyState = () => (
  <div className="col-span-full py-12 px-6 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
    {/* Subtle Background Decoration */}
    <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12">
      <ShieldAlert size={80} />
    </div>

    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
      <ShieldAlert size={28} strokeWidth={1.5} />
    </div>

    <div className="text-center">
      <h3 className="text-sm font-bold text-primary uppercase tracking-wider">
        Products Temporarily Unavailable
      </h3>
      <p className="text-[11px] text-slate-400 mt-2 max-w-[240px] mx-auto leading-relaxed">
        We are currently updating our loan catalog to bring you better rates.
        Please check back in a few moments.
      </p>
    </div>

    <button
      onClick={() => window.location.reload()}
      className="mt-6 flex items-center gap-2 px-6 py-2 border border-slate-200 text-primary rounded-[7px] text-[10px] font-medium uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
    >
      <RefreshCcw size={14} />
      Refresh Catalog
    </button>
  </div>
);

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

const EmptyState = ({ message, onApply }) => (
  <div className="relative h-full w-full overflow-hidden border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center bg-white/50 bg-slate-900/40 group transition-all hover:border-secondary/30">
    {/* Decorative Background Glow */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-colors"></div>

    {/* Icon with Soft Background */}
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4 transition-transform group-hover:scale-110 group-hover:text-secondary duration-500">
      <FilePlus2 size={32} strokeWidth={1.5} />
    </div>

    {/* Text Content */}
    <div className="text-center mb-6">
      <p className="text-sm font-bold text-primary tracking-tight">{message}</p>
      <p className="text-[11px] text-slate-400 mt-1 max-w-[180px] mx-auto">
        Start a new application to access quick credit and growth funds.
      </p>
    </div>

    {/* Modern Button CTA */}
    <button
      onClick={onApply}
      className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-[7px] text-xs font-bold shadow-lg shadow-blue-900/20 hover:bg-secondary hover:shadow-secondary/20 transition-all active:scale-95"
    >
      <PlusCircle size={16} />
      Apply Now
    </button>
  </div>
);

export default Homepage;

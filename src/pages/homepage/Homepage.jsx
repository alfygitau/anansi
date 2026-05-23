import React, { useMemo, useState } from "react";
import {
  TrendingUp,
  Wallet,
  ArrowDownCircle,
  PieChart,
  Calculator,
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
  Hourglass,
  ChevronRight,
  Zap,
  HeartPulse,
  Briefcase,
  GraduationCap,
  Car,
  Home,
  Info,
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
import { allLoans, myLoanApplications } from "../../static/loans";
import LoanTerms from "../../components/loan-terms-conditions/TermsAndCobditions";

const allProducts = [
  {
    id: "prod_01",
    name: "Flash Emergency",
    cat: "Instant Loan",
    description:
      "Get instant funds for urgent bills and unexpected expenses within minutes.",
    icon: Zap,
    rate: "1.5%",
    maxAmount: "50,000",
    period: "1 Month",
    color: "#F59E0B",
  },
  {
    id: "prod_02",
    name: "Mortgage Plus",
    cat: "Housing",
    description:
      "Flexible financing options to help you own your dream home with ease.",
    icon: Home,
    rate: "9.0%",
    maxAmount: "15,000,000",
    period: "240 Months",
    color: "#042159",
  },
  {
    id: "prod_03",
    name: "Asset Financing",
    cat: "Vehicle",
    description:
      "Drive your ambition with low-interest loans for new and used vehicles.",
    icon: Car,
    rate: "11.5%",
    maxAmount: "3,500,000",
    period: "60 Months",
    color: "#3B82F6",
  },
  {
    id: "prod_04",
    name: "Edu-Advance",
    cat: "Education",
    description:
      "Invest in your future with specialized loans covering tuition and supplies.",
    icon: GraduationCap,
    rate: "8.5%",
    maxAmount: "500,000",
    period: "12 Months",
    color: "#8B5CF6",
  },
  {
    id: "prod_05",
    name: "SME Growth",
    cat: "Business",
    description:
      "Scale your business operations with working capital and equipment loans.",
    icon: Briefcase,
    rate: "13.0%",
    maxAmount: "10,000,000",
    period: "48 Months",
    color: "#10B981",
  },
  {
    id: "prod_06",
    name: "Medi-Shield",
    cat: "Medical",
    description:
      "Comprehensive medical loans to ensure health emergencies never catch you off guard.",
    icon: HeartPulse,
    rate: "7.0%",
    maxAmount: "1,200,000",
    period: "24 Months",
    color: "#EF4444",
  },
];

const Homepage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const setStoreAccounts = useStore((state) => state.setAccounts);
  const [loans, setLoans] = useState(allLoans);
  const [loanProducts, setLoanProducts] = useState(allProducts);
  const [loanApplications, setLoanApplications] = useState(myLoanApplications);
  const quickActions = [
    {
      id: 1,
      label: "Quick Invest & Save",
      icon: <TrendingUp size={24} />,
      onClick: () => setShowInvestAmount(true),
    },
    {
      id: 2,
      label: "Deposit Savings",
      icon: <ArrowDownCircle size={24} />,
      onClick: () => setShowDepositAmount(true),
    },
    {
      id: 3,
      label: "Buy Me Shares",
      icon: <PieChart size={24} />,
      onClick: () => setShowSharesAmount(true),
    },
    {
      id: 5,
      label: "View All Loans",
      icon: <LayoutList size={24} />,
      onClick: () => navigate("/all-loans"),
    },
    {
      id: 6,
      label: "Loan Products",
      icon: <Grid2X2 size={24} />,
      onClick: () => navigate("/loan-products"),
    },
    {
      id: 7,
      label: "Loan Applications",
      icon: <FileText size={24} />,
      onClick: () => navigate("/all-loan-applications"),
    },
    {
      id: 8,
      label: "View Statements",
      icon: <Folder size={24} />,
      onClick: () => navigate("/statements"),
    },
    {
      id: 9,
      label: "My Guarantorship",
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

  const sortedAccounts = useMemo(() => {
    if (!accounts) return [];
    return [...accounts].sort((a, b) => {
      const isASavings = a?.product?.name === "Savings";
      const isBSavings = b?.product?.name === "Savings";
      return isASavings === isBSavings ? 0 : isASavings ? -1 : 1;
    });
  }, [accounts]);

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

      {isFetching ? (
        <HomeLoader />
      ) : (
        <div className="max-w-6xl sm:px-4 mx-auto">
          <header className="flex justify-between mb-3 items-center">
            <div>
              <h1 className="text-2xl text-primary font-bold tracking-tight">Dashboard</h1>
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
                    <h3 className="text-lg font-black uppercase tracking-tight text-primary">
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
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                        Shares Acquired
                      </span>
                      <span className="text-[13px] font-black text-primary">
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
                    className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-primary px-8 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-blue-900/20 transition-all hover:bg-[#062d7a] active:scale-[0.98]"
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
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6 items-start">
            {/* LEFT PANEL: COMPACT ACCOUNT CARDS VECTORS (5 COLS) */}
            <div className="lg:col-span-5 space-y-3">
              <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-400 pl-1">
                Active Accounts
              </h2>
              <div className="space-y-5">
                {sortedAccounts?.length > 0 &&
                  sortedAccounts.map((account, index) => (
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
            </div>

            <div className="lg:col-span-7">
              {/* Micro-Header */}
              <h2 className="text-[12px] font-black uppercase tracking-[0.15em] text-slate-400 mb-3 pl-0.5">
                Quick Actions
              </h2>
              <div className="bg-slate-50/40 border border-slate-200/50 rounded-2xl p-2.5 flex flex-col justify-between">
                {/* High-Density Micro Matrix */}
                <div className="grid grid-cols-2 gap-2.5">
                  {quickActions.map(({ id, label, icon, onClick }) => (
                    <div
                      key={id}
                      onClick={onClick}
                      className="flex items-center gap-2.5 h-16 p-2.5 cursor-pointer group bg-white border border-slate-100 rounded-xl hover:border-primary transition-all duration-200 select-none shadow-sm"
                    >
                      {/* Action Icon Square Plate (Perfect 1:1 Match) */}
                      <div className="w-10 h-10 bg-slate-50 border border-slate-200/20 rounded-lg flex items-center justify-center text-slate-700 transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary shrink-0">
                        {React.cloneElement(icon, {
                          size: 18,
                          className:
                            "shrink-0 transition-transform duration-200 group-hover:scale-105",
                        })}
                      </div>

                      {/* Right Text Vector Column */}
                      <div className="min-w-0 flex-1">
                        <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400 group-hover:text-primary transition-colors leading-tight truncate">
                          {label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <h2 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-1">
            Loans & Applications
          </h2>

          {/* Side-by-Side: Applications and Loans */}
          <div className="grid grid-cols-1 mb-3 lg:grid-cols-2 gap-8">
            {/* Right Side: Active Loans */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Recent Loans</h2>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  {loans.length} Running
                </span>
              </div>
              {loans.length > 0 ? (
                loans.map((loan) => (
                  <LoanItem
                    key={loan.id}
                    title={loan.title}
                    id={loan.id}
                    amount={loan.amount}
                    balance={loan.balance}
                    status={loan.status}
                    statusColor={loan.statusColor}
                    maturityDate={loan.maturityDate}
                    onTap={() => navigate("/loan-details")}
                  />
                ))
              ) : (
                <EmptyState
                  message="No active loans found"
                  onApply={() => navigate("/loan-products")}
                />
              )}
            </section>
            {/* Left Side: Pending Applications */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Loan Applications</h2>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                  {loanApplications.length} Pending
                </span>
              </div>
              {loanApplications.length > 0 ? (
                loanApplications.map((app, index) => (
                  <ApplicationItem
                    key={app.reference || index}
                    reference={app.reference}
                    title={app.title}
                    date={app.date}
                    amount={app.amount}
                    status={app.status}
                    onTap={() => navigate("/loan-application-details")}
                  />
                ))
              ) : (
                <EmptyState
                  message="No pending applications"
                  onApply={() => navigate("/loan-products")}
                />
              )}
            </section>
          </div>

          {/* Smaller Quick Actions */}
          <section>
            <h2 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Explore Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {loanProducts.length > 0 ? (
                loanProducts.map((product) => (
                  <DetailedProductCard
                    key={product.id}
                    product={product}
                    onApply={() => {}}
                    onTerms={() => setShowLoanTerms(true)}
                  />
                ))
              ) : (
                <ProductsEmptyState />
              )}
            </div>
          </section>
        </div>
      )}
    </>
  );
};

/* --- Sub-Components --- */
const DetailedProductCard = ({ product, onApply, onTerms }) => {
  const {
    name,
    description,
    icon: Icon,
    rate,
    maxAmount,
    period,
    color = "#042159",
  } = product;

  return (
    <div className="group bg-white rounded-[32px] border border-slate-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all overflow-hidden mb-6">
      {/* Top Section: Icon, Rate, and Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-5">
          {/* Main Icon Box */}
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-300"
            style={{ backgroundColor: `${color}1A`, color: color }} // 1A = 10% opacity
          >
            <Icon size={28} strokeWidth={1.5} />
          </div>

          {/* Rate Badge */}
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
            {rate} P.A
          </span>
        </div>

        {/* Title and Description */}
        <div className="mb-6">
          <h3 className="text-xl font-medium text-slate-900 tracking-tight mb-2 group-hover:text-secondary transition-colors">
            {name}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed max-w-md">
            {description}
          </p>
        </div>

        {/* Info Grid (Mimicking the Flutter _buildInfoColumn) */}
        <div className="flex items-center justify-between py-4 border-t border-slate-50">
          <InfoColumn label="MAX AMOUNT" value={`KES ${maxAmount}`} />
          <div className="h-8 w-px bg-slate-100" /> {/* Vertical Divider */}
          <InfoColumn label="TENURE" value={period} />
          <div className="h-8 w-px bg-slate-100" /> {/* Vertical Divider */}
          <InfoColumn label="REPAYMENT" value="Monthly" />
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
        <div
          onClick={onTerms}
          className="flex items-center cursor-pointer gap-1 text-[10px] font-semibold text-slate-400"
        >
          <Info size={12} />
          <span>Terms & Conditions apply</span>
        </div>

        <button
          onClick={onApply}
          className="px-6 py-2.5 bg-[#042159] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-900/10 hover:bg-slate-800 transition-all active:scale-95"
        >
          Apply Now
        </button>
      </div>
    </div>
  );
};

const InfoColumn = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[9px] font-black text-slate-400 tracking-wider uppercase">
      {label}
    </span>
    <span className="text-xs font-bold text-slate-700">{value}</span>
  </div>
);

const ApplicationItem = ({ reference, title, date, amount, status, onTap }) => {
  return (
    <div
      onClick={onTap}
      className="group relative cursor-pointer overflow-hidden rounded-[20px] mb-[20px] border border-gray-100 bg-white p-4 transition-all hover:bg-[#17C6C6]/5 active:scale-[0.98]"
    >
      <div className="flex items-center gap-3">
        {/* Lucide Hourglass Icon */}
        <div className="text-amber-500">
          <Hourglass size={20} strokeWidth={2.5} />
        </div>

        <div className="flex-1 flex flex-col">
          <span className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">
            {reference}
          </span>
          <h3 className="text-[13px] font-bold text-[#0A2351]">{title}</h3>
          <span className="text-[11px] text-gray-400">{date}</span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[13px] font-black text-[#0A2351] font-outfit">
            {amount}
          </span>
          <span className="text-[9px] font-black uppercase text-amber-500 tracking-tighter">
            {status}
          </span>
        </div>
      </div>
    </div>
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
            className={`text-[10px] font-black uppercase tracking-widest ${
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
            <button className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Copy
                size={12}
                className={isPrimary ? "text-blue-300" : "text-slate-300"}
              />
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
      className="mt-6 flex items-center gap-2 px-6 py-2 border border-slate-200 text-primary rounded-[7px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
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
      className="mb-4 cursor-pointer rounded-[30px] bg-white transition-all active:scale-[0.99] hover:shadow-[0_12px_32px_rgba(10,35,81,0.07)]"
    >
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3.5">
          <div className="flex flex-col">
            <h3 className="text-[16px] font-black text-[#0A2351] tracking-tight">
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
        <div className="mx-4 flex items-center justify-between rounded-[22px] bg-[#F8FAFC] px-5 py-4 border border-gray-100/50">
          <div>
            <span className="text-[9px] font-extrabold text-gray-400 tracking-widest">
              PRINCIPAL
            </span>
            <div className="text-[15px] font-black font-outfit text-black">
              {amount}
            </div>
          </div>
          <div className="h-8 w-[1px] bg-gray-200" />
          <div className="text-right">
            <span className="text-[9px] font-extrabold text-gray-400 tracking-widest">
              CURRENT BALANCE
            </span>
            <div className="text-[15px] font-black font-outfit text-[#0A2351]">
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
              className="text-[10px] font-black uppercase"
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
  <div className="relative overflow-hidden py-12 px-6 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center bg-white/50 bg-slate-900/40 group transition-all hover:border-secondary/30">
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

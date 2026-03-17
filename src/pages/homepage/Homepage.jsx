import React, { useState } from "react";
import {
  TrendingUp,
  Wallet,
  ArrowUpRight,
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

const Homepage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const setStoreAccounts = useStore((state) => state.setAccounts);
  const [loans, setLoans] = useState([]);
  const [loanProducts, setLoanProducts] = useState([]);
  const activeLoans = loans.filter((l) => l.status === "Active");
  const pendingApplications = loans.filter((l) => l.status === "Pending");
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
      id: 4,
      label: "Calculate Loan",
      icon: <Calculator size={24} />,
      onClick: () => navigate("/loan-calculator"),
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
      id: 7,
      label: "View Statements",
      icon: <Folder size={24} />,
      onClick: () => navigate("/statements"),
    },
  ];
  const { auth } = useAuth();
  const [sharesSummary, setSharesSummary] = useState({});
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

  const { refetch: refetchCustomerDetails, isLoading } = useQuery({
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

  const { refetch: refetchSharesSummary } = useQuery({
    queryKey: ["get shares summary"],
    queryFn: async () => {
      const response = await getSharesSummary(auth?.user?.public_id);
      return response.data.data;
    },
    onSuccess: (data) => {
      setSharesSummary(data);
      setCurrentShares(data?.numberOfShares);
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
    <>
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
        onClose={() => setShowJoinMembership(false)}
        onNext={() => {
          setShowJoinMembership(false);
          setShowSaveAndInvest(true);
        }}
      />

      <SaveAndInvest
        isOpen={showSaveAndInvest}
        onClose={() => setShowSaveAndInvest(false)}
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
        onClose={() => setShowMakeContribution(false)}
        onNext={() => {
          setShowMakeContribution(false);
          setShowReviewMembership(true);
        }}
      />

      <ReviewMembership
        isOpen={showReviewMembership}
        onClose={() => setShowReviewMembership(false)}
        onNext={() => {
          setShowReviewMembership(false);
          setShowAwaitMembershipPayment(true);
        }}
      />

      <ReviewRegistrationOnly
        isOpen={showReviewRegistrationOnly}
        onClose={() => setShowReviewRegistrationOnly(false)}
        onNext={() => {
          setShowReviewRegistrationOnly(false);
          setShowAwaitMembershipPayment(true);
        }}
      />

      <AwaitingMembershipPayment
        isOpen={showAwaitMembershipPayment}
        onClose={() => setShowAwaitMembershipPayment(false)}
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

      {isLoading ? (
        <HomeLoader />
      ) : (
        <div className="min-h-screen bg-slate-50 text-[#042159] pb-12">
          {/* Centered Container (approx 75% width) */}
          <div className="max-w-6xl mx-auto">
            <header className="flex justify-between mb-6 items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-sm text-slate-500">
                  Welcome back to your financial overview.
                </p>
              </div>
            </header>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 w-full mx-auto overflow-hidden border border-cyan-100 bg-gradient-to-br from-[#F0FFFE] to-white p-4 shadow-sm shadow-cyan-900/5 relative"
            >
              {/* Decorative Blur Background */}
              <div className="absolute -right-16 -top-16 h-32 w-32 rounded-full bg-cyan-200/20 blur-3xl" />

              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                {/* Text Content Area */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#042159] text-[#4DB8E4] shadow-lg shadow-blue-900/20">
                      <ShieldCheck size={22} />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-[#042159]">
                      Membership Progress
                    </h3>
                  </div>

                  <p className="max-w-[550px] text-[15px] leading-relaxed text-slate-600">
                    To unlock{" "}
                    <span className="font-bold text-slate-900">
                      full membership benefits
                    </span>{" "}
                    and access various loan products, you need a minimum of{" "}
                    <span className="font-bold text-[#042159]">
                      10 shares (KES 10,000)
                    </span>
                    .
                  </p>

                  {remainingShares > 0 && (
                    <div className="inline-flex items-center gap-2 rounded-lg bg-white/60 px-3 py-1.5 border border-cyan-100">
                      <Wallet size={14} className="text-cyan-600" />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-800">
                        KES {formatNumber(remainingShares * shareValue)}{" "}
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
                      <span className="text-[13px] font-black text-[#042159]">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>

                    {/* Custom Progress Bar */}
                    <div className="relative h-4 w-full overflow-hidden rounded-full bg-slate-100 p-1 shadow-inner border border-slate-200/50">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1.2, ease: "circOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-[#042159] to-[#074073] relative"
                      >
                        {/* Shine effect on bar */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                      </motion.div>
                    </div>

                    <p className="px-1 text-right text-[12px] font-bold text-slate-500">
                      {formatNumber(currentShares)}{" "}
                      <span className="text-slate-300">/</span> 10 Shares
                    </p>
                  </div>

                  <button
                    onClick={() => setShowSharesAmount(true)}
                    className="group flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#042159] px-8 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-blue-900/20 transition-all hover:bg-[#062d7a] active:scale-[0.98]"
                  >
                    Buy Shares
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1 text-[#4DB8E4]"
                    />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Account Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {accounts?.length > 0 &&
                accounts.map((account, index) => (
                  <AccountCard
                    key={account.id || index}
                    title={account?.product?.name || "Savings Account"}
                    accountNumber={account.account_number || "ACC-XXXXX"}
                    balance={`KES ${formatNumber(account?.balance)}`}
                    isPrimary={account?.product?.name === "Savings"}
                    navigateToAccountDetails={() =>
                      navigate(
                        `/account-details/${account.id}/${account.account_number}`,
                      )
                    }
                  />
                ))}
            </section>

            <section className="mb-10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
                Quick Actions
              </h2>
              <div className="flex items-start justify-between overflow-x-auto pb-2 no-scrollbar">
                {quickActions.map(({ label, icon, onClick }) => (
                  <div
                    onClick={onClick}
                    className="flex flex-col items-center cursor-pointer min-w-[100px] group cursor-pointer"
                  >
                    <div className="w-20 h-20 bg-slate-200 rounded-3xl flex items-center justify-center text-[#042159] transition-all duration-300 group-hover:bg-[#4DB8E4] group-hover:text-white group-hover:shadow-xl group-hover:shadow-blue-100 group-hover:-translate-y-1">
                      {React.cloneElement(icon, { size: 32 })}
                    </div>

                    <span className="text-[11px] font-bold text-center mt-4 leading-tight max-w-[90px] uppercase tracking-wide text-slate-500 group-hover:text-[#042159]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Smaller Quick Actions */}
            <section className="mb-10">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
                Explore Products
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {loanProducts.length > 0 ? (
                  loanProducts.map((product) => (
                    <QuickAction
                      key={product.id}
                      label={product.label}
                      icon={product.icon}
                    />
                  ))
                ) : (
                  <ProductsEmptyState />
                )}
              </div>
            </section>
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">
              Loans & Applications
            </h2>

            {/* Side-by-Side: Applications and Loans */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side: Pending Applications */}

              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Loan Applications</h2>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                    {pendingApplications.length} Pending
                  </span>
                </div>
                {pendingApplications.length > 0 ? (
                  pendingApplications.map((loan) => (
                    <CompactLoanCard
                      key={loan.id}
                      loan={loan}
                      accent="#F59E0B"
                    />
                  ))
                ) : (
                  <EmptyState message="No pending applications" />
                )}
              </section>

              {/* Right Side: Active Loans */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold">Recent Loans</h2>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    {activeLoans.length} Running
                  </span>
                </div>
                {activeLoans.length > 0 ? (
                  activeLoans.map((loan) => (
                    <CompactLoanCard
                      key={loan.id}
                      loan={loan}
                      accent="#4DB8E4"
                    />
                  ))
                ) : (
                  <EmptyState message="No active loans found" />
                )}
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* --- Sub-Components --- */

const AccountCard = ({
  title,
  balance,
  accountNumber,
  isPrimary,
  navigateToAccountDetails,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Helper to mask the balance (e.g., KES 450,000 -> KES ••••••)
  // const maskedBalance = balance.replace(/[\d,]/g, "*");
  const maskedBalance = isVisible ? balance : "KES *********";
  return (
    <div
      onClick={navigateToAccountDetails}
      className={`p-6 cursor-pointer rounded-[32px] transition-all relative overflow-hidden group ${
        isPrimary
          ? "bg-[#042159] text-white shadow-xl shadow-blue-900/20"
          : "bg-white border border-slate-200 shadow-sm"
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
        <Wallet
          size={20}
          className={isPrimary ? "text-blue-300" : "text-slate-300"}
        />
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
      <ShieldAlert size={120} />
    </div>

    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4">
      <ShieldAlert size={28} strokeWidth={1.5} />
    </div>

    <div className="text-center">
      <h3 className="text-sm font-bold text-[#042159] uppercase tracking-wider">
        Products Temporarily Unavailable
      </h3>
      <p className="text-[11px] text-slate-400 mt-2 max-w-[240px] mx-auto leading-relaxed">
        We are currently updating our loan catalog to bring you better rates.
        Please check back in a few moments.
      </p>
    </div>

    <button
      onClick={() => window.location.reload()}
      className="mt-6 flex items-center gap-2 px-6 py-2 border border-slate-200 text-[#042159] rounded-[7px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
    >
      <RefreshCcw size={14} />
      Refresh Catalog
    </button>
  </div>
);

const QuickAction = ({ label, icon }) => (
  <button className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-[7px] transition-all hover:border-[#4DB8E4] hover:shadow-md group text-left">
    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded bg-slate-50 text-[#042159] group-hover:bg-[#4DB8E4] group-hover:text-white transition-colors">
      {icon}
    </div>
    <span className="text-xs font-bold text-slate-600 group-hover:text-[#042159]">
      {label}
    </span>
  </button>
);

const CompactLoanCard = ({ loan, accent }) => (
  <div className="bg-white rounded-xl p-4 mb-3 border border-slate-100 shadow-sm relative overflow-hidden">
    <div
      className="absolute left-0 top-0 bottom-0 w-1"
      style={{ backgroundColor: accent }}
    ></div>
    <div className="flex justify-between items-start mb-3">
      <div>
        <h4 className="font-bold text-sm">{loan.productName}</h4>
        <p className="text-[10px] text-slate-400 font-mono tracking-tighter">
          {loan.loanCode}
        </p>
      </div>
      <p className="font-bold text-sm text-[#042159]">{loan.balance}</p>
    </div>
    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-3 border-t border-slate-50">
      <span>
        Due:{" "}
        <span className="text-slate-900 font-medium">{loan.repaymentDate}</span>
      </span>
      <ArrowUpRight size={12} className="text-slate-300" />
    </div>
  </div>
);

const EmptyState = ({ message, onApply }) => (
  <div className="relative overflow-hidden py-12 px-6 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm group transition-all hover:border-[#4DB8E4]/30">
    {/* Decorative Background Glow */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#4DB8E4]/5 rounded-full blur-3xl group-hover:bg-[#4DB8E4]/10 transition-colors"></div>

    {/* Icon with Soft Background */}
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-4 transition-transform group-hover:scale-110 group-hover:text-[#4DB8E4] duration-500">
      <FilePlus2 size={32} strokeWidth={1.5} />
    </div>

    {/* Text Content */}
    <div className="text-center mb-6">
      <p className="text-sm font-bold text-[#042159] tracking-tight">
        {message}
      </p>
      <p className="text-[11px] text-slate-400 mt-1 max-w-[180px] mx-auto">
        Start a new application to access quick credit and growth funds.
      </p>
    </div>

    {/* Modern Button CTA */}
    <button
      onClick={onApply}
      className="flex items-center gap-2 px-5 py-2.5 bg-[#042159] text-white rounded-[7px] text-xs font-bold shadow-lg shadow-blue-900/20 hover:bg-[#4DB8E4] hover:shadow-[#4DB8E4]/20 transition-all active:scale-95"
    >
      <PlusCircle size={16} />
      Apply Now
    </button>
  </div>
);

export default Homepage;

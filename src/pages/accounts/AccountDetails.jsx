import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Copy,
  ArrowDownCircle,
  FileText,
  Search,
  TrendingUp,
  Filter,
  Smartphone,
  ShieldCheck,
  Info,
  Clock,
  Wallet,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import {
  fetchAccount,
  fetchAccountTransactions,
} from "../../sdks/accounts/accounts";
import { useToast } from "../../contexts/ToastProvider";
import AccountDetailsLoader from "../../skeletons/AccountDetailsLoader";
import InvestAmount from "../../components/quick-invest/InvestAmount";
import ConfirmInvest from "../../components/quick-invest/ConfirmInvest";
import AwaitingPayment from "../../components/quick-invest/AwaitPayment";
import DepositAmount from "../../components/deposit-savings/DepositAmount";
import ReviewDeposit from "../../components/deposit-savings/ConfirmDeposit";
import AwaitDepositPayment from "../../components/deposit-savings/AwaitDepositPayment";
import TransactionDetails from "../../components/transactions/TransactionDetails";
import { useFormatAmount } from "../../hooks/useFormatAmount";
import { useFormattedDateTime } from "../../hooks/useFormatDateTime";

const AccountDetails = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const navigate = useNavigate();
  const { accountId, accountNumber } = useParams();
  const [account, setAccount] = useState({});
  const [transactions, setTransactions] = useState([]);
  const { showToast } = useToast();
  const [showInvestAmount, setShowInvestAmount] = useState(false);
  const [showConfirmInvestment, setShowConfirmInvestment] = useState(false);
  const [showAwaitPayment, setShowAwaitPayment] = useState(false);
  const formatAmount = useFormatAmount();
  const [showDepositAmount, setShowDepositAmount] = useState(false);
  const [showReviewDeposit, setShowReviewDeposit] = useState(false);
  const [showAwaitDepositPayment, setShowAwaitDepositPayment] = useState(false);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [transaction, setTransaction] = useState({});

  const { refetch: refetchAccounts } = useQuery({
    queryKey: ["get account"],
    queryFn: async () => {
      const response = await fetchAccount(accountId);
      return response.data.data;
    },
    onSuccess: (data) => {
      setAccount(data);
    },
    onError: (error) => {
      showToast({
        title: "Account glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const { isLoading, refetch: refetchTransactions } = useQuery({
    queryKey: ["get account transactions"],
    queryFn: async () => {
      const response = await fetchAccountTransactions(accountNumber);
      return response.data.data;
    },
    onSuccess: (data) => {
      setTransactions(data);
    },
    onError: (error) => {
      showToast({
        title: "Transactions glitch",
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
          refetchAccounts();
          refetchTransactions();
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
          refetchAccounts();
          refetchTransactions();
          setShowAwaitDepositPayment(false);
        }}
      />

      <TransactionDetails
        isOpen={showTransactionDetails}
        onClose={() => setShowTransactionDetails(false)}
        transaction={transaction}
      />
      {isLoading ? (
        <AccountDetailsLoader />
      ) : (
        <div className="bg-slate-50 text-primary">
          <div className="max-w-6xl sm:px-4 mx-auto">
            <h3 className="text-xl font-medium mb-3 tracking-tight">
              Account Details
            </h3>
            {/* 1. Hero Balance Card & Quick Actions (Grid Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              {/* Main Balance Area (8 Cols) */}
              <div className="lg:col-span-7 bg-primary rounded-[30px] p-6 text-white relative overflow-hidden group h-[220px] flex flex-col justify-between">
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
                    <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-blue-300/60">
                      {account?.product?.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <h2 className="text-4xl font-medium tracking-tighter">
                      {balanceVisible
                        ? `${formatAmount(account?.balance)}`
                        : "KES ••••••••"}
                    </h2>
                    <button
                      onClick={() => setBalanceVisible(!balanceVisible)}
                      className="p-3 bg-white/5 bg-slate-900/40 border border-white/10 rounded-2xl hover:bg-white/15"
                    >
                      {balanceVisible ? (
                        <EyeOff size={22} />
                      ) : (
                        <Eye size={22} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-6">
                  <div>
                    <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-blue-300/40 mb-1">
                      Account Number
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-mono font-medium text-blue-100">
                        {account?.account_number}
                      </p>
                      <Copy
                        size={14}
                        className="text-blue-400 cursor-pointer hover:text-white"
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <Wallet size={20} className={"text-slate-300"} />
                  </div>
                </div>
              </div>

              {/* Quick Actions Vertical (4 Cols) */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                <VerticalAction
                  icon={<ArrowDownCircle />}
                  label="Deposit"
                  color="bg-secondary"
                  onClick={() => setShowDepositAmount(true)}
                />
                <VerticalAction
                  icon={<FileText />}
                  label="Statements"
                  color="bg-white"
                  darkText
                  onClick={() => navigate("/statements")}
                />
                <VerticalAction
                  icon={<TrendingUp />}
                  label="Invest"
                  color="bg-white"
                  darkText
                  onClick={() => setShowInvestAmount(true)}
                />
                <VerticalAction
                  icon={<Search />}
                  label="Explore"
                  color="bg-white"
                  darkText
                  onClick={() => navigate("/loan-products")}
                />
              </div>
            </div>

            {/* 2. Main Transactions Section with Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Transaction List (8 Cols) */}
              <div className="lg:col-span-7">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-medium tracking-tight">
                    Recent Transactions
                  </h3>
                  <button className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-widest text-slate-400 hover:text-primary">
                    <SlidersHorizontal size={16} />
                  </button>
                </div>

                <div className="space-y-3">
                  {transactions.length > 0 ? (
                    <div className="h-[550px] w-full py-3 flex flex-col gap-3 overflow-y-auto">
                      {transactions.map((tx) => (
                        <TransactionRow
                          key={tx.id}
                          tx={tx}
                          setTransaction={setTransaction}
                          setShowTransactionDetails={setShowTransactionDetails}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-[40px] border-2 border-dashed border-slate-100 p-20 flex flex-col items-center justify-center text-center group transition-all hover:border-blue-100">
                      <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform duration-500">
                        <div className="absolute inset-0 bg-blue-100/50 rounded-[30px] animate-ping opacity-20" />
                        <Clock
                          size={32}
                          className="text-slate-300 relative z-10"
                        />
                      </div>
                      <h4 className="text-lg font-medium text-primary mb-2 tracking-tight">
                        No Transactions Yet
                      </h4>
                      <p className="text-xs text-slate-400 max-w-[280px] leading-relaxed font-medium mb-8">
                        Your financial activity will appear here once you start
                        using this account for deposits or payments.
                      </p>
                      <button
                        onClick={() => {}}
                        className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-medium uppercase tracking-[0.2em] shadow-xl shadow-blue-900/20 hover:bg-[#062d7a] active:scale-95 transition-all"
                      >
                        <ArrowDownCircle size={18} className="text-secondary" />
                        Make First Deposit
                      </button>
                      <div className="mt-8 flex items-center gap-2 opacity-30">
                        <Smartphone size={12} />
                        <span className="text-[9px] font-bold uppercase tracking-widest">
                          Secured by Anansi Ledger
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Info & Disclaimers (4 Cols) */}
              <aside className="lg:col-span-5 space-y-6">
                {/* Account Status Card */}
                <div className="bg-white rounded-[32px] p-5 border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <ShieldCheck className="text-emerald-500" size={20} />
                    <h3 className="font-medium text-[11px] uppercase tracking-widest text-slate-400">
                      Account Security
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    This account is protected by 256-bit encryption. Always
                    ensure you log out after viewing sensitive financial data.
                  </p>
                </div>

                {/* Disclaimer / Notice */}
                <div className="bg-blue-50/50 rounded-[32px] p-5 border border-blue-100/100">
                  <div className="flex items-center gap-3 mb-4">
                    <Info className="text-secondary" size={20} />
                    <h3 className="font-medium text-[11px] uppercase tracking-widest text-slate-400">
                      Important Info
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    <DisclaimerItem text="M-PESA deposits reflect instantly. Third-party bank transfers may take up to 24 hours." />
                    <DisclaimerItem text="A minimum balance of KES 1,000 must be maintained to keep the account active." />
                    <DisclaimerItem text="Interest is calculated daily and credited to your account at the end of every quarter." />
                  </ul>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* --- Sub-Components --- */

const VerticalAction = ({ icon, label, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full p-5 bg-white rounded-2xl 
                 border border-slate-100/80 shadow-[0_4px_20px_rgba(0,0,0,0.02)]
                 flex items-center justify-between gap-4 
                 transition-all duration-300 ease-out transform 
                 hover:-translate-x-0.5 hover:shadow-[0_12px_30px_rgba(15,23,42,0.04)] hover:border-slate-200
                 active:scale-[0.99] group text-left"
    >
      {/* Left Content Side: Icon + Text */}
      <div className="flex items-center gap-4">
        {/* Premium Icon Wrapper */}
        <div
          className="p-3.5 rounded-xl bg-slate-50 text-slate-600 
                        border border-slate-100/50 transition-all duration-300 ease-out 
                        group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:border-emerald-100 shrink-0"
        >
          {React.cloneElement(icon, {
            size: 22,
            strokeWidth: 2.2,
          })}
        </div>

        {/* Typography Block */}
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold tracking-wide text-slate-800 uppercase group-hover:text-emerald-800 transition-colors duration-300">
            {label}
          </span>
          {description && (
            <span className="text-xs text-slate-400 font-medium leading-normal">
              {description}
            </span>
          )}
        </div>
      </div>

      {/* Right Content Side: Premium Trailing Arrow */}
      <div className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-300 ease-out shrink-0 pr-1">
        <ChevronRight size={20} strokeWidth={2.5} />
      </div>
    </button>
  );
};

const TransactionRow = ({ tx, setTransaction, setShowTransactionDetails }) => {
  const formatAmount = useFormatAmount();
  const formatDateTime = useFormattedDateTime();
  return (
    <div
      onClick={() => {
        setTransaction(tx);
        setShowTransactionDetails(true);
      }}
      className="bg-white p-5 cursor-pointer rounded-[28px] border border-slate-200 flex items-center justify-between hover:border-secondary/30 transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-100 text-slate-400 group-hover:bg-green-50 group-hover:text-green-600 rounded-2xl flex items-center justify-center transition-colors">
          <Smartphone size={22} />
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">
            {tx.public_id}
          </p>
          <h4 className="text-sm font-medium text-primary">{tx.type}</h4>
          <p className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">
            {tx.ref_number} • {formatDateTime(tx.createdAt)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-base font-medium text-green-600">
          {formatAmount(tx?.amount)}
        </p>
        <p className="text-[9px] font-bold uppercase text-slate-300 tracking-widest">
          {tx.status}
        </p>
      </div>
    </div>
  );
};

const DisclaimerItem = ({ text }) => (
  <li className="flex gap-3 items-start">
    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
    <p className="text-[11px] text-slate-500 leading-normal font-medium">
      {text}
    </p>
  </li>
);

export default AccountDetails;

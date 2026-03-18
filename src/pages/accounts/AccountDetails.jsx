import React, { useState } from "react";
import {
  ArrowLeft,
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
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import {
  fetchAccount,
  fetchAccountTransactions,
} from "../../sdks/accounts/accounts";
import { useToast } from "../../contexts/ToastProvider";
import AccountDetailsLoader from "../../skeletons/AccountDetailsLoader";

const AccountDetails = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const navigate = useNavigate();
  const { accountId, accountNumber } = useParams();
  const [account, setAccount] = useState({});
  const [transactions, setTransactions] = useState([]);
  const { showToast } = useToast();

  useQuery({
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

  const { isLoading } = useQuery({
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

  const formatNumber = (value) => {
    if (value === null || value === undefined || isNaN(value)) return "0";

    return new Intl.NumberFormat("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <>
      {isLoading ? (
        <AccountDetailsLoader />
      ) : (
        <div className="min-h-screen bg-slate-50 text-[#042159] pb-20">
          <div className="max-w-6xl sm:px-4 mx-auto">
            {/* Navigation Header */}
            <header className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-black tracking-tight uppercase tracking-widest text-[11px] text-slate-400">
                  Account Details
                </h1>
              </div>
            </header>

            {/* 1. Hero Balance Card & Quick Actions (Grid Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              {/* Main Balance Area (8 Cols) */}
              <div className="lg:col-span-8 bg-[#042159] rounded-[30px] p-6 text-white shadow-xl shadow-blue-900/40 relative overflow-hidden group min-h-[300px] flex flex-col justify-between">
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#4DB8E4] opacity-20 blur-[80px] rounded-full"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-[#4DB8E4] animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300/60">
                      Regular Savings
                    </span>
                  </div>
                  <div className="flex items-center gap-6">
                    <h2 className="text-4xl font-black tracking-tighter">
                      {balanceVisible
                        ? `KES ${formatNumber(account?.balance)}`
                        : "KES ••••••••"}
                    </h2>
                    <button
                      onClick={() => setBalanceVisible(!balanceVisible)}
                      className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/15"
                    >
                      {balanceVisible ? (
                        <EyeOff size={22} />
                      ) : (
                        <Eye size={22} />
                      )}
                    </button>
                  </div>
                </div>

                <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-6 mt-4">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-300/40 mb-1">
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
              <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                <VerticalAction
                  icon={<ArrowDownCircle />}
                  label="Deposit"
                  color="bg-[#4DB8E4]"
                />
                <VerticalAction
                  icon={<FileText />}
                  label="Statement"
                  color="bg-white"
                  darkText
                />
                <VerticalAction
                  icon={<TrendingUp />}
                  label="Invest"
                  color="bg-white"
                  darkText
                />
                <VerticalAction
                  icon={<Search />}
                  label="Explore"
                  color="bg-white"
                  darkText
                />
              </div>
            </div>

            {/* 2. Main Transactions Section with Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Transaction List (8 Cols) */}
              <div className="lg:col-span-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-black tracking-tight">
                    Recent Transactions
                  </h3>
                  <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#042159]">
                    <Filter size={16} /> Filter
                  </button>
                </div>

                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <TransactionRow key={tx.id} tx={tx} />
                  ))}
                </div>
              </div>

              {/* Right: Info & Disclaimers (4 Cols) */}
              <aside className="lg:col-span-4 space-y-6">
                {/* Account Status Card */}
                <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-blue-900/5">
                  <div className="flex items-center gap-3 mb-6">
                    <ShieldCheck className="text-emerald-500" size={20} />
                    <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-400">
                      Account Security
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    This account is protected by 256-bit encryption. Always
                    ensure you log out after viewing sensitive financial data.
                  </p>
                </div>

                {/* Disclaimer / Notice */}
                <div className="bg-blue-50/50 rounded-[32px] p-8 border border-blue-100/100">
                  <div className="flex items-center gap-3 mb-4">
                    <Info className="text-[#4DB8E4]" size={20} />
                    <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-400">
                      Important Info
                    </h3>
                  </div>
                  <ul className="space-y-4">
                    <DisclaimerItem text="M-PESA deposits reflect instantly. Third-party bank transfers may take up to 24 hours." />
                    <DisclaimerItem text="A minimum balance of KES 1,000 must be maintained to keep the account active." />
                    <DisclaimerItem text="Interest is calculated daily and credited to your account at the end of every quarter." />
                  </ul>
                </div>

                {/* Support */}
                <div className="px-8 flex items-start gap-3 opacity-50">
                  <Clock size={14} className="mt-0.5 shrink-0" />
                  <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                    Transaction history is available online for up to 2 years.
                    Older records require a branch visit.
                  </p>
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

const VerticalAction = ({ icon, label, color, darkText = false }) => (
  <button
    className={`${color} ${darkText ? "text-[#042159] border border-slate-200" : "text-white"} p-6 rounded-[32px] flex flex-col items-center justify-center gap-3 shadow-xl shadow-blue-900/5 hover:scale-[1.02] transition-all group`}
  >
    <div
      className={`${darkText ? "bg-slate-50" : "bg-white/20"} p-4 rounded-2xl group-hover:scale-110 transition-transform`}
    >
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <span className="text-[10px] font-black uppercase tracking-widest">
      {label}
    </span>
  </button>
);

const TransactionRow = ({ tx }) => (
  <div className="bg-white p-5 rounded-[28px] border border-slate-200 flex items-center justify-between hover:border-[#4DB8E4]/30 transition-all cursor-pointer group">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-slate-50 text-slate-400 group-hover:bg-green-50 group-hover:text-green-600 rounded-2xl flex items-center justify-center transition-colors">
        <Smartphone size={22} />
      </div>
      <div>
        <p className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">
          {tx.public_id}
        </p>
        <h4 className="text-sm font-black text-[#042159]">{tx.type}</h4>
        <p className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">
          {tx.ref_number} • {tx.createdAt}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-base font-black text-green-600 font-mono">
        {tx.amount}
      </p>
      <p className="text-[9px] font-bold uppercase text-slate-300 tracking-widest">
        {tx.status}
      </p>
    </div>
  </div>
);

const DisclaimerItem = ({ text }) => (
  <li className="flex gap-3 items-start">
    <div className="w-1.5 h-1.5 rounded-full bg-[#4DB8E4] mt-1.5 shrink-0" />
    <p className="text-[11px] text-slate-500 leading-normal font-medium">
      {text}
    </p>
  </li>
);

export default AccountDetails;

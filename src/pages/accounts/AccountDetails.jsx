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
  Wallet,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AccountDetails = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const navigate = useNavigate();

  const accountInfo = {
    name: "Regular Savings",
    accNumber: "ACC-0098221",
    balance: "KES 450,000",
    interestEarned: "KES 12,400",
    withdrawable: "KES 440,000",
    status: "Active",
  };

  const transactions = [
    {
      id: 1,
      type: "M-PESA Deposit",
      ref: "SCL90231KL",
      date: "Mar 12, 2026",
      amount: "+ 5,000",
      status: "Success",
    },
    {
      id: 2,
      type: "M-PESA Deposit",
      ref: "SCL44210OP",
      date: "Mar 10, 2026",
      amount: "+ 12,500",
      status: "Success",
    },
    {
      id: 3,
      type: "M-PESA Deposit",
      ref: "SCL11092LL",
      date: "Mar 05, 2026",
      amount: "+ 2,000",
      status: "Success",
    },
    {
      id: 4,
      type: "M-PESA Deposit",
      ref: "SCM55123XA",
      date: "Feb 28, 2026",
      amount: "+ 8,200",
      status: "Success",
    },
    {
      id: 5,
      type: "M-PESA Deposit",
      ref: "SCM00912ZQ",
      date: "Feb 25, 2026",
      amount: "+ 1,500",
      status: "Success",
    },
    {
      id: 6,
      type: "M-PESA Deposit",
      ref: "SCA77812MM",
      date: "Feb 20, 2026",
      amount: "+ 25,000",
      status: "Success",
    },
    {
      id: 7,
      type: "M-PESA Deposit",
      ref: "SCA44102BB",
      date: "Feb 15, 2026",
      amount: "+ 3,400",
      status: "Success",
    },
    {
      id: 8,
      type: "M-PESA Deposit",
      ref: "SCX33219PP",
      date: "Feb 10, 2026",
      amount: "+ 10,000",
      status: "Success",
    },
    {
      id: 9,
      type: "M-PESA Deposit",
      ref: "SCX88901WW",
      date: "Feb 05, 2026",
      amount: "+ 5,500",
      status: "Success",
    },
    {
      id: 10,
      type: "M-PESA Deposit",
      ref: "SCR11234KK",
      date: "Feb 01, 2026",
      amount: "+ 1,200",
      status: "Success",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-[#042159] pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Navigation Header */}
        <header className="py-4 flex items-center gap-4">
          <h1 className="text-xl font-bold">Savings Account Details</h1>
        </header>

        {/* 1. Hero Balance Card (Expanded) */}
        <div className="bg-[#042159] rounded-[40px] p-6 text-white shadow-2xl shadow-blue-900/40 mb-6 relative overflow-hidden group">
          {/* 1. Animated Mesh Gradient Background Elements */}
          <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-[#4DB8E4] opacity-20 blur-[80px] rounded-full group-hover:opacity-30 transition-opacity duration-700"></div>
          <div className="absolute bottom-[-20%] left-[-5%] w-40 h-40 bg-blue-400 opacity-10 blur-[60px] rounded-full"></div>

          {/* 2. Top Section: Balance & Toggle */}
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#4DB8E4] animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300/60">
                  Active Savings
                </span>
              </div>
              <h2 className="text-5xl font-black tracking-tight mt-2">
                {balanceVisible ? accountInfo.balance : "KES ********"}
              </h2>
            </div>

            <button
              onClick={() => setBalanceVisible(!balanceVisible)}
              className="p-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/15 transition-all active:scale-90"
            >
              {balanceVisible ? (
                <EyeOff size={22} className="text-blue-200" />
              ) : (
                <Eye size={22} className="text-blue-200" />
              )}
            </button>
          </div>
          {/* 3. Bottom Section: Glassmorphism Info Row */}
          <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between relative z-10">
            <div className="flex gap-12">
              <div className="space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-300/40">
                  Account Number
                </p>
                <div className="flex items-center gap-2 group/acc cursor-pointer">
                  <p className="text-sm font-mono font-medium text-blue-100">
                    {accountInfo.accNumber}
                  </p>
                  <Copy
                    size={12}
                    className="text-blue-400 opacity-0 group-hover/acc:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </div>
            {/* Decorative Brand Icon */}
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
              <Wallet size={20} className="text-blue-300/50" />
            </div>
          </div>
        </div>

        {/* 2. Quick Actions Row */}
        <section className="mb-4">
          <h2 className="text-[14px] font-black uppercase tracking-[0.2em] text-slate-400 my-5">
            Account Actions
          </h2>
          <div className="flex justify-start items-start gap-[30px] overflow-x-auto pb-4 no-scrollbar">
            <DetailAction
              label="Deposit savings"
              icon={<ArrowDownCircle />}
              color="#4DB8E4"
            />
            <DetailAction
              label="View Statements"
              icon={<FileText />}
              color="#042159"
            />
            <DetailAction
              label="Explore Products"
              icon={<Search />}
              color="#042159"
            />
            <DetailAction
              label="Quick Invest & Save"
              icon={<TrendingUp />}
              color="#042159"
            />
          </div>
        </section>

        {/* 3. M-PESA Deposits List */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Account Transactions</h2>
            <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-[#042159]">
              <Filter size={14} /> Filter
            </button>
          </div>

          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">{tx.type}</h4>
                    <p className="text-[10px] text-slate-400 font-mono tracking-tighter">
                      REF: {tx.ref} • {tx.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-green-600 font-mono">
                    {tx.amount}
                  </p>
                  <p className="text-[9px] font-bold uppercase text-slate-300 tracking-tighter">
                    {tx.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

/* --- Sub-Components --- */

const DetailAction = ({ label, icon, color }) => (
  // Removed min-w and changed items-center to items-start for flush-left alignment
  <div className="flex flex-col items-start group cursor-pointer">
    <div
      className="w-20 h-20 rounded-[30px] flex items-center justify-center text-white shadow-lg transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl"
      style={{ backgroundColor: color }}
    >
      {/* Increased icon size to 32 to match the larger container */}
      {React.cloneElement(icon, { size: 32, strokeWidth: 1.5 })}
    </div>

    {/* Aligned text-left to match the icon's start point */}
    <span className="text-[10px] font-bold text-center mt-4 uppercase tracking-tight text-slate-500 group-hover:text-[#042159] w-full line-clamp-2 leading-tight transition-colors">
      {label}
    </span>
  </div>
);

export default AccountDetails;

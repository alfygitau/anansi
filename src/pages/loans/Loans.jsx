import React, { useState } from "react";
import {
  Search,
  Filter,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  ShieldX,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyLoans = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const loans = [
    {
      id: "ln-001",
      productName: "Development Loan",
      loanCode: "DEV-2024-9902",
      balance: "KES 450,000",
      repaymentDate: "Mar 30, 2026",
      status: "Active",
    },
    {
      id: "ln-002",
      productName: "Flash Loan",
      loanCode: "FLS-2026-1102",
      balance: "KES 0",
      repaymentDate: "Feb 10, 2026",
      status: "Paid",
    },
    {
      id: "ln-003",
      productName: "Jijenge Loan",
      loanCode: "JIJ-2025-4410",
      balance: "KES 120,000",
      repaymentDate: "Apr 05, 2026",
      status: "Active",
    },
    {
      id: "ln-004",
      productName: "Emergency Loan",
      loanCode: "EMG-2026-005",
      balance: "KES 50,000",
      repaymentDate: "Jan 15, 2026",
      status: "Defaulted",
    },
    {
      id: "ln-005",
      productName: "Education Loan",
      loanCode: "EDU-2026-882",
      balance: "KES 85,000",
      repaymentDate: "Mar 01, 2026",
      status: "Overdue",
    },
    {
      id: "ln-006",
      productName: "Mobile Loan",
      loanCode: "MOB-2026-331",
      balance: "KES 5,500",
      repaymentDate: "Mar 18, 2026",
      status: "Active",
    },
  ];

  const filteredLoans = loans.filter(
    (l) =>
      l.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.loanCode.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 text-[#042159] pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Navigation & Header */}
        <header className="py-10">
          <h1 className="text-3xl font-black tracking-tight">My Loans</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage and track all your credit facilities in one place.
          </p>
        </header>

        {/* 1. Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatMiniCard
            label="Active"
            count={3}
            icon={<Clock className="text-[#4DB8E4]" />}
          />
          <StatMiniCard
            label="Overdue"
            count={2}
            icon={<AlertCircle className="text-[#f00]" />}
          />
          <StatMiniCard
            label="Completed"
            count={1}
            icon={<CheckCircle2 className="text-emerald-500" />}
          />
        </div>

        {/* 2. Search & List Section */}
        <section className="bg-white rounded-[40px] p-8 shadow-xl shadow-blue-900/5 border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                type="text"
                placeholder="Search loan code or type..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4DB8E4]/20 outline-none text-sm transition-all"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 px-6 py-3 border border-slate-100 rounded-2xl text-xs font-bold text-slate-400 hover:bg-slate-50 transition-all">
              <Filter size={16} /> Filter by Status
            </button>
          </div>

          <div className="space-y-4">
            {filteredLoans.map((loan) => (
              <DetailedLoanCard
                key={loan.id}
                loan={loan}
                navigate={() => navigate("/loan-details")}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

/* --- Sub-Components --- */

const StatMiniCard = ({ label, count, icon }) => (
  <div className="bg-white p-6 rounded-[28px] border border-slate-100 flex items-center justify-between shadow-sm">
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="text-2xl font-bold mt-1">{count}</p>
    </div>
    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
      {React.cloneElement(icon, { size: 24 })}
    </div>
  </div>
);

const DetailedLoanCard = ({ loan, navigate }) => {
  const statusConfig = {
    Active: {
      color: "bg-[#042159] text-white",
      icon: <Clock size={16} />,
      bgLight: "bg-blue-50",
    },
    Paid: {
      color: "bg-emerald-500 text-white",
      icon: <CheckCircle size={16} />,
      bgLight: "bg-emerald-50",
    },
    Overdue: {
      color: "bg-amber-500 text-white",
      icon: <AlertTriangle size={16} />,
      bgLight: "bg-amber-50",
    },
    Defaulted: {
      color: "bg-red-600 text-white",
      icon: <ShieldX size={16} />,
      bgLight: "bg-red-50",
    },
  };

  const style = statusConfig[loan.status] || statusConfig.Active;

  return (
    <div
      onClick={navigate}
      className="group p-6 bg-white border border-slate-100 rounded-[32px] hover:border-[#4DB8E4]/30 hover:shadow-xl hover:shadow-blue-900/5 transition-all cursor-pointer relative overflow-hidden"
    >
      {/* GRID SYSTEM:
          col-1: Icon & Name (Span 2)
          col-2: Loan Balance
          col-3: Repayment Date
          col-4: Status Badge
          col-5: Arrow (Small)
      */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* 1. Product & Code (4/12 columns) */}
        <div className="md:col-span-4 flex items-center gap-4">
          <div
            className={`w-14 h-14 shrink-0 rounded-[20px] flex items-center justify-center shadow-inner ${style.bgLight}`}
          >
            {React.cloneElement(style.icon, {
              size: 26,
              className: style.iconColor, // Using the explicit high-contrast color
              strokeWidth: 2.5, // Slightly thicker stroke for better visibility
            })}
          </div>
          <div className="truncate">
            <h4 className="font-bold text-[#042159] text-base truncate">
              {loan.productName}
            </h4>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              {loan.loanCode}
            </p>
          </div>
        </div>

        {/* 2. Balance (3/12 columns) */}
        <div className="md:col-span-3">
          <p
            className={`text-base font-black ${loan.status === "Paid" ? "text-slate-300 line-through" : "text-[#042159]"}`}
          >
            {loan.balance}
          </p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Outstanding
          </p>
        </div>

        {/* 3. Date (2/12 columns) */}
        <div className="md:col-span-2">
          <p
            className={`text-[11px] font-black ${loan.status === "Overdue" ? "text-amber-600" : "text-slate-500"}`}
          >
            {loan.repaymentDate}
          </p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            {loan.status === "Paid" ? "Paid Date" : "Due Date"}
          </p>
        </div>

        {/* 4. Status Badge (2/12 columns) */}
        <div className="md:col-span-2 flex md:justify-center">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest w-fit shadow-lg shadow-current/10 ${style.color}`}
          >
            {style.icon}
            {loan.status}
          </div>
        </div>

        {/* 5. Action Arrow (1/12 column) */}
        <div className="md:col-span-1 flex justify-end">
          <ArrowUpRight
            size={20}
            className="text-slate-200 group-hover:text-[#4DB8E4] transition-all group-hover:translate-x-1 group-hover:-translate-y-1 hidden md:block"
          />
        </div>
      </div>
    </div>
  );
};

export default MyLoans;

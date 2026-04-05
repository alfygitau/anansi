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
  PlusCircle,
  CreditCard,
  Info,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MyLoans = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  // Your existing loan data...
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
    <div className="min-h-screen bg-slate-50 text-primary pb-20">
      <div className="max-w-6xl sm:px-4 mx-auto">
        {/* Header */}
        <header className="py-4">
          <h1 className="text-4xl font-black tracking-tight">My Loans</h1>
          <p className="text-slate-400 text-sm mt-2 font-medium">
            Manage your active credit lines and track your path to financial
            freedom.
          </p>
        </header>

        {/* 1. Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <StatMiniCard
            label="Active"
            count={3}
            icon={<Clock className="text-secondary" />}
          />
          <StatMiniCard
            label="Overdue"
            count={2}
            icon={<AlertCircle className="text-red-500" />}
          />
          <StatMiniCard
            label="Completed"
            count={1}
            icon={<CheckCircle2 className="text-emerald-500" />}
          />
        </div>

        {/* 2. Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Search & List (8 Columns) */}
          <div className="lg:col-span-8 space-y-4">
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
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-secondary/20 outline-none text-sm transition-all font-bold"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">
                  <Filter size={16} /> Filter Status
                </button>
              </div>

              <div className="space-y-4">
                {filteredLoans.length > 0 ? (
                  filteredLoans.map((loan) => (
                    <DetailedLoanCard
                      key={loan.id}
                      loan={loan}
                      navigate={() => navigate("/loan-details")}
                    />
                  ))
                ) : (
                  <div className="py-20 text-center">
                    <p className="text-slate-400 font-bold italic">
                      No loans found matching your search.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT: Quick Actions & Sidebar (4 Columns) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-primary rounded-[22px] p-8 text-white shadow-xl shadow-blue-900/20">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <Zap className="text-secondary" size={20} /> Quick Actions
              </h3>
              <div className="space-y-3">
                <ActionButton
                  icon={<PlusCircle size={18} />}
                  label="Apply for New Loan"
                  onClick={() => navigate("/apply")}
                  primary
                />
                <ActionButton
                  icon={<CreditCard size={18} />}
                  label="Make a Repayment"
                  onClick={() => navigate("/repay")}
                />
              </div>
            </div>

            {/* Credit Score / Info Card */}
            <div className="bg-white rounded-[22px] p-8 border border-slate-100 shadow-xl shadow-blue-900/5">
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="text-emerald-500" size={20} />
                <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-400">
                  Credit Standing
                </h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Your current repayment rate is{" "}
                <span className="text-primary font-bold">84%</span>. Maintaining
                a rate above 90% qualifies you for higher loan limits.
              </p>
            </div>

            {/* Legal Disclaimers */}
            <div className="bg-blue-50/50 rounded-[32px] p-8 border border-blue-100/50">
              <div className="flex items-center gap-3 mb-6">
                <Info className="text-secondary" size={20} />
                <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-400">
                  Important Notes
                </h3>
              </div>
              <ul className="space-y-4">
                <DisclaimerItem text="Late payments attract a 5% penalty fee on the outstanding installment." />
                <DisclaimerItem text="Defaulting for more than 90 days results in CRB listing as per CBK regulations." />
                <DisclaimerItem text="Loan interest rates are calculated on a reducing balance basis monthly." />
              </ul>
            </div>

            {/* Footer Support */}
            <div className="px-8 text-center">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-loose">
                Need specialized assistance? <br />
                <span className="text-secondary cursor-pointer hover:underline">
                  Talk to a Loan Officer
                </span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

/* --- Sub-Components --- */

const ActionButton = ({ icon, label, onClick, primary = false }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 p-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] transition-all ${
      primary
        ? "bg-secondary text-primary hover:bg-sky-300"
        : "bg-white/10 text-white hover:bg-white/20 border border-white/5"
    }`}
  >
    {icon} {label}
  </button>
);

const DisclaimerItem = ({ text }) => (
  <li className="flex gap-3 items-start">
    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
    <p className="text-[11px] text-slate-500 leading-normal font-medium">
      {text}
    </p>
  </li>
);

// StatMiniCard and DetailedLoanCard remain largely same as your original,
// just ensure font sizes align with the new layout...

const StatMiniCard = ({ label, count, icon }) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center justify-between shadow-xl shadow-blue-900/5">
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className="text-3xl font-black mt-1 text-primary">{count}</p>
    </div>
    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center">
      {React.cloneElement(icon, { size: 28 })}
    </div>
  </div>
);

const DetailedLoanCard = ({ loan, navigate }) => {
  const statusConfig = {
    Active: {
      color: "bg-primary text-white",
      icon: <Clock size={16} />,
      bgLight: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    Paid: {
      color: "bg-emerald-500 text-white",
      icon: <CheckCircle size={16} />,
      bgLight: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    Overdue: {
      color: "bg-amber-500 text-white",
      icon: <AlertTriangle size={16} />,
      bgLight: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    Defaulted: {
      color: "bg-red-600 text-white",
      icon: <ShieldX size={16} />,
      bgLight: "bg-red-50",
      iconColor: "text-red-600",
    },
  };

  const style = statusConfig[loan.status] || statusConfig.Active;

  return (
    <div
      onClick={navigate}
      className="group p-6 bg-white border border-slate-200 rounded-[32px] hover:border-secondary/30 hover:shadow-2xl transition-all cursor-pointer relative"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-4 flex items-center gap-4">
          <div
            className={`w-14 h-14 shrink-0 rounded-[20px] flex items-center justify-center ${style.bgLight}`}
          >
            {React.cloneElement(style.icon, {
              size: 26,
              className: style.iconColor,
            })}
          </div>
          <div className="truncate">
            <h4 className="font-black text-primary text-base truncate">
              {loan.productName}
            </h4>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              {loan.loanCode}
            </p>
          </div>
        </div>
        <div className="md:col-span-3">
          <p
            className={`text-base font-black ${loan.status === "Paid" ? "text-slate-200 line-through" : "text-primary"}`}
          >
            {loan.balance}
          </p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Balance
          </p>
        </div>
        <div className="md:col-span-2">
          <p
            className={`text-[11px] font-black ${loan.status === "Overdue" ? "text-red-500" : "text-slate-600"}`}
          >
            {loan.repaymentDate}
          </p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Next Due
          </p>
        </div>
        <div className="md:col-span-2 flex md:justify-center">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest w-fit shadow-lg shadow-current/10 ${style.color}`}
          >
            {loan.status}
          </div>
        </div>
        <div className="md:col-span-1 flex justify-end">
          <ArrowUpRight
            size={20}
            className="text-slate-200 group-hover:text-secondary transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default MyLoans;

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
  ChevronRight,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { allMyLoans } from "../../static/loans";
import { motion } from "framer-motion";

const MyLoans = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-primary pb-20">
      <div className="max-w-6xl sm:px-4 mx-auto">
        {/* Header */}
        <header className="py-2">
          <h1 className="text-2xl font-black tracking-tight">My Loans</h1>
          <p className="text-slate-400 text-sm font-medium">
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
          <div className="lg:col-span-7 space-y-4">
            <section>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                <div className="relative w-full md:w-96">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search loan code or type..."
                    className="w-full pl-12 pr-4 py-3 bg-white border rounded-2xl focus:ring-2 focus:ring-secondary/20 outline-none text-sm transition-all font-bold"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="flex items-center gap-2 px-6 py-3 border border rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">
                  <Filter size={16} /> Filter Status
                </button>
              </div>

              <div className="space-y-4">
                {allMyLoans.length > 0 ? (
                  allMyLoans.map((loan) => (
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
          <aside className="lg:col-span-5 space-y-6">
            <ApplyLoanAction />
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
const ApplyLoanAction = ({ onClick }) => {
  return (
    <div className="py-2.5">
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -2 }}
        onClick={onClick}
        className="w-full text-left bg-white p-4 rounded-[24px] border border-[#0A2351]/10 flex items-center shadow-sm hover:shadow-md transition-all group"
      >
        {/* 1. Circle Icon (Matching darkBlue color) */}
        <div className="p-3 bg-[#0A2351] rounded-full text-white shrink-0 group-hover:scale-110 transition-transform duration-300">
          <Plus size={20} strokeWidth={3} />
        </div>

        {/* 2. Text Content */}
        <div className="flex-1 ml-4 flex flex-col justify-center">
          <span className="text-[#0A2351] font-black text-[15px] leading-tight">
            Apply for a new Loan
          </span>
          <span className="text-slate-400 text-[11px] font-medium mt-0.5">
            Instant processing for eligible members
          </span>
        </div>

        {/* 3. Right Chevron */}
        <ChevronRight
          size={16}
          className="text-slate-300 ml-6 group-hover:translate-x-1 transition-transform"
          strokeWidth={2.5}
        />
      </motion.button>
    </div>
  );
};

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
      className="mb-4 cursor-pointer rounded-[30px] bg-white shadow-[0_12px_24px_rgba(10,35,81,0.04)] transition-all active:scale-[0.99] hover:shadow-[0_12px_32px_rgba(10,35,81,0.07)]"
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

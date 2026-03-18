import React, { useState } from "react";
import {
  ShieldCheck,
  Wallet,
  History,
  Users,
  Clock,
  ChevronRight,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Guarantorship = () => {
  const [activeTab, setActiveTab] = useState("Requests");
  const [loading, setLoading] = useState(false);

  // Static Mock Data
  const limitSummary = {
    ifEligible: true,
    availableBalance: 450000.5,
    totalAmountAlreadyGuaranteed: 120000.0,
    guaranteedLoans: [
      {
        borrowerName: "Kevin Omolo",
        borrowerPhone: "+254 712 345 678",
        loanInfo: { loancode: "LN-8821" },
        amountGuaranteed: 50000.0,
      },
      {
        borrowerName: "Sarah Wanjiku",
        borrowerPhone: "+254 722 000 111",
        loanInfo: { loancode: "LN-4432" },
        amountGuaranteed: 70000.0,
      },
      {
        borrowerName: "David Kiprono",
        borrowerPhone: "+254 701 998 877",
        loanInfo: { loancode: "LN-9012" },
        amountGuaranteed: 120000.0,
      },
      {
        borrowerName: "Mercy Atieno",
        borrowerPhone: "+254 733 445 566",
        loanInfo: { loancode: "LN-2219" },
        amountGuaranteed: 15000.0,
      },
      {
        borrowerName: "Brian Mutua",
        borrowerPhone: "+254 755 112 233",
        loanInfo: { loancode: "LN-5567" },
        amountGuaranteed: 45000.0,
      },
      {
        borrowerName: "Faith Nyambura",
        borrowerPhone: "+254 788 667 788",
        loanInfo: { loancode: "LN-3341" },
        amountGuaranteed: 85000.0,
      },
      {
        borrowerName: "Samuel Hassan",
        borrowerPhone: "+254 710 554 433",
        loanInfo: { loancode: "LN-1108" },
        amountGuaranteed: 30000.0,
      },
    ],
  };

  const myRequests = [
    {
      id: 1,
      borrowerName: "Alice Mwangi",
      message:
        "Alice Mwangi is requesting you to guarantee a Development Loan of KES 150,000",
      status: "pending",
      createdAt: "2026-03-14T10:30:00Z",
    },
    {
      id: 2,
      borrowerName: "John Doe",
      message: "John Doe's request for an Emergency Loan has been accepted.",
      status: "accepted",
      createdAt: "2026-03-12T14:20:00Z",
    },
    {
      id: 3,
      borrowerName: "Peter Kamau",
      message:
        "Peter Kamau has sent a request for a School Fees Loan of KES 45,000",
      status: "pending",
      createdAt: "2026-03-14T08:15:00Z",
    },
    {
      id: 4,
      borrowerName: "Esther Nekesa",
      message: "Your guarantee for Esther Nekesa's Business Loan was declined.",
      status: "rejected",
      createdAt: "2026-03-11T09:45:00Z",
    },
    {
      id: 5,
      borrowerName: "Michael Otieno",
      message:
        "Michael Otieno is requesting you to guarantee a Flash Loan of KES 10,000",
      status: "pending",
      createdAt: "2026-03-14T13:00:00Z",
    },
    {
      id: 6,
      borrowerName: "Zainab Juma",
      message:
        "Zainab Juma's request for an Asset Financing Loan has been accepted.",
      status: "accepted",
      createdAt: "2026-03-10T16:50:00Z",
    },
    {
      id: 7,
      borrowerName: "Robert Kariuki",
      message:
        "Robert Kariuki is requesting you to guarantee a Personal Loan of KES 200,000",
      status: "pending",
      createdAt: "2026-03-14T15:20:00Z",
    },
  ];

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl sm:px-4 mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#042159]">
              Guarantorship
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Manage and track your loan guarantees.
            </p>
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${limitSummary.ifEligible ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}
          >
            <ShieldCheck size={18} />
            <span className="text-sm font-bold">
              {limitSummary.ifEligible
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
            value={limitSummary.guaranteedLoans.length}
            sub="Current Loans"
          />
          <StatCard
            icon={<Wallet className="text-emerald-500" />}
            label="Available Balance"
            value={`KES ${limitSummary.availableBalance.toLocaleString()}`}
            sub="To guarantee"
          />
          <StatCard
            icon={<Users className="text-amber-500" />}
            label="Total Guaranteed"
            value={`KES ${limitSummary.totalAmountAlreadyGuaranteed.toLocaleString()}`}
            sub="Cumulative amount"
          />
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-blue-900/5 overflow-hidden min-h-[500px]">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-100 px-8">
            <button
              onClick={() => setActiveTab("Requests")}
              className={`py-4 px-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === "Requests" ? "text-[#042159]" : "text-slate-400"}`}
            >
              Requests
              {activeTab === "Requests" && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 w-full h-1 bg-[#4DB8E4]"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("Loans")}
              className={`py-4 px-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === "Loans" ? "text-[#042159]" : "text-slate-400"}`}
            >
              Guaranteed Loans
              {activeTab === "Loans" && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 w-full h-1 bg-[#4DB8E4]"
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
                  {myRequests.map((request) => (
                    <div
                      key={request.id}
                      className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-transparent hover:border-slate-200 hover:bg-white transition-all"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#042159] font-bold text-sm">
                        {getInitials(request.borrowerName)}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-sm font-bold text-slate-800 pr-4">
                            {request.message}
                          </p>
                          <StatusBadge status={request.status} />
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock size={12} />{" "}
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                          <button className="text-xs font-black text-[#4DB8E4] uppercase tracking-wider hover:text-[#042159] transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                      <ChevronRight
                        size={18}
                        className="text-slate-300 group-hover:text-[#4DB8E4]"
                      />
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="loans"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {limitSummary.guaranteedLoans.map((loan, idx) => (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl border border-slate-100 bg-slate-50/30 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                          {getInitials(loan.borrowerName)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#042159]">
                            {loan.borrowerName}
                          </p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {loan.loanInfo.loancode}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-medium text-slate-400">
                          Guaranteed
                        </p>
                        <p className="text-sm font-black text-emerald-600">
                          KES {loan.amountGuaranteed.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
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
            responsible for the loan amount in case of default. Ensure you have
            a personal agreement with the borrower and keep track of their
            repayment schedules. Available balance is calculated based on your
            total deposits minus current liabilities.
          </p>
        </div>
      </div>
    </div>
  );
};

// Sub-components for cleaner structure
const StatCard = ({ icon, label, value, sub }) => (
  <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
      {icon}
    </div>
    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
      {label}
    </p>
    <h3 className="text-xl font-black text-[#042159] my-1">{value}</h3>
    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
      {sub}
    </p>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    accepted: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rejected: "bg-rose-50 text-rose-600 border-rose-100",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${styles[status]}`}
    >
      {status}
    </span>
  );
};

export default Guarantorship;

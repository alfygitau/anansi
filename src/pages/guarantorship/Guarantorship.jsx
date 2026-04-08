import React, { useState } from "react";
import {
  ShieldCheck,
  Wallet,
  History,
  Users,
  Clock,
  ChevronRight,
  Info,
  BellDot,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "react-query";
import {
  getGuarantorRequests,
  getGuarantorshipSummary,
} from "../../sdks/guarantorship/guarantorship";
import { useToast } from "../../contexts/ToastProvider";

const Guarantorship = () => {
  const [activeTab, setActiveTab] = useState("Requests");
  const [summary, setSummary] = useState({});
  const [requests, setRequests] = useState([]);
  const { showToast } = useToast();

  useQuery({
    queryKey: ["guarantorship summary"],
    queryFn: async () => {
      const response = await getGuarantorshipSummary();
      return response.data;
    },
    onSuccess: (data) => {
      setSummary(data);
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

  useQuery({
    queryKey: ["guarantor requests"],
    queryFn: async () => {
      const response = await getGuarantorRequests();
      return response.data.data;
    },
    onSuccess: (data) => {
      setRequests(data);
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

  const getInitials = (name) => {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-6xl sm:px-4 mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary">Guarantorship</h1>
            <p className="text-slate-500 font-medium mt-1">
              Manage and track your loan guarantees.
            </p>
          </div>
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 ${summary?.ifEligible ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-rose-50 border-rose-100 text-rose-700"}`}
          >
            <ShieldCheck size={18} />
            <span className="text-sm font-bold">
              {summary?.ifEligible ? "Eligible to Guarantee" : "Not Eligible"}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<History className="text-blue-500" />}
            label="Active Guarantees"
            value={summary?.guaranteedLoans?.length}
            sub="Current Loans"
          />
          <StatCard
            icon={<Wallet className="text-emerald-500" />}
            label="Available Balance"
            value={`KES ${summary?.availableBalance?.toLocaleString()}`}
            sub="To guarantee"
          />
          <StatCard
            icon={<Users className="text-amber-500" />}
            label="Total Guaranteed"
            value={`KES ${summary?.totalAmountAlreadyGuaranteed?.toLocaleString()}`}
            sub="Cumulative amount"
          />
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-blue-900/5 overflow-hidden min-h-[500px]">
          {/* Tab Navigation */}
          <div className="flex border-b border-slate-100 px-8">
            <button
              onClick={() => setActiveTab("Requests")}
              className={`py-4 px-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === "Requests" ? "text-primary" : "text-slate-400"}`}
            >
              Requests
              {activeTab === "Requests" && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 w-full h-1 bg-secondary"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("Loans")}
              className={`py-4 px-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === "Loans" ? "text-primary" : "text-slate-400"}`}
            >
              Guaranteed Loans
              {activeTab === "Loans" && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 w-full h-1 bg-secondary"
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
                  {requests?.length > 0 ? (
                    requests?.map((request) => (
                      <div
                        key={request.id}
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-transparent hover:border-slate-200 hover:bg-white transition-all"
                      >
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-primary font-bold text-sm">
                          {getInitials(request?.borrowerName)}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-sm font-bold text-slate-800 pr-4">
                              {request?.message}
                            </p>
                            <StatusBadge status={request?.status} />
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <Clock size={12} />{" "}
                              {new Date(
                                request?.createdAt,
                              ).toLocaleDateString()}
                            </span>
                            <button className="text-xs font-black text-secondary uppercase tracking-wider hover:text-primary transition-colors">
                              View Details
                            </button>
                          </div>
                        </div>
                        <ChevronRight
                          size={18}
                          className="text-slate-300 group-hover:text-secondary"
                        />
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      icon={BellDot}
                      title="No Pending Requests"
                      description="You're all caught up! New guarantee requests will appear here."
                    />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="loans"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {summary?.guaranteedLoans?.length > 0 ? (
                    summary?.guaranteedLoans.map((loan, idx) => (
                      <div
                        key={idx}
                        className="p-6 rounded-2xl border border-slate-100 bg-slate-50/30 flex justify-between items-center"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
                            {getInitials(loan?.borrowerName)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-primary">
                              {loan?.borrowerName}
                            </p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              {loan?.loanInfo.loancode}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-slate-400">
                            Guaranteed
                          </p>
                          <p className="text-sm font-black text-emerald-600">
                            KES {loan?.amountGuaranteed.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full">
                      <EmptyState
                        icon={ShieldCheck}
                        title="No Active Guarantees"
                        description="You haven't guaranteed any loans yet. Active guarantees will show up here."
                      />
                    </div>
                  )}
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
    <h3 className="text-xl font-black text-primary my-1">{value}</h3>
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

const EmptyState = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 px-4 text-center"
  >
    <div className="relative mb-6">
      {/* Decorative background pulse */}
      <div className="absolute inset-0 scale-150 bg-slate-100/50 rounded-full blur-2xl" />
      <div className="relative w-20 h-20 bg-white rounded-3xl shadow-xl shadow-slate-200/50 flex items-center justify-center border border-slate-50">
        <Icon size={40} className="text-secondary" />
      </div>
    </div>
    <h3 className="text-lg font-black text-primary mb-2 tracking-tight">
      {title}
    </h3>
    <p className="text-sm text-slate-400 max-w-[240px] leading-relaxed">
      {description}
    </p>
  </motion.div>
);

export default Guarantorship;

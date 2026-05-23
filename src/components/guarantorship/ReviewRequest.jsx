import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowRight,
  LayoutGrid,
} from "lucide-react";

const ReviewRequest = ({
  isOpen,
  onClose,
  borrowerDetails,
  onContinue,
  onDecline,
}) => {
  const borrowerInfo = borrowerDetails || {};
  const loanInfo = borrowerDetails?.loanInfo || {};

  const formatCurrency = (val) => {
    return Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(val || 0));
  };

  const handleContinue = () => {
    onContinue();
  };

  const handleDecline = () => {
    onDecline();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden bg-slate-900/40">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-[480px] bg-white flex flex-col h-full relative"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 text-gray-500 hover:text-gray-900 rounded-full transition-all active:scale-95 shadow-sm"
            >
              <X size={20} />
            </button>
            {/* Header */}
            <div className="p-8 py-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-medium text-slate-900">
                    Review Request
                  </h3>
                  <span
                    className={`text-[8px] px-2 py-0.5 rounded-md font-medium uppercase tracking-wider border ${
                      borrowerInfo?.status === "pending"
                        ? "bg-amber-100 text-amber-700 border-amber-200/40"
                        : borrowerInfo?.status === "accepted" ||
                            borrowerInfo?.status === "approved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : borrowerInfo?.status === "rejected" ||
                              borrowerInfo?.status === "declined"
                            ? "bg-red-50 text-red-600 border-red-100/60"
                            : "bg-slate-50 text-slate-500 border-slate-200/60"
                    }`}
                  >
                    {borrowerInfo?.status}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  Guarantorship Protocol
                </p>
              </div>
            </div>
            <div className="border mx-8 border-slate-100"></div>
            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-8 py-4 space-y-6 custom-scrollbar">
              <div>
                <p className="text-[12px] leading-relaxed text-blue-900 font-medium">
                  Review the borrower's request carefully. By accepting, you
                  commit your deposits as security for this loan.
                </p>
              </div>

              {/* Borrower Details */}
              <section>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                    Borrower Identity
                  </span>
                </div>

                <div className="space-y-5 px-1">
                  <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                      Full Name
                    </span>
                    <span className="text-sm font-medium text-slate-900">
                      {borrowerInfo?.borrowerName || "---"}
                    </span>
                  </div>
                  <div className="flex justify-between items-end border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                      Phone Number
                    </span>
                    <span className="text-sm font-bold text-slate-900 tracking-tight">
                      {borrowerInfo?.borrowerPhone || "---"}
                    </span>
                  </div>
                </div>
              </section>

              {/* Loan Parameters */}
              <section>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                    Loan Parameters
                  </span>
                </div>

                <div className="bg-slate-50 rounded-[12px] p-4">
                  <div className="mb-4">
                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mb-1">
                      Requested Amount
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-blue-600">
                        KES
                      </span>
                      <span className="text-3xl font-medium text-slate-900">
                        {formatCurrency(loanInfo?.loanamount)}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200/60">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar size={10} />
                        <p className="text-[9px] font-medium uppercase tracking-widest">
                          Tenure
                        </p>
                      </div>
                      <p className="text-sm font-bold text-slate-800">
                        {loanInfo?.loanperiod} Days
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <LayoutGrid size={10} />
                        <p className="text-[9px] font-medium uppercase tracking-widest">
                          Interest
                        </p>
                      </div>
                      <p className="text-sm font-bold text-emerald-600">
                        {loanInfo?.loaninterest}% p.m
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-white rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-medium text-slate-400 uppercase">
                        Repayment
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        KES {formatCurrency(loanInfo?.loanrepaymentamount)}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer Actions */}
            <div className="p-8 bg-white border-t border-slate-100 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
              {borrowerInfo?.status === "pending" ? (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleDecline}
                    className="h-14 rounded-2xl border border-rose-100 bg-rose-50 text-rose-600 text-[11px] font-medium uppercase tracking-widest hover:bg-rose-100 transition-all active:scale-95"
                  >
                    Decline
                  </button>
                  <button
                    onClick={handleContinue}
                    className="h-14 rounded-2xl bg-slate-900 text-white text-[11px] font-medium uppercase tracking-widest hover:bg-slate-800 shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    Continue
                    <ArrowRight size={16} strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <div
                  className={`h-14 w-full rounded-2xl flex items-center justify-center gap-3 font-medium text-[11px] uppercase tracking-widest border-2 ${
                    borrowerInfo?.status === "accepted"
                      ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                      : "bg-rose-50 border-rose-100 text-rose-600"
                  }`}
                >
                  {borrowerInfo?.status === "accepted" ? (
                    <CheckCircle size={18} />
                  ) : (
                    <XCircle size={18} />
                  )}
                  Guarantorship {borrowerInfo?.status}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReviewRequest;

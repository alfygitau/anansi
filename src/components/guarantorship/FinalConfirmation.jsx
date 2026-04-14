import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  ShieldCheck,
  User,
  Briefcase,
  Info,
  ArrowRight,
  Lock,
} from "lucide-react";

const FinalConfirmation = ({
  isOpen,
  onClose,
  borrowerDetails,
  guaranteeAmount,
  onFinalize,
  isLoading,
}) => {
  const [agreed, setAgreed] = useState(false);
  const loanInfo = borrowerDetails?.loanInfo || {};

  const formatCurrency = (val) => {
    return Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(val || 0));
  };

  const handleFinish = async () => {
    if (!agreed) return;
    onFinalize();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[80] flex justify-end overflow-hidden bg-slate-900/60">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="relative w-full max-w-md bg-[#FDFDFD] shadow-2xl flex flex-col h-full border-l border-white"
          >
            {/* Header: Trust Indicators */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    Final Summary
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Verify & Authorize
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-900 transition-colors"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Scrollable Receipt Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {/* My Commitment Hero Card */}
              <div className="bg-slate-900 rounded-[32px] p-6 text-white relative overflow-hidden shadow-xl shadow-blue-900/10">
                <Lock
                  className="absolute -right-4 -bottom-4 opacity-10"
                  size={70}
                />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                  My Pledged Amount
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-blue-400">KES</span>
                  <span className="text-4xl font-black">
                    {formatCurrency(guaranteeAmount)}
                  </span>
                </div>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-medium text-slate-400 border-t border-white/10 pt-4">
                  <Info size={14} className="text-blue-400" />
                  This amount will be blocked from withdrawal.
                </div>
              </div>

              {/* Identity Section */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <User size={14} className="text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Borrower Identity
                  </span>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-4 flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase">
                      Full Name
                    </p>
                    <p className="text-sm font-black text-slate-900">
                      {borrowerDetails?.borrowerName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">
                      Phone
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {borrowerDetails?.borrowerPhone}
                    </p>
                  </div>
                </div>
              </section>

              {/* Loan Breakdown Section */}
              <section className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <Briefcase size={14} className="text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Loan Structure
                  </span>
                </div>
                <div className="bg-emerald-50/30 border border-emerald-100/50 rounded-3xl p-6 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-500">
                      Requested Principal
                    </span>
                    <span className="font-black text-slate-900">
                      KES {formatCurrency(loanInfo?.loanamount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-500">Tenure</span>
                    <span className="font-black text-slate-900">
                      {loanInfo?.loanperiod} Days
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-500">
                      Interest Rate
                    </span>
                    <span className="font-black text-emerald-600">
                      {loanInfo?.loaninterest}% p.m
                    </span>
                  </div>
                  <div className="pt-4 border-t border-emerald-100 flex justify-between items-center">
                    <span className="text-xs font-black text-slate-900">
                      Total Liability
                    </span>
                    <span className="text-sm font-black text-blue-600">
                      KES {formatCurrency(loanInfo?.loanrepaymentamount)}
                    </span>
                  </div>
                </div>
              </section>

              {/* Legal Checkbox */}
              <div
                onClick={() => setAgreed(!agreed)}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex gap-4 items-center ${
                  agreed
                    ? "bg-blue-50/50 border-blue-500"
                    : "bg-white border-slate-100 hover:border-slate-200"
                }`}
              >
                <div
                  className={`mt-0.5 border flex items-center justify-center transition-all ${
                    agreed
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white border-slate-300 text-transparent"
                  }`}
                >
                  <Check size={14} strokeWidth={4} />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-slate-900">
                    Legal Agreement
                  </p>
                  <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                    I confirm that I have read the{" "}
                    <span className="text-blue-600 underline">
                      Terms & Conditions
                    </span>{" "}
                    and understand my obligation to repay if the borrower
                    defaults.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-8 bg-white border-t border-slate-100">
              <button
                onClick={handleFinish}
                disabled={!agreed || isLoading}
                className="w-full h-16 rounded-[24px] bg-blue-600 text-white text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Confirm & Authorize
                    <ArrowRight size={18} strokeWidth={3} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FinalConfirmation;

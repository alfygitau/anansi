import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Hash, DollarSign } from "lucide-react";

const ConfirmRepayDetails = ({
  isOpen,
  onClose,
  onBack,
  amount,
  phoneNumber,
  onConfirm,
  isProcessing,
}) => {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 2,
    }).format(val);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden antialiased">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-[480px] h-full bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-8 pt-6 pb-6">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 z-10 flex items-center justify-center w-8 h-8 bg-slate-100 hover:bg-slate-200 text-gray-500 hover:text-gray-900 rounded-full transition-all active:scale-95 shadow-sm"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-black text-primary tracking-tight">
                Review Payment
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Verify the transaction details below.
              </p>
            </div>
            <div className="border-b border-slate-100 mx-8"></div>
            {/* Scrollable Receipt Area */}
            <div className="flex-grow overflow-y-auto p-8 space-y-8 bg-slate-50/30">
              {/* The "Big Check" Amount Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center relative overflow-hidden">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">
                  Total Repayment
                </span>
                <h1 className="text-4xl font-black text-primary tracking-tight">
                  {formatCurrency(amount)}
                </h1>
              </div>
              {/* Transaction Details Breakdown */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
                  Transaction Summary
                </h3>
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  {/* row 1: Payment Source */}
                  <div className="p-2 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-2xl bg-blue-50 flex items-center justify-center text-emerald-600">
                        <Smartphone size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                          Source
                        </p>
                        <p className="text-sm font-black text-slate-900">
                          {phoneNumber}
                        </p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-emerald-100/50 rounded-full">
                      <span className="text-[10px] font-black text-emerald-700 uppercase">
                        M-Pesa
                      </span>
                    </div>
                  </div>

                  {/* row 2: Reference */}
                  <div className="p-2 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                        <Hash size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                          Reference
                        </p>
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                          LN-{new Date().getFullYear()}-AX
                        </p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-blue-100/50 rounded-full">
                      <span className="text-[10px] font-black text-blue-700 uppercase">
                        Loan
                      </span>
                    </div>
                  </div>

                  {/* row 3: Fees */}
                  <div className="p-2 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-2xl bg-blue-50 flex items-center justify-center text-amber-600">
                        <DollarSign size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                          Transaction Fee
                        </p>
                        <p className="text-sm font-black text-slate-900">
                          Zero Charges
                        </p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-amber-100/50 rounded-full">
                      <span className="text-[10px] font-black text-amber-700 uppercase">
                        Free
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* STK Instructions Box */}
              <div className="p-5 bg-primary rounded-2xl text-white relative overflow-hidden">
                <div className="relative z-10 flex items-center gap-4">
                  <div className="size-10 shrink-0 bg-white/20 rounded-xl flex items-center justify-center">
                    <Smartphone size={20} className="text-white" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold leading-tight">
                      STK Push Authorization
                    </p>
                    <p className="text-[11px] text-white/70 leading-relaxed">
                      A secure prompt will appear on your phone shortly. Simply
                      enter your M-Pesa PIN to complete.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-b border-slate-100 mx-8"></div>
            {/* Footer Action */}
            <div className="p-8 bg-white">
              <button
                onClick={onConfirm}
                disabled={isProcessing}
                className="w-full h-[60px] bg-primary text-white rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#062d7a] transition-all shadow-xl shadow-blue-900/10 active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Authorize & Pay Now</>
                )}
              </button>

              <div className="flex flex-col items-center gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                    End-to-End Encrypted
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmRepayDetails;

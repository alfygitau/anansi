import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, Hash, DollarSign, AlertCircle, Sparkles } from "lucide-react";

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

              <h2 className="text-2xl font-medium text-primary tracking-tight">
                Review Payment
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Verify the transaction details below.
              </p>
            </div>
            <div className="border-b border-slate-100 mx-8"></div>
            {/* Scrollable Receipt Area */}
            <div className="flex-grow overflow-y-auto p-8 py-6 space-y-6 bg-slate-50/30">
              {/* The "Big Check" Amount Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-100 text-center relative overflow-hidden">
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.2em] block mb-2">
                  Total Repayment
                </span>
                <h1 className="text-4xl font-medium text-primary tracking-tight">
                  {formatCurrency(amount)}
                </h1>
              </div>
              {/* Transaction Details Breakdown */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.25em]">
                  Transaction Summary
                </h3>
                <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.02)] divide-y divide-slate-100/80 overflow-hidden">
                  {/* Row 1: Payment Source */}
                  <div className="p-3.5 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                    <div className="flex items-center gap-3.5">
                      {/* Matched Emerald Tinted Icon Frame */}
                      <div className="size-9 rounded-xl bg-emerald-50/80 border border-emerald-100/40 flex items-center justify-center text-emerald-600 shrink-0">
                        <Smartphone size={18} className="stroke-[2.25]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Source
                        </p>
                        <p className="text-[14px] font-semibold text-slate-800 tracking-tight mt-0.5">
                          {phoneNumber}
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-100/60 rounded-full text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      M-Pesa
                    </span>
                  </div>

                  {/* Row 2: Reference */}
                  <div className="p-3.5 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                    <div className="flex items-center gap-3.5">
                      {/* Matched Blue Tinted Icon Frame */}
                      <div className="size-9 rounded-xl bg-blue-50/80 border border-blue-100/40 flex items-center justify-center text-blue-600 shrink-0">
                        <Hash size={18} className="stroke-[2.25]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Reference
                        </p>
                        <p className="text-[14px] font-semibold text-slate-800 uppercase tracking-wider mt-0.5">
                          LN-{new Date().getFullYear()}-AX
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 bg-blue-50 border border-blue-100/60 rounded-full text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                      Facility
                    </span>
                  </div>

                  {/* Row 3: Fees */}
                  <div className="p-3.5 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                    <div className="flex items-center gap-3.5">
                      {/* Premium Amber/Sparkle Frame for Waived/Free text */}
                      <div className="size-9 rounded-xl bg-amber-50/80 border border-amber-100/40 flex items-center justify-center text-amber-600 shrink-0">
                        <Sparkles size={18} className="stroke-[2.25]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Transaction Fee
                        </p>
                        <p className="text-[14px] font-semibold text-slate-800 tracking-tight mt-0.5">
                          Zero Charges
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-100/60 rounded-full text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                      Waived
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3">
                  <AlertCircle
                    size={14}
                    className="text-slate-300 mt-0.5 shrink-0"
                  />
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    By clicking continue, an STK push will be sent to your
                    device. Ensure you have the sufficient funds to complete the
                    transaction.
                  </p>
                </div>
              </div>
            </div>
            <div className="border-b border-slate-100 mx-8"></div>
            {/* Footer Action */}
            <div className="p-8 py-6 bg-white">
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
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmRepayDetails;

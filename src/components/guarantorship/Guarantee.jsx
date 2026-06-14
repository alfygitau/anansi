import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Info, Landmark, Coins } from "lucide-react";

const GuaranteeAmount = ({
  isOpen,
  onClose,
  onContinue,
  amount,
  setAmount,
}) => {
  const handleContinue = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    onContinue();
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setAmount(value);
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
            className="relative w-full max-w-[480px] bg-white shadow-2xl flex flex-col h-full border-l border-slate-100"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Landmark size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-900 leading-tight">
                    Pledge Amount
                  </h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-8 py-5 flex flex-col">
              <div className="mb-6">
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  How much will you back?
                </h4>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  Enter the specific amount you are willing to guarantee. This
                  amount will be held as a lien against your deposits.
                </p>
              </div>

              {/* Input Group */}
              <div className="space-y-6">
                <div className="relative group">
                  <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-2 block ml-2">
                    Guarantee Amount
                  </label>
                  <div className="relative flex items-center group">
                    {/* Absolute Prefix Block with Icon & Vertical Divider */}
                    <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                      <span className="text-slate-400 group-focus-within:text-blue-600 transition-colors">
                        <Coins size={18} className="stroke-[2.25]" />
                      </span>
                      <div className="w-[1.5px] h-5 bg-slate-200 ml-3 group-focus-within:bg-blue-600/20 transition-colors" />
                    </div>

                    <input
                      type="text"
                      value={amount}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      className="w-full pl-[72px] pr-8 py-3 bg-white border-2 border-slate-100 rounded-[12px] text-xl font-semibold text-slate-900 outline-none transition-all placeholder:text-slate-300"
                    />
                  </div>
                </div>

                {/* Helpful Tip */}
                <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100/50 flex items-center gap-4">
                  <div className="size-8 rounded-full bg-white flex items-center justify-center text-amber-600 shrink-0 shadow-sm">
                    <Info size={16} />
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-900 font-semibold">
                    Ensure this amount does not exceed your available deposits .
                    You can only guarantee what is uncommitted from your
                    savings.
                  </p>
                </div>

                <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100/50 flex items-center gap-4">
                  <div className="size-8 rounded-full bg-white flex items-center justify-center text-amber-600 shrink-0 shadow-sm">
                    <Info size={16} />
                  </div>
                  <p className="text-[11px] leading-relaxed text-amber-900 font-semibold">
                    Ensure this amount does not exceed the requested loan amount
                    . You cannot allocate, request, or guarantee a value that
                    surpasses the absolute size of the active facility.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-8 py-5 border-t border-slate-50">
              <button
                onClick={handleContinue}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full h-16 rounded-[18px] bg-slate-900 text-white text-xs font-medium uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-3"
              >
                Continue to Finalize
                <ArrowRight size={18} strokeWidth={3} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GuaranteeAmount;

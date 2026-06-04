import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  PiggyBank,
  Zap,
  ShieldCheck,
  Info,
  ArrowRight,
  X,
} from "lucide-react";
import { useStore } from "../../store/useStore";

const SaveAndInvest = ({ isOpen, onNext, onClose, onCombine }) => {
  const SHARE_PRICE = 1000;
  const setMembership = useStore((state) => state.setMembership);

  const calculateShares = (amount) => {
    const num = parseFloat(amount) || 0;
    return (num / SHARE_PRICE).toFixed(2);
  };

  const handleContinue = () => {
    setMembership({
      savings: "0",
      shares: "0",
      totalShares: calculateShares(0),
    });
    onNext();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex justify-end bg-slate-500/10"
        >
          {/* Invisible dismissal zone target click area */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="bg-white relative w-full max-w-[480px] h-full shadow-2xl flex flex-col z-10"
          >
            {/* Circled Grey Close Button Anchor */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 z-10 flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 text-gray-500 hover:text-gray-900 rounded-full transition-all active:scale-95 shadow-sm"
            >
              <X size={20} />
            </button>

            {/* Header Track */}
            <div className="px-8 pt-5 pb-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-center text-[#074073] shrink-0 shadow-sm">
                <TrendingUp size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#074073] leading-tight">
                  Maximize Starting Investment
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Combine requirements into a single execution step
                </p>
              </div>
            </div>
            <div className="border-b mx-8 border-slate-100"></div>

            {/* Scrollable Core Body Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Intent Explainer Text Block */}
              <p className="text-sm text-slate-600 leading-relaxed font-medium pl-1">
                Would you like to acquire structural shares and log your initial
                savings deposit alongside registration?
                <span className="text-[#074073] font-bold">
                  {" "}
                  Combining your payment prompts
                </span>{" "}
                allows you to satisfy setup milestones concurrently.
              </p>

              {/* Benefits Structured Matrix Blocks */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-2">
                  <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center border border-slate-100 text-amber-500 shadow-sm">
                    <Zap size={14} />
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                    Mitigate Fees
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium leading-normal">
                    Authorize exactly one transaction prompt rather than
                    incurring multiple carrier charges.
                  </p>
                </div>

                <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-200/60 shadow-sm space-y-2">
                  <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center border border-slate-100 text-emerald-500 shadow-sm">
                    <PiggyBank size={14} />
                  </div>
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                    Immediate Growth
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium leading-normal">
                    Lock in corporate dividend distribution vectors and compound
                    balances starting Day 1.
                  </p>
                </div>
              </div>

              {/* Secure Secondary Info Advisory Block */}
              <div className="flex gap-3 p-4 bg-slate-50 border border-slate-200/60 rounded-2xl shadow-sm">
                <Info className="text-[#074073] shrink-0 mt-0.5" size={16} />
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  <span className="text-slate-800 font-bold">
                    Optional Step:
                  </span>{" "}
                  Capital growth allocations are entirely non-mandatory. You can
                  freely pass past this window and seed capital straight from
                  your primary workspace later.
                </p>
              </div>
            </div>

            <div className="border-b mx-8 border-slate-100"></div>

            {/* Actions Execution Footer Deck */}
            <div className="p-8 space-y-3 bg-white shrink-0">
              <button
                type="button"
                onClick={onCombine}
                className="group w-full h-16 bg-[#074073] hover:bg-[#052d52] text-white rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-md"
              >
                <span>Yes, Add Shares & Savings</span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>

              <button
                type="button"
                onClick={handleContinue}
                className="w-full h-12 bg-white hover:bg-slate-50 text-[#074073] border border-slate-200 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-sm"
              >
                No, Pay Registration Only
              </button>
            </div>

            {/* Cryptographic Compliance Bottom Tracker Tag */}
            <div className="bg-slate-50 border-t border-slate-100 p-4 flex items-center justify-center gap-2 shrink-0 select-none">
              <ShieldCheck size={14} className="text-slate-400" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Secure Anansi Sacco Protocol Bound
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SaveAndInvest;

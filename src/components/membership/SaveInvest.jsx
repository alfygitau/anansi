import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  PiggyBank,
  Zap,
  ShieldCheck,
  Info,
  ArrowRight,
} from "lucide-react";
import { useStore } from "../../store/useStore";

const SaveAndInvest = ({ isOpen, onClose, onNext, onCombine }) => {
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#042159]/60 backdrop-blur-sm"
          />

          {/* Centered Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[500px] bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Content Area */}
            <div className="p-8 space-y-6">
              {/* Title & Iconography */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-50 rounded-2xl text-[#042159]">
                  <TrendingUp size={32} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-[#042159] tracking-tight leading-tight">
                    Maximize Your <br />
                    Starting Investment
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed px-4">
                    Would you like to purchase shares and deposit savings now?
                    <span className="text-[#042159] font-bold">
                      {" "}
                      Combine your payments{" "}
                    </span>
                    to clear all setup requirements in one go.
                  </p>
                </div>
              </div>

              {/* Benefits Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <Zap className="text-amber-500" size={18} />
                  <h4 className="text-[11px] font-black uppercase text-slate-700">
                    Save Money
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Pay a single transaction fee instead of multiple prompts.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <PiggyBank className="text-emerald-500" size={18} />
                  <h4 className="text-[11px] font-black uppercase text-slate-700">
                    Early Growth
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Start earning dividends and interest from Day 1.
                  </p>
                </div>
              </div>

              {/* Secure Disclaimer */}
              <div className="flex gap-3 p-4 bg-[#F0FFFE] rounded-2xl border border-cyan-100">
                <Info className="text-[#042159] shrink-0" size={18} />
                <p className="text-[11px] text-[#042159]/70 leading-relaxed">
                  Adding shares and savings is{" "}
                  <span className="font-bold italic">optional</span>. You can
                  always add more funds later from your dashboard.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={onCombine}
                  className="group w-full h-14 bg-[#042159] hover:bg-[#062d7a] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
                >
                  Yes, Add Shares & Savings
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform text-[#4DB8E4]"
                  />
                </button>

                <button
                  onClick={handleContinue}
                  className="w-full border h-12 text-[#042159] hover:bg-slate-50 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all"
                >
                  No, Pay Registration Only
                </button>
              </div>
            </div>

            {/* Trust Footer */}
            <div className="bg-slate-50 p-4 flex items-center justify-center gap-2">
              <ShieldCheck size={14} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Secure Anansi Sacco Protocol
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SaveAndInvest;

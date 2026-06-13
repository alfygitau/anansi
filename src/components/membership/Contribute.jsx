import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PiggyBank,
  PieChart,
  Info,
  ArrowRight,
  Calculator,
  X,
  AlertCircle,
} from "lucide-react";
import { useStore } from "../../store/useStore";

const SetupContributions = ({ isOpen, onClose, onNext }) => {
  const [savingsAmount, setSavingsAmount] = useState("");
  const [sharesAmount, setSharesAmount] = useState("");
  const [errors, setErrors] = useState({ savings: "", shares: "" });
  const setMembership = useStore((state) => state.setMembership);

  const SHARE_PRICE = 1000;

  const calculateShares = (amount) => {
    const num = parseFloat(amount) || 0;
    return (num / SHARE_PRICE).toFixed(2);
  };

  const handleReview = () => {
    setMembership({
      savings: savingsAmount || "0",
      shares: sharesAmount || "0",
      totalShares: calculateShares(sharesAmount),
    });
    onNext();
  };

  const validateField = (name, value) => {
    let error = "";
    const num = parseFloat(value);
    if (value && num < 0) {
      error = "Amount cannot be negative";
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const isFormValid =
    (savingsAmount || sharesAmount) &&
    validateField("savings", savingsAmount) === "" &&
    validateField("shares", sharesAmount) === "";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex justify-end bg-zinc-950/20 transition-opacity"
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
            <div className="px-8 pt-5 pb-6">
              <h2 className="text-2xl font-bold text-[#074073]">
                Contributions
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Set initial savings and share capital balances
              </p>
            </div>
            <div className="border-b mx-8 border-slate-100"></div>

            {/* Scrollable Core Form Workspace Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* DEPOSIT SAVINGS CONTAINER MODULE */}
              <div className="p-5 rounded-[24px] bg-emerald-50/30 border border-emerald-100 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-white border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                    <PiggyBank size={16} />
                  </div>
                  <h3 className="font-black text-[10px] uppercase tracking-widest text-emerald-900">
                    Deposit Savings
                  </h3>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">
                    Amount to Save
                  </label>
                  <div className="relative flex items-center bg-white border-2 border-slate-100 focus-within:border-slate-900 rounded-2xl h-14 transition-all duration-200 shadow-sm">
                    <div className="pl-6 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto shrink-0 font-bold text-[11px] tracking-wider">
                      KES
                    </div>
                    <input
                      type="number"
                      name="savings"
                      min={0}
                      value={savingsAmount}
                      onChange={(e) => setSavingsAmount(e.target.value)}
                      onBlur={handleBlur}
                      placeholder="0.00"
                      className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:ring-0 focus:outline-none"
                    />
                  </div>
                  {errors.savings && (
                    <p className="text-rose-500 text-[11px] font-bold flex items-center gap-1 ml-1 mt-1">
                      <AlertCircle size={12} /> {errors.savings}
                    </p>
                  )}
                </div>
              </div>

              {/* PURCHASE SHARE CAPITAL CONTAINER MODULE */}
              <div className="p-5 rounded-[24px] bg-blue-50/30 border border-blue-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-white border border-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                      <PieChart size={16} />
                    </div>
                    <h3 className="font-black text-[10px] uppercase tracking-widest text-[#074073]">
                      Purchase Shares
                    </h3>
                  </div>
                  <span className="text-[9px] bg-white border border-blue-100 text-[#074073] px-2 py-1 rounded-lg font-medium uppercase tracking-tighter shadow-sm">
                    1 Share = KES 1,000
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">
                      Investment Capital Amount
                    </label>
                    <div className="relative flex items-center bg-white border-2 border-slate-100 focus-within:border-slate-900 rounded-2xl h-14 transition-all duration-200 shadow-sm">
                      <div className="pl-6 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto shrink-0 font-bold text-[11px] tracking-wider">
                        KES
                      </div>
                      <input
                        type="number"
                        name="shares"
                        min={0}
                        value={sharesAmount}
                        onChange={(e) => setSharesAmount(e.target.value)}
                        onBlur={handleBlur}
                        placeholder="e.g. 5,000"
                        className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:ring-0 focus:outline-none"
                      />
                    </div>
                    {errors.shares && (
                      <p className="text-rose-500 text-[11px] font-bold flex items-center gap-1 ml-1 mt-1">
                        <AlertCircle size={12} /> {errors.shares}
                      </p>
                    )}
                  </div>

                  {/* Equity Allocation Dynamic Metric Card */}
                  <div className="flex items-center justify-between bg-white border border-slate-200/60 p-3.5 rounded-xl shadow-sm">
                    <div className="flex items-center gap-2">
                      <Calculator size={14} className="text-blue-500" />
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Equity to be issued:
                      </span>
                    </div>
                    <span className="text-xs font-black text-[#074073]">
                      {calculateShares(sharesAmount)} Shares
                    </span>
                  </div>
                </div>
              </div>

              {/* Consolidation Advisory Statement Prompt */}
              <div className="p-4 rounded-xl flex gap-3 bg-slate-50 border border-slate-200/60 shadow-sm">
                <Info className="text-slate-400 shrink-0 mt-0.5" size={14} />
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  <span className="text-slate-800 font-bold">
                    Carrier Surcharge Mitigation:
                  </span>{" "}
                  Consolidating your initial capital inputs into a single prompt
                  triggers only one structural M-PESA validation protocol fee,
                  bypassing multiple individual deposit premiums later.
                </p>
              </div>
            </div>

            <div className="border-b mx-8 border-slate-100"></div>

            {/* Pinned Execution Actions Footer */}
            <div className="p-8 bg-white shrink-0">
              <button
                onClick={handleReview}
                disabled={!isFormValid}
                className={`group w-full h-16 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all
                  ${
                    isFormValid
                      ? "bg-[#074073] hover:bg-[#052d52] text-white active:scale-[0.98] shadow-md"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                <span>Go to Review & Finish</span>
                <ArrowRight
                  size={14}
                  className={`transition-transform duration-200 ${isFormValid ? "group-hover:translate-x-0.5" : ""}`}
                />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SetupContributions;

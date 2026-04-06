import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PiggyBank,
  PieChart,
  Info,
  ArrowRight,
  Calculator,
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

    if (name === "savings") {
      if (value && num < 0) error = "Amount cannot be negative";
    }

    if (name === "shares") {
      if (value) {
        if (num < 0) {
          error = "Amount cannot be negative";
        }
      }
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/60 bg-slate-900/40"
          />

          {/* Centered Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[520px] bg-white p-6 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
          >
            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-primary tracking-tight">
                  Contributions
                </h2>
                <p className="text-slate-500 text-sm">
                  Set your initial savings and share capital
                </p>
              </div>

              <div className="space-y-6">
                {/* Deposit Savings Card */}
                <div className="p-5 rounded-[24px] bg-emerald-50/50 border border-emerald-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg text-emerald-600 shadow-sm">
                      <PiggyBank size={20} />
                    </div>
                    <h3 className="font-bold text-emerald-900 text-sm">
                      Deposit Savings
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-emerald-700/60 ml-1">
                      Amount to Save
                    </label>
                    <div className="flex h-12 w-full items-center bg-white border border-emerald-200 rounded-xl px-4 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                      <span className="font-bold text-emerald-800/40 text-xs mr-3">
                        KES
                      </span>
                      <input
                        type="number"
                        name="savings"
                        min={0}
                        value={savingsAmount}
                        onChange={(e) => setSavingsAmount(e.target.value)}
                        onBlur={handleBlur}
                        placeholder="0.00"
                        className="bg-transparent font-bold text-primary outline-none w-full text-sm"
                      />
                    </div>
                    {errors.savings && (
                      <p className="text-red-500 text-[10px] mt-1">
                        {errors.savings}
                      </p>
                    )}
                  </div>
                </div>

                {/* Buy Shares Card */}
                <div className="p-5 rounded-[24px] bg-blue-50/50 border border-blue-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg text-blue-600 shadow-sm">
                        <PieChart size={20} />
                      </div>
                      <h3 className="font-bold text-blue-900 text-sm">
                        Purchase Shares
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold bg-white px-2 py-1 rounded-md text-blue-600 border border-blue-100">
                      1 Share = KES 1,000
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-blue-700/60 ml-1">
                        Investment Amount
                      </label>
                      <div className="flex h-12 w-full items-center bg-white border border-blue-200 rounded-xl px-4 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
                        <span className="font-bold text-blue-800/40 text-xs mr-3">
                          KES
                        </span>
                        <input
                          type="number"
                          name="shares"
                          min={0}
                          value={sharesAmount}
                          onChange={(e) => setSharesAmount(e.target.value)}
                          onBlur={handleBlur}
                          placeholder="e.g. 5000"
                          className="bg-transparent font-bold text-primary outline-none w-full text-sm"
                        />
                      </div>
                      {errors.shares && (
                        <p className="text-red-500 text-[10px] mt-1">
                          {errors.shares}
                        </p>
                      )}
                    </div>

                    {/* Result Card */}
                    <div className="flex items-center justify-between bg-white/60 p-3 rounded-xl border border-blue-200/50">
                      <div className="flex items-center gap-2">
                        <Calculator size={14} className="text-blue-400" />
                        <span className="text-xs font-medium text-slate-500">
                          Equity to be issued:
                        </span>
                      </div>
                      <span className="text-sm font-black text-blue-700">
                        {calculateShares(sharesAmount)} Shares
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Fee Disclaimer */}
              <div className="flex gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <Info className="text-slate-400 shrink-0" size={18} />
                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                  A single M-PESA transaction fee will apply to the total
                  amount. This is cheaper than making individual deposits later.
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-white border-t mt-4 border-slate-50">
              <button
                onClick={handleReview}
                disabled={!isFormValid}
                className={`
    group w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs 
    flex items-center justify-center gap-3 transition-all duration-200
    ${
      isFormValid
        ? "bg-primary hover:bg-[#062d7a] text-white shadow-xl shadow-blue-900/20 active:scale-[0.98] cursor-pointer"
        : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-70 shadow-none"
    }
  `}
              >
                Go to Review & Finish
                <ArrowRight
                  size={18}
                  className={`transition-transform ${
                    isFormValid
                      ? "group-hover:translate-x-1 text-secondary"
                      : "text-slate-300"
                  }`}
                />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SetupContributions;

import { useEffect, useState } from "react";
import {
  X,
  ArrowUpRight,
  Phone,
  AlertCircle,
  ShieldAlert,
  Smartphone,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import { useStore } from "../../../store/useStore";
import { motion, AnimatePresence } from "framer-motion";

const Withdrawal = ({ isOpen, onClose, account, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [useRegisteredNumber, setUseRegisteredNumber] = useState(true);
  const [customNumber, setCustomNumber] = useState("");
  const [errors, setErrors] = useState({ mobile: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const setWithdrawalDetails = useStore((state) => state.setWithdrawalDetails); // Assuming standard naming convention

  const activeMobileNumber = useRegisteredNumber
    ? auth?.user?.mobileno || ""
    : customNumber;

  // Clear errors when toggling number targets
  useEffect(() => {
    setErrors({ mobile: "", amount: "" });
  }, [useRegisteredNumber]);

  const validateField = (name, value) => {
    let error = "";
    if (name === "mobile" && !useRegisteredNumber) {
      const kePhoneRegex = /^(?:254|\+254|0)?([71][0-9]{8})$/;
      if (!value) {
        error = "Phone number is required";
      } else if (!kePhoneRegex.test(value.replace(/\s+/g, ""))) {
        error = "Enter a valid M-PESA number (e.g., 0712...)";
      }
    }
    if (name === "amount") {
      const amt = Number(value);
      const availableBalance = Number(account?.balance || 0);
      if (!value || amt <= 0) {
        error = "Amount must be greater than 0";
      } else if (amt > availableBalance) {
        error = `Insufficient FOSA funds. Maximum available: KES ${availableBalance.toLocaleString()}`;
      }
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const isFormValid =
    Number(amount) > 0 &&
    !validateField("amount", amount) &&
    (useRegisteredNumber ||
      (customNumber.length >= 10 && !validateField("mobile", customNumber)));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);

    // Persist contextual values to global ledger store state
    if (setWithdrawalDetails) {
      setWithdrawalDetails({
        withdrawalAmount: Number(amount),
        mobile: activeMobileNumber,
        accountNumber: account?.account_number,
      });
    }

    // Simulate backend FOSA API transaction sequence
    setTimeout(() => {
      setLoading(false);
      onSuccess();
      onClose();
    }, 1500);
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
            {/* Dismissal Circular Core Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 z-10 flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 text-gray-500 hover:text-gray-900 rounded-full transition-all active:scale-95 shadow-sm"
            >
              <X size={20} />
            </button>

            {/* Scrollable Content Container */}
            <div className="flex-1 overflow-y-auto">
              {/* Header Layout Block */}
              <div className="px-8 pt-8 pb-6">
                <h2 className="text-2xl font-bold text-[#074073]">
                  Withdraw to M-PESA
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Safely move funds out of your FOSA savings.
                </p>
              </div>
              <div className="border-b mx-8 border-slate-100"></div>

              <div className="p-8 space-y-6">
                {/* Available Balance Mirror Card */}
                <div className="flex items-center justify-between bg-rose-50/50 p-5 rounded-2xl border border-rose-100/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm border border-rose-100/40">
                      <ArrowUpRight className="text-rose-600" size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Available FOSA Balance
                      </span>
                      <span className="text-base font-bold text-slate-800">
                        KES{" "}
                        {(account?.balance || 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Target Radio Selection Matrix */}
                <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex flex-col gap-3">
                  <label className="flex items-center gap-3.5 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="destination"
                      checked={useRegisteredNumber}
                      onChange={() => setUseRegisteredNumber(true)}
                      className="w-4 h-4 text-[#074073] focus:ring-0 border-slate-300 focus:ring-offset-0"
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Send to registered Phone
                      </p>
                      <p className="text-[11px] font-mono font-medium text-slate-400">
                        {auth?.user?.mobileno || "No number linked"}
                      </p>
                    </div>
                  </label>

                  <hr className="border-slate-200/60" />

                  <label className="flex items-center gap-3.5 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="destination"
                      checked={!useRegisteredNumber}
                      onChange={() => setUseRegisteredNumber(false)}
                      className="w-4 h-4 text-[#074073] focus:ring-0 border-slate-300 focus:ring-offset-0"
                    />
                    <span className="text-xs font-bold text-slate-800">
                      Send to a different Number
                    </span>
                  </label>
                </div>

                {/* Conditional Sub-input Fields Configuration */}
                <form
                  id="withdrawal-panel-form"
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  {!useRegisteredNumber && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <label className="text-[11px] font-medium text-slate-400 uppercase tracking-widest ml-1">
                        M-PESA Mobile Number
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                          <Phone
                            size={18}
                            className="text-slate-300 group-focus-within:text-[#074073] transition-colors"
                          />
                          <div className="w-[1.5px] h-5 bg-slate-200 ml-4 group-focus-within:bg-[#074073]/20 transition-colors" />
                        </div>
                        <input
                          type="tel"
                          name="mobile"
                          value={customNumber}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            setCustomNumber(e.target.value);
                            setErrors((prev) => ({ ...prev, mobile: "" }));
                          }}
                          placeholder="e.g. 0712345678"
                          className="w-full pl-[74px] pr-6 py-5 h-14 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-[#074073] focus:ring-4 focus:ring-[#074073]/5 transition-all placeholder:text-xs font-medium text-slate-800"
                        />
                      </div>
                      <AnimatePresence>
                        {errors.mobile && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="text-rose-500 text-[11px] font-bold flex items-center gap-1 ml-1"
                          >
                            <AlertCircle size={12} /> {errors.mobile}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-slate-400 uppercase tracking-widest ml-1">
                      Amount to Withdraw
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                        <span className="text-[11px] font-medium tracking-wider text-slate-400 group-focus-within:text-[#074073] transition-colors">
                          KES
                        </span>
                        <div className="w-[1.5px] h-5 bg-slate-200 ml-3 group-focus-within:bg-[#074073]/20 transition-colors" />
                      </div>
                      <input
                        type="number"
                        name="amount"
                        value={amount}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          setAmount(e.target.value);
                          setErrors((prev) => ({ ...prev, amount: "" }));
                        }}
                        placeholder="0.00"
                        className="w-full pl-[74px] pr-6 py-5 h-14 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-[#074073] focus:ring-4 focus:ring-[#074073]/5 transition-all placeholder:text-xs font-semibold text-slate-800"
                      />
                    </div>
                    <AnimatePresence>
                      {errors.amount && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="text-rose-500 text-[11px] font-bold flex items-center gap-1 ml-1"
                        >
                          <AlertCircle size={12} /> {errors.amount}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Operational Safety Compliance Banner */}
                  <div className="mt-3 p-3 bg-slate-50 border flex items-center border-slate-200/60 rounded-xl">
                    <ShieldAlert
                      size={20}
                      className="shrink-0 text-amber-500"
                    />
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium pl-3">
                      Maximum transaction cap is{" "}
                      <strong className="text-slate-700 font-bold">
                        KES 250,000.00
                      </strong>
                      . Ensure recipient phone targets can absorb the incoming
                      cash float to prevent ledger reversal bottlenecks.
                    </p>
                  </div>
                </form>
              </div>
            </div>

            <div className="border-b mx-8 border-slate-100"></div>

            {/* Footer Action Anchor - Force Pinned to Bottom Base */}
            <div className="p-8 py-5 bg-white">
              <button
                type="submit"
                form="withdrawal-panel-form"
                disabled={!isFormValid || loading}
                className={`w-full h-14 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${
                  isFormValid && !loading
                    ? "bg-[#074073] hover:bg-[#052d52] text-white active:scale-[0.98] shadow-lg shadow-blue-900/10"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? "Processing Transfer..." : "Confirm Withdrawal"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Withdrawal;

import { useEffect, useState } from "react";
import {
  X,
  Receipt,
  Hash,
  AlertCircle,
  ShieldAlert,
  Smartphone,
} from "lucide-react";
import { useStore } from "../../../store/useStore";
import { motion, AnimatePresence } from "framer-motion";

const PayBill = ({ isOpen, onClose, account, onSuccess }) => {
  const [mode, setMode] = useState("paybill"); // 'paybill' or 'till'
  const [businessNumber, setBusinessNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState({
    businessNumber: "",
    accountNumber: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const setMerchantDetails = useStore((state) => state.setMerchantDetails); // Global context hooks

  // Clear states when toggle tabs change
  useEffect(() => {
    setBusinessNumber("");
    setAccountNumber("");
    setErrors({ businessNumber: "", accountNumber: "", amount: "" });
  }, [mode]);

  const validateField = (name, value) => {
    let error = "";
    if (name === "businessNumber") {
      if (!value) {
        error =
          mode === "paybill"
            ? "Paybill business number is required"
            : "Till number is required";
      } else if (!/^\d{5,7}$/.test(value)) {
        error =
          mode === "paybill"
            ? "Enter a valid Paybill number (5-7 digits)"
            : "Enter a valid Till number (5-7 digits)";
      }
    }
    if (name === "accountNumber" && mode === "paybill") {
      if (!value.trim()) {
        error = "Account number or matcher string reference is required";
      }
    }
    if (name === "amount") {
      const amt = Number(value);
      const availableBalance = Number(account?.balance || 0);
      if (!value || amt <= 0) {
        error = "Amount must be greater than 0";
      } else if (amt > availableBalance) {
        error = `Insufficient FOSA funds. Available balance: KES ${availableBalance.toLocaleString()}`;
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
    businessNumber.length >= 5 &&
    !validateField("businessNumber", businessNumber) &&
    !validateField("amount", amount) &&
    (mode === "till" ||
      (accountNumber.trim().length > 0 &&
        !validateField("accountNumber", accountNumber)));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);

    if (setMerchantDetails) {
      setMerchantDetails({
        paymentMode: mode,
        shortCode: businessNumber,
        billAccount: mode === "paybill" ? accountNumber : null,
        paymentAmount: Number(amount),
        sourceAccount: account?.account_number,
      });
    }

    // Simulate backend FOSA routing transaction sequence
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
                  Merchant Payment
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Settle standard utility bills and merchant targets instantly.
                </p>
              </div>
              <div className="border-b mx-8 border-slate-100"></div>

              <div className="p-8 space-y-8">
                {/* Available Balance Mirror Card */}
                <div className="flex items-center justify-between bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm border border-blue-100/40">
                      <Receipt className="text-[#074073]" size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Available Balance Source
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

                {/* Toggle Tab Switch */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setMode("paybill")}
                    className={`py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                      mode === "paybill"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Paybill
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("till")}
                    className={`py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                      mode === "till"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Buy Goods (Till)
                  </button>
                </div>

                <form
                  id="merchant-panel-form"
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  {/* Short Code Entry Section */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-slate-400 uppercase tracking-widest ml-1">
                      {mode === "paybill"
                        ? "Business Paybill Number"
                        : "Till Number"}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                        <Hash
                          size={18}
                          className="text-slate-300 group-focus-within:text-[#074073] transition-colors"
                        />
                        <div className="w-[1.5px] h-5 bg-slate-200 ml-4 group-focus-within:bg-[#074073]/20 transition-colors" />
                      </div>
                      <input
                        type="number"
                        name="businessNumber"
                        value={businessNumber}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          setBusinessNumber(e.target.value);
                          setErrors((prev) => ({
                            ...prev,
                            businessNumber: "",
                          }));
                        }}
                        placeholder={
                          mode === "paybill" ? "e.g. 247247" : "e.g. 543210"
                        }
                        className="w-full pl-[74px] pr-6 py-5 h-14 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-[#074073] focus:ring-4 focus:ring-[#074073]/5 transition-all placeholder:text-xs font-medium text-slate-800"
                      />
                    </div>
                    <AnimatePresence>
                      {errors.businessNumber && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="text-rose-500 text-[11px] font-bold flex items-center gap-1 ml-1"
                        >
                          <AlertCircle size={12} /> {errors.businessNumber}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Account Reference Entry Section (Conditional) */}
                  {mode === "paybill" && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <label className="text-[11px] font-medium text-slate-400 uppercase tracking-widest ml-1">
                        Account Number
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                          <Smartphone
                            size={18}
                            className="text-slate-300 group-focus-within:text-[#074073] transition-colors"
                          />
                          <div className="w-[1.5px] h-5 bg-slate-200 ml-4 group-focus-within:bg-[#074073]/20 transition-colors" />
                        </div>
                        <input
                          type="text"
                          name="accountNumber"
                          value={accountNumber}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            setAccountNumber(e.target.value);
                            setErrors((prev) => ({
                              ...prev,
                              accountNumber: "",
                            }));
                          }}
                          placeholder="e.g. KPLC-ACCOUNT"
                          className="w-full pl-[74px] pr-6 py-5 h-14 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-[#074073] focus:ring-4 focus:ring-[#074073]/5 transition-all placeholder:text-xs font-medium text-slate-800"
                        />
                      </div>
                      <AnimatePresence>
                        {errors.accountNumber && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="text-rose-500 text-[11px] font-bold flex items-center gap-1 ml-1"
                          >
                            <AlertCircle size={12} /> {errors.accountNumber}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Transaction Amount Section */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-slate-400 uppercase tracking-widest ml-1">
                      Amount to Settle
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
                </form>
              </div>
            </div>

            <div className="border-b mx-8 border-slate-100"></div>

            {/* Footer Action Anchor - Pinned to Bottom Base */}
            <div className="p-8 py-5 bg-white">
              <button
                type="submit"
                form="merchant-panel-form"
                disabled={!isFormValid || loading}
                className={`w-full h-14 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${
                  isFormValid && !loading
                    ? "bg-[#074073] hover:bg-[#052d52] text-white active:scale-[0.98] shadow-lg shadow-blue-900/10"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {loading
                  ? "Authorizing Payment..."
                  : "Confirm Merchant Payment"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PayBill;

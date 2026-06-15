import { useEffect, useState } from "react";
import {
  X,
  Send,
  Landmark,
  AlertCircle,
  ShieldAlert,
  ArrowDownCircle,
} from "lucide-react";
import { useStore } from "../../../store/useStore";
import { motion, AnimatePresence } from "framer-motion";

const Transfer = ({ isOpen, onClose, account, onSuccess }) => {
  const [targetType, setTargetType] = useState("internal"); // 'internal' or 'bank'
  const [selectedBank, setSelectedBank] = useState("kcb");
  const [destinationAccount, setDestinationAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState({ destination: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const setTransferDetails = useStore((state) => state.setTransferDetails); // Standard global store hook usage

  // Clear states when toggle tabs change
  useEffect(() => {
    setDestinationAccount("");
    setErrors({ destination: "", amount: "" });
  }, [targetType]);

  const validateField = (name, value) => {
    let error = "";
    if (name === "destination") {
      if (!value) {
        error =
          targetType === "internal"
            ? "Recipient member number is required"
            : "Bank account number is required";
      } else if (targetType === "internal" && value.trim().length < 3) {
        error = "Enter a valid FOSA/Member designation profile identifier";
      } else if (
        targetType === "bank" &&
        !/^\d{8,16}$/.test(value.replace(/\s+/g, ""))
      ) {
        error =
          "Enter a valid numeric clearing bank account reference (8-16 digits)";
      }
    }
    if (name === "amount") {
      const amt = Number(value);
      const availableBalance = Number(account?.balance || 0);
      if (!value || amt <= 0) {
        error = "Transfer amount must be greater than 0";
      } else if (amt > availableBalance) {
        error = `Insufficient funds. Your available limit is KES ${availableBalance.toLocaleString()}`;
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
    destinationAccount.trim().length > 0 &&
    !validateField("destination", destinationAccount) &&
    !validateField("amount", amount);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    setLoading(true);

    if (setTransferDetails) {
      setTransferDetails({
        transferType: targetType,
        bank: targetType === "bank" ? selectedBank : null,
        destination: destinationAccount,
        transferAmount: Number(amount),
        sourceAccount: account?.account_number,
      });
    }

    // Simulate core banking settlement cycle
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
          {/* Dismissal Click Overlay */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="bg-white relative w-full max-w-[480px] h-full shadow-2xl flex flex-col z-10"
          >
            {/* Round Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 z-10 flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 text-gray-500 hover:text-gray-900 rounded-full transition-all active:scale-95 shadow-sm"
            >
              <X size={20} />
            </button>

            {/* Scrollable Core Elements View */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-8 pt-8 pb-6">
                <h2 className="text-2xl font-bold text-[#074073]">
                  Funds Transfer
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Move capital instantly between multi-ledger environments.
                </p>
              </div>
              <div className="border-b mx-8 border-slate-100"></div>

              <div className="p-8 space-y-8">
                {/* Balance Status Display Card */}
                <div className="flex items-center justify-between bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm border border-emerald-100/40">
                      <Send className="text-emerald-600" size={20} />
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

                {/* Modern Toggle Menu Switch Controls */}
                <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setTargetType("internal")}
                    className={`py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                      targetType === "internal"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Internal
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType("bank")}
                    className={`py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                      targetType === "bank"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    External Bank
                  </button>
                </div>

                <form
                  id="transfer-panel-form"
                  onSubmit={handleSubmit}
                  className="space-y-8"
                >
                  {/* Dynamic Clearing Bank Configuration Dropdown */}
                  {targetType === "bank" && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <label className="text-[11px] font-medium text-slate-400 uppercase tracking-widest ml-1">
                        Select Target Bank
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                          <Landmark size={18} className="text-slate-300" />
                          <div className="w-[1.5px] h-5 bg-slate-200 ml-4" />
                        </div>
                        <select
                          value={selectedBank}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full pl-[74px] pr-6 py-4 h-14 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-[#074073] focus:ring-4 focus:ring-[#074073]/5 transition-all text-sm font-semibold text-slate-800 appearance-none cursor-pointer"
                        >
                          <option value="kcb">
                            Kenya Commercial Bank (KCB)
                          </option>
                          <option value="equity">Equity Bank</option>
                          <option value="coop">Co-operative Bank</option>
                          <option value="absa">Absa Bank</option>
                        </select>
                        <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-slate-400">
                          <ArrowDownCircle size={16} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recipient Account Value Processing Node */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-slate-400 uppercase tracking-widest ml-1">
                      {targetType === "internal"
                        ? "Recipient FOSA/Member No."
                        : "Recipient Bank Account"}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                        <Landmark
                          size={18}
                          className="text-slate-300 group-focus-within:text-[#074073] transition-colors"
                        />
                        <div className="w-[1.5px] h-5 bg-slate-200 ml-4 group-focus-within:bg-[#074073]/20 transition-colors" />
                      </div>
                      <input
                        type="text"
                        name="destination"
                        value={destinationAccount}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          setDestinationAccount(e.target.value);
                          setErrors((prev) => ({ ...prev, destination: "" }));
                        }}
                        placeholder={
                          targetType === "internal"
                            ? "e.g. MH-99823"
                            : "e.g. 01109283748300"
                        }
                        className="w-full pl-[74px] pr-6 py-5 h-14 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-[#074073] focus:ring-4 focus:ring-[#074073]/5 transition-all placeholder:text-xs font-medium text-slate-800"
                      />
                    </div>
                    <AnimatePresence>
                      {errors.destination && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="text-rose-500 text-[11px] font-bold flex items-center gap-1 ml-1"
                        >
                          <AlertCircle size={12} /> {errors.destination}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Operational Value Limit Frame */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-slate-400 uppercase tracking-widest ml-1">
                      Amount to Transfer
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

            {/* Sticky Action Footer Panel */}
            <div className="p-8 py-5 bg-white">
              <button
                type="submit"
                form="transfer-panel-form"
                disabled={!isFormValid || loading}
                className={`w-full h-14 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 ${
                  isFormValid && !loading
                    ? "bg-[#074073] hover:bg-[#052d52] text-white active:scale-[0.98] shadow-lg shadow-blue-900/10"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? "Processing Transfer..." : "Execute Transfer"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Transfer;

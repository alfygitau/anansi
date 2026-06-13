import { useEffect, useState } from "react";
import { X, Wallet, Phone, AlertCircle, ShieldAlert } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useStore } from "../../store/useStore";
import { motion, AnimatePresence } from "framer-motion";

const DepositAmount = ({ isOpen, onClose, onConfirm }) => {
  const [amount, setAmount] = useState("0");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState({ mobile: "", amount: "" });
  const { auth } = useAuth();
  const setDepositDetails = useStore((state) => state.setDepositDetails);

  useEffect(() => {
    setMobile(auth?.user?.mobileno || "");
  }, [auth]);

  const validateField = (name, value) => {
    let error = "";
    if (name === "mobile") {
      const kePhoneRegex = /^(?:254|\+254|0)?([71][0-9]{8})$/;
      if (!value) {
        error = "Phone number is required";
      } else if (!kePhoneRegex.test(value.replace(/\s+/g, ""))) {
        error = "Enter a valid M-PESA number (e.g., 0712...)";
      }
    }
    if (name === "amount") {
      const amt = Number(value);
      if (!value || amt <= 0) {
        error = "Amount must be greater than 0";
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
    mobile.length >= 10 &&
    !validateField("mobile", mobile) &&
    !validateField("amount", amount);

  const generateUniqueId = () => {
    return "id-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  };

  const handleSave = () => {
    setDepositDetails({
      depositAmount: Number(amount),
      mobile: mobile,
      reference: generateUniqueId(),
    });
    onConfirm();
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
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 text-gray-500 hover:text-gray-900 rounded-full transition-all active:scale-95 shadow-sm"
            >
              <X size={20} />
            </button>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Header Section */}
              <div className="px-8 pt-8 pb-6">
                <h2 className="text-2xl font-bold text-[#074073]">
                  Deposit Savings
                </h2>
                <p className="text-sm text-slate-500 font-medium">
                  Securely add funds to your savings account.
                </p>
              </div>
              <div className="border-b mx-8 border-slate-100"></div>
              <div className="p-8 space-y-10">
                {/* Payment Method Display */}
                <div className="flex items-center justify-between bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100">
                      <Wallet className="text-[#074073]" size={20} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Method
                      </span>
                      <span className="text-sm font-bold text-gray-700">
                        Pay via M-PESA
                      </span>
                    </div>
                  </div>
                  <img src="/mpesa.svg" alt="M-Pesa" className="h-6" />
                </div>

                {/* Inputs Grid */}
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-slate-400 uppercase tracking-widest ml-1">
                      M-PESA Phone Number
                    </label>
                    <div className="relative group">
                      {/* Absolute Prefix Block */}
                      <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                        <Phone
                          size={18}
                          className="text-slate-300 group-focus-within:text-[#074073] transition-colors"
                        />
                        <div className="w-[1.5px] h-5 bg-slate-200 ml-4 group-focus-within:bg-[#074073]/20 transition-colors" />
                      </div>

                      <input
                        type="text"
                        name="mobile"
                        value={mobile}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          setMobile(e.target.value);
                          setErrors((prev) => ({
                            ...prev,
                            [name]: "",
                          }));
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

                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-slate-400 uppercase tracking-widest ml-1">
                      Amount to Deposit
                    </label>
                    <div className="relative group">
                      {/* Absolute Prefix Block with Custom KES Badge */}
                      <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                        <span className="text-[11px] font-medium tracking-wider text-slate-400 group-focus-within:text-[#074073] transition-colors">
                          KES
                        </span>
                        {/* Shifted ml-3 here to cleanly space from the letters instead of the icon layout */}
                        <div className="w-[1.5px] h-5 bg-slate-200 ml-3 group-focus-within:bg-[#074073]/20 transition-colors" />
                      </div>

                      <input
                        type="number"
                        name="amount"
                        value={amount}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          setAmount(e.target.value);
                          setErrors((prev) => ({
                            ...prev,
                            [name]: "",
                          }));
                        }}
                        placeholder="Min. 500"
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

                    <div className="mt-3 p-3 bg-slate-50 border flex items-center border-slate-200/60 rounded-xl space-y-1">
                      <ShieldAlert size={20} className="shrink-0" />
                      <p className="text-[10px] text-slate-500 leading-relaxed font-medium pl-5">
                        Minimum deposit is{" "}
                        <strong className="text-[#074073] font-bold">
                          KES 100.00
                        </strong>
                        . Ensure the M-PESA account name matches your profile.
                        Processing may take up to 15 minutes during network
                        delays.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-b mx-8 border-slate-100"></div>
            {/* Footer Action - Pinned to Bottom */}
            <div className="p-8 bg-white">
              <button
                onClick={handleSave}
                disabled={!isFormValid}
                className={`w-full h-14 font-bold rounded-2xl transition-all ${
                  isFormValid
                    ? "bg-[#074073] hover:bg-[#052d52] text-white active:scale-[0.98]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Continue
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-2 uppercase tracking-[0.15em] font-bold">
                Secure M-PESA Payment
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DepositAmount;

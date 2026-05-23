import { useEffect, useState } from "react";
import { X, TrendingUp, AlertCircle, Phone, Coins } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useStore } from "../../store/useStore";
import { motion, AnimatePresence } from "framer-motion";

const InvestAmount = ({ isOpen, onClose, onConfirm }) => {
  const [savings, setSavings] = useState("");
  const [numberShares, setNumberShares] = useState("0");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState({ mobile: "", shares: "", savings: "" });
  const { auth } = useAuth();
  const setInvestDetails = useStore((state) => state.setInvestDetails);

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
    if (name === "shares" && !value) error = "Shares amount is required";
    if (name === "savings" && !value) error = "Savings amount is required";
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const isFormValid =
    Number(numberShares) > 0 &&
    mobile.length >= 10 &&
    !validateField("mobile", mobile) &&
    !validateField("savings", savings) &&
    !validateField("shares", numberShares);

  const generateUniqueId = () => {
    return "id-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  };

  const handleSave = () => {
    setInvestDetails({
      savings: savings,
      sharesAmount: Number(numberShares),
      mobile: mobile,
      reference: generateUniqueId(),
    });
    onConfirm();
  };

  const calculateShares = () => {
    const count = Number(numberShares) / 1000;
    return new Intl.NumberFormat("en-KE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(count);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex justify-end bg-slate-900/60"
        >
          {/* Invisible dismissal zone target click area */}
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="bg-white relative w-full max-w-[500px] h-full shadow-2xl flex flex-col z-10"
          >
            {/* Circled Grey Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 text-gray-500 hover:text-gray-900 rounded-full transition-all active:scale-95 shadow-sm"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="px-8 pt-8 pb-6">
              <h2 className="text-2xl font-bold text-[#074073]">
                Quick Invest & Save
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Buy shares and Deposit Savings at a go!
              </p>
            </div>
            <div className="border-b mx-8 border-slate-100"></div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Savings Section */}
              <div className="p-4 rounded-[24px] border border-emerald-100 bg-emerald-50/30">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="text-primary" size={18} />
                  <p className="text-primary text-[10px] font-medium uppercase tracking-widest">
                    Deposit Savings
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-medium text-slate-400 uppercase tracking-widest ml-1">
                    Savings Amount
                  </label>
                  <div className="relative group">
                    {/* Absolute Prefix Block with Custom KES Badge */}
                    <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                      <span className="text-[11px] font-medium tracking-wider text-slate-400 group-focus-within:text-[#074073] transition-colors">
                        KES
                      </span>
                      <div className="w-[1.5px] h-5 bg-slate-200 ml-3 group-focus-within:bg-[#074073]/20 transition-colors" />
                    </div>

                    <input
                      type="number"
                      name="savings"
                      value={savings}
                      onBlur={handleBlur}
                      onChange={(e) => setSavings(e.target.value)}
                      placeholder="e.g. 500"
                      className="w-full pl-[74px] pr-6 py-5 h-14 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-[#074073] focus:ring-4 focus:ring-[#074073]/5 transition-all placeholder:text-xs font-semibold text-slate-800"
                    />
                  </div>
                  {/* Framer Motion Error State */}
                  <AnimatePresence>
                    {errors.savings && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-rose-500 text-[11px] font-bold flex items-center gap-1 ml-1"
                      >
                        <AlertCircle size={12} /> {errors.savings}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Shares Section */}
              <div className="p-6 rounded-[24px] border border-blue-100 bg-blue-50/30">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-[#074073]" size={18} />
                    <p className="text-[#074073] text-[10px] font-medium uppercase tracking-widest">
                      Buy Shares
                    </p>
                  </div>
                  <span className="text-[9px] bg-white border border-blue-100 text-[#074073] px-2 py-1 rounded-lg font-medium uppercase tracking-tighter">
                    1 Share = KES 1,000
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-slate-400 uppercase tracking-widest ml-1">
                      Investment
                    </label>
                    <div className="relative group">
                      {/* Absolute Prefix Block with Custom KES Badge */}
                      <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                        <span className="text-[11px] font-medium tracking-wider text-slate-400 group-focus-within:text-[#074073] transition-colors">
                          KES
                        </span>
                        <div className="w-[1.5px] h-5 bg-slate-200 ml-3 group-focus-within:bg-[#074073]/20 transition-colors" />
                      </div>

                      <input
                        type="number"
                        name="shares"
                        value={numberShares}
                        onBlur={handleBlur}
                        onChange={(e) => setNumberShares(e.target.value)}
                        placeholder="e.g. 5000"
                        className="w-full pl-[74px] pr-6 py-5 h-14 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-[#074073] focus:ring-4 focus:ring-[#074073]/5 transition-all placeholder:text-xs font-semibold text-slate-800"
                      />
                    </div>

                    {/* Framer Motion Error State */}
                    <AnimatePresence>
                      {errors.shares && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="text-rose-500 text-[11px] font-bold flex items-center gap-1 ml-1"
                        >
                          <AlertCircle size={12} /> {errors.shares}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                      Units to Acquire
                    </label>
                    <div className="h-14 flex items-center justify-center border rounded-xl">
                      <p className="text-sm font-medium text-primary">
                        {calculateShares()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                    Payment Method
                  </p>
                  <img src="/mpesa.svg" alt="M-Pesa" className="h-5" />
                </div>

                <div className="relative group">
                  {/* Absolute Prefix Block with MOBILE Badge */}
                  <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                    <span className="text-[10px] font-medium tracking-wider text-slate-400 group-focus-within:text-[#074073] transition-colors">
                      <Phone size={20} />
                    </span>
                    <div className="w-[1.5px] h-5 bg-slate-200 ml-3 group-focus-within:bg-[#074073]/20 transition-colors" />
                  </div>

                  <input
                    type="text"
                    name="mobile"
                    value={mobile}
                    onBlur={handleBlur}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter mobile number"
                    className="w-full pl-[88px] pr-6 py-5 h-14 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-[#074073] focus:ring-4 focus:ring-[#074073]/5 transition-all placeholder:text-xs font-bold text-slate-800"
                  />
                </div>

                {/* Framer Motion Error State */}
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
            </div>
            <div className="border-b mx-8 border-slate-100"></div>
            {/* Footer */}
            <div className="p-8 bg-white">
              <button
                onClick={handleSave}
                disabled={!isFormValid}
                className={`w-full h-16 font-medium rounded-2xl transition-all uppercase tracking-widest text-xs ${
                  isFormValid
                    ? "bg-[#074073] hover:bg-[#052d52] text-white active:scale-[0.98]"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Review and Finish
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InvestAmount;

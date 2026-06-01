import { useEffect, useState } from "react";
import { X, Info, AlertCircle } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useStore } from "../../store/useStore";
import { motion, AnimatePresence } from "framer-motion";

const SharesAmount = ({ isOpen, onClose, onConfirm }) => {
  const [numberShares, setNumberShares] = useState("0");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState({ mobile: "", shares: "" });
  const { auth } = useAuth();
  const setSharesDetails = useStore((state) => state.setSharesDetails);

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
    if (name === "shares") {
      if (!value || Number(value) <= 0) {
        error = "Amount is required";
      }
    }
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
    !validateField("shares", numberShares);

  const calculateUnits = () => {
    const units = Number(numberShares) / 1000;
    return new Intl.NumberFormat("en-KE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    }).format(units);
  };

  const generateUniqueId = () => {
    return "id-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
  };

  const handleSave = () => {
    setSharesDetails({
      sharesAmount: Number(numberShares),
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
          className="fixed inset-0 z-[100] flex justify-end bg-slate-900/60"
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
            {/* Header - Fixed at top */}
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 z-10 flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 text-gray-500 hover:text-gray-900 rounded-full transition-all active:scale-95 shadow-sm"
              >
                <X size={20} />
              </button>
              <div className="px-8 pt-8 pb-6">
                <h2 className="text-2xl font-bold text-[#074073]">
                  Buy Shares
                </h2>
                <p className="text-sm text-slate-500">
                  Invest in your future by increasing your stake in the SACCO.
                </p>
              </div>
            </div>
            <div className="border-b mx-8 border-slate-100"></div>
            {/* Scrollable Body - Takes up remaining space */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Share Calculation Section */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-1">
                  <label className="text-[11px] font-medium text-slate-400 uppercase tracking-widest ml-1">
                    Purchase Cost (KES)
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
                      onChange={(e) => {
                        const { name, value } = e.target;
                        setNumberShares(e.target.value);
                        setErrors((prev) => ({
                          ...prev,
                          [name]: "",
                        }));
                      }}
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

                <div className="flex-1 space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                    Units to Receive
                  </label>
                  <div className="h-14 flex items-center justify-center bg-[#F0F7FF] border border-[#D1E9FF] rounded-xl">
                    <p className="text-sm font-bold text-[#074073]">
                      {calculateUnits()} units
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Tooltip */}
              <div className="flex items-center gap-3 text-[11px] text-blue-600 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <Info size={16} />
                <span>
                  Currently, <strong>1 Share = KES 1,000</strong>
                </span>
              </div>

              {/* Payment Method */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">
                    Payment Details
                  </h4>
                  <img src="/mpesa.svg" className="h-6" alt="M-PESA" />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400 uppercase tracking-widest ml-1">
                    M-PESA Phone Number
                  </label>
                  <div className="relative group">
                    {/* Absolute Prefix Block with MOBILE Badge */}
                    <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                      <span className="text-[10px] font-medium tracking-wider text-slate-400 group-focus-within:text-[#074073] transition-colors">
                        MOBILE
                      </span>
                      <div className="w-[1.5px] h-5 bg-slate-200 ml-3 group-focus-within:bg-[#074073]/20 transition-colors" />
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
                      placeholder="e.g. 0722000000"
                      className="w-full pl-[88px] pr-6 py-5 h-14 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-[#074073] focus:ring-4 focus:ring-[#074073]/5 transition-all placeholder:text-xs font-medium text-slate-800"
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
            </div>
            <div className="border-b mx-8 border-slate-100"></div>
            {/* Action Button - Pinned to bottom */}
            <div className="p-8 bg-white">
              <button
                onClick={handleSave}
                disabled={!isFormValid}
                className={`w-full h-16 font-bold rounded-2xl transition-all ${
                  isFormValid
                    ? "bg-[#074073] hover:bg-[#052d52] text-white active:scale-[0.98]"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Review and Finish
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-2 uppercase tracking-widest font-bold">
                Secure Payment Gateway
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SharesAmount;

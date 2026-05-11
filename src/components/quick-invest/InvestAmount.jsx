import { useEffect, useState } from "react";
import { X, TrendingUp, PiggyBank } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useStore } from "../../store/useStore";

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
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    }).format(count);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-[#042159]/40 transition-opacity">
      {/* Side Drawer */}
      <div className="bg-white relative w-full max-w-[500px] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
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
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Buy shares and Deposit Savings at a go!
          </p>
        </div>
        <div className="border-b mx-8 border-slate-100"></div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Savings Section */}
          <div className="p-6 rounded-[24px] border border-emerald-100 bg-emerald-50/30">
            <div className="flex items-center gap-2 mb-4">
              <PiggyBank className="text-emerald-600" size={18} />
              <p className="text-emerald-700 text-[10px] font-black uppercase tracking-widest">
                Deposit Savings
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                Savings Amount
              </label>
              <div className="flex items-center h-12 bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#074073] transition-all">
                <div className="px-4 bg-slate-50 text-[#074073] font-black text-xs border-r border-gray-100">
                  KES
                </div>
                <input
                  type="number"
                  name="savings"
                  value={savings}
                  onBlur={handleBlur}
                  onChange={(e) => setSavings(e.target.value)}
                  placeholder="e.g 500"
                  className="flex-1 px-4 outline-none text-sm font-semibold"
                />
              </div>
              {errors.savings && (
                <p className="text-[10px] text-red-500 ml-1 font-medium">
                  {errors.savings}
                </p>
              )}
            </div>
          </div>

          {/* Shares Section */}
          <div className="p-6 rounded-[24px] border border-blue-100 bg-blue-50/30">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-[#074073]" size={18} />
                <p className="text-[#074073] text-[10px] font-black uppercase tracking-widest">
                  Buy Shares
                </p>
              </div>
              <span className="text-[9px] bg-white border border-blue-100 text-[#074073] px-2 py-1 rounded-lg font-black uppercase tracking-tighter">
                1 Share = KES 1,000
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Investment
                </label>
                <div className="flex items-center h-12 bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#074073] transition-all">
                  <div className="px-3 bg-slate-50 text-[#074073] font-black text-[10px] border-r border-gray-100">
                    KES
                  </div>
                  <input
                    type="number"
                    name="shares"
                    onBlur={handleBlur}
                    value={numberShares}
                    onChange={(e) => setNumberShares(e.target.value)}
                    className="w-full h-full px-4 outline-none text-sm font-semibold"
                    placeholder="e.g 5000"
                  />
                </div>
                {errors.shares && (
                  <p className="text-[10px] text-red-500 ml-1 font-medium">
                    {errors.shares}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  Units to Acquire
                </label>
                <div className="h-12 flex items-center justify-center bg-[#074073] rounded-xl shadow-inner shadow-black/10">
                  <p className="text-sm font-black text-white">
                    {calculateShares()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Payment Method
              </p>
              <img src="/mpesa.svg" alt="M-Pesa" className="h-5" />
            </div>

            <div className="flex items-center h-12 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden focus-within:border-[#074073] transition-all">
              <div className="px-4 bg-slate-100 text-[#074073] font-black text-[10px] border-r border-slate-200">
                MOBILE
              </div>
              <input
                type="text"
                name="mobile"
                placeholder="Enter mobile number"
                value={mobile}
                onBlur={handleBlur}
                onChange={(e) => setMobile(e.target.value)}
                className="flex-1 px-4 outline-none text-sm font-bold bg-transparent"
              />
            </div>
            {errors.mobile && (
              <p className="text-[10px] text-red-500 ml-1 font-medium">
                {errors.mobile}
              </p>
            )}
          </div>
        </div>
        <div className="border-b mx-8 border-slate-100"></div>
        {/* Footer */}
        <div className="p-8 bg-white">
          <button
            onClick={handleSave}
            disabled={!isFormValid}
            className={`w-full h-16 font-black rounded-2xl transition-all uppercase tracking-widest text-xs ${
              isFormValid
                ? "bg-[#074073] hover:bg-[#052d52] text-white active:scale-[0.98]"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Review and Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestAmount;

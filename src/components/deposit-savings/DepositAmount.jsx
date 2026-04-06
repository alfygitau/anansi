import { useEffect, useState } from "react";
import { X, Info, Wallet } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useStore } from "../../store/useStore";

const DepositAmount = ({ isOpen, onClose, onConfirm }) => {
  const [amount, setAmount] = useState("0");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState({ mobile: "", shares: "" });
  const { auth } = useAuth();
  const setDepositDetails = useStore((state) => state.setDepositDetails);

  useEffect(() => {
    setMobile(auth?.user?.mobileno);
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
    !validateField("shares", amount);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#074073]/40 bg-slate-900/40">
      {/* Centered Modal Container */}
      <div className="bg-white w-full relative max-w-[480px] rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="text-gray-400 absolute top-5 right-5 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        {/* Header Section */}
        <div className="px-8 pt-8 pb-4">
          <div className="text-center">
            <h2 className="text-xl font-bold text-[#074073]">
              Deposit Savings
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Securely add funds to your savings account.
            </p>
          </div>
        </div>

        {/* Body Section */}
        <div className="px-8 py-4 space-y-10">
          {/* Payment Method Display */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl shadow-sm">
                <Wallet className="text-[#074073]" size={20} />
              </div>
              <span className="text-sm font-bold text-gray-700">
                Pay via M-PESA
              </span>
            </div>
            <img src="/mpesa.svg" alt="M-Pesa" className="h-6" />
          </div>

          {/* Inputs */}
          <div className="space-y-8">
            {/* Phone Number Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                M-PESA Phone Number
              </label>
              <div className="h-12 border border-gray-200 rounded-xl flex items-center overflow-hidden focus-within:border-[#074073] focus-within:ring-1 focus-within:ring-[#074073] transition-all">
                <input
                  type="text"
                  name="mobile"
                  value={mobile}
                  onBlur={handleBlur}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. 0712345678"
                  className="w-full h-full px-4 outline-none text-sm font-medium"
                />
              </div>
              {errors.mobile && (
                <p className="text-[10px] text-red-500 ml-1">{errors.mobile}</p>
              )}
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                Amount to Deposit
              </label>
              <div className="flex h-12 border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#074073] transition-all">
                <div className="bg-gray-50 px-4 flex items-center justify-center border-r border-gray-200 text-xs font-black text-[#074073]">
                  KES
                </div>
                <input
                  type="number"
                  name="amount"
                  value={amount}
                  onBlur={handleBlur}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Min. 500"
                  className="flex-1 px-4 outline-none text-sm font-semibold"
                />
              </div>
              {errors.amount && (
                <p className="text-[10px] text-red-500 ml-1">{errors.amount}</p>
              )}
              <div className="flex items-center gap-1.5 text-[11px] text-gray-400 ml-1">
                <Info size={12} />
                <span>Minimum deposit amount KES 500.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-8">
          <button
            onClick={handleSave}
            disabled={!isFormValid}
            className={`w-full h-14 font-bold rounded-2xl shadow-lg transition-all ${
              isFormValid
                ? "bg-[#074073] hover:bg-[#052d52] text-white active:scale-[0.98]"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositAmount;

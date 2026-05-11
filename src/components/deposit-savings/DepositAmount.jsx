import { useEffect, useState } from "react";
import { X, Info, Wallet } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useStore } from "../../store/useStore";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-[#042159]/40 transition-opacity">
      {/* Side Drawer - Full Height */}
      <div className="bg-white relative w-full max-w-[480px] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Circled Grey Close Button */}
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
            <p className="text-sm text-slate-500 mt-1 font-medium">
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
                  <p className="text-[10px] text-red-500 ml-1 font-medium">
                    {errors.mobile}
                  </p>
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
                  <p className="text-[10px] text-red-500 ml-1 font-medium">
                    {errors.amount}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-[11px] text-gray-400 ml-1 font-medium">
                  <Info size={14} className="text-[#074073]/50" />
                  <span>Minimum deposit amount KES 500.00</span>
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
      </div>
    </div>
  );
};

export default DepositAmount;

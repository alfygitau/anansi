import React, { useState } from "react";
import { X, ArrowLeft, Info, Wallet } from "lucide-react";

const DepositAmount = ({ isOpen, onClose, onConfirm, initialPhone }) => {
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || "");

  if (!isOpen) return null;

  const handleContinue = () => {
    if (Number(amount) < 500) {
      alert("Minimum deposit is KES 500");
      return;
    }
    onConfirm({ amount, phoneNumber });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#074073]/40 backdrop-blur-sm">
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
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 0712345678"
                  className="w-full h-full px-4 outline-none text-sm font-medium"
                />
              </div>
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
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Min. 500"
                  className="flex-1 px-4 outline-none text-sm font-semibold"
                />
              </div>
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
            onClick={handleContinue}
            className="w-full h-14 bg-[#074073] hover:bg-[#052d52] text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositAmount;

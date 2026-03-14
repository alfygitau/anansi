import React, { useState } from "react";
import { X, ArrowLeft } from "lucide-react";

const InvestAmount = ({ isOpen, onClose, onConfirm }) => {
  const [savings, setSavings] = useState("");
  const [sharesAmount, setSharesAmount] = useState("0");
  const [mobile, setMobile] = useState("");

  if (!isOpen) return null;

  const calculateShares = () => {
    const count = Number(sharesAmount) / 1000;
    return new Intl.NumberFormat("en-KE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    }).format(count);
  };

  const handleFinish = () => {
    onConfirm({
      savings,
      sharesAmount: Number(sharesAmount),
      mobile,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#074073]/40 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="bg-white w-full relative max-w-[550px] rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="text-[#074073] absolute top-5 right-5 font-bold text-sm hover:opacity-70"
        >
          <X size={20} />
        </button>
        {/* Header Section */}
        <div className="px-8 pt-8 pb-4">
          <h2 className="text-center text-gray-900 font-bold text-lg leading-tight">
            Quick Invest & Save
          </h2>
          <p className="text-center text-gray-500 text-sm mt-1">
            Buy shares and Deposit Savings at a go!
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="px-8 py-4 max-h-[70vh] overflow-y-auto space-y-5">
          {/* Savings Section */}
          <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50">
            <p className="text-[#0C722F] text-xs font-bold uppercase tracking-wider mb-4">
              Deposit Savings
            </p>
            <label className="text-xs font-semibold text-gray-600 block mb-2 ml-1">
              Savings Amount
            </label>
            <div className="flex items-center h-12 bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#074073] focus-within:ring-1 focus-within:ring-[#074073] transition-all">
              <div className="px-4 bg-gray-50 text-gray-500 font-bold text-xs border-r border-gray-100">
                KES
              </div>
              <input
                type="number"
                value={savings}
                onChange={(e) => setSavings(e.target.value)}
                placeholder="0.00"
                className="flex-1 px-4 outline-none text-sm font-medium"
              />
            </div>
          </div>

          {/* Shares Section */}
          <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-center mb-4">
              <p className="text-[#0C722F] text-xs font-bold uppercase tracking-wider">
                Buy Shares
              </p>
              <span className="text-[10px] bg-[#074073]/10 text-[#074073] px-2 py-1 rounded-md font-bold">
                1 Share = KES 1,000
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2 ml-1">
                  Investment Amount
                </label>
                <div className="flex items-center h-12 bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#074073] transition-all">
                  <div className="px-3 bg-gray-50 text-gray-400 font-bold text-[10px] border-r border-gray-100">
                    KES
                  </div>
                  <input
                    type="number"
                    value={sharesAmount}
                    onChange={(e) => setSharesAmount(e.target.value)}
                    className="flex-1 px-3 outline-none text-sm font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-2 ml-1">
                  Units to Acquire
                </label>
                <div className="h-12 flex items-center justify-center bg-[#E6F0F9] rounded-xl border border-[#B3D1E6]">
                  <p className="text-sm font-bold text-[#074073]">
                    {calculateShares()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-gray-900 uppercase tracking-widest">
                Payment Method
              </p>
              <img src="/mpesa.svg" alt="M-Pesa" className="h-6" />
            </div>

            <div className="flex items-center h-12 bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#074073] transition-all">
              <div className="px-4 bg-gray-50 text-gray-500 font-bold text-xs border-r border-gray-100">
                MOBILE
              </div>
              <input
                type="text"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="flex-1 px-4 outline-none text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-8 bg-white">
          <button
            onClick={handleFinish}
            className="w-full h-14 bg-[#074073] hover:bg-[#052d52] text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
          >
            Review and Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestAmount;

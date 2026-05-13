import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  X,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const RepayAmount = ({ isOpen, onClose, onProceed, loanData }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const paymentOptions = [
    {
      id: "minimum",
      title: "Minimum Payment",
      description:
        "Cover interest and required principal to keep your loan in good standing.",
      amount: loanData?.minimumPayable || 0,
    },
    {
      id: "full",
      title: "Pay in Full",
      description:
        "Settle the entire remaining balance and close this loan account today.",
      amount: loanData?.paymentInFull || 0,
    },
    {
      id: "custom",
      title: "Custom Amount",
      description:
        "Maintain flexibility by paying any specific amount toward your balance.",
      amount: null,
    },
  ];

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(val);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden antialiased">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-[480px] h-full bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-8 pt-6 pb-6">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 z-10 flex items-center justify-center w-8 h-8 bg-slate-100 hover:bg-slate-200 text-gray-500 hover:text-gray-900 rounded-full transition-all active:scale-95 shadow-sm"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-black text-primary tracking-tight">
                Repayment Option
              </h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Select your preferred method to settle your loan balance.
              </p>
            </div>
            <div className="border-b border-slate-100 mx-8"></div>
            {/* Selection Area */}
            <div className="flex-grow overflow-y-auto p-8 space-y-4">
              {paymentOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${
                    selectedOption === option.id
                      ? "border-primary bg-blue-50/30 shadow-md scale-[1.02]"
                      : "border-slate-100 bg-white hover:border-slate-200"
                  }`}
                >
                  {/* items-center here aligns the Radio, the Text, and the Price along the horizontal axis */}
                  <div className="flex items-center justify-between gap-4">
                    {/* Left Section: Radio + Content */}
                    <div className="flex items-center gap-5">
                      {/* Centered Radio Button */}
                      <div className="shrink-0">
                        <div
                          className={`size-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            selectedOption === option.id
                              ? "border-primary bg-primary"
                              : "border-slate-200"
                          }`}
                        >
                          {selectedOption === option.id && (
                            <div className="size-2 bg-white rounded-full" />
                          )}
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="flex flex-col">
                        <h4
                          className={`font-black text-base leading-tight transition-colors ${
                            selectedOption === option.id
                              ? "text-primary"
                              : "text-slate-900"
                          }`}
                        >
                          {option.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium leading-tight max-w-[240px] mt-0.5">
                          {option.description}
                        </p>
                      </div>
                    </div>

                    {/* Right Section: Price (Also centered along the axis) */}
                    <div className="text-right shrink-0 flex flex-col items-end">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                        Amount
                      </span>
                      <span className="font-black text-primary text-sm leading-none">
                        {option.amount
                          ? formatCurrency(option.amount)
                          : "Flexible"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-slate-50 bg-slate-50/30">
              <button
                disabled={!selectedOption}
                onClick={() => onProceed(selectedOption)}
                className="w-full h-[60px] bg-primary text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#062d7a] transition-all disabled:opacity-20 shadow-xl shadow-blue-900/10 active:scale-95"
              >
                Continue to Pay <ArrowRight size={18} />
              </button>
              <div className="flex items-center justify-center gap-2 mt-2">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                  Anansi Security Verified
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RepayAmount;

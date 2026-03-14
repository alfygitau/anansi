import React, { useState, useMemo } from "react";
import { X, ArrowLeft, Loader2, Calendar, Phone, Receipt } from "lucide-react";

const ConfirmShares = ({ isOpen, onClose, onBack, data, onConfirm }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic date formatting
  const formattedDate = useMemo(() => {
    return new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-KE", {
      style: "decimal",
      minimumFractionDigits: 2,
    }).format(val);

  if (!isOpen) return null;

  const handleContinue = async () => {
    setIsLoading(true);
    await onConfirm(); // Logic for buyShares goes here
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#074073]/40 backdrop-blur-sm">
      <div className="bg-white relative w-full max-w-[480px] rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="text-gray-400 absolute top-5 right-5 hover:text-gray-900"
        >
          <X size={20} />
        </button>
        {/* Header */}
        <div className="px-8 pt-8">
          <div className="text-center">
            <h2 className="text-[#074073] font-bold text-lg">
              Confirm Purchase
            </h2>
            <p className="text-gray-500 text-xs mt-1">
              Please verify your transaction details
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 space-y-5">
          {/* M-PESA Card */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              <Phone size={12} /> Account Details
            </label>
            <div className="bg-[#F0FFFE] border border-[#B2EBE8] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#0C722F] font-bold uppercase">
                  M-PESA Phone No
                </p>
                <p className="text-sm font-bold text-gray-800">
                  {"0769404436"}
                </p>
              </div>
              <img src="/mpesa.svg" alt="M-Pesa" className="h-6" />
            </div>
          </div>

          {/* Transaction Details Card */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              <Receipt size={12} /> Summary
            </label>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total Share Cost</span>
                <span className="text-base font-black text-[#074073]">
                  KES {formatCurrency(2000)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-200/50">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar size={14} /> Date
                </span>
                <span className="text-xs font-bold text-gray-700">
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Instruction Note */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
            <p className="text-[11px] leading-relaxed text-blue-700 text-center font-medium">
              A push notification will be sent to your phone. Enter your PIN to
              complete the purchase.
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="px-8 pb-8">
          <button
            disabled={isLoading}
            onClick={handleContinue}
            className={`w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-blue-900/10 ${
              isLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#074073] hover:bg-[#052d52] text-white"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Processing...</span>
              </>
            ) : (
              "Confirm & Pay"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmShares;

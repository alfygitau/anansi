import React, { useState } from "react";
import { X, ArrowLeft, Loader2, Smartphone, ShieldCheck } from "lucide-react";

const ReviewDeposit = ({
  isOpen,
  onClose,
  onBack,
  amount,
  initialPhone,
  onConfirm,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(initialPhone || "");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleDeposit = async () => {
    setLoading(true);
    await onConfirm(phoneNumber);
    setLoading(false);
  };

  const formattedAmount = new Intl.NumberFormat("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#074073]/40 backdrop-blur-sm">
      {/* Modern Centered Modal */}
      <div className="bg-white relative w-full max-w-[480px] rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="text-gray-400 absolute top-5 right-5 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        {/* Header Section */}
        <div className="px-8 pt-8">
          <div className="text-left space-y-1">
            <h2 className="text-lg font-bold text-gray-900">Review Transfer</h2>
            <p className="text-xs text-gray-500">
              Double check your details before confirming
            </p>
          </div>
        </div>

        {/* Body Section */}
        <div className="p-8 space-y-8">
          {/* Large Amount Display */}
          <div className="text-center py-6 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
              Deposit Amount
            </p>
            <h2 className="text-4xl font-black text-[#074073]">
              <span className="text-lg font-bold mr-1">KES</span>
              {formattedAmount}
            </h2>
          </div>

          {/* Phone Input Section */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              Verify M-PESA Number
            </label>
            <div className="group flex h-14 border border-gray-200 rounded-2xl overflow-hidden focus-within:border-[#074073] focus-within:ring-1 focus-within:ring-[#074073] transition-all">
              <div className="bg-gray-50 px-4 flex items-center border-r border-gray-100">
                <Smartphone
                  size={18}
                  className="text-gray-400 group-focus-within:text-[#074073] transition-colors"
                />
              </div>
              <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="flex-1 px-4 outline-none text-sm font-semibold tracking-wider"
                placeholder="07XX XXX XXX"
              />
            </div>
          </div>

          {/* Security Note */}
          <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
            <ShieldCheck size={18} className="text-blue-600 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-blue-700 font-medium">
              By clicking deposit, you will receive an M-PESA STK prompt to
              authorize this transaction. Keep your phone nearby.
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="px-8 pb-8">
          <button
            disabled={loading}
            onClick={handleDeposit}
            className={`w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-blue-900/10 ${
              loading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#074073] hover:bg-[#052d52] text-white"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Initiating...</span>
              </>
            ) : (
              "Confirm Deposit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewDeposit;

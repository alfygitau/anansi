import { useState, useMemo, useEffect } from "react";
import { X, Loader2, Phone, ReceiptText, Smartphone } from "lucide-react";
import { useToast } from "../../contexts/ToastProvider";
import { useMutation } from "react-query";
import { investAndSave } from "../../sdks/accounts/accounts";
import useAuth from "../../hooks/useAuth";

const ConfirmInvest = ({ isOpen, onClose, onConfirm }) => {
  const { showToast } = useToast();
  const { auth } = useAuth();

  const [investDetails] = useState(() => {
    const saved = localStorage.getItem("invest_details");
    return saved ? JSON.parse(saved) : {};
  });

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

  const { mutate: investAndSaveMutate, isLoading } = useMutation({
    mutationKey: ["buy shares"],
    mutationFn: () =>
      investAndSave(
        investDetails?.savings,
        investDetails?.sharesAmount,
        investDetails?.reference,
        auth?.user?.id,
        investDetails?.mobile,
      ),
    onSuccess: () => {
      onConfirm();
    },
    onError: (error) => {
      showToast({
        title: "Investment glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const handleContinue = async () => {
    await investAndSaveMutate();
  };

  const totalAmount =
    Number(investDetails?.savings) + Number(investDetails?.sharesAmount);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#074073]/40 backdrop-blur-sm">
      {/* Centered Modal Container */}
      <div className="bg-white w-full relative max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="text-gray-400 absolute top-5 right-5 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        {/* Header Area */}
        <div className="px-8 pt-10">
          <h2 className="text-center text-[#074073] font-bold text-lg">
            Confirm Transaction
          </h2>
          <p className="text-center text-gray-500 text-xs mt-1">
            Review your investment details before paying
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-8 space-y-8">
          {/* M-PESA Section */}
          <div className="relative group">
            <label className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
              <Phone size={12} /> Payment Account
            </label>
            <div className="bg-[#F0F9FF] border border-blue-100 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-blue-500 font-bold uppercase">
                  M-PESA Number
                </p>
                <p className="text-sm font-bold text-[#074073]">
                  {investDetails?.mobile || "Not Set"}
                </p>
              </div>
              <img src="/mpesa.svg" alt="Mpesa" className="h-6 opacity-80" />
            </div>
          </div>

          {/* Transaction Summary */}
          <div>
            <label className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">
              <ReceiptText size={12} /> Breakdown
            </label>
            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-sm text-gray-500 font-medium">
                  Total Payable
                </span>
                <div className="text-right">
                  <p className="text-lg font-black text-[#074073]">
                    KES {formatCurrency(totalAmount)}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {formattedDate}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200/60 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Shares Purchase</span>
                  <span className="font-bold text-gray-700">
                    KES {formatCurrency(investDetails?.sharesAmount)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Savings Deposit</span>
                  <span className="font-bold text-gray-700">
                    KES {formatCurrency(investDetails?.savings)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Prompt Info */}
          <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
            <Smartphone size={16} className="text-blue-600 mt-0.5" />
            <p className="text-[11px] leading-relaxed text-blue-700 font-medium">
              A STK push will be sent to{" "}
              <span className="font-bold">{investDetails?.mobile}</span>. Please
              enter your M-PESA pin to authorize the transaction.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="px-8 pb-8">
          <button
            disabled={isLoading}
            onClick={handleContinue}
            className={`w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-blue-900/10 ${
              isLoading
                ? "bg-gray-100 text-gray-400"
                : "bg-[#074073] hover:bg-[#052d52] text-white"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Processing...</span>
              </>
            ) : (
              "Authorize & Pay"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmInvest;

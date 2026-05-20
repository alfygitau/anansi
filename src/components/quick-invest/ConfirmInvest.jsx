import { useMemo } from "react";
import {
  X,
  Loader2,
  Phone,
  ReceiptText,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import { useToast } from "../../contexts/ToastProvider";
import { useMutation } from "react-query";
import { investAndSave } from "../../sdks/accounts/accounts";
import useAuth from "../../hooks/useAuth";
import { useStore } from "../../store/useStore";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmInvest = ({ isOpen, onClose, onConfirm }) => {
  const { showToast } = useToast();
  const { auth } = useAuth();
  const investDetails = useStore((state) => state.investDetails);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex justify-end bg-[#042159]/40"
        >
          {/* Invisible dismissal zone target click area */}
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="bg-white relative w-full max-w-[500px] h-full shadow-2xl flex flex-col z-10"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 text-gray-500 hover:text-gray-900 rounded-full transition-all active:scale-95 shadow-sm"
            >
              <X size={20} />
            </button>
            {/* Header Area */}
            <div className="px-8 pt-8 pb-6">
              <h2 className="text-2xl font-bold text-[#074073]">
                Confirm Transaction
              </h2>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                Review your investment details before paying
              </p>
            </div>
            <div className="border-b mx-8 border-slate-100"></div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* M-PESA Section */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  <Phone size={14} className="text-sky-500" /> Payment Account
                </label>
                <div className="bg-sky-50/50 border border-sky-100 rounded-[24px] p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] text-sky-600 font-black uppercase tracking-tighter">
                      M-PESA Number
                    </p>
                    <p className="text-lg font-black text-[#074073]">
                      {investDetails?.mobile || "Not Set"}
                    </p>
                  </div>
                  <div className="bg-white p-2 rounded-xl border border-sky-100 shadow-sm">
                    <img src="/mpesa.svg" alt="Mpesa" className="h-6" />
                  </div>
                </div>
              </div>

              {/* Transaction Summary */}
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                  <ReceiptText size={14} className="text-[#074073]" /> Breakdown
                </label>
                <div className="bg-slate-50 border border-slate-100 rounded-[28px] p-6 space-y-5">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Total Payable
                    </span>
                    <div className="text-right">
                      <p className="text-2xl font-black text-[#074073]">
                        <span className="text-xs font-bold mr-1 text-[#074073]/50">
                          KES
                        </span>
                        {formatCurrency(totalAmount)}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">
                        {formattedDate}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/60 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500">
                        Shares Purchase
                      </span>
                      <span className="text-sm font-black text-slate-700">
                        {formatCurrency(investDetails?.sharesAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500">
                        Savings Deposit
                      </span>
                      <span className="text-sm font-black text-slate-700">
                        {formatCurrency(investDetails?.savings)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prompt Info */}
              <div className="flex items-center gap-4 bg-blue-50/50 p-3 rounded-2xl border border-blue-100/50">
                <div className="bg-blue-600 p-1.5 rounded-lg shadow-sm">
                  <Smartphone size={16} className="text-white" />
                </div>
                <p className="text-xs leading-relaxed text-blue-700 font-semibold">
                  A STK push will be sent to{" "}
                  <span className="text-[#074073] underline decoration-blue-200">
                    {investDetails?.mobile}
                  </span>
                  . Please enter your M-PESA pin to authorize.
                </p>
              </div>
            </div>
            <div className="border-b mx-8 border-slate-100"></div>
            {/* Action Button - Pinned to Bottom */}
            <div className="p-8 bg-white">
              <button
                disabled={isLoading}
                onClick={handleContinue}
                className={`w-full h-16 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-blue-900/10 ${
                  isLoading
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-[#074073] hover:bg-[#052d52] text-white"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span className="uppercase tracking-widest text-xs">
                      Processing...
                    </span>
                  </>
                ) : (
                  <>
                    <span className="uppercase tracking-widest text-xs">
                      Authorize & Pay
                    </span>
                    <ArrowRight size={18} className="text-sky-400" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Secure 256-bit Encrypted Payment
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmInvest;

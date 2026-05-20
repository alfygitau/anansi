import { X, Loader2, Smartphone, ShieldCheck } from "lucide-react";
import { buyShares } from "../../sdks/accounts/accounts";
import { useToast } from "../../contexts/ToastProvider";
import { useMutation } from "react-query";
import { useStore } from "../../store/useStore";
import { motion, AnimatePresence } from "framer-motion";

const ReviewDeposit = ({ isOpen, onClose, onConfirm }) => {
  const { showToast } = useToast();
  const depositDetails = useStore((state) => state.depositDetails);

  const savingsAccountId = useStore(
    (state) =>
      state.accounts.find((acc) => acc.product?.name === "Savings")?.id || null,
  );

  const { mutate: buySavingsMutate, isLoading } = useMutation({
    mutationKey: ["buy savings"],
    mutationFn: () =>
      buyShares(
        depositDetails?.depositAmount,
        depositDetails?.reference,
        savingsAccountId,
        depositDetails?.mobile,
      ),
    onSuccess: () => {
      onConfirm();
    },
    onError: (error) => {
      showToast({
        title: "Authentication glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const handleContinue = async () => {
    await buySavingsMutate();
  };

  const formattedAmount = new Intl.NumberFormat("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(depositDetails?.depositAmount);

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

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Header Section */}
              <div className="px-8 pt-8 pb-6">
                <h2 className="text-2xl font-bold text-[#074073]">
                  Review Transfer
                </h2>
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  Double check your details before confirming
                </p>
              </div>
              <div className="border-b mx-8 border-slate-100"></div>
              <div className="p-8 space-y-6">
                {/* Large Amount Display */}
                <div className="text-center py-8 bg-slate-50 rounded-[28px] border border-slate-100 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-2">
                    Deposit Amount
                  </p>
                  <h2 className="text-4xl font-black text-[#074073] flex items-center justify-center">
                    <span className="text-lg font-bold mr-2 text-[#074073]/60 uppercase">
                      KES
                    </span>
                    {formattedAmount}
                  </h2>
                </div>

                {/* Phone Input Section (Read Only) */}
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
                    Recipient M-PESA Number
                  </label>
                  <div className="group flex h-14 border border-gray-200 rounded-2xl overflow-hidden bg-slate-50/50 transition-all">
                    <div className="bg-slate-100 px-4 flex items-center border-r border-gray-100">
                      <Smartphone size={18} className="text-[#074073]" />
                    </div>
                    <input
                      type="text"
                      value={depositDetails?.mobile}
                      readOnly
                      className="flex-1 px-4 outline-none text-sm font-bold tracking-wider text-[#074073] bg-transparent"
                      placeholder="07XX XXX XXX"
                    />
                  </div>
                </div>

                {/* Security Note */}
                <div className="flex items-center gap-4 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50">
                  <div className="bg-emerald-500 p-1.5 rounded-lg shadow-sm">
                    <ShieldCheck size={18} className="text-white" />
                  </div>
                  <p className="text-xs leading-relaxed text-emerald-800 font-semibold">
                    By clicking deposit, you will receive an M-PESA STK prompt
                    to authorize this transaction. Keep your phone nearby.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Action - Pinned to Bottom */}
            <div className="p-8 border-t border-slate-50 bg-white">
              <button
                disabled={isLoading}
                onClick={handleContinue}
                className={`w-full h-14 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-[#074073]/10 ${
                  isLoading
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : "bg-[#074073] hover:bg-[#052d52] text-white"
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span className="uppercase tracking-widest text-xs">
                      Initiating Push...
                    </span>
                  </>
                ) : (
                  <span className="uppercase tracking-widest text-xs text-white">
                    Confirm & Deposit
                  </span>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 mt-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Secure Transaction Layer Active
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewDeposit;

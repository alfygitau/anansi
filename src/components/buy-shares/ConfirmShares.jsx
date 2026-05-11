import { useMemo } from "react";
import {
  X,
  Calendar,
  Phone,
  Receipt,
  Loader2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import { buyShares } from "../../sdks/accounts/accounts";
import { useStore } from "../../store/useStore";

const ConfirmShares = ({ isOpen, onClose, onConfirm }) => {
  const { showToast } = useToast();
  const sharesDetails = useStore((state) => state.sharesDetails);
  const sharesAccountId = useStore(
    (state) =>
      state.accounts.find((acc) => acc.product?.name === "Shares")?.id || null,
  );

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

  const { mutate: buySharesMutate, isLoading } = useMutation({
    mutationKey: ["buy shares"],
    mutationFn: () =>
      buyShares(
        sharesDetails?.sharesAmount,
        sharesDetails?.reference,
        sharesAccountId,
        sharesDetails?.mobile,
      ),
    onSuccess: () => {
      onConfirm();
    },
    onError: (error) => {
      showToast({
        title: "Transaction failed",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const handleContinue = async () => {
    await buySharesMutate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-[#042159]/40 transition-opacity">
      {/* Side Drawer Container */}
      <div className="bg-white relative w-full max-w-[500px] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Circled Grey Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 rounded-full transition-all active:scale-95 shadow-sm"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="px-8 pt-8 pb-6">
          <h2 className="text-2xl font-black tracking-tighter text-[#042159]">
            Verify Payment
          </h2>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Review your purchase summary
          </p>
        </div>
        <div className="border-b mx-8 border-slate-100"></div>
        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* M-PESA Card - Professional Styling */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              <Phone size={12} className="text-emerald-500" /> Account Details
            </label>
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-[24px] p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-[9px] text-emerald-600 font-black uppercase tracking-tighter">
                  M-PESA Recipient
                </p>
                <p className="text-lg font-black text-[#042159]">
                  {sharesDetails?.mobile}
                </p>
              </div>
              <div className="bg-white p-2 rounded-xl border border-emerald-100 shadow-sm">
                <img src="/mpesa.svg" alt="M-Pesa" className="h-6" />
              </div>
            </div>
          </div>

          {/* Transaction Details Card */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
              <Receipt size={12} className="text-sky-500" /> Summary
            </label>
            <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-6 space-y-5">
              <div className="flex justify-between items-end">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Investment Cost
                </span>
                <span className="text-2xl font-black text-[#042159]">
                  <span className="text-xs not-italic font-bold opacity-40">
                    KES
                  </span>{" "}
                  {formatCurrency(sharesDetails?.sharesAmount ?? 0)}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-200/60 flex justify-between items-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-2">
                  <Calendar size={14} className="text-slate-400" /> Date
                </span>
                <span className="text-xs font-black text-slate-600">
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Instruction Note */}
          <div className="bg-[#042159]/5 p-5 rounded-[20px] border border-[#042159]/10 flex gap-4 items-start">
            <div className="mt-1 p-1 bg-[#042159] rounded-md">
              <ShieldCheck size={14} className="text-sky-400" />
            </div>
            <p className="text-[11px] leading-relaxed text-[#042159] font-semibold">
              An STK Push notification will be sent to your mobile device.
              Please enter your PIN to authorize the transaction safely.
            </p>
          </div>
        </div>
        <div className="border-b mx-8 border-slate-100"></div>
        {/* Footer Action - Pinned to Bottom */}
        <div className="p-8 bg-white">
          <button
            onClick={handleContinue}
            disabled={isLoading}
            className={`w-full h-16 rounded-[22px] font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all duration-300 shadow-xl
    ${
      isLoading
        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
        : "bg-[#042159] hover:bg-[#052d52] text-white active:scale-[0.98] shadow-[#042159]/20"
    }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin text-sky-500" size={20} />
                <span>Processing...</span>
              </>
            ) : (
              <>
                Confirm & Pay <ArrowRight size={18} className="text-sky-500" />
              </>
            )}
          </button>
          <p className="text-center text-[9px] text-slate-400 uppercase tracking-widest mt-2 font-black opacity-60">
            Powered by Secure M-PESA Integration
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmShares;

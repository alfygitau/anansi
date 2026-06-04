import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Smartphone,
  Calendar,
  Loader2,
  CreditCard,
  ArrowRight,
  X,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import { payMembership } from "../../sdks/membership/membership";
import { useStore } from "../../store/useStore";

const ReviewMembership = ({ isOpen, onClose, onNext }) => {
  const { auth } = useAuth();
  const { showToast } = useToast();
  const membershipPhone = useStore((state) => state.membership_mobile);
  const membershipDetails = useStore((state) => state.membership);

  const formatKES = (val) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(val || 0);

  const today = new Date().toLocaleDateString("en-KE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const { mutate: payMembershipMutate, isLoading } = useMutation({
    mutationKey: ["pay membership"],
    mutationFn: () =>
      payMembership(
        auth?.user?.id,
        membershipDetails?.shares,
        membershipDetails?.savings,
        membershipPhone,
      ),
    onSuccess: () => {
      onNext();
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

  const handlePayment = async () => {
    await payMembershipMutate();
  };

  const registrationFee = 1000;
  const sharesAmount = parseFloat(membershipDetails?.shares) || 0;
  const savingsAmount = parseFloat(membershipDetails?.savings) || 0;
  const totalPayable = registrationFee + sharesAmount + savingsAmount;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex justify-end bg-slate-500/10"
        >
          {/* Invisible dismissal zone target click area */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="bg-white relative w-full max-w-[480px] h-full shadow-2xl flex flex-col z-10"
          >
            {/* Circled Grey Close Button Anchor */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 z-10 flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 text-gray-500 hover:text-gray-900 rounded-full transition-all active:scale-95 shadow-sm"
            >
              <X size={20} />
            </button>

            {/* Header Track */}
            <div className="px-8 pt-5 pb-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-center text-[#074073] shrink-0 shadow-sm">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#074073] leading-tight">
                  Confirm Details
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Verify transaction details before firing network protocols
                </p>
              </div>
            </div>
            <div className="border-b mx-8 border-slate-100"></div>

            {/* Scrollable Core Review Content Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Desaturated M-PESA Routing Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-200/60 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-200/40 pb-3 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Target Billing Gateway
                  </span>
                  <img
                    src="/mpesa.svg"
                    alt="M-Pesa Core Logo"
                    className="h-4 opacity-60 grayscale"
                  />
                </div>
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-700 shadow-sm">
                    <Smartphone size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">
                      Handset Validation Node
                    </p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {membershipPhone || "Not Configured"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Breakdown Table List Matrix */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pl-1">
                  <CreditCard size={14} className="text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Transaction Breakdown
                  </span>
                </div>

                <div className="rounded-2xl border-2 border-slate-100 overflow-hidden shadow-sm">
                  <div className="p-4 space-y-3 bg-slate-50/30">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 text-xs font-medium">
                        Registration Activation Fee
                      </span>
                      <span className="font-bold text-slate-900">
                        {formatKES(registrationFee)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 text-xs font-medium">
                        Share Capital Purchase
                      </span>
                      <span className="font-bold text-slate-900">
                        {formatKES(sharesAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 text-xs font-medium">
                        Initial Savings Deposit
                      </span>
                      <span className="font-bold text-slate-900">
                        {formatKES(savingsAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Dark-Mode Themed Summary Footing */}
                  <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Total Payable Gross
                    </span>
                    <span className="text-xl font-black tracking-tight">
                      {formatKES(totalPayable)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-1 text-slate-400">
                  <Calendar size={12} />
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    Ledger Log: {today}
                  </span>
                </div>
              </div>

              {/* Network Action STK Advisory Alert Block */}
              <div className="p-4 rounded-xl flex gap-3 bg-slate-50 border border-slate-200/60 shadow-sm">
                <Smartphone
                  size={14}
                  className="text-[#074073] shrink-0 mt-0.5 animate-pulse"
                />
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  <span className="text-slate-800 font-bold">
                    PIN Authorization Notice:
                  </span>{" "}
                  Confirming execution triggers an automatic STK popup directly
                  onto the wireless validation endpoint node. Input your
                  authentication credentials immediately.
                </p>
              </div>
            </div>

            <div className="border-b mx-8 border-slate-100"></div>

            {/* Pinned Execution Action Footer Deck */}
            <div className="p-8 bg-white shrink-0">
              <button
                type="button"
                disabled={isLoading}
                onClick={handlePayment}
                className={`group w-full h-16 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all
                  ${
                    isLoading
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/40"
                      : "bg-[#074073] hover:bg-[#052d52] text-white active:scale-[0.98] shadow-md"
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin text-slate-400"
                    />
                    <span>Initiating Payment Protocol...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Authorize Payment</span>
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReviewMembership;

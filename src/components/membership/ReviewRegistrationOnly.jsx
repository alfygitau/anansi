import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Smartphone,
  Calendar,
  ArrowRight,
  Lock,
  Loader2,
  X,
} from "lucide-react";
import { useStore } from "../../store/useStore";
import useAuth from "../../hooks/useAuth";
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import { payMembership } from "../../sdks/membership/membership";

const ReviewRegistrationOnly = ({ isOpen, onClose, onNext }) => {
  const { auth } = useAuth();
  const { showToast } = useToast();
  const membershipDetails = useStore((state) => state.membership);
  const membershipPhone = useStore((state) => state.membership_mobile);
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
            <div className="px-8 pt-5 pb-6 flex items-start gap-2">
              <div className="w-10 h-10 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-center text-[#074073] shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#074073] leading-tight">
                  Review Registration
                </h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  Verify verification matrices before firing network protocols
                </p>
              </div>
            </div>
            <div className="border-b mx-8 border-slate-200"></div>

            {/* Scrollable Core Review Content Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Desaturated M-PESA Confirmation Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-200/60 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200/40 pb-3">
                  <div className="flex items-center gap-2">
                    <Smartphone size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      M-PESA Checkout
                    </span>
                  </div>
                  <img
                    src="/mpesa.svg"
                    alt="M-Pesa Core Logo"
                    className="h-4 opacity-60 grayscale"
                  />
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">
                      Handset Validation Node
                    </p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {membershipPhone || "Not Configured"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">
                      Ledger Date
                    </p>
                    <p className="text-xs font-bold text-slate-800 flex items-center gap-1 mt-0.5 justify-end">
                      <Calendar size={12} className="text-slate-400" /> {today}
                    </p>
                  </div>
                </div>
              </div>

              {/* High-Contrast Premium Invoice Summary Block */}
              <div className="bg-slate-900 border border-slate-950 p-6 rounded-2xl text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 text-white pointer-events-none">
                  <Lock size={80} />
                </div>
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                      Total Due Gross
                    </p>
                    <h3 className="text-2xl font-black tracking-tight">
                      KES 1,000.00
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black uppercase tracking-wider bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 text-slate-300">
                      Standard Entry
                    </span>
                  </div>
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

export default ReviewRegistrationOnly;

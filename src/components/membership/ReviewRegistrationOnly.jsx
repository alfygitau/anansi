import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Smartphone,
  Calendar,
  ArrowRight,
  Lock,
  Loader2,
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
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/70 bg-slate-900/40"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full p-8 max-w-[520px] bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header / Progress Section */}

            <div className="space-y-8">
              {/* Title Section */}
              <div className="text-center space-y-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0FFFE] text-primary mb-2 shadow-inner">
                  <ShieldCheck size={28} />
                </div>
                <h2 className="text-2xl font-black text-primary tracking-tight">
                  Review Registration
                </h2>
                <p className="text-slate-500 text-sm">
                  Activate your Anansi membership
                </p>
              </div>

              {/* M-PESA Confirmation Box */}
              <div className="p-5 rounded-2xl bg-[#F0FFFE] border border-cyan-100 space-y-4">
                <div className="flex items-center justify-between border-b border-cyan-200/50 pb-3">
                  <div className="flex items-center gap-2">
                    <Smartphone size={16} className="text-primary" />
                    <span className="text-xs font-bold text-cyan-900 uppercase tracking-wider">
                      M-PESA Checkout
                    </span>
                  </div>
                  <img src="/mpesa.svg" alt="M-Pesa" className="h-4" />
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-cyan-700/60 uppercase tracking-widest">
                      Phone Number
                    </p>
                    <p className="text-lg font-black text-primary">
                      {membershipPhone || "07XX XXX XXX"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-cyan-700/60 uppercase tracking-widest">
                      Date
                    </p>
                    <p className="text-xs font-bold text-primary flex items-center gap-1">
                      <Calendar size={12} /> {today}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Card */}
              <div className="bg-primary p-6 rounded-2xl text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Lock size={60} />
                </div>
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <p className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                      Total Due
                    </p>
                    <h3 className="text-3xl font-black tracking-tighter">
                      KES 1,000.00
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] bg-white/10 px-2 py-1 rounded border border-white/20">
                      Standard Entry
                    </span>
                  </div>
                </div>
              </div>

              {/* STK Push Disclaimer */}
              <div className="flex gap-3 px-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="shrink-0"
                >
                  <div className="h-2 w-2 rounded-full bg-blue-500 mt-1" />
                </motion.div>
                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                  An <span className="font-bold text-primary">STK Push</span>{" "}
                  prompt will appear on your phone shortly. Ensure your phone is
                  unlocked and enter your M-PESA PIN to complete registration.
                </p>
              </div>
            </div>

            {/* Action Footer */}
            <div className="bg-white border-t mt-5 border-slate-50">
              <button
                disabled={isLoading}
                onClick={handlePayment}
                className="group w-full h-14 bg-primary hover:bg-[#062d7a] disabled:bg-slate-300 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Initiating Payment...
                  </>
                ) : (
                  <>
                    Confirm and Pay
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform text-secondary"
                    />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReviewRegistrationOnly;

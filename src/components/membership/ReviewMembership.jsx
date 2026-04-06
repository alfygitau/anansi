import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Smartphone,
  Calendar,
  Loader2,
  CreditCard,
  ArrowRight,
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
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-[520px] p-6 bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="space-y-4 overflow-y-auto no-scrollbar max-h-[80vh]">
              {/* Summary Header */}
              <div className="text-center space-y-2">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-primary mb-2">
                  <ShieldCheck size={28} />
                </div>
                <h2 className="text-2xl font-black text-primary tracking-tight">
                  Confirm Details
                </h2>
                <p className="text-slate-500 text-sm">
                  Please verify your transaction details below
                </p>
              </div>

              {/* M-PESA Box */}
              <div className="group relative p-3 rounded-2xl bg-[#F0FFFE] border border-cyan-100 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-cyan-700">
                    Payment Method
                  </span>
                  <img
                    src="/mpesa.svg"
                    alt="M-Pesa"
                    className="h-4 opacity-80"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Smartphone size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-cyan-800/60 font-bold uppercase tracking-tighter">
                      Phone Number
                    </p>
                    <p className="text-sm font-black text-primary">
                      {"0769404436" || "Not Set"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Breakdown Table */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard size={14} className="text-slate-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Transaction Breakdown
                  </span>
                </div>

                <div className="rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="p-4 space-y-3 bg-slate-50/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Registration Fee</span>
                      <span className="font-bold text-primary">
                        {formatKES(1000)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Shares Purchase</span>
                      <span className="font-bold text-primary">
                        {formatKES(membershipDetails?.shares)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Initial Savings</span>
                      <span className="font-bold text-primary">
                        {formatKES(membershipDetails?.savings)}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-primary text-white flex justify-between items-center">
                    <span className="text-xs font-black uppercase tracking-widest text-cyan-400">
                      Total Payable
                    </span>
                    <span className="text-xl font-black">
                      {formatKES(
                        (parseFloat(membershipDetails?.shares) || 0) +
                          (parseFloat(membershipDetails?.savings) || 0),
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-2">
                  <Calendar size={12} className="text-slate-400" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    {today}
                  </span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Smartphone size={18} className="text-amber-600" />
                </motion.div>
                <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                  An <span className="font-black underline">STK Push</span>{" "}
                  prompt will be sent to your phone. Please enter your M-PESA
                  PIN to finalize activation.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="border-t mt-4 border-slate-50">
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

export default ReviewMembership;

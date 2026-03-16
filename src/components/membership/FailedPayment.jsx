import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  Smartphone,
  HelpCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import { payMembership } from "../../sdks/membership/membership";

const FailedMembershipPayment = ({
  isOpen,
  onClose,
  onTryAgain,
  onConfirmManual,
}) => {
  const [membershipDetails, setMembershipDetails] = useState({});
  const [membershipPhone, setMembershipPhone] = useState("");
  const { auth } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    let membership = localStorage.getItem("membership")
      ? JSON.parse(localStorage.getItem("membership"))
      : {};
    let mobile = localStorage.getItem("membership_mobile")
      ? JSON.parse(localStorage.getItem("membership_mobile"))
      : "";
    setMembershipDetails(membership);
    setMembershipPhone(mobile);
  }, []);

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
      onTryAgain();
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

  const handleRetry = async () => {
    handlePayment();
  };

  const handleManualConfirm = async () => {
    await onConfirmManual();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[520px] bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-8 space-y-8 overflow-y-auto no-scrollbar max-h-[85vh]">
              {/* Error Status Banner */}
              <div className="text-center space-y-4">
                <div className="relative inline-flex">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="h-20 w-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500"
                  >
                    <AlertCircle size={40} />
                  </motion.div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    Payment Unsuccessful
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Something went wrong while processing your request.
                  </p>
                </div>
              </div>

              {/* Troubleshooting Checklist */}
              <div className="bg-slate-50 rounded-[24px] p-6 space-y-4 border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <HelpCircle size={14} /> Quick Checklist
                </p>

                <ul className="space-y-3">
                  {[
                    "Ensure your M-PESA SIM is active and inserted.",
                    "Verify you entered the correct M-PESA PIN.",
                    "Check if you have sufficient funds for the total amount.",
                  ].map((text, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <div className="mt-1 h-4 w-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={10} className="text-emerald-600" />
                      </div>
                      <span className="text-xs text-slate-600 font-medium leading-relaxed">
                        {text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Manual Confirmation Call-to-action */}
              <div className="text-center px-4">
                <p className="text-xs text-slate-500 mb-2">
                  Did you receive an M-PESA SMS already?
                </p>
                <button
                  onClick={handleManualConfirm}
                  className="inline-flex items-center gap-2 text-[#042159] font-black text-xs uppercase tracking-wider hover:underline disabled:opacity-50"
                >
                  <ExternalLink size={14} />
                  Verify Payment Status
                </button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-slate-50">
                <button
                  onClick={handleRetry}
                  className="group w-full h-14 bg-[#042159] hover:bg-[#062d7a] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] disabled:bg-slate-300"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <RotateCcw
                        size={18}
                        className="group-hover:-rotate-45 transition-transform"
                      />
                      Try Again
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-400 leading-relaxed px-6">
                  Clicking "Try Again" will send a new STK Push prompt to your
                  registered M-PESA number.
                </p>
              </div>
            </div>

            {/* Support Footer */}
            <div className="bg-slate-50 p-4 flex items-center justify-center gap-2">
              <Smartphone size={14} className="text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Secure Transaction Support
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FailedMembershipPayment;

import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

const AcceptRequestSuccess = ({ isOpen, onClose, loanCode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop with heavy blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-[40px] p-8 shadow-2xl text-center overflow-hidden"
          >
            {/* Background Decorative Element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-emerald-50 to-transparent -z-0" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Success Icon Animation */}
            <div className="relative z-10 flex flex-col items-center pt-4">
              <div className="size-24 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200 mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <Check size={48} className="text-white" strokeWidth={3} />
                </motion.div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-2">
                Success!
              </h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed px-4">
                You have officially guaranteed the loan request for
                <span className="block font-black text-blue-600 mt-1 uppercase tracking-wider underline">
                  #{loanCode || "LN-9902"}
                </span>
              </p>
            </div>

            {/* Info Box */}
            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center gap-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Transaction Verified
              </p>
              <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            {/* Action Button */}
            <div className="mt-10">
              <button
                onClick={onClose}
                className="w-full h-14 rounded-2xl bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AcceptRequestSuccess;

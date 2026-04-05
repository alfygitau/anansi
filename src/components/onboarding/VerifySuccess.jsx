import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldCheck } from "lucide-react";

const SuccessVerification = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Soft Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/30 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[500px] bg-white rounded-[40px] shadow-2xl overflow-hidden p-6 flex flex-col items-center"
          >
            {/* Animated Success Icon Section */}
            <div className="relative mb-8">
              {/* Outer Pulse Rings */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-green-100 rounded-full opacity-50"
              />
              <div className="relative h-24 w-24 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle2
                  size={48}
                  className="text-green-500"
                  strokeWidth={2.5}
                />
              </div>
            </div>

            {/* Detailed Success Message */}
            <div className="text-center space-y-4 mb-10">
              <h2 className="text-2xl font-black text-primary uppercase tracking-tight">
                Document Read Successfully!
              </h2>
              <p className="text-[14px] text-slate-500 leading-relaxed max-w-[380px] mx-auto">
                We've successfully extracted the information from your ID.
                Please take a moment to{" "}
                <span className="text-primary font-bold">
                  review the details
                </span>{" "}
                on the next screen to ensure everything matches your physical
                document.
              </p>
            </div>

            {/* Verification Badge/Info Box */}
            <div className="w-full flex items-center gap-4 p-5 bg-blue-50/50 rounded-3xl mb-8 border border-blue-100/50">
              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                <ShieldCheck size={20} className="text-secondary" />
              </div>
              <p className="text-[12px] text-slate-600 font-medium">
                Data accurately scanned and ready for final review.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SuccessVerification;

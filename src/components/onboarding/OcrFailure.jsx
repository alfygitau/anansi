import { motion, AnimatePresence } from "framer-motion";
import { XCircle, HelpCircle, RefreshCcw, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OCRFailure = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-primary/60 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-[500px] bg-white rounded-[40px] shadow-2xl overflow-hidden"
        >
          {/* Close Icon (Top Right) */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-slate-300 hover:text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="p-10 flex flex-col items-center text-center">
            {/* Animated Icon Header */}
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
              <XCircle className="text-red-500" size={48} strokeWidth={1.5} />
            </div>

            <h3 className="text-xl font-black text-primary uppercase tracking-tight mb-3">
              Document Scan Failed
            </h3>

            <p className="text-slate-500 text-sm leading-relaxed mb-10 px-4">
              We couldn't read your document or it might be invalid. Please
              ensure the photo is{" "}
              <span className="font-bold text-primary">clear, well-lit</span>,
              and all corners are visible.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              <button
                onClick={() => navigate("/onboarding/help")}
                className="w-full h-[56px] flex items-center justify-center gap-2 bg-slate-100 text-slate-600 rounded-[20px] font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                <HelpCircle size={18} />
                Get Help
              </button>

              <button
                onClick={onClose}
                className="w-full h-[56px] flex items-center justify-center gap-2 bg-primary text-white rounded-[20px] font-bold text-xs uppercase tracking-widest hover:bg-secondary transition-all shadow-lg shadow-blue-900/20"
              >
                <RefreshCcw size={18} />
                Try Again
              </button>
            </div>
          </div>

          {/* Bottom Accent Line */}
          <div className="h-1.5 w-full bg-red-500/10" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OCRFailure;

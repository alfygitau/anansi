import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { XCircle, HelpCircle, RefreshCcw, AlertTriangle } from "lucide-react";

const DocumentError = ({ isOpen, onClose }) => {
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
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-[500px] bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-100"
        >
          <div className="p-6 md:p-8 flex flex-col items-center text-center">
            {/* Animated Icon Header */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-rose-100 rounded-full blur-2xl opacity-50 animate-pulse" />
              <div className="relative w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center rotate-3 border border-rose-100">
                <XCircle
                  size={44}
                  className="text-rose-500 -rotate-3"
                  strokeWidth={1.5}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md">
                <AlertTriangle size={18} className="text-amber-500" />
              </div>
            </div>

            {/* Typography */}
            <h2 className="text-2xl font-black text-[#042159] mb-4">
              Upload Unsuccessful
            </h2>
            <p className="text-slate-500 text-[15px] leading-relaxed mb-10 px-4">
              We couldn't read your document or it might be invalid. Please
              ensure the file is clear, unexpired, and in a supported format.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
              <button
                onClick={() => navigate("/onboarding/help")}
                className="w-full sm:flex-1 h-14 flex items-center justify-center gap-2 rounded-2xl bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <HelpCircle size={18} />
                Get Help
              </button>

              <button
                onClick={onClose}
                className="w-full sm:flex-1 h-14 flex items-center justify-center gap-2 rounded-2xl bg-[#042159] text-white font-bold hover:bg-[#062d7a] transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
              >
                <RefreshCcw size={18} />
                Try Again
              </button>
            </div>
          </div>

          {/* Footer Decoration */}
          <div className="bg-slate-50 py-4 px-8 border-t border-slate-100 flex justify-center">
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-widest">
              Supported Formats: PDF, PNG, JPEG
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DocumentError;

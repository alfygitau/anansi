import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XCircle, X, Info } from 'lucide-react';

const DeclineRequestSuccess = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm bg-white rounded-[40px] p-10 shadow-2xl text-center"
          >
            <div className="flex flex-col items-center">
              {/* Decline Icon */}
              <div className="size-20 rounded-3xl bg-rose-50 flex items-center justify-center text-rose-500 mb-8 border border-rose-100 rotate-12">
                <XCircle size={40} strokeWidth={2.5} className="-rotate-12" />
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-3">Request Declined</h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed px-2">
                The guarantorship request has been cancelled. The borrower will be notified of your decision.
              </p>
            </div>

            {/* Secondary Feedback */}
            <div className="mt-8 flex items-center gap-3 text-left p-4 bg-slate-50 rounded-2xl">
              <Info className="text-slate-400 shrink-0" size={18} />
              <p className="text-[11px] font-semibold text-slate-400 leading-tight">
                This action is final. You can no longer view or accept this specific request.
              </p>
            </div>

            <button
              onClick={onClose}
              className="mt-10 w-full h-14 rounded-2xl border-2 border-slate-100 bg-white text-slate-900 text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95"
            >
              Close Portal
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeclineRequestSuccess;
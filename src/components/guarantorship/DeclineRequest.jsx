import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  AlertCircle,
  ShieldOff,
  UserX,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

const DeclineRequest = ({
  isOpen,
  onClose,
  reason,
  setReason,
  isLoading,
  onFinalize,
}) => {
  const declineOptions = [
    {
      id: "unknown",
      label: "I do not know the borrower",
      icon: <UserX size={18} />,
      desc: "Safety protocol: I haven't established a relationship with this member.",
    },
    {
      id: "unwilling",
      label: "I prefer not to guarantee at this time",
      icon: <ShieldOff size={18} />,
      desc: "Personal choice: I am unable to commit my deposits as security right now.",
    },
  ];

  const handleDecline = async () => {
    if (!reason) return;
    onFinalize();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex justify-end overflow-hidden bg-slate-900/60">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="relative w-full max-w-md bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] flex flex-col h-full border-l border-slate-100"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 border border-rose-100">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    Decline Request
                  </h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:bg-slate-100"
              >
                <X size={20} strokeWidth={3} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div className="text-center space-y-2">
                <h4 className="text-xl font-bold text-slate-900">
                  Provide Feedback
                </h4>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                  Declining this request helps us maintain the integrity of our
                  lending network. Please select a reason below.
                </p>
              </div>

              {/* Selection Options */}
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                  Selection Reason
                </span>

                {declineOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setReason(option.label)}
                    className={`w-full text-left p-5 rounded-[28px] border-2 transition-all duration-300 group relative overflow-hidden ${
                      reason === option.label
                        ? "border-rose-500 bg-rose-50/30 shadow-lg shadow-rose-900/5"
                        : "border-slate-100 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-start gap-4 relative z-10">
                      <div
                        className={`size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          reason === option.label
                            ? "bg-rose-500 text-white"
                            : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                        }`}
                      >
                        {option.icon}
                      </div>
                      <div className="space-y-1">
                        <p
                          className={`text-sm font-bold transition-colors ${
                            reason === option.label
                              ? "text-rose-700"
                              : "text-slate-700"
                          }`}
                        >
                          {option.label}
                        </p>
                        <p className="text-[11px] text-slate-400 font-medium leading-tight">
                          {option.desc}
                        </p>
                      </div>
                    </div>

                    {/* Active Indicator Dot */}
                    {reason === option.label && (
                      <motion.div
                        layoutId="active-pill"
                        className="absolute right-4 top-1/2 -translate-y-1/2 size-2 rounded-full bg-rose-500"
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Note about Privacy */}
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 flex gap-4 items-center">
                <MessageSquare size={18} className="text-slate-400 shrink-0" />
                <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
                  The borrower will be notified that their request was declined,
                  but specific feedback details are handled securely.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-8 bg-white border-t border-slate-50 mt-auto">
              <button
                onClick={handleDecline}
                disabled={!reason || isLoading}
                className="w-full h-16 rounded-[24px] bg-rose-600 text-white text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-200 hover:bg-rose-700 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Confirm Decline
                    <ArrowRight size={18} strokeWidth={3} />
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="w-full mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
              >
                Cancel and Go Back
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeclineRequest;

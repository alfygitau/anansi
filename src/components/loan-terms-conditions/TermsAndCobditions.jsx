import React, { useState } from "react";
import { X, Scale, AlertTriangle, ChevronDown, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LoanTerms = ({ isOpen, onClose, onAccept }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = (e) => {
    const target = e.target;
    const isAtBottom =
      target.scrollHeight - target.scrollTop <= target.clientHeight + 40;
    if (isAtBottom) {
      setHasScrolledToBottom(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex justify-end bg-slate-900/40"
        >
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 240 }}
            className="bg-white relative w-full max-w-[480px] h-full shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {/* PREMIUM HEADER */}
            <div className="bg-white p-5 flex items-center justify-between sticky top-0 z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700 border border-slate-200/60">
                  <Scale size={18} />
                </div>
                <div>
                  <h2 className="text-slate-900 text-base font-medium uppercase tracking-wider">
                    Terms & Conditions
                  </h2>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                    Agreement Facility Reference
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="border mx-5 border-slate-100"></div>
            {/* DETAILED AGREEMENT CONTENT AREA */}
            <div
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth"
            >
              <div className="text-xs text-slate-500 leading-relaxed">
                Please review the structural, financial, and legal covenants
                governing your credit facility carefully before executing the
                signature payload below.
              </div>

              {/* SECTION 2: LEGAL INTELLECTUAL TERMS TEXT */}
              <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
                <div className="space-y-2">
                  <h4 className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
                    02. Interest Calculation & Accrual
                  </h4>
                  <p className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm text-slate-500">
                    Interest charges accrue daily on the outstanding principal
                    balance of the facility based on a 365-day year format. Any
                    payment received after 5:00 PM standard local operating
                    hours will be dynamically credited to the subsequent ledger
                    business cycle.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
                    03. Prepayment & Early Redemption Clauses
                  </h4>
                  <p className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm text-slate-500">
                    The borrower preserves the absolute structural right to
                    execute early repayment or liquidate the total outstanding
                    ledger balance in full at any processing junction. No early
                    liquidation penalties, administrative fees, or restructuring
                    processing charges apply to early settlement requests.
                  </p>
                </div>

                {/* CRITICAL WARNING SECTION */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-medium uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                    <AlertTriangle size={12} className="text-amber-500" /> 04.
                    Default & Delinquency Covenants
                  </h4>
                  <div className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                    <p className="text-[10px] font-medium text-amber-600 uppercase tracking-widest mb-1">
                      Critical Notice
                    </p>
                    <p className="text-slate-500 text-xs">
                      Failure to post payments within{" "}
                      <span className="text-slate-900 font-bold">
                        15 continuous calendar days
                      </span>{" "}
                      from the designated monthly due date triggers a flat late
                      delinquency administrative overhead fee of{" "}
                      <span className="text-slate-900 font-bold">1.5%</span> of
                      the unliquidated past due balance. Continued delinquency
                      grants the issuer operational authorization to accelerate
                      the total outstanding principal liability and report
                      parameters to regional asset credit bureaus.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-medium uppercase tracking-widest text-slate-400">
                    05. Legal Framework & Jurisdiction
                  </h4>
                  <p className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm text-slate-500">
                    This structural facility credit agreement is strictly
                    interpreted, regulated, and governed under the applicable
                    statutory financial compliance frameworks of the sovereign
                    state jurisdiction where the origination entity executes
                    operations.
                  </p>
                </div>
              </div>

              {/* CONTINUOUS READING INDICATOR */}
              {!hasScrolledToBottom && (
                <div className="flex items-center justify-center gap-1 text-[10px] font-medium uppercase tracking-widest text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200 animate-pulse">
                  <ChevronDown size={14} /> Scroll down to complete reading
                  requirements
                </div>
              )}
            </div>
            <div className="border mx-5 border-slate-100"></div>

            {/* FIXED BOTTOM ACTION PANEL */}
            <div className="p-5 bg-white mt-auto flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-4 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-white border border-slate-200 text-slate-600 py-4 rounded-xl text-[11px] font-medium uppercase tracking-[0.08em] hover:bg-slate-50 transition-all text-center shadow-sm"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={!hasScrolledToBottom}
                  onClick={onAccept}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl text-[11px] font-medium uppercase tracking-[0.08em] hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  Download <Download size={14} className="text-slate-400" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoanTerms;

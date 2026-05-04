import { useState } from "react";
import {
  FileText,
  AlertTriangle,
  Download,
  Printer,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const NormalLoanTermsConditions = () => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const onAccept = () => {
    navigate("/all-loan-applications");
  };
  const onCancel = () => {};

  // Logic to detect if user has read the terms
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      setHasScrolledToBottom(true);
    }
  };

  return (
    <div className="bg-slate-50 text-primary pb-10">
      <div className="max-w-6xl mx-auto sm:px-6">
        {/* Header with Actions */}
        <header className="mb-3 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl tracking-tight">
              Terms & Conditions
            </h1>
          </div>

          <div className="flex gap-3">
            <button className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-primary transition-all">
              <Printer size={20} />
            </button>
            <button className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-primary transition-all">
              <Download size={20} />
            </button>
          </div>
        </header>

        {/* Terms Container */}
        <div className="bg-white border border-slate-100 shadow-xl shadow-blue-900/5 overflow-hidden">
          {/* Scrollable Content Area */}
          <div
            onScroll={handleScroll}
            className="h-[500px] overflow-y-auto p-6 md:p-6 space-y-12 scroll-smooth bg-white custom-scrollbar"
          >
            {/* 01. Disbursement & Financial Obligations */}
            <section className="group">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-bold px-2 py-1 bg-secondary/10 text-secondary rounded-md tracking-tighter">
                  01
                </span>
                <h3 className="text-sm font-black uppercase tracking-widest text-primary">
                  Disbursement & Interest Framework
                </h3>
              </div>
              <div className="space-y-4 pl-10 border-l-2 border-gray-50 group-hover:border-secondary/30 transition-colors">
                <p className="text-slate-500 text-sm leading-relaxed">
                  Upon execution of this agreement and successful verification
                  of guarantors, the loan amount shall be disbursed to the
                  Member's verified **KES mobile wallet** or bank account.
                </p>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Interest shall accrue at a rate of **12% per annum** on a
                  reducing balance basis. The Member acknowledges that the SACCO
                  reserves the right to vary interest rates in accordance with
                  market conditions or Central Bank of Kenya guidelines,
                  providing 30 days' notice.
                </p>
              </div>
            </section>

            {/* 02. Repayment & Default Penalties (High Visibility) */}
            <section className="p-8 bg-rose-50/50 rounded-[32px] border border-rose-100 relative overflow-hidden">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-rose-700">
                <AlertTriangle size={18} /> Default & Legal Recourse
              </h3>
              <div className="space-y-4 relative z-10">
                <p className="text-rose-900/70 text-sm leading-relaxed">
                  Repayments are due on the 5th of every month. Any installment
                  remaining unpaid for **more than 48 hours** post-due date will
                  attract a cumulative penalty of **2% per month**.
                </p>
                <p className="text-rose-900/70 text-sm leading-relaxed font-semibold">
                  The Member consents to the SACCO sharing credit performance
                  data with Licensed Credit Reference Bureaus (CRB). Continued
                  default beyond 90 days triggers immediate recovery procedures
                  against pledged deposits and listed Guarantors.
                </p>
              </div>
            </section>

            {/* 03. Guarantor Liabilities */}
            <section className="group">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-bold px-2 py-1 bg-secondary/10 text-secondary rounded-md">
                  02
                </span>
                <h3 className="text-sm font-black uppercase tracking-widest text-primary">
                  Guarantor Statutory Obligations
                </h3>
              </div>
              <div className="space-y-4 pl-10 border-l-2 border-gray-50 group-hover:border-secondary/30 transition-colors">
                <p className="text-slate-500 text-sm leading-relaxed">
                  The Member understands that Guarantors are **jointly and
                  severally liable**. This means if the Member fails to pay, the
                  SACCO has the legal right to recover the full debt from any
                  one of the guarantors or all of them collectively.
                </p>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Member deposits equivalent to the guaranteed amount shall be
                  "frozen" and cannot be withdrawn until the loan balance falls
                  below the total free deposits.
                </p>
              </div>
            </section>

            {/* 04. Statutory Right of Offset */}
            <section className="group">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-bold px-2 py-1 bg-secondary/10 text-secondary rounded-md">
                  03
                </span>
                <h3 className="text-sm font-black uppercase tracking-widest text-primary">
                  Right of Offset & Lien
                </h3>
              </div>
              <div className="space-y-4 pl-10 border-l-2 border-gray-50 group-hover:border-secondary/30 transition-colors">
                <p className="text-slate-500 text-sm leading-relaxed">
                  The SACCO maintains a **first lien** over all shares,
                  deposits, and dividends owned by the Member. In the event of
                  default, the SACCO is hereby authorized to apply these funds
                  toward the settlement of the outstanding loan without further
                  reference to the Member.
                </p>
              </div>
            </section>

            {/* 05. Loan Insurance */}
            <section className="group">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[10px] font-bold px-2 py-1 bg-secondary/10 text-secondary rounded-md">
                  04
                </span>
                <h3 className="text-sm font-black uppercase tracking-widest text-primary">
                  Credit Life Insurance
                </h3>
              </div>
              <div className="space-y-4 pl-10 border-l-2 border-gray-50 group-hover:border-secondary/30 transition-colors">
                <p className="text-slate-500 text-sm leading-relaxed">
                  A mandatory insurance premium of **0.5%** of the loan amount
                  will be deducted at source to cover the loan against death or
                  permanent disability of the Member.
                </p>
              </div>
            </section>
          </div>

          {/* Footer Acceptance Area */}
          <div className="p-10 bg-slate-50 border-t border-slate-100">
            <div className="flex items-center gap-4 mb-8">
              <button
                onClick={() => setAgreed(!agreed)}
                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all border-2 ${
                  agreed
                    ? "bg-secondary border-secondary text-white"
                    : "bg-white border-slate-200"
                }`}
              >
                {agreed && <Check size={16} strokeWidth={4} />}
              </button>
              <div className="flex-1">
                <p className="text-xs font-bold leading-relaxed">
                  I have read, understood, and agree to be bound by the above
                  Loan Terms and Conditions. I authorize the institution to
                  perform credit checks as required.
                </p>
                {!hasScrolledToBottom && (
                  <p className="text-[10px] text-secondary font-black uppercase mt-2 animate-pulse">
                    Please scroll to the bottom to enable agreement
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={onCancel}
                className="flex-1 py-5 border rounded-[24px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-all"
              >
                Decline
              </button>
              <button
                disabled={!agreed || !hasScrolledToBottom}
                onClick={onAccept}
                className="flex-[2] py-5 bg-primary text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-secondary transition-all disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed"
              >
                Accept & Submit Application
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NormalLoanTermsConditions;

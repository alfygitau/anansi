import React from "react";
import {
  FileText,
  Users,
  Plus,
  Info,
  ShieldCheck,
  ArrowRight,
  Download,
  MessageCircle,
  UserPlus,
  Zap,
  FileSearch,
} from "lucide-react";

const LoanApplicationDetails = ({ onBack }) => {
  const appData = {
    code: "APP-DEV-001",
    product: "Development Loan",
    requestedAmount: "KES 1,200,000",
    submissionDate: "Mar 12, 2026",
    status: "Pending Guarantors",
    requiredGuarantors: 3,
  };

  const guarantors = [
    {
      name: "John Kamau",
      phone: "0712***456",
      amount: "KES 100,000",
      status: "Accepted",
    },
    {
      name: "Sarah Wanjiku",
      phone: "0722***890",
      amount: "KES 100,000",
      status: "Pending",
    },
  ];

  const isProcessing = [
    "Pending Approval",
    "Pending Disbursement",
    "Reviewing Customer Information",
  ].includes("Reviewing Customer Information");

  return (
    <div className="min-h-screen bg-slate-50 text-primary pb-20">
      <div className="max-w-6xl mx-auto sm:px-4">
        {/* Navigation & Header */}
        <header className="py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                {appData.product}
              </h1>
              <p className="text-slate-400 font-mono text-xs mt-1 uppercase tracking-widest">
                {appData.code}
              </p>
            </div>
            {/* Status Indicator */}
            <div className="bg-amber-500 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-200">
              {appData.status}
            </div>
          </div>
        </header>

        {/* 1. Application Summary Card */}
        <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-blue-900/5 mb-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <DetailItem
            label="Amount Requested"
            value={appData.requestedAmount}
            isHighlight
          />
          <DetailItem label="Submission Date" value={appData.submissionDate} />
          <DetailItem label="Interest Rate" value="12% P.A (Projected)" />
          <DetailItem label="Est. Period" value="24 Months" />
        </div>

        {/* Conditionally show the insight section */}
        {isProcessing && (
          <StatusInsight status="Reviewing Customer Information" />
        )}

        {/* 2. Guarantors Management */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-black tracking-tight">
                Guarantors Required
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                You need {appData.requiredGuarantors} guarantors.{" "}
                {guarantors.length} added so far.
              </p>
            </div>
            {guarantors.length < appData.requiredGuarantors && (
              <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-secondary text-white px-4 py-2.5 rounded-xl hover:scale-105 transition-all">
                <Plus size={16} /> Add Guarantor
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {guarantors.map((g) => (
              <GuarantorCard key={g.id} guarantor={g} />
            ))}
            {/* Empty Slot for missing guarantors */}
            {guarantors.length < appData.requiredGuarantors && (
              <div className="border-2 border-dashed border-slate-200 rounded-[32px] p-6 flex flex-col items-center justify-center text-slate-300 hover:border-secondary hover:text-secondary transition-all cursor-pointer">
                <Users size={32} strokeWidth={1.5} />
                <span className="text-[10px] font-black uppercase tracking-widest mt-2">
                  Slot Empty
                </span>
              </div>
            )}
          </div>
        </section>

        {/* 3. Document & Terms Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <section className="bg-white p-8 rounded-[40px] border border-slate-100">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
              Application Documents
            </h3>
            <div className="space-y-4">
              <DocRow label="Loan Terms & Conditions" />
              <DocRow label="Repayment Agreement (Draft)" />
            </div>
          </section>

          {/* Final Action Block */}
          <section className="flex flex-col justify-center gap-4">
            <div className="bg-sky-50 p-6 rounded-[32px] border border-sky-100 mb-2">
              <div className="flex gap-4">
                <Info className="text-secondary" size={24} />
                <p className="text-xs text-primary/70 leading-relaxed font-medium">
                  Once all guarantors have accepted your request, you will be
                  able to sign the final contract and submit for disbursement.
                </p>
              </div>
            </div>
            <button className="w-full bg-primary text-white py-5 rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#062d7a] transition-all shadow-xl shadow-blue-900/20">
              Continue Application <ArrowRight size={20} />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

/* --- UI Sub-Components --- */

const DetailItem = ({ label, value, isHighlight }) => (
  <div>
    <p className="text-[9px] font-black uppercase tracking-[0.15em] text-slate-300 mb-1">
      {label}
    </p>
    <p
      className={`text-base font-bold ${isHighlight ? "text-secondary font-black" : "text-primary"}`}
    >
      {value}
    </p>
  </div>
);

const DocRow = ({ label }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-slate-100">
    <div className="flex items-center gap-3">
      <FileText size={18} className="text-secondary" />
      <span className="text-sm font-bold text-primary">{label}</span>
    </div>
    <Download size={16} className="text-slate-300 group-hover:text-primary" />
  </div>
);

const GuarantorCard = ({ guarantor }) => {
  const isPending = guarantor.status === "Pending";

  return (
    <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between mb-4">
        {/* Avatar/Status Icon */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
            isPending
              ? "bg-amber-50 text-amber-500"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          {isPending ? (
            <UserPlus size={22} className="animate-pulse" />
          ) : (
            <ShieldCheck size={22} />
          )}
        </div>

        {/* Amount Badge */}
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Guarantee
          </p>
          <p className="text-sm font-black text-primary">{guarantor.amount}</p>
        </div>
      </div>

      <div>
        <h4 className="font-bold text-primary text-sm truncate">
          {guarantor.name}
        </h4>
        <p className="text-[10px] font-mono text-slate-400 mt-0.5">
          {guarantor.phone}
        </p>
      </div>

      {/* Action Footer */}
      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
        <span
          className={`text-[9px] font-black uppercase tracking-widest ${
            isPending ? "text-amber-500" : "text-emerald-500"
          }`}
        >
          {guarantor.status}
        </span>

        {isPending && (
          <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-secondary hover:text-primary transition-colors">
            <MessageCircle size={12} />
            Nudge via SMS
          </button>
        )}
      </div>
    </div>
  );
};

const StatusInsight = ({ status }) => {
  const insights = {
    "Pending Approval": {
      title: "Under Credit Review",
      description:
        "Our credit committee is currently reviewing your financial profile and guarantor commitments. This typically takes 24-48 hours.",
      icon: <ShieldCheck className="text-blue-600" />,
      bg: "bg-blue-50",
      border: "border-blue-100",
    },
    "Reviewing Customer Information": {
      title: "Verification in Progress",
      description:
        "We are performing standard KYC (Know Your Customer) checks on your provided identification and documents to ensure your security.",
      icon: <FileSearch className="text-indigo-600" />,
      bg: "bg-indigo-50",
      border: "border-indigo-100",
    },
    "Pending Disbursement": {
      title: "Processing M-PESA Transfer",
      description:
        "Great news! Your loan is approved. We are currently queuing the funds for transfer to your registered mobile number.",
      icon: <Zap className="text-secondary" />,
      bg: "bg-sky-50",
      border: "border-sky-100",
    },
  };

  const active = insights[status] || insights["Pending Approval"];

  return (
    <div
      className={`p-6 rounded-[40px] border ${active.border} ${active.bg} mb-10`}
    >
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm shrink-0">
          {React.cloneElement(active.icon, { size: 32 })}
        </div>
        <div>
          <h3 className="text-lg font-black text-primary tracking-tight">
            {active.title}
          </h3>
          <p className="text-sm text-primary/70 leading-relaxed mt-1 max-w-2xl">
            {active.description}
          </p>
        </div>
        {status === "Pending Disbursement" && (
          <div className="md:ml-auto">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-sky-200">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
              </span>
              <span className="text-[10px] font-black uppercase text-secondary">
                System Live
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanApplicationDetails;

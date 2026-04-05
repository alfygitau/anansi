import React, { useState } from "react";
import {
  XCircle,
  Search,
  Plus,
  Filter,
  FileSearch,
  Users,
  Zap,
  Ban,
  Hourglass,
  ShieldCheck,
  ArrowRight,
  Gavel,
  History,
} from "lucide-react";

const LoanApplications = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const applications = [
    {
      id: "ap-990",
      product: "Development Loan",
      appCode: "APP-DEV-001",
      amount: "KES 1,200,000",
      date: "Mar 12, 2026",
      status: "Pending Approval",
    },
    {
      id: "ap-991",
      product: "Education Loan",
      appCode: "APP-EDU-045",
      amount: "KES 85,000",
      date: "Mar 10, 2026",
      status: "Pending Disbursement",
    },
    {
      id: "ap-992",
      product: "Biashara Loan",
      appCode: "APP-BIA-112",
      amount: "KES 300,000",
      date: "Mar 08, 2026",
      status: "Pending Guarantors",
    },
    {
      id: "ap-993",
      product: "Mobile Loan",
      appCode: "APP-MOB-772",
      amount: "KES 15,000",
      date: "Mar 05, 2026",
      status: "Rejected",
    },
    {
      id: "ap-994",
      product: "Asset Finance",
      appCode: "APP-AST-099",
      amount: "KES 2,500,000",
      date: "Mar 02, 2026",
      status: "Pending Approval",
    },
    {
      id: "ap-995",
      product: "Flash Loan",
      appCode: "APP-FLS-661",
      amount: "KES 10,000",
      date: "Feb 28, 2026",
      status: "Pending Disbursement",
    },
    {
      id: "ap-996",
      product: "Jijenge Loan",
      appCode: "APP-JIJ-445",
      amount: "KES 250,000",
      date: "Feb 25, 2026",
      status: "Cancelled",
    },
  ];

  const filteredApps = applications.filter(
    (app) =>
      app.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.appCode.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50 text-primary pb-20">
      <div className="max-w-6xl sm:px-4 mx-auto">
        {/* Header Section */}
        <header className="py-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              Loan Applications
            </h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">
              Monitor your credit requests through the vetting and disbursement
              pipeline.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-[24px] font-bold shadow-xl shadow-blue-900/20 hover:scale-[1.02] transition-all">
            <Plus size={20} /> New Application
          </button>
        </header>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Search & List (8 Columns) */}
          <div className="lg:col-span-8 space-y-6">
            <section className="bg-white rounded-[20px] p-8 shadow-xl shadow-blue-900/5 border border-slate-100">
              <div className="flex gap-4 mb-8">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search by product or application code..."
                    className="w-full pl-12 pr-4 py-4 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-secondary/20 outline-none text-sm font-bold transition-all"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="flex items-center gap-2 px-6 py-4 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">
                  <Filter size={18} /> Filter
                </button>
              </div>

              <div className="space-y-4">
                {filteredApps.length > 0 ? (
                  filteredApps.map((app) => (
                    <ApplicationRow key={app.id} app={app} />
                  ))
                ) : (
                  <div className="py-20 text-center text-slate-300 font-bold italic">
                    No matching applications found.
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT: Quick Actions & Sidebar (4 Columns) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Action Required Card */}
            <div className="bg-primary rounded-[32px] p-8 text-white shadow-xl shadow-blue-900/20">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="text-secondary" size={20} />
                <h3 className="text-lg font-black tracking-tight">
                  Pending Action
                </h3>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-6">
                <p className="text-[11px] font-bold text-secondary uppercase tracking-widest mb-1">
                  Attention Required
                </p>
                <p className="text-xs leading-relaxed text-white/80">
                  Your{" "}
                  <span className="text-white font-bold underline">
                    Biashara Loan
                  </span>{" "}
                  is waiting for guarantor signatures.
                </p>
              </div>
              <button className="w-full bg-secondary text-primary py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-sky-300 transition-colors flex items-center justify-center gap-2">
                Invite Guarantors <ArrowRight size={14} />
              </button>
            </div>

            {/* Vetting Process Card */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-blue-900/5">
              <div className="flex items-center gap-3 mb-6">
                <ShieldCheck className="text-emerald-500" size={20} />
                <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-400">
                  Approval Flow
                </h3>
              </div>
              <div className="space-y-4">
                <ProcessStep step="1" label="Member Vetting" active />
                <ProcessStep step="2" label="Guarantor Verification" active />
                <ProcessStep step="3" label="Credit Committee Review" />
                <ProcessStep step="4" label="Funds Disbursement" />
              </div>
            </div>

            {/* Disclaimers & Info */}
            <div className="bg-blue-50/50 rounded-[32px] p-8 border border-blue-100/100">
              <div className="flex items-center gap-3 mb-6">
                <Gavel className="text-secondary" size={20} />
                <h3 className="font-black text-[11px] uppercase tracking-widest text-slate-400">
                  Legal Info
                </h3>
              </div>
              <ul className="space-y-4">
                <DisclaimerItem text="Disbursement: Approved loans are disbursed to your linked savings account within 24 hours of final approval." />
                <DisclaimerItem text="Processing Fees: A statutory 1% processing fee is deducted from the principal amount upon disbursement." />
                <DisclaimerItem text="Rejected Status: If an application is rejected, you may appeal or re-apply after 30 days of the decision date." />
              </ul>
            </div>

            {/* History Link */}
            <div className="px-8 flex items-center gap-3 opacity-60 hover:opacity-100 cursor-pointer transition-opacity">
              <History size={16} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Archive (2025 & Older)
              </span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

/* --- Sub-Components --- */

const ApplicationRow = ({ app }) => {
  const statusConfig = {
    "Pending Approval": {
      color: "bg-blue-600 text-white",
      icon: <FileSearch />,
      bgLight: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    "Pending Guarantors": {
      color: "bg-amber-500 text-white",
      icon: <Users />,
      bgLight: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    "Pending Disbursement": {
      color: "bg-secondary text-white",
      icon: <Zap />,
      bgLight: "bg-sky-50",
      iconColor: "text-secondary",
    },
    Rejected: {
      color: "bg-red-500 text-white",
      icon: <XCircle />,
      bgLight: "bg-red-50",
      iconColor: "text-red-600",
    },
    Cancelled: {
      color: "bg-slate-400 text-white",
      icon: <Ban />,
      bgLight: "bg-slate-50",
      iconColor: "text-slate-500",
    },
    Default: {
      color: "bg-slate-600 text-white",
      icon: <Hourglass />,
      bgLight: "bg-slate-50",
      iconColor: "text-slate-600",
    },
  };

  const style = statusConfig[app.status] || statusConfig.Default;

  return (
    <div className="group p-6 bg-white border border-slate-200 rounded-[32px] hover:border-secondary/30 hover:shadow-2xl transition-all cursor-pointer">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-4 flex items-center gap-4">
          <div
            className={`w-14 h-14 shrink-0 rounded-[20px] flex items-center justify-center ${style.bgLight}`}
          >
            {React.cloneElement(style.icon, {
              size: 26,
              className: style.iconColor,
            })}
          </div>
          <div className="truncate">
            <h4 className="font-black text-primary text-base leading-tight truncate">
              {app.product}
            </h4>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">
              {app.appCode}
            </p>
          </div>
        </div>
        <div className="md:col-span-3">
          <p className="text-base font-black text-primary">{app.amount}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Requested
          </p>
        </div>
        <div className="md:col-span-2">
          <p className="text-[11px] font-black text-slate-500">{app.date}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Submitted
          </p>
        </div>
        <div className="md:col-span-3 flex md:justify-end">
          <div
            className={`flex items-center gap-2 px-4 py-2 truncate rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-current/10 ${style.color}`}
          >
            {app.status}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProcessStep = ({ step, label, active = false }) => (
  <div className="flex items-center gap-3">
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${active ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"}`}
    >
      {step}
    </div>
    <span
      className={`text-xs font-bold ${active ? "text-primary" : "text-slate-400"}`}
    >
      {label}
    </span>
  </div>
);

const DisclaimerItem = ({ text }) => (
  <li className="flex gap-3 items-start">
    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
    <p className="text-[11px] text-slate-500 leading-normal font-medium">
      {text}
    </p>
  </li>
);

export default LoanApplications;

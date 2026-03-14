import React from "react";
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
} from "lucide-react";

const LoanApplications = () => {
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
    {
      id: "ap-997",
      product: "Emergency Loan",
      appCode: "APP-EMG-110",
      amount: "KES 45,000",
      date: "Feb 20, 2026",
      status: "Pending Approval",
    },
    {
      id: "ap-998",
      product: "Travel Loan",
      appCode: "APP-TRV-229",
      amount: "KES 150,000",
      date: "Feb 15, 2026",
      status: "Rejected",
    },
    {
      id: "ap-999",
      product: "Salary Advance",
      appCode: "APP-SAL-883",
      amount: "KES 60,000",
      date: "Feb 10, 2026",
      status: "Pending Disbursement",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-[#042159] pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header with "New Application" Primary Action */}
        <header className="py-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight">
              Loan Applications
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Track the status of your recent credit requests.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-[#4DB8E4] text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-sky-200 hover:scale-[1.02] transition-all active:scale-95">
            <Plus size={20} /> New Application
          </button>
        </header>

        {/* Search & List */}
        <section className="bg-white rounded-[40px] p-8 shadow-xl shadow-blue-900/5 border border-slate-100">
          <div className="flex gap-4 mb-8">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={18}
              />
              <input
                type="text"
                placeholder="Search applications..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4DB8E4]/20 outline-none text-sm transition-all"
              />
            </div>
            <button className="p-3 border border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50">
              <Filter size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {applications.map((app) => (
              <ApplicationRow key={app.id} app={app} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

/* --- Sub-Component: ApplicationRow --- */

const ApplicationRow = ({ app }) => {
  const statusConfig = {
    "Pending Approval": {
      color: "bg-blue-600 text-white",
      icon: <FileSearch />,
      iconColor: "text-blue-600",
      bgLight: "bg-blue-50",
    },
    "Pending Guarantors": {
      color: "bg-amber-500 text-white",
      icon: <Users />,
      iconColor: "text-amber-600",
      bgLight: "bg-amber-50",
    },
    "Pending Disbursement": {
      color: "bg-[#4DB8E4] text-white",
      icon: <Zap />,
      iconColor: "text-[#4DB8E4]",
      bgLight: "bg-sky-50",
    },
    Rejected: {
      color: "bg-red-500 text-white",
      icon: <XCircle />,
      iconColor: "text-red-600",
      bgLight: "bg-red-50",
    },
    Cancelled: {
      color: "bg-slate-400 text-white",
      icon: <Ban />,
      iconColor: "text-slate-500",
      bgLight: "bg-slate-50",
    },
    Pending: {
      color: "bg-slate-600 text-white",
      icon: <Hourglass />,
      iconColor: "text-slate-600",
      bgLight: "bg-slate-50",
    },
  };

  const style = statusConfig[app.status] || statusConfig["Pending"];

  return (
    <div className="group p-5 bg-white border border-slate-100 rounded-[32px] hover:border-[#4DB8E4]/30 hover:shadow-lg transition-all cursor-pointer">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* 1. App Info (4/12) */}
        <div className="md:col-span-4 flex items-center gap-4">
          <div
            className={`w-14 h-14 shrink-0 rounded-[22px] flex items-center justify-center shadow-inner ${style.bgLight}`}
          >
            {React.cloneElement(style.icon, {
              size: 26,
              className: style.iconColor,
              strokeWidth: 2.5,
            })}
          </div>
          <div>
            <h4 className="font-bold text-[#042159] text-base leading-tight">
              {app.product}
            </h4>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">
              {app.appCode}
            </p>
          </div>
        </div>

        {/* 2. Amount (3/12) */}
        <div className="md:col-span-3">
          <p className="text-base font-black text-[#042159]">{app.amount}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Requested
          </p>
        </div>

        {/* 3. Date (2/12) */}
        <div className="md:col-span-2">
          <p className="text-[11px] font-black text-slate-500">{app.date}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Submitted
          </p>
        </div>

        {/* 4. Status Badge (3/12) - Expanded slightly for longer text */}
        <div className="md:col-span-3 flex md:justify-end pr-4">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-current/10 whitespace-nowrap ${style.color}`}
          >
            {React.cloneElement(style.icon, { size: 14, strokeWidth: 3 })}
            {app.status}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanApplications;

import React from "react";
import {
  Calendar,
  Percent,
  Hash,
  Coins,
  Timer,
  CheckCircle,
  Info,
  ArrowUpRight,
  Smartphone,
  Clock,
  Check,
  Receipt,
  CheckCircle2,
  UserPlus,
  ShieldCheck,
  MessageCircle,
  CreditCard,
  FileStack,
  ClipboardList,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";

const LoanDetails = ({ onBack }) => {
  const loanData = {
    code: "DEV-2024-9902",
    product: "Development Loan",
    balance: "KES 450,000",
    period: "12 Months",
    rateType: "Reducing Balance",
    rate: "12% P.A",
    maturityDate: "Mar 30, 2027",
    repaymentAmount: "KES 42,500",
    status: "Active",
  };

  const schedule = [
    { date: "Oct 30, 2025", amount: "KES 42,500", status: "Paid" },
    { date: "Nov 30, 2025", amount: "KES 42,500", status: "Paid" },
    { date: "Dec 30, 2025", amount: "KES 42,500", status: "Upcoming" },
    { date: "Jan 30, 2026", amount: "KES 42,500", status: "Upcoming" },
    { date: "Feb 28, 2026", amount: "KES 42,500", status: "Upcoming" },
    { date: "Mar 30, 2026", amount: "KES 42,500", status: "Upcoming" },
  ];

  // Expanded Data: 6 Transactions
  const transactions = [
    {
      id: 1,
      type: "M-PESA Repayment",
      date: "Feb 28, 2026",
      amount: "KES 42,500",
      ref: "SCL90231KL",
    },
    {
      id: 2,
      type: "M-PESA Repayment",
      date: "Jan 30, 2026",
      amount: "KES 42,500",
      ref: "SBC4403940",
    },
    {
      id: 3,
      type: "M-PESA Repayment",
      date: "Dec 29, 2025",
      amount: "KES 42,500",
      ref: "SCK11204OP",
    },
    {
      id: 4,
      type: "M-PESA Repayment",
      date: "Nov 30, 2025",
      amount: "KES 42,500",
      ref: "SBA882011M",
    },
    {
      id: 5,
      type: "M-PESA Repayment",
      date: "Oct 30, 2025",
      amount: "KES 42,500",
      ref: "SBH55621QQ",
    },
    {
      id: 6,
      type: "M-PESA Disbursement",
      date: "Oct 15, 2025",
      amount: "KES 500,000",
      ref: "SBE00122ZZ",
    },
  ];

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
    {
      name: "Michael Omondi",
      phone: "0733***112",
      amount: "KES 100,000",
      status: "Accepted",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-[#042159] pb-20">
      <div className="max-w-6xl sm:px-4 mx-auto">
        {/* Header */}
        <header className="py-4">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                {loanData.product}
              </h1>
              <p className="text-slate-400 font-mono text-xs mt-1 uppercase tracking-widest">
                {loanData.code}
              </p>
            </div>
            <div className="bg-[#042159] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em]">
              {loanData.status}
            </div>
          </div>
        </header>

        <section className="mb-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickActionButton
              icon={<CreditCard className="text-emerald-500" />}
              label="Pay Loan"
              sub="Direct M-PESA"
              onClick={() => {}}
              variant="emerald"
            />
            <QuickActionButton
              icon={<FileStack className="text-blue-500" />}
              label="Statements"
              sub="View Ledger"
              onClick={() => {}}
              variant="blue"
            />
            <QuickActionButton
              icon={<ClipboardList className="text-purple-500" />}
              label="Applications"
              sub="Check Status"
              onClick={() => {}}
              variant="purple"
            />
            <QuickActionButton
              icon={<LayoutGrid className="text-slate-500" />}
              label="Other Products"
              sub="Explore More"
              onClick={() => {}}
              variant="slate"
            />
          </div>
        </section>

        {/* 1. Loan Parameters Card (High Density) */}
        <div className="bg-white rounded-[40px] p-6 border border-slate-100 shadow-sm shadow-blue-900/5 mb-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6">
            <ParamItem
              icon={<Hash />}
              label="Loan Code"
              value={loanData.code}
            />
            <ParamItem
              icon={<Coins />}
              label="Outstanding Balance"
              value={loanData.balance}
              isHighlight
            />
            <ParamItem
              icon={<Timer />}
              label="Loan Period"
              value={loanData.period}
            />
            <ParamItem
              icon={<Info />}
              label="Rate Type"
              value={loanData.rateType}
            />
            <ParamItem
              icon={<Percent />}
              label="Interest Rate"
              value={loanData.rate}
            />
            <ParamItem
              icon={<Calendar />}
              label="Maturity Date"
              value={loanData.maturityDate}
            />
            <ParamItem
              icon={<ArrowUpRight />}
              label="Repayment Amount"
              value={loanData.repaymentAmount}
              isHighlight
            />
            <ParamItem
              icon={<CheckCircle />}
              label="Loan Status"
              value={loanData.status}
            />
          </div>
        </div>

        {/* 3. GUARANTORS SECTION (Full Width or 2-Column Grid) */}
        <section className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Guarantors & Securities
            </h3>
            <span className="text-[10px] font-bold text-[#4DB8E4] bg-sky-50 px-3 py-1 rounded-full">
              3 Required • 2 Verified
            </span>
          </div>

          {/* Grid of 2 or 3 to keep them compact */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guarantors.map((g) => (
              <GuarantorCard key={g.id} guarantor={g} />
            ))}
          </div>
        </section>

        {/* 2. Split View: Schedule & Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-3">
          {/* Left Side: Schedule (Stepper) */}
          <div className="md:col-span-5">
            <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
              Repayment Progress
            </h3>
            <div className="space-y-0">
              {schedule.map((step, idx) => (
                <div key={idx} className="flex gap-6 relative pb-12 group">
                  {/* Stepper Line */}
                  {idx !== schedule.length - 1 && (
                    <div
                      className={`absolute left-[15px] top-8 w-[2px] h-full ${step.status === "Paid" ? "bg-emerald-200" : "bg-slate-100"}`}
                    ></div>
                  )}

                  {/* Stepper Icon/Circle */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${
                      step.status === "Paid"
                        ? "bg-emerald-500 text-white scale-110"
                        : "bg-white border-4 border-slate-100 text-slate-300"
                    }`}
                  >
                    {step.status === "Paid" ? (
                      <Check size={16} strokeWidth={3} />
                    ) : (
                      <Clock size={12} />
                    )}
                  </div>

                  <div className="flex flex-col">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${step.status === "Paid" ? "text-emerald-500" : "text-slate-400"}`}
                    >
                      Installment {idx + 1} • {step.status}
                    </span>
                    <p className="text-lg font-bold text-[#042159] mt-0.5">
                      {step.amount}
                    </p>
                    <p className="text-xs font-medium text-slate-400">
                      {step.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Transactions */}
          <div className="md:col-span-7">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-slate-400">
                Transaction Ledger
              </h3>
              <button className="text-[13px] font-black uppercase tracking-widest text-[#4DB8E4] hover:underline flex items-center gap-1">
                Download Statement <Receipt size={14} />
              </button>
            </div>

            <div className="space-y-3">
              {transactions.map((tx) => (
                <MPesaTransactionRow tx={tx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Sub-Component: QuickActionButton --- */
const QuickActionButton = ({ icon, label, sub, onClick, variant }) => {
  const themes = {
    emerald: "hover:border-emerald-200 hover:bg-emerald-50/30",
    blue: "hover:border-blue-200 hover:bg-blue-50/30",
    purple: "hover:border-purple-200 hover:bg-purple-50/30",
    slate: "hover:border-slate-200 hover:bg-slate-50/30",
  };

  return (
    <button
      onClick={onClick}
      className={`group p-5 bg-white border border-slate-100 rounded-[32px] shadow-sm transition-all duration-300 flex flex-col items-start text-left relative overflow-hidden ${themes[variant]}`}
    >
      <div className="w-12 h-12 rounded-[20px] bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        {React.cloneElement(icon, { size: 24 })}
      </div>

      <div>
        <h4 className="font-bold text-[#042159] text-sm group-hover:text-[#4DB8E4] transition-colors">
          {label}
        </h4>
        <p className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-wider">
          {sub}
        </p>
      </div>

      <ChevronRight
        className="absolute right-6 bottom-6 text-slate-200 group-hover:text-[#4DB8E4] group-hover:translate-x-1 transition-all"
        size={16}
      />
    </button>
  );
};

const MPesaTransactionRow = ({ tx }) => {
  const isDisbursement = tx.type.includes("Disbursement");

  return (
    <div className="group p-5 bg-white border border-slate-200 rounded-[28px] hover:border-[#3EB344]/30 transition-all flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* M-PESA Branded Icon Container */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
            isDisbursement
              ? "bg-blue-50 text-[#042159]"
              : "bg-[#3EB344]/10 text-[#3EB344]"
          }`}
        >
          <Smartphone size={22} strokeWidth={2.5} />
        </div>

        <div>
          <h4 className="text-sm font-bold text-[#042159] tracking-tight">
            {tx.type}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
              {tx.ref}
            </span>
            <span className="text-[10px] text-slate-300">•</span>
            <span className="text-[10px] text-slate-400 font-medium">
              {tx.date}
            </span>
          </div>
        </div>
      </div>

      <div className="text-right">
        {/* Color polarity: Blue for money in, Green for repayments */}
        <p
          className={`text-sm font-black ${isDisbursement ? "text-[#042159]" : "text-[#3EB344]"}`}
        >
          {isDisbursement ? "+" : "-"}
          {tx.amount}
        </p>
        <div className="flex items-center justify-end gap-1 mt-0.5">
          <span className="text-[9px] font-black uppercase text-slate-300 tracking-tighter">
            Verified
          </span>
          <CheckCircle2 size={10} className="text-[#3EB344]" />
        </div>
      </div>
    </div>
  );
};

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
          <p className="text-sm font-black text-[#042159]">
            {guarantor.amount}
          </p>
        </div>
      </div>

      <div>
        <h4 className="font-bold text-[#042159] text-sm truncate">
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
          <button className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#4DB8E4] hover:text-[#042159] transition-colors">
            <MessageCircle size={12} />
            Nudge via SMS
          </button>
        )}
      </div>
    </div>
  );
};

/* --- Sub-Component: ParamItem --- */
const ParamItem = ({ icon, label, value, isHighlight }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-slate-300">
      {React.cloneElement(icon, { size: 14 })}
      <span className="text-[9px] font-black uppercase tracking-widest">
        {label}
      </span>
    </div>
    <p
      className={`text-base font-bold ${isHighlight ? "text-[#4DB8E4] font-black text-lg" : "text-[#042159]"}`}
    >
      {value}
    </p>
  </div>
);

export default LoanDetails;

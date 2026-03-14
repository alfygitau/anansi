import React, { useState, useEffect } from "react";
import {
  Info,
  User,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ArrowRight,
  Wallet2,
  ReceiptText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ApplyLoan = () => {
  const navigate = useNavigate();
  // Mock Data
  const member = { name: "Jane Doe", mobile: "+254 712 345 678" };
  const product = { name: "Development Loan", limit: 450000, rate: 0.12 }; // 12% P.A

  // Form State
  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState(12);
  const [interval, setInterval] = useState("Monthly");
  const [repayment, setRepayment] = useState(0);
  const [error, setError] = useState("");

  // Calculation Logic (Simplified Reducing Balance or Straight Line)
  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    if (numAmount > product.limit) {
      setError(
        `Amount exceeds your limit of KES ${product.limit.toLocaleString()}`,
      );
    } else {
      setError("");
    }

    // Simple Calculation: (Principal + (Principal * Rate)) / Duration
    const totalInterest = numAmount * product.rate;
    const totalPayable = numAmount + totalInterest;
    setRepayment(numAmount > 0 ? totalPayable / duration : 0);
  }, [amount, duration, product.limit, product.rate]);

  return (
    <div className="min-h-screen bg-slate-50 text-[#042159] pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <header className="py-10">
          <h1 className="text-3xl font-black tracking-tight">
            Loan Application
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
            Adjust your requested amount and repayment structure to fit your
            cash flow. Please note that your maximum limit is determined by your
            current shares and deposit multiplier. Ensure your selection allows
            for a comfortable debt-to-income ratio before proceeding to the
            guarantor stage.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form (7/12) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Member & Product Info Card */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    Member
                  </p>
                  <p className="text-sm font-bold">{member.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center text-[#4DB8E4]">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    Product
                  </p>
                  <p className="text-sm font-bold">{product.name}</p>
                </div>
              </div>
            </div>

            {/* Main Form Card */}
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-xl shadow-blue-900/5">
              {/* Loan Amount Input */}
              <div className="mb-8">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">
                  Loan Amount
                </label>
                <div
                  className={`relative flex items-center transition-all ${error ? "ring-2 ring-red-100 rounded-2xl" : ""}`}
                >
                  <span className="absolute left-5 font-black text-slate-300">
                    KES
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-slate-50 border-none rounded-[24px] focus:ring-2 focus:ring-[#4DB8E4]/20 outline-none text-xl font-black text-[#042159]"
                  />
                </div>
                {/* Limit Disclaimer / Error */}
                <div className="mt-3 px-2 flex items-center gap-2">
                  {error ? (
                    <AlertCircle size={14} className="text-red-500" />
                  ) : (
                    <Info size={14} className="text-[#4DB8E4]" />
                  )}
                  <p
                    className={`text-[10px] font-bold uppercase tracking-tight ${error ? "text-red-500" : "text-slate-400"}`}
                  >
                    {error ||
                      `Your maximum limit for this loan is KES ${product.limit.toLocaleString()}. Enter an amount between 0 and the limit`}
                  </p>
                </div>
              </div>

              {/* Duration & Interval Grid */}
              <div className="flex flex-col gap-8">
                {/* Duration Selection */}
                <div className="relative">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">
                    Duration (Months)
                  </label>
                  <div className="relative group">
                    <select
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      className="w-full px-6 py-5 bg-slate-50 border-none rounded-[24px] 
                   focus:ring-2 focus:ring-[#4DB8E4]/20 outline-none 
                   font-bold text-[#042159] appearance-none cursor-pointer 
                   transition-all hover:bg-slate-100"
                    >
                      {[6, 12, 18, 24, 36].map((m) => (
                        <option key={m} value={m}>
                          {m} Months
                        </option>
                      ))}
                    </select>

                    {/* Custom Chevron Icon */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#4DB8E4] group-hover:text-[#042159] transition-colors">
                      <ChevronDown size={20} strokeWidth={3} />
                    </div>
                  </div>
                </div>

                {/* Repayment Interval Selection */}
                <div className="relative">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">
                    Repayment Interval
                  </label>
                  <div className="relative group">
                    <select
                      value={interval}
                      onChange={(e) => setInterval(e.target.value)}
                      className="w-full px-6 py-5 bg-slate-50 border-none rounded-[24px] 
                   focus:ring-2 focus:ring-[#4DB8E4]/20 outline-none 
                   font-bold text-[#042159] appearance-none cursor-pointer 
                   transition-all hover:bg-slate-100"
                    >
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                    </select>

                    {/* Custom Chevron Icon */}
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#4DB8E4] group-hover:text-[#042159] transition-colors">
                      <ChevronDown size={20} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Calculation Summary (5/12) */}
          <div className="lg:col-span-5">
            <div className="sticky top-10 bg-[#042159] rounded-[40px] p-2 text-white shadow-[0_32px_64px_-16px_rgba(4,33,89,0.3)]">
              {/* Inner Container to allow for the 'Pilling' effect */}
              <div className="p-8">
                <div className="flex items-center gap-2 mb-10">
                  <ReceiptText size={16} className="text-[#4DB8E4]" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4DB8E4]">
                    Repayment Summary
                  </h3>
                </div>

                {/* Main Payment Display - "The Hero Figure" */}
                <div className="bg-white/5 backdrop-blur-md rounded-[32px] p-6 border border-white/10 mb-8">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">
                    Expected {interval} Payment
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-bold text-[#4DB8E4]">
                      KES
                    </span>
                    <h2 className="text-4xl font-black tracking-tighter">
                      {repayment.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </h2>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-tight">
                      Inclusive of 12% P.A reducing balance
                    </p>
                  </div>
                </div>

                {/* Detailed Parameters */}
                <div className="space-y-5 px-2">
                  <SummaryRow
                    label="Loan Type"
                    value="Development"
                    icon={<Wallet2 size={12} />}
                  />
                  <SummaryRow
                    label="Total Duration"
                    value={`${duration} Months`}
                  />
                  <SummaryRow label="Payment Mode" value={interval} />

                  {/* Total Payable (Optional but recommended for transparency) */}
                  <div className="pt-2 border-t border-white/5 mt-5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                        Est. Total Payable
                      </span>
                      <span className="text-xs font-bold text-white/60">
                        KES {(repayment * duration).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate("/add-guarantor")}
                  disabled={!!error || !amount}
                  className="w-full mt-10 bg-[#4DB8E4] text-[#042159] py-5 text-[14px] rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-[#4DB8E4]/20 hover:bg-white hover:text-[#042159] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-20 disabled:grayscale"
                >
                  Proceed to Guarantors
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Sub-Components --- */
const SummaryRow = ({ label, value, icon }) => (
  <div className="flex justify-between items-center group">
    <div className="flex items-center gap-2">
      {icon && <span className="text-white/20">{icon}</span>}
      <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.15em]">
        {label}
      </span>
    </div>
    <span className="text-xs font-bold text-white tracking-wide">{value}</span>
  </div>
);

export default ApplyLoan;

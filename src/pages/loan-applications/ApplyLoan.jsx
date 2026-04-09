import React, { useState, useEffect } from "react";
import {
  Info,
  User,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ArrowRight,
  ReceiptText,
  ShieldCheck,
  TrendingDown,
  Clock,
  Sparkles,
  Lock,
  Percent,
  Lightbulb,
  Landmark,
  History,
  LayoutGrid,
  Download,
  Calendar,
  X,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const ApplyLoan = () => {
  const navigate = useNavigate();
  const [showSchedule, setShowSchedule] = useState(false);
  const interestType = "Reducing Balance";
  const member = {
    name: "Jane Doe",
    mobile: "+254 712 345 678",
    rank: "Gold Member",
    shares: 150000,
    deposits: 120000,
  };
  const product = { name: "Development Loan", limit: 450000, rate: 0.12 };

  const [amount, setAmount] = useState("");
  const [duration, setDuration] = useState(12);
  const [interval, setInterval] = useState("Monthly");
  const [repayment, setRepayment] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const numAmount = parseFloat(amount) || 0;
    if (numAmount > product.limit) {
      setError(
        `Above pre-qualified limit of KES ${product.limit.toLocaleString()}`,
      );
    } else {
      setError("");
    }
    const totalInterest = numAmount * product.rate;
    const totalPayable = numAmount + totalInterest;
    setRepayment(numAmount > 0 ? totalPayable / duration : 0);
  }, [amount, duration, product.limit, product.rate]);

  const generateSchedule = () => {
    const p = parseFloat(amount) || 0;
    const r = product.rate / 12;
    const n = duration;
    let schedule = [];
    let remainingBalance = p;

    for (let i = 1; i <= n; i++) {
      let interestPost, principalPost, monthlyPayment;

      if (interestType === "Reducing Balance") {
        monthlyPayment =
          (p * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
        interestPost = remainingBalance * r;
        principalPost = monthlyPayment - interestPost;
      } else {
        interestPost = (p * product.rate) / n;
        principalPost = p / n;
        monthlyPayment = interestPost + principalPost;
      }
      remainingBalance -= principalPost;
      schedule.push({
        month: i,
        payment: monthlyPayment,
        principal: principalPost,
        interest: interestPost,
        balance: Math.max(0, remainingBalance),
      });
    }
    return schedule;
  };
  const scheduleData = generateSchedule();

  return (
    <>
      {/* AMORTIZATION MODAL OVERLAY */}
      <AnimatePresence>
        {showSchedule && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSchedule(false)}
              className="absolute inset-0 bg-slate-900/60 bg-slate-900/40"
            />

            {/* Modal Content - Optimized max-w-xl */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="text-blue-600" size={18} />
                    <h3 className="text-lg font-bold text-slate-900">
                      Repayment Schedule
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Breakdown for{" "}
                    <span className="text-slate-900 font-bold">
                      KES {parseFloat(amount || 0).toLocaleString()}
                    </span>{" "}
                    • {duration} months
                  </p>
                </div>
                <button
                  onClick={() => setShowSchedule(false)}
                  className="size-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Column Headers - Grid-cols-5 */}
              <div className="grid grid-cols-5 gap-1 px-6 py-3 bg-white border-b border-slate-50">
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                  Month
                </span>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 text-right">
                  Installment
                </span>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 text-right">
                  Principal
                </span>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 text-right">
                  Interest
                </span>
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 text-right">
                  Balance
                </span>
              </div>

              {/* Scrollable Body */}
              <div className="p-3 sm:p-5 overflow-y-auto custom-scrollbar bg-white">
                <div className="space-y-1">
                  {scheduleData.map((row) => (
                    <div
                      key={row.month}
                      className="grid grid-cols-5 gap-1 p-2.5 rounded-xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all group"
                    >
                      <div className="flex items-center">
                        <span className="size-5 rounded-md bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {row.month}
                        </span>
                      </div>

                      {/* Total Installment Column */}
                      <div className="text-right flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-blue-600">
                          <span className="text-[7px] opacity-40 mr-0.5 uppercase">
                            KES
                          </span>
                          {row.payment.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>

                      <div className="text-right flex flex-col justify-center">
                        <span className="text-[10px] font-medium text-slate-700">
                          <span className="text-[7px] opacity-40 mr-0.5 uppercase">
                            KES
                          </span>
                          {row.principal.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>

                      <div className="text-right flex flex-col justify-center">
                        <span className="text-[10px] font-medium text-emerald-600">
                          <span className="text-[7px] opacity-40 mr-0.5 uppercase">
                            KES
                          </span>
                          {row.interest.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>

                      <div className="text-right flex flex-col justify-center">
                        <span className="text-[10px] font-black text-slate-900">
                          <span className="text-[7px] opacity-40 mr-0.5 uppercase">
                            KES
                          </span>
                          {row.balance.toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      Total Interest
                    </p>
                    <p className="text-xs font-bold text-slate-900">
                      KES{" "}
                      {(
                        parseFloat(amount || 0) * product.rate
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="w-[1px] h-6 bg-slate-200 hidden sm:block" />
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      Method
                    </p>
                    <p className="text-xs font-bold text-blue-600 lowercase first-letter:uppercase">
                      {interestType}
                    </p>
                  </div>
                  <div className="w-[1px] h-6 bg-slate-200 hidden sm:block" />
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      Total Repayment Amount
                    </p>
                    <p className="text-xs font-bold text-blue-600 lowercase first-letter:uppercase">
                      KES {(repayment * duration).toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
                  onClick={() => window.print()}
                >
                  <Download size={14} />
                  PDF Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-24 font-sans">
        <div className="max-w-6xl mx-auto">
          {/* --- PREMIUM HEADER --- */}
          <header className="flex flex-col md:flex-row md:items-center mb-8 justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                <Sparkles size={12} fill="currentColor" />
                Priority Processing Active
              </div>
              <h1 className="text-3xl md:text-3xl font-bold tracking-tight text-slate-900">
                Configure <span className="text-blue-600">Your Loan</span>
              </h1>
              <p className="text-slate-500 font-medium">
                Your borrowing capacity is not static and can be strategically
                enhanced through a few key financial actions. By making a Direct
                Deposit Top-up (lump-sum contribution) to your non-withdrawable
                shares, you instantly trigger a higher qualified limit via the
                3× multiplier. Furthermore, securing Strong Guarantors—members
                with significant uncommitted deposits—ensures that the Sacco’s
                risk assessment supports the full disbursement of your qualified
                amount. Finally, utilizing Loan Buy-offs to consolidate
                high-interest external debt into your Sacco portfolio improves
                your net "Ability to Pay" (ATP), effectively unlocking the
                maximum percentage of your qualified limit by freeing up your
                debt-to-income ratio.
              </p>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* --- LEFT COLUMN: CONFIGURATION --- */}
            <div className="lg:col-span-7 space-y-8">
              {/* 1. APPLICANT CONTEXT */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-4">
                  <div className="size-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Applicant
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      {member.name}
                    </p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm flex items-center gap-4 hover:border-emerald-100 transition-all duration-300">
                  {/* Icon Container */}
                  <div className="size-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-100/50 shrink-0">
                    <LayoutGrid size={20} />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">
                        Loan Product
                      </p>
                      <span className="text-[8px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-tighter">
                        Verified
                      </span>
                    </div>

                    <p className="text-sm font-bold text-slate-900 leading-tight truncate">
                      Development Loan
                    </p>

                    <div className="flex items-center gap-1.5 mt-1">
                      <Percent size={10} className="text-emerald-500" />
                      <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-tight">
                        12% p.a{" "}
                        <span className="text-[8px] opacity-60 ml-0.5">
                          Reducing Balance
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. MAIN CONFIGURATOR */}
              <div className="bg-white rounded-[40px] p-6 border border-slate-100 shadow-2xl shadow-slate-200/50 relative">
                <div className="mb-12">
                  <div className="flex justify-between items-end mb-4">
                    <label className="text-xs font-bold uppercase tracking-[0.15em] text-slate-400">
                      Requested Principal
                    </label>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                      Max Qualified: KES {product.limit.toLocaleString()}
                    </span>
                  </div>

                  <div className="relative group transition-all duration-300">
                    <span className="absolute left-7 top-1/2 -translate-y-1/2 font-bold text-slate-300 text-xl">
                      KES
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className={`w-full pl-20 pr-8 py-3 bg-slate-50 border-2 rounded-[32px] text-3xl font-bold transition-all outline-none 
                      ${error ? "border-red-100 text-red-600 bg-red-50/30" : "border-transparent focus:border-blue-100 focus:bg-white text-slate-900"}`}
                    />
                    {error && (
                      <div className="absolute -bottom-6 left-6 flex items-center gap-2 text-red-500">
                        <AlertCircle size={14} />
                        <p className="text-[10px] font-bold uppercase">
                          {error}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock size={16} />
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Tenure
                      </label>
                    </div>
                    <div className="relative group">
                      <select
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        className="w-full px-6 py-5 bg-slate-50 border-none rounded-[24px] font-bold text-slate-900 appearance-none cursor-pointer"
                      >
                        {[6, 12, 18, 24, 36].map((m) => (
                          <option key={m} value={m}>
                            {m} Months
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none">
                        <ChevronDown size={20} strokeWidth={3} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <TrendingDown size={16} />
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Frequency
                      </label>
                    </div>
                    <div className="relative group">
                      <select
                        value={interval}
                        onChange={(e) => setInterval(e.target.value)}
                        className="w-full px-6 py-5 bg-slate-50 border-none rounded-[24px] font-bold text-slate-900 appearance-none cursor-pointer focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                      >
                        {["Weekly", "Monthly", "Quarterly"].map((i) => (
                          <option key={i} value={i}>
                            {i} Payments
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none group-hover:text-blue-700 transition-colors">
                        <ChevronDown size={20} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. LIMIT OPTIMIZATION (THE "WHY") */}
              <div className="bg-blue-600 rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-200">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <TrendingDown size={120} />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
                      <Lightbulb size={20} className="text-amber-300" />
                    </div>
                    <h3 className="font-bold text-lg tracking-tight">
                      How to increase your limit?
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-2 mb-2 text-blue-200">
                        <Landmark size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          Increase Deposits
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-blue-50/80">
                        Every KES 1 saved increases your limit by KES 3
                        instantly.
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-2 mb-2 text-blue-200">
                        <History size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          Loyalty Points
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-blue-50/80">
                        Maintain Gold status for 12 months to unlock a 4×
                        multiplier.
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-2 mb-2 text-blue-200">
                        <ShieldCheck size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          Clear Arrears
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-blue-50/80">
                        Ensuring zero outstanding penalties boosts your internal
                        credit score.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. DISCLOSURE SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-100 rounded-[32px] border border-slate-200 flex gap-4">
                  <Info className="text-slate-500 shrink-0" size={20} />
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-900 mb-1">
                      Affordability Rule
                    </h4>
                    <p className="text-[11px] leading-relaxed text-slate-500">
                      Monthly deductions cannot exceed 2/3 of your basic salary
                      per Sacco regulations.
                    </p>
                  </div>
                </div>
                <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-[32px] flex gap-4">
                  <CheckCircle2
                    className="text-emerald-500 shrink-0"
                    size={20}
                  />
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-emerald-900 mb-1">
                      Self-Guaranteed
                    </h4>
                    <p className="text-[11px] leading-relaxed text-emerald-600">
                      Your current deposits (KES{" "}
                      {member.deposits.toLocaleString()}) cover up to 25% of
                      this request.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* --- RIGHT COLUMN: THE SUMMARY --- */}
            <div className="lg:col-span-5">
              <div className="bg-[#0F172A] rounded-[48px] p-2 text-white shadow-2xl">
                <div className="p-10 relative">
                  <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        <ReceiptText size={16} className="text-blue-400" />
                      </div>
                      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400">
                        {showSchedule ? "Amortization Table" : "Projection"}
                      </h3>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowSchedule(!showSchedule);
                        }}
                        className="p-2 hover:bg-white/10 bg-white/10 rounded-lg transition-colors text-white/60 hover:text-blue-400"
                        title="View Schedule"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        className="p-2 bg-blue-500 hover:bg-blue-400 rounded-lg transition-all shadow-lg shadow-blue-500/20 text-white"
                        onClick={() => alert("Generating PDF Schedule...")}
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Hero Calculation */}
                  <div className="mb-10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">
                      Installment ({interval})
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl font-bold text-blue-400">
                        KES
                      </span>
                      <h2 className="text-6xl font-bold tracking-tighter">
                        {repayment.toLocaleString(undefined, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </h2>
                      <span className="text-2xl font-medium text-white/20">
                        .{(repayment % 1).toFixed(2).split(".")[1]}
                      </span>
                    </div>
                  </div>

                  {/* Breakdown Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-10">
                    <div className="p-5 rounded-[28px] bg-white/5 border border-white/5">
                      <p className="text-[9px] font-bold text-white/30 uppercase mb-1">
                        Annual Rate
                      </p>
                      <p className="text-lg font-bold">
                        12.0
                        <span className="text-blue-400 text-xs ml-0.5">%</span>
                      </p>
                    </div>
                    <div className="p-5 rounded-[28px] bg-white/5 border border-white/5">
                      <p className="text-[9px] font-bold text-white/30 uppercase mb-1">
                        Total Interest
                      </p>
                      <p className="text-lg font-bold">
                        <span className="text-xs text-white/30 mr-1">KES</span>
                        {(
                          parseFloat(amount || 0) * product.rate
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Detail List */}
                  <div className="space-y-4 mb-10 px-2">
                    <div className="flex justify-between text-[11px] font-medium border-b border-white/5 pb-3">
                      <span className="text-white/40 uppercase tracking-widest">
                        Processing Fee
                      </span>
                      <span className="text-white">KES 1,500.00</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-medium border-b border-white/5 pb-3">
                      <span className="text-white/40 uppercase tracking-widest">
                        Excise Duty
                      </span>
                      <span className="text-white">KES 300.00</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-medium pt-2">
                      <span className="text-blue-400 font-bold uppercase tracking-widest">
                        Total Payable
                      </span>
                      <span className="text-white font-bold">
                        KES {(repayment * duration).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate("/add-guarantor")}
                    disabled={!!error || !amount}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-[32px] font-bold shadow-xl shadow-blue-900/40 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                  >
                    Confirm & Add Guarantors
                    <ArrowRight size={20} />
                  </button>

                  <div className="mt-8 flex justify-center gap-4 opacity-40">
                    <div className="flex items-center gap-1.5">
                      <Lock size={10} />
                      <span className="text-[8px] font-bold uppercase tracking-widest">
                        AES-256
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck size={10} />
                      <span className="text-[8px] font-bold uppercase tracking-widest">
                        GDPR Compliant
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-4 mt-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Security Status
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    End-to-End Encrypted
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ApplyLoan;

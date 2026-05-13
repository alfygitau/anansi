import { useState } from "react";
import {
  ArrowRight,
  Lock,
  ExternalLink,
  Scale,
  ShieldCheck,
  Info,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PremiumSlider from "../../shared/slider/Slider";

const ApplyLoan = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(50000);
  const [tenure, setTenure] = useState(48);
  const [frequency, setFrequency] = useState("Monthly");

  // Constants for Anansi Financial Logic
  const annualRate = 0.144; // 14.4%
  const processingFeeRate = 0.015; // 1.5%
  const insurancePremium = 1200;

  // Financial Calculations
  const calculateInstallment = () => {
    const p = amount || 0;
    const r = annualRate / 12;
    const n = tenure;
    if (p === 0 || n === 0) return 0;
    return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  const installment = calculateInstallment();
  const totalRepayable = installment * tenure;
  const totalInterest = totalRepayable - amount;

  return (
    <div className="w-full text-primary">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Configuration (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <header className="space-y-4">
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                Loan Configuration
              </h1>
              <div className="space-y-4">
                <p className="text-slate-500 leading-relaxed text-sm">
                  Configure your facility by adjusting the principal and
                  preferred repayment window. Your interest is calculated using
                  the{" "}
                  <span className="text-slate-900 font-semibold">
                    Reducing Balance Method
                  </span>
                  , meaning you only pay interest on the remaining principal
                  each month, not the original loan amount.
                </p>
                <p className="text-slate-400 leading-relaxed text-xs">
                  This approach ensures that as you pay down your debt, your
                  interest burden decreases accordingly. Final approval and
                  exact disbursement values are subject to a standard credit
                  assessment and verification of your current monthly net
                  income.
                </p>
              </div>
            </header>

            <div className="space-y-10">
              {/* Principal Amount Input */}
              <div className="group">
                <div className="flex justify-between items-end mb-4">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Desired Principal (KES)
                  </label>
                  <span className="text-xs font-bold text-slate-300">
                    Max: 2.5M
                  </span>
                </div>
                <div className="group relative flex items-center">
                  {/* Prefix Container */}
                  <div className="absolute left-0 h-full flex items-center px-5 pointer-events-none">
                    <span className="text-lg font-bold text-slate-400 tracking-tight">
                      KES
                    </span>
                    {/* Vertical Separator */}
                    <div className="ml-4 h-6 w-[1.5px] bg-slate-200 group-focus-within:bg-primary/30 transition-colors" />
                  </div>

                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl h-16 pl-24 pr-6 text-xl font-medium text-slate-900 focus:bg-white focus:border-primary focus:ring-0 transition-all outline-none placeholder:text-slate-200"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Tenure Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Repayment Tenure
                  </label>
                  <div className="text-right">
                    <span className="text-xl font-black text-primary leading-none">
                      {tenure}
                    </span>
                    <span className="text-xs font-bold text-slate-400 ml-1 uppercase">
                      Months
                    </span>
                  </div>
                </div>
                <PremiumSlider
                  min={1}
                  max={48}
                  initialValue={6}
                  value={tenure}
                  onChange={setTenure}
                />
              </div>

              {/* Frequency Selection */}
              <div className="space-y-4">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Payment Frequency
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {["Weekly", "Monthly", "Quarterly"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setFrequency(opt)}
                      className={`h-14 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all border-2 ${
                        frequency === opt
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-slate-100 text-slate-400 hover:border-slate-200"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Regulatory Footer */}
            <footer className="pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <Scale size={18} className="text-primary shrink-0" />
                <p className="text-[11px] text-slate-500 leading-normal">
                  <span className="font-bold text-slate-800">Compliance:</span>{" "}
                  All facilities are regulated under the Sacco Societies Act.
                </p>
              </div>
              <div className="flex gap-4">
                <ShieldCheck size={18} className="text-primary shrink-0" />
                <p className="text-[11px] text-slate-500 leading-normal">
                  <span className="font-bold text-slate-800">Security:</span>{" "}
                  256-bit SSL encryption protects your financial data.
                </p>
              </div>
            </footer>
          </div>

          {/* Right Column: Financial Summary (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-12 bg-slate-50 border border-slate-200 rounded-[32px] p-4 space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">Financial Summary</h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Verified Amortization Schedule
                  </p>
                </div>
                <ExternalLink
                  size={18}
                  className="text-slate-300 cursor-pointer hover:text-primary"
                />
              </div>

              {/* Installment Highlight */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">
                  Monthly Installment
                </p>
                <h4 className="text-4xl font-black text-slate-900 tracking-tighter">
                  <span className="text-lg font-medium mr-1">KES</span>
                  {installment.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </h4>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-4 px-2">
                <SummaryRow
                  label="Principal Amount"
                  value={`KES ${amount.toLocaleString()}`}
                />
                <SummaryRow
                  label="Est. Total Interest"
                  value={`KES ${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                />
                <SummaryRow
                  label="Processing Fee (1.5%)"
                  value={`KES ${(amount * processingFeeRate).toLocaleString()}`}
                />
                <SummaryRow label="Insurance & Duty" value="KES 1,400" />
                <div className="pt-4 mt-4 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-900">
                    Total Repayable
                  </span>
                  <span className="text-sm font-black text-primary">
                    KES{" "}
                    {totalRepayable.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
              </div>

              {/* Payment Health Indicator */}
              <div className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center gap-4">
                {/* Add 'shrink-0' to lock the dimensions */}
                <div className="w-10 h-10 shrink-0 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Info size={20} />
                </div>
                <div className="text-[10px] leading-relaxed text-slate-500">
                  <span className="font-bold text-slate-800">
                    Anansi Insight:
                  </span>{" "}
                  Keeping your tenure under 24 months reduces total interest
                  costs by <span className="text-primary font-bold">12%</span>.
                </div>
              </div>

              {/* Primary Action */}
              <button
                onClick={() => navigate("/add-guarantor")}
                className="w-full h-16 bg-[#1A1C1E] hover:bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-slate-200 group"
              >
                Continue to Add Guarantors
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <div className="flex items-center justify-center gap-2 opacity-30">
                <Lock size={12} />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  End-to-End Encrypted
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * HELPER: SUMMARY ROW
 */
const SummaryRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-xs font-medium">
    <span className="text-slate-400">{label}</span>
    <span className="text-slate-700 font-bold">{value}</span>
  </div>
);

export default ApplyLoan;

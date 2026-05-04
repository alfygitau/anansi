import { useState } from "react";
import {
  HelpCircle,
  ArrowRight,
  Lock,
  ExternalLink,
  Scale,
  ShieldCheck,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ApplyLoan = () => {
  const [amount, setAmount] = useState("50000");
  const [tenure, setTenure] = useState(12);
  const [frequency, setFrequency] = useState("Monthly");
  const navigate = useNavigate();

  // Calculations
  const annualRate = 0.144;
  const monthlyRate = annualRate / 12;
  const calculatePMT = () => {
    const p = parseFloat(amount) || 0;
    const n = tenure;
    const i = monthlyRate;
    return p > 0 ? (p * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1) : 0;
  };

  const installment = calculatePMT();
  const totalRepayable = installment * tenure;

  return (
    <div className="min-h-screen text-[#1A1C1E] font-sans antialiased">
      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* --- LEFT: CONFIGURATION --- */}
          <div className="space-y-12">
            <section className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">
                Loan Configuration
              </h2>
              <p className="text-slate-500 leading-relaxed max-w-md">
                Please specify the amount and duration for your facility. Your
                interest rate is locked at{" "}
                <span className="text-black font-semibold">
                  14.4% per annum
                </span>{" "}
                on a reducing balance basis.
              </p>
            </section>

            {/* Input Groups */}
            <div className="space-y-10">
              {/* Amount Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                    Principal Amount (KES)
                  </label>
                  <span className="text-[11px] font-bold text-slate-400">
                    Limit: 2,500,000
                  </span>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    KES
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-[50px] pl-14 pr-4 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all outline-none font-semibold text-lg"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Tenure Selection */}
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <label className="text-[11px] font-[900] uppercase tracking-[0.15em] text-slate-400">
                      Repayment Period
                    </label>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Monthly increments up to 4 years
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-blue-600">
                      {tenure}
                    </span>
                    <span className="text-xs font-bold text-slate-400 ml-1 uppercase">
                      Months
                    </span>
                  </div>
                </div>

                <div className="relative pt-2">
                  <input
                    type="range"
                    min="1"
                    max="48"
                    step="1" // Changed from 6 to 1 for monthly sliding
                    value={tenure}
                    onChange={(e) => setTenure(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
                  />

                  {/* Dynamic Progress Track (Optional Visual Polish) */}
                  <div className="flex justify-between mt-4 px-1">
                    {[1, 12, 24, 36, 48].map((marker) => (
                      <div
                        key={marker}
                        className="flex flex-col items-center gap-1"
                      >
                        <div
                          className={`h-1 w-px ${tenure >= marker ? "bg-blue-600" : "bg-slate-200"}`}
                        />
                        <span
                          className={`text-[9px] font-black tracking-tighter uppercase transition-colors ${tenure >= marker ? "text-blue-600" : "text-slate-300"}`}
                        >
                          {marker === 1
                            ? "1 Mo"
                            : marker === 48
                              ? "48 Mo"
                              : marker}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disclosure for granular selection */}
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50 flex gap-3">
                  <Info size={14} className="text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] leading-relaxed text-blue-800 font-medium">
                    Selecting a custom tenure affects the reducing balance
                    interest calculation. Total interest for{" "}
                    <span className="font-bold">{tenure} months</span> is
                    amortized across each installment.
                  </p>
                </div>
              </div>

              {/* Frequency Selection */}
              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                  Payment Frequency
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["Weekly", "Monthly", "Quarterly"].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setFrequency(opt)}
                      className={`h-[50px] rounded-lg font-bold text-xs uppercase tracking-widest transition-all border ${frequency === opt ? "border-blue-600 bg-blue-50/20 text-blue-600" : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Regulatory Disclaimers */}
            <div className="pt-8 border-t border-slate-100 space-y-6">
              <div className="flex gap-4">
                <Scale size={20} className="text-slate-400 shrink-0" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  <span className="font-bold text-slate-800">
                    Legal Compliance:
                  </span>{" "}
                  All loans are subject to the Credit Policy and Section 44 of
                  the Sacco Societies Act. Default on payments may lead to
                  negative listing with the Credit Reference Bureau (CRB).
                </p>
              </div>
              <div className="flex gap-4">
                <ShieldCheck size={20} className="text-slate-400 shrink-0" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  <span className="font-bold text-slate-800">Insurance:</span> A
                  mandatory Loan Guard insurance premium of 0.75% p.a is
                  included in your total repayable amount to cover against death
                  or permanent disability.
                </p>
              </div>
            </div>
          </div>

          {/* --- RIGHT: BREAKDOWN (No colored container) --- */}
          <div className="lg:pl-12">
            <div className="border border-slate-200 rounded-2xl p-6 space-y-12">
              <header className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold">Financial Summary</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Estimates based on current interest rates
                  </p>
                </div>
                <button className="text-blue-600 text-xs font-bold uppercase tracking-widest flex items-center gap-1 hover:underline">
                  Download PDF <ExternalLink size={12} />
                </button>
              </header>

              {/* Main Numbers */}
              <div className="space-y-10">
                <div className="flex justify-between items-end pb-8 border-b border-slate-50">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Monthly Installment
                    </p>
                    <p className="text-xl font-bold tracking-tight">
                      <span className="text-xl mr-2 font-medium tracking-normal">
                        KES
                      </span>
                      {installment.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Total Repayable
                    </p>
                    <p className="text-xl font-bold">
                      KES{" "}
                      {totalRepayable.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>

                {/* Technical Breakdown */}
                <div className="space-y-4">
                  <BreakdownRow
                    label="Principal Amount"
                    value={`KES ${Number(amount).toLocaleString()}`}
                  />
                  <BreakdownRow
                    label="Total Interest (Reducing Balance)"
                    value={`KES ${(totalRepayable - amount).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                  />
                  <BreakdownRow
                    label="Processing Fees (1.5%)"
                    value={`KES ${(amount * 0.015).toLocaleString()}`}
                  />
                  <BreakdownRow
                    label="Life Insurance Premium"
                    value="KES 1,200.00"
                  />
                  <BreakdownRow label="Excise Duty" value="KES 200.00" isLast />
                </div>
              </div>

              {/* Action */}
              <div className="space-y-4 pt-4">
                <button
                  onClick={() => navigate("/add-guarantor")}
                  className="w-full h-[56px] bg-[#1A1C1E] text-white rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center gap-3 shadow-lg shadow-slate-200"
                >
                  Continue to Guarantors
                  <ArrowRight size={18} />
                </button>
                <div className="flex items-center justify-center gap-2 text-slate-400">
                  <Lock size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    256-bit Secure Encryption
                  </span>
                </div>
              </div>
            </div>

            {/* Helper Help Link */}
            <div className="mt-12 bg-slate-50 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm">
                  <HelpCircle size={16} className="text-blue-600" />
                </div>
                <div className="text-xs">
                  <p className="font-bold">Need assistance structureing?</p>
                  <p className="text-slate-500">Chat with a loan officer now</p>
                </div>
              </div>
              <button className="text-[10px] font-bold text-blue-600 uppercase border-b border-blue-600">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- Minimal Helper Components --- */

const BreakdownRow = ({ label, value, isLast }) => (
  <div
    className={`flex justify-between items-center py-1 ${isLast ? "mt-4 pt-4 border-t border-slate-100" : ""}`}
  >
    <span
      className={`text-xs ${isLast ? "font-bold text-slate-800" : "text-slate-500 font-medium"}`}
    >
      {label}
    </span>
    <span
      className={`text-xs font-bold ${isLast ? "text-slate-800" : "text-slate-700"}`}
    >
      {value}
    </span>
  </div>
);

export default ApplyLoan;

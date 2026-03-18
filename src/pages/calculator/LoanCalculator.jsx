import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Info,
  Calculator,
  TrendingDown,
  Percent,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoanCalculator = () => {
  const navigate = useNavigate();

  // Input States
  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState(0);
  const [period, setPeriod] = useState(0);

  // Calculation Results
  const [reducing, setReducing] = useState({
    emi: 0,
    totalInterest: 0,
    totalPayable: 0,
  });
  const [simple, setSimple] = useState({
    emi: 0,
    totalInterest: 0,
    totalPayable: 0,
  });

  useEffect(() => {
    calculateLoans();
  }, [amount, rate, period]);

  const calculateLoans = () => {
    // Convert inputs to numbers, defaulting to 0 if empty or invalid
    const principal = parseFloat(amount) || 0;
    const annualRate = (parseFloat(rate) || 0) / 100;
    const months = parseFloat(period) || 0;

    // --- 1. Guard Clause: Initial State / Zero principal or period ---
    // If no money is borrowed or no time is set, everything is 0.
    if (principal <= 0 || months <= 0) {
      const zeroState = { emi: 0, totalInterest: 0, totalPayable: 0 };
      setReducing(zeroState);
      setSimple(zeroState);
      return;
    }

    // --- 2. Interest-Free Case (0% Rate) ---
    // Avoids division by zero in the EMI formula.
    if (annualRate === 0) {
      const interestFreeEmi = principal / months;
      const interestFreeResult = {
        emi: interestFreeEmi,
        totalInterest: 0,
        totalPayable: principal,
      };
      setReducing(interestFreeResult);
      setSimple(interestFreeResult);
      return;
    }

    // --- 3. Reducing Balance Calculation (Amortization) ---
    const monthlyRate = annualRate / 12;
    const growthFactor = Math.pow(1 + monthlyRate, months);

    // EMI Formula: [P x r x (1+r)^n] / [(1+r)^n - 1]
    const emiReducing =
      (principal * monthlyRate * growthFactor) / (growthFactor - 1);
    const totalPayableRed = emiReducing * months;
    const totalInterestRed = totalPayableRed - principal;

    setReducing({
      emi: emiReducing,
      totalInterest: totalInterestRed,
      totalPayable: totalPayableRed,
    });

    // --- 4. Simple Interest Calculation ---
    // Interest = Principal x Rate x Time (in years)
    const totalInterestSimple = principal * annualRate * (months / 12);
    const totalPayableSimple = principal + totalInterestSimple;
    const emiSimple = totalPayableSimple / months;

    setSimple({
      emi: emiSimple,
      totalInterest: totalInterestSimple,
      totalPayable: totalPayableSimple,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#042159] pb-20">
      <div className="max-w-6xl sm:px-4 mx-auto">
        <header className="flex mt-2 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-black tracking-tight">
              Loan Calculator
            </h1>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
            <Download size={16} /> Export Schedule
          </button>
        </header>
        <p className="text-slate-500 mb-4 mt-3 text-sm leading-relaxed font-medium">
          Evaluate your credit options by comparing &nbsp;
          <span className="text-[#042159] font-bold">
            Amortized Reducing Balance &nbsp;
          </span>
          against&nbsp;
          <span className="text-[#042159] font-bold">
            Standard Simple Interest &nbsp;
          </span>
          models. Adjust your principal, rates, and tenure below to visualize
          total interest costs and monthly repayment obligations in real-time.
        </p>

        {/* 1. Input Section */}
        <section className="bg-white rounded-[40px] p-6 shadow-md shadow-blue-900/5 border border-slate-100 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <InputGroup
              label="Loan Amount (KES)"
              icon={<Calculator size={18} />}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1000"
            />
            <InputGroup
              label="Annual Interest Rate (%)"
              icon={<Percent size={18} />}
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              step="0.1"
            />
            <InputGroup
              label="Repayment Period (Months)"
              icon={<Calendar size={18} />}
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              min="1"
            />
          </div>
        </section>

        {/* 2. Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT: Reducing Balance */}
          <div className="bg-[#042159] rounded-[40px] p-10 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <TrendingDown size={120} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[#4DB8E4] rounded-lg">
                  <ShieldCheck size={20} className="text-[#042159]" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-[13px] text-blue-300">
                  Reducing Balance
                </h3>
              </div>

              <ResultRow
                label="Monthly Installment (EMI)"
                value={reducing.emi}
                highlight
              />
              <div className="grid grid-cols-2 gap-6 mt-10 pt-8 border-t border-white/10">
                <ResultRow
                  label="Total Interest"
                  value={reducing.totalInterest}
                />
                <ResultRow
                  label="Total Payable"
                  value={reducing.totalPayable}
                />
              </div>

              <p className="mt-8 text-[11px] text-blue-300/60 leading-relaxed italic">
                *Interest is calculated on the remaining principal each month.
                This is the most cost-effective method for long-term loans.
              </p>
            </div>
          </div>

          {/* RIGHT: Simple Interest */}
          <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-xl shadow-blue-900/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Percent size={20} className="text-[#042159]" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-[13px] text-slate-400">
                  Simple Interest
                </h3>
              </div>

              <ResultRow
                label="Monthly Installment"
                value={simple.emi}
                highlight
                dark
              />
              <div className="grid grid-cols-2 gap-6 mt-10 pt-8 border-t border-slate-100">
                <ResultRow
                  label="Total Interest"
                  value={simple.totalInterest}
                  dark
                />
                <ResultRow
                  label="Total Payable"
                  value={simple.totalPayable}
                  dark
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <AlertCircle size={18} className="text-amber-600 shrink-0" />
              <p className="text-[11px] text-amber-700 leading-tight font-medium">
                Note: Simple interest charges are fixed based on the original
                principal. Total interest remains the same throughout the term.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Footer Info */}
        <footer className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <InfoCard
            title="What is Reducing Balance?"
            text="As you pay off your loan, the interest is only charged on the outstanding amount, meaning you pay less interest over time."
          />
          <InfoCard
            title="Financial Advice"
            text="Compare both methods carefully. Reducing balance typically results in a lower total cost than simple interest for the same rate."
          />
          <div className="bg-blue-600 rounded-[32px] p-8 text-white flex flex-col items-center justify-center text-center">
            <h4 className="font-black text-sm mb-2">Ready to proceed?</h4>
            <button className="w-full py-3 bg-[#4DB8E4] text-[#042159] rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-sky-300 transition-colors">
              Apply for this Loan
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

/* --- Sub-Components --- */

const InputGroup = ({ label, icon, ...props }) => (
  <div className="space-y-3">
    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
      {icon} {label}
    </label>
    <input
      {...props}
      type="number"
      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-lg font-bold text-[#042159] focus:ring-2 focus:ring-[#4DB8E4]/20 outline-none transition-all"
    />
  </div>
);

const ResultRow = ({ label, value, highlight, dark }) => (
  <div className="space-y-1">
    <p
      className={`text-[10px] font-black uppercase tracking-widest ${dark ? "text-slate-400" : "text-blue-300/60"}`}
    >
      {label}
    </p>
    <p
      className={`font-black tracking-tight ${highlight ? "text-4xl" : "text-xl"} ${dark ? "text-[#042159]" : "text-white"}`}
    >
      KES{" "}
      {Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}
    </p>
  </div>
);

const InfoCard = ({ title, text }) => (
  <div className="p-8 border border-slate-200 rounded-[32px] bg-white/50">
    <h4 className="font-black text-[11px] uppercase tracking-widest text-[#042159] mb-3 flex items-center gap-2">
      <Info size={14} className="text-[#4DB8E4]" /> {title}
    </h4>
    <p className="text-xs text-slate-500 leading-relaxed font-medium">{text}</p>
  </div>
);

export default LoanCalculator;

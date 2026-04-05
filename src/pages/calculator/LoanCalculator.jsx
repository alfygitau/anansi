import { useState, useEffect } from "react";
import {
  Info,
  Calculator,
  TrendingDown,
  Percent,
  Calendar,
  ShieldCheck,
  AlertCircle,
  Download,
  X,
} from "lucide-react";
import { useFormatAmount } from "../../hooks/useFormatAmount";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const LoanCalculator = () => {
  const [isMonthly, setIsMonthly] = useState(false);
  // Input States
  const [amount, setAmount] = useState(0);
  const [rate, setRate] = useState(0);
  const [period, setPeriod] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [activeScheduleTab, setActiveScheduleTab] = useState("reducing");
  const [schedule, setSchedule] = useState({ reducing: [], simple: [] });
  const formatAmount = useFormatAmount();

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
  }, [amount, rate, period, isMonthly]);

  useEffect(() => {
    const results = calculateLoans();
    const reducingSched = generateSchedule("reducing");
    const simpleSched = generateSchedule("simple");
    setSchedule({
      reducing: reducingSched,
      simple: simpleSched,
    });
  }, [amount, rate, period, isMonthly]);

  const calculateLoans = () => {
    // 1. Parse inputs
    const principal = parseFloat(amount) || 0;
    const inputRate = parseFloat(rate) || 0;
    const months = parseFloat(period) || 0;

    // 2. Guard Clause
    if (principal <= 0 || months <= 0) {
      const zeroState = { emi: 0, totalInterest: 0, totalPayable: 0 };
      setReducing(zeroState);
      setSimple(zeroState);
      return;
    }

    // 3. Normalize Rates based on Toggle
    let annualRateDecimal;
    let monthlyRateDecimal;

    if (isMonthly) {
      // If user selects 'Monthly', the input (e.g., 3) is the monthly rate
      monthlyRateDecimal = inputRate / 100;
      annualRateDecimal = monthlyRateDecimal * 12;
    } else {
      // If user selects 'Yearly', the input (e.g., 15) is the annual rate
      annualRateDecimal = inputRate / 100;
      monthlyRateDecimal = annualRateDecimal / 12;
    }

    // 4. Handle 0% Interest
    if (inputRate === 0) {
      const interestFreeEmi = principal / months;
      const res = {
        emi: interestFreeEmi,
        totalInterest: 0,
        totalPayable: principal,
      };
      setReducing(res);
      setSimple(res);
      return;
    }

    // --- 5. Reducing Balance (Amortization) ---
    const growthFactor = Math.pow(1 + monthlyRateDecimal, months);
    const emiReducing =
      (principal * monthlyRateDecimal * growthFactor) / (growthFactor - 1);
    const totalPayableRed = emiReducing * months;

    setReducing({
      emi: emiReducing,
      totalInterest: totalPayableRed - principal,
      totalPayable: totalPayableRed,
    });

    // --- 6. Simple Interest ---
    const totalInterestSimple = principal * annualRateDecimal * (months / 12);
    const totalPayableSimple = principal + totalInterestSimple;

    setSimple({
      emi: totalPayableSimple / months,
      totalInterest: totalInterestSimple,
      totalPayable: totalPayableSimple,
    });
  };

  const generateSchedule = (type) => {
    const principal = parseFloat(amount) || 0;
    const inputRate = parseFloat(rate) || 0;
    const months = parseInt(period) || 0;

    if (principal <= 0 || months <= 0) return [];

    let schedule = [];
    let remainingBalance = principal;

    if (type === "reducing") {
      let monthlyRate = (isMonthly ? inputRate : inputRate / 12) / 100;
      let emi = reducing.emi;

      for (let i = 1; i <= months; i++) {
        const interest = remainingBalance * monthlyRate;
        const principalPaid = emi - interest;
        remainingBalance -= principalPaid;
        schedule.push({
          month: i,
          payment: emi,
          principal: principalPaid,
          interest: interest,
          balance: Math.max(0, remainingBalance),
        });
      }
    } else {
      // Simple Interest Schedule
      const totalInterest = simple.totalInterest;
      const monthlyInterest = totalInterest / months;
      const monthlyPrincipal = principal / months;
      const emi = simple.emi;

      for (let i = 1; i <= months; i++) {
        remainingBalance -= monthlyPrincipal;
        schedule.push({
          month: i,
          payment: emi,
          principal: monthlyPrincipal,
          interest: monthlyInterest,
          balance: Math.max(0, remainingBalance),
        });
      }
    }
    return schedule;
  };

  const downloadPDF = (activeTab, scheduleData, totals) => {
    const doc = new jsPDF();
    const title =
      activeTab === "reducing"
        ? "Reducing Balance Schedule"
        : "Simple Interest Schedule";

    // 1. Add Branding/Header
    doc.setFontSize(20);
    doc.setTextColor(4, 33, 89); // Your Navy Color #042159
    doc.text("ZIP LOAN REPORT", 14, 22);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(title.toUpperCase(), 14, 30);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 35);

    // 2. Add Summary Box
    doc.setDrawColor(241, 245, 249);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, 45, 180, 25, 3, 3, "FD");

    doc.setTextColor(4, 33, 89);
    doc.setFont(undefined, "bold");
    doc.text(
      `Total Interest: KES ${Math.round(totals.interest).toLocaleString()}`,
      20,
      55,
    );
    doc.text(
      `Total Payable: KES ${Math.round(totals.payable).toLocaleString()}`,
      20,
      62,
    );

    // 3. Generate the Table
    const tableColumn = [
      "Month",
      "Installment",
      "Principal",
      "Interest",
      "Balance",
    ];
    const tableRows = scheduleData.map((row) => [
      `#${row.month}`,
      Math.round(row.payment).toLocaleString(),
      Math.round(row.principal).toLocaleString(),
      Math.round(row.interest).toLocaleString(),
      Math.round(row.balance).toLocaleString(),
    ]);

    autoTable(doc, {
      startY: 80,
      head: [["Month", "Installment", "Principal", "Interest", "Balance"]],
      body: scheduleData.map((row) => [
        `#${row.month}`,
        Math.round(row.payment).toLocaleString(),
        Math.round(row.principal).toLocaleString(),
        Math.round(row.interest).toLocaleString(),
        Math.round(row.balance).toLocaleString(),
      ]),
      theme: "grid",
      headStyles: { fillColor: [4, 33, 89] },
      styles: { fontSize: 9 },
    });

    doc.save(`Zip_Loan_Schedule_${activeTab}.pdf`);
  };

  return (
    <>
      <div className="min-h-screen bg-slate-50 text-[#042159] pb-20">
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#042159]/40 backdrop-blur-xl transition-all">
            <div className="bg-[#F8FAFC] w-full max-w-5xl max-h-[80vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col border border-white">
              {/* 1. Ultra-Modern Header */}
              <div className="p-6 pb-6 flex justify-between items-start">
                <div>
                  <h2 className="text-4xl font-black text-[#042159] tracking-tighter italic">
                    Repayment <span className="text-[#4DB8E4]">Schedule</span>
                  </h2>

                  {/* Strategy Switcher - Glassmorphism style */}
                  <div className="flex gap-1 mt-3 bg-slate-200/60 p-1.5 rounded-2xl w-fit backdrop-blur-md border border-slate-200">
                    {["reducing", "simple"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setActiveScheduleTab(type)}
                        className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                          activeScheduleTab === type
                            ? "bg-white text-[#042159] shadow-xl shadow-[#042159]/10"
                            : "text-slate-500 hover:text-[#042159]"
                        }`}
                      >
                        {type === "reducing"
                          ? "Reducing Balance"
                          : "Simple Interest"}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="p-4 bg-white hover:bg-red-50 hover:text-red-500 text-slate-400 rounded-2xl shadow-sm border border-slate-100 transition-all group"
                >
                  <X
                    size={24}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                </button>
              </div>

              {/* 2. Visual Table Header */}
              <div className="px-10 py-2 grid grid-cols-6 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100">
                <span className="col-span-1">Period</span>
                <span className="col-span-1 text-center">Installment</span>
                <span className="col-span-1 text-center">Principal</span>
                <span className="col-span-1 text-center">Interest</span>
                <span className="col-span-2 text-right">Remaining Balance</span>
              </div>

              {/* 3. Luxury Scroll Area */}
              <div className="overflow-y-auto flex-1 px-6 custom-scrollbar bg-white/50">
                {generateSchedule(activeScheduleTab).map((row, idx) => {
                  // Calculate progress percentage for visual aid
                  const progress = (row.balance / amount) * 100;

                  return (
                    <div
                      key={row.month}
                      className="group grid grid-cols-6 py-2.5 px-4 items-center rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 mb-1 border border-transparent hover:border-slate-100"
                    >
                      {/* Month Badge */}
                      <div className="col-span-1">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-[#042159] font-black text-xs group-hover:bg-[#042159] group-hover:text-white transition-colors">
                          {row.month}
                        </span>
                      </div>

                      {/* Repayment Details */}
                      <div className="col-span-1 text-center font-bold text-slate-900">
                        {formatAmount(row.payment)}
                      </div>

                      <div className="col-span-1 text-center">
                        <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-xs border border-emerald-100">
                          {formatAmount(row.principal)}
                        </span>
                      </div>

                      <div className="col-span-1 text-center font-bold text-slate-400">
                        {formatAmount(row.interest)}
                      </div>

                      {/* Visual Balance Column */}
                      <div className="col-span-2 text-right">
                        <div className="flex flex-col items-end gap-1.5">
                          <span className="font-black text-[#042159]">
                            {formatAmount(Math.max(0, Number(row.balance)))}
                          </span>
                          {/* Micro Progress Bar */}
                          <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#4DB8E4] rounded-full transition-all duration-1000"
                              style={{ width: `${100 - progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 4. Insight Footer */}
              <div className="m-8 p-8 bg-[#042159] rounded-[32px] shadow-2xl shadow-blue-900/40 flex justify-between items-center relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />

                <div className="flex gap-12 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-blue-300/60 uppercase tracking-widest mb-1">
                      Projected Interest
                    </span>
                    <span className="text-2xl font-black text-white italic">
                      {activeScheduleTab === "reducing"
                        ? formatAmount(reducing.totalInterest)
                        : formatAmount(simple.totalInterest)}
                    </span>
                  </div>

                  <div className="flex flex-col border-l border-white/10 pl-12">
                    <span className="text-[10px] font-black text-blue-300/60 uppercase tracking-widest mb-1">
                      Total Payable
                    </span>
                    <span className="text-2xl font-black text-[#4DB8E4] italic">
                      {activeScheduleTab === "reducing"
                        ? formatAmount(reducing.totalPayable)
                        : formatAmount(simple.totalPayable)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    downloadPDF(
                      activeScheduleTab,
                      generateSchedule(activeScheduleTab),
                      activeScheduleTab === "reducing" ? reducing : simple,
                    )
                  }
                  className="relative z-10 px-10 py-4 bg-[#4DB8E4] text-[#042159] rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white transition-all active:scale-95 flex items-center gap-3"
                >
                  <Download size={18} /> Export PDF
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="max-w-6xl sm:px-4 mx-auto">
          <header className="flex mt-2 items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black tracking-tight">
                Loan Calculator
              </h1>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
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

          <section className="bg-white rounded-[40px] p-6 shadow-md shadow-blue-900/5 border border-slate-100 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <InputGroup
                label="Loan Amount (KES)"
                icon={<Calculator size={18} />}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <Percent size={18} /> Interest Rate (%)
                  </label>

                  {/* Modern Toggle Switch */}
                  <div className="flex bg-slate-100 rounded-xl">
                    <button
                      onClick={() => setIsMonthly(false)}
                      className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg transition-all ${!isMonthly ? "bg-white text-[#042159] shadow-sm" : "text-slate-400"}`}
                    >
                      Yearly
                    </button>
                    <button
                      onClick={() => setIsMonthly(true)}
                      className={`px-3 py-1 text-[9px] font-black uppercase rounded-lg transition-all ${isMonthly ? "bg-white text-[#042159] shadow-sm" : "text-slate-400"}`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder={isMonthly ? "e.g. 3" : "e.g. 14"}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-lg font-bold text-[#042159] focus:ring-2 focus:ring-[#4DB8E4]/20 outline-none transition-all"
                />
              </div>

              <InputGroup
                label="Duration (Months)"
                icon={<Calendar size={18} />}
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
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
                  principal. Total interest remains the same throughout the
                  term.
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
    </>
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
      {Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}
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

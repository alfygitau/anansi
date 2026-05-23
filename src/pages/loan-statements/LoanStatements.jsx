import { useState, useMemo } from "react";
import {
  Download,
  FileText,
  Calendar,
  ChevronDown,
  Receipt,
  ShieldAlert,
  HelpCircle,
  Clock,
  Lock,
  ArrowLeft,
  Plus,
  ChevronRight,
  TrendingDown,
  Percent,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "../../contexts/ToastProvider";

// 1. PREMIUM STATIC DATA MATRIX
const STATIC_LOANS = [
  {
    id: "L-9081",
    product: { name: "Development Loan" },
    account_number: "LN-00948172",
  },
  {
    id: "L-4412",
    product: { name: "Emergency Asset Facility" },
    account_number: "LN-00441920",
  },
  {
    id: "L-3110",
    product: { name: "Boresha Biashara Line" },
    account_number: "LN-00311054",
  },
];

const STATIC_STATEMENTS = [
  {
    id: "STMT-001",
    loanId: "L-9081",
    year: "2026",
    product: { name: "Development Loan Amortization" },
    start_date: "2026-01-01",
    end_date: "2026-03-31",
    url: "#",
  },
  {
    id: "STMT-002",
    loanId: "L-9081",
    year: "2025",
    product: { name: "Development Loan Year-End Summary" },
    start_date: "2025-01-01",
    end_date: "2025-12-31",
    url: "#",
  },
  {
    id: "STMT-003",
    loanId: "L-4412",
    year: "2026",
    product: { name: "Emergency Asset Repayment Track" },
    start_date: "2026-02-15",
    end_date: "2026-05-20",
    url: "#",
  },
  {
    id: "STMT-004",
    loanId: "L-3110",
    year: "2024",
    product: { name: "Biashara Clearing History" },
    start_date: "2024-06-01",
    end_date: "2024-12-31",
    url: "#",
  },
  {
    id: "STMT-005",
    loanId: "L-9081",
    year: "2024",
    product: { name: "Development Loan Disbursal Audit" },
    start_date: "2024-10-12",
    end_date: "2024-12-31",
    url: "#",
  },
  {
    id: "STMT-006",
    loanId: "L-4412",
    year: "2025",
    product: { name: "Emergency Asset Q4 Principal Ledger" },
    start_date: "2025-10-01",
    end_date: "2025-12-31",
    url: "#",
  },
  {
    id: "STMT-007",
    loanId: "L-3110",
    year: "2025",
    product: { name: "Boresha Biashara Interest Schedule" },
    start_date: "2025-01-01",
    end_date: "2025-06-30",
    url: "#",
  },
];

const MyLoanStatements = () => {
  const [year, setYear] = useState("");
  const [loanId, setLoanId] = useState("");
  const [loadingStatement, setLoadingStatement] = useState(false);

  const currentYear = 2026;
  const yearsArray = Array.from({ length: 6 }, (_, index) =>
    String(currentYear - index),
  );
  const { showToast } = useToast();

  // 2. REAL-TIME CLIENT SIDE FILTERING ENGINE
  const filteredStatements = useMemo(() => {
    return STATIC_STATEMENTS.filter((stmt) => {
      const matchesLoan = loanId === "" || stmt.loanId === loanId;
      const matchesYear = year === "" || stmt.year === year;
      return matchesLoan && matchesYear;
    });
  }, [loanId, year]);

  // Simulated Download Engine
  const handleDownload = (id) => {
    showToast({
      title: "Downloading Document",
      type: "success",
      position: "top-right",
      description: `Amortization ledger target file ${id} is parsing into local environment cache memory.`,
    });
  };

  // Simulated Compiler Mutation Layer
  const handleGenerateStatement = () => {
    if (!loanId) {
      showToast({
        title: "Configuration Missing",
        type: "error",
        position: "top-right",
        description:
          "Please select an active target credit line sequence to run the compiler algorithms.",
      });
      return;
    }

    setLoadingStatement(true);

    // Simulate cryptographic processing lifecycle duration
    setTimeout(() => {
      setLoadingStatement(false);
      showToast({
        title: "Amortization Statement Compiled",
        type: "success",
        position: "top-right",
        description:
          "Your official debt clearing statement has been calculated dynamically and appended to the history deck.",
      });
    }, 1800);
  };

  return (
    <div className="bg-slate-50 text-primary pb-20 h-screen">
      <div className="max-w-6xl sm:px-4 mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-primary">
              Loan Amortization Statements
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Official historical repayment records, interest schedules, and
              remaining principal balances for audit verification.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: INTERACTIVE FILTER CONTROLS & RENDER HOUSING */}
          <div className="lg:col-span-8 space-y-6">
            {/* Preferred Dual Border Input Layout Category Filters */}
            <section className="bg-white border border-slate-200/60 rounded-[28px] p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Active Credit Select Line Input */}
                <div className="md:col-span-8 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 block">
                    Select Active Credit Facility
                  </label>
                  <div className="relative flex items-center bg-slate-50 border-2 border-slate-100 focus-within:border-primary focus-within:bg-white rounded-2xl h-14 transition-all duration-200 shadow-sm">
                    <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto shrink-0 select-none">
                      <TrendingDown size={16} />
                    </div>
                    <select
                      value={loanId}
                      onChange={(e) => setLoanId(e.target.value)}
                      className="w-full bg-transparent border-none pl-4 pr-10 h-full text-sm font-bold text-primary outline-none focus:ring-0 appearance-none cursor-pointer"
                    >
                      <option value="">All active credit lines</option>
                      {STATIC_LOANS.map((loan) => (
                        <option key={loan.id} value={loan.id}>
                          {loan.product.name} (****
                          {loan.account_number.slice(-4)})
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>

                {/* Fiscal Year Input Select */}
                <div className="md:col-span-4 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 block">
                    Fiscal Year
                  </label>
                  <div className="relative flex items-center bg-slate-50 border-2 border-slate-100 focus-within:border-primary focus-within:bg-white rounded-2xl h-14 transition-all duration-200 shadow-sm">
                    <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto shrink-0 select-none">
                      <Calendar size={16} />
                    </div>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full bg-transparent border-none pl-4 pr-10 h-full text-sm font-bold text-primary outline-none focus:ring-0 appearance-none cursor-pointer"
                    >
                      <option value="">All Years</option>
                      {yearsArray.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      size={16}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Statements Listing Block */}
            <div className="space-y-3 max-h-[750px] overflow-y-auto custom-scrollbar pr-1">
              {filteredStatements.length > 0 ? (
                filteredStatements.map((stmt) => (
                  <StatementListItem
                    key={stmt.id}
                    stmt={stmt}
                    onDownload={() => handleDownload(stmt.id)}
                  />
                ))
              ) : (
                <div className="bg-white rounded-[32px] h-[400px] flex flex-col items-center justify-center border border-dashed border-slate-200/80 text-center p-8 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 mb-3">
                    <FileText size={22} />
                  </div>
                  <p className="font-bold text-sm text-slate-800">
                    No amortization logs found
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs font-medium">
                    There are no compiled statements matching this specific
                    credit query cross-reference selection.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: DESATURATED PREMIUM ADVISORY SIDEBARS */}
          <aside className="lg:col-span-4 space-y-4">
            {/* Interactive Generate Hook Block Trigger */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateStatement}
              disabled={loadingStatement}
              className="w-full text-left bg-white p-4 rounded-2xl border-2 border-slate-100 flex items-center shadow-sm hover:border-slate-300 transition-all group focus:outline-none"
            >
              <div className="w-10 h-10 bg-primary rounded-xl text-white shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                {loadingStatement ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Plus size={16} strokeWidth={3} />
                )}
              </div>
              <div className="flex-1 ml-4 flex flex-col justify-center">
                <span className="text-primary font-bold text-sm leading-tight">
                  {loadingStatement
                    ? "Computing Ledger..."
                    : "Generate Loan Statement"}
                </span>
                <span className="text-slate-400 text-[11px] font-medium mt-0.5">
                  Instant real-time statement processing
                </span>
              </div>
              <ChevronRight
                size={14}
                className="text-slate-300 ml-4 group-hover:translate-x-0.5 transition-transform"
                strokeWidth={2.5}
              />
            </motion.button>

            {/* Password Protection Security Vault Card */}
            <div className="bg-primary border border-slate-950 rounded-[32px] p-6 text-white relative overflow-hidden shadow-md">
              <div className="flex justify-between items-start border-b border-white/10 pb-4 mb-4">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                    Security Vault
                  </h3>
                  <p className="text-xs font-bold text-slate-200 mt-0.5">
                    Password Encrypted PDFs
                  </p>
                </div>
                <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                  <Lock size={14} />
                </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-medium mb-4">
                To maintain strict institutional compliance, generated PDF
                amortization records are locked.
              </p>
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                <p className="text-[9px] uppercase font-black tracking-widest text-slate-400 mb-1">
                  Unlocking Vault Key
                </p>
                <p className="text-xs font-mono font-bold text-white">
                  Last 4 digits of corresponding loan account string
                </p>
              </div>
            </div>

            {/* Legal Audit Guidelines Disclaimer Block */}
            <div className="bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3 mb-4">
                <ShieldAlert className="text-slate-400" size={16} />
                <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400">
                  Audit Disclaimers
                </h3>
              </div>
              <ul className="space-y-3.5">
                <DisclaimerItem text="Statutory Binding: These logs represent legally verified summaries filed under the Sacco Societies Act rules." />
                <DisclaimerItem text="Interests Matrix: Interest calculations display amortized balances on a reducing scale algorithm trajectory." />
                <DisclaimerItem text="Audit Window: Discrepancies must be raised with the credit compliance desk within 14 calendar ledger days." />
              </ul>
            </div>

            {/* Assistance Actions Box */}
            <div className="bg-slate-50/60 border border-slate-200/50 rounded-[32px] p-6">
              <div className="flex items-center gap-2.5 mb-2">
                <HelpCircle className="text-slate-500" size={16} />
                <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-700">
                  Statement Inquiries
                </h3>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed mb-4 font-medium">
                Need a physically stamped certification copy for legal
                processing rails? Reach out to support.
              </p>
              <button
                type="button"
                onClick={() =>
                  showToast({
                    title: "Terminal Initialized",
                    type: "success",
                    description: "Connecting securely to support rails...",
                  })
                }
                className="text-primary text-[10px] font-black uppercase tracking-widest hover:text-slate-700 transition-colors flex items-center gap-2 focus:outline-none"
              >
                <span>Contact Support Terminal</span>
                <ArrowLeft size={10} className="rotate-180" />
              </button>
            </div>

            {/* Archival Compliance Tracking Line */}
            <div className="px-4 flex items-start gap-2.5 text-slate-400">
              <Clock size={12} className="mt-0.5 shrink-0" />
              <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed">
                Data Retention Protocol: Archived 7 years as per SASRA records
                acts.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

/* --- DOWNSCALED COMPOSITE TILES --- */
const StatementListItem = ({ stmt, onDownload }) => (
  <div className="group p-5 bg-white border border-slate-200/60 rounded-2xl hover:border-slate-400 hover:shadow-sm transition-all duration-200">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Product Title Group */}
      <div className="flex items-center gap-3.5 min-w-0 md:w-1/3">
        <div className="w-11 h-11 shrink-0 rounded-xl bg-slate-50 border border-slate-200/30 flex items-center justify-center text-slate-700 transition-colors group-hover:bg-primary group-hover:text-white group-hover:border-primary">
          <Receipt size={18} />
        </div>
        <div className="min-w-0">
          <h4 className="font-extrabold text-primary text-sm leading-tight truncate">
            {stmt.product.name}
          </h4>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5 flex items-center gap-1.5">
            <span>Repayment Schedule</span>
          </p>
        </div>
      </div>

      {/* Date Ranges Columns Container */}
      <div className="flex flex-1 items-center justify-between md:justify-around gap-6">
        <div>
          <p className="text-xs font-bold text-primary">
            {new Date(stmt.start_date).toLocaleDateString("en-GB", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
            Start Balance Date
          </p>
        </div>

        <div>
          <p className="text-xs font-bold text-primary">
            {new Date(stmt.end_date).toLocaleDateString("en-GB", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
            Closing Audit Date
          </p>
        </div>
      </div>

      {/* Download Action Component Button Pin */}
      <div className="flex justify-end shrink-0">
        <button
          type="button"
          onClick={onDownload}
          className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shadow-sm focus:outline-none"
        >
          <Download size={16} />
        </button>
      </div>
    </div>
  </div>
);

const DisclaimerItem = ({ text }) => (
  <li className="flex gap-2.5 items-start">
    <div className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 shrink-0" />
    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
      {text}
    </p>
  </li>
);

export default MyLoanStatements;

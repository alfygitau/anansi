import React, { useState } from "react";
import {
  Download,
  FileText,
  Calendar,
  Info,
  Wallet,
  ChevronDown,
  Receipt,
  ShieldAlert,
  HelpCircle,
  Clock,
  Lock,
  ArrowLeft,
} from "lucide-react";
import GenerateStatement from "../../components/statements/GenerateStatement";

const MyStatements = () => {
  // --- State ---
  const [year, setYear] = useState("All");
  const [accountType, setAccountType] = useState("");
  const [activeTab, setActiveTab] = useState("accounts");
  const [showGenerateStatement, setShowGenerateStatement] = useState(false);

  // --- Static Data ---
  const accounts = [
    {
      id: "acc-01",
      productName: "Savings Account",
      account_number: "0011223344",
    },
    {
      id: "acc-02",
      productName: "Current Account",
      account_number: "9988776655",
    },
    {
      id: "acc-03",
      productName: "Fixed Deposit",
      account_number: "5544332211",
    },
  ];

  const allStatements = [
    {
      id: 1,
      type: "account",
      start_date: "2026-02-01",
      end_date: "2026-02-28",
      product: { name: "Savings Account" },
      accountId: "acc-01",
      year: "2026",
      url: "#",
    },
    {
      id: 2,
      type: "account",
      start_date: "2026-01-01",
      end_date: "2026-01-31",
      product: { name: "Savings Account" },
      accountId: "acc-01",
      year: "2026",
      url: "#",
    },
    {
      id: 3,
      type: "account",
      start_date: "2025-12-01",
      end_date: "2025-12-31",
      product: { name: "Current Account" },
      accountId: "acc-02",
      year: "2025",
      url: "#",
    },
    {
      id: 4,
      type: "account",
      start_date: "2026-02-01",
      end_date: "2026-02-28",
      product: { name: "Fixed Deposit" },
      accountId: "acc-03",
      year: "2026",
      url: "#",
    },
    {
      id: 5,
      type: "loan",
      start_date: "2026-01-01",
      end_date: "2026-03-01",
      product: { name: "Personal Loan" },
      accountId: "loan-01",
      year: "2026",
      url: "#",
    },
    {
      id: 6,
      type: "loan",
      start_date: "2025-11-01",
      end_date: "2025-12-01",
      product: { name: "Car Loan" },
      accountId: "loan-02",
      year: "2025",
      url: "#",
    },
    {
      id: 7,
      type: "loan",
      start_date: "2026-02-01",
      end_date: "2026-02-28",
      product: { name: "Personal Loan" },
      accountId: "loan-01",
      year: "2026",
      url: "#",
    },
  ];

  // --- Logic ---
  const filteredStatements = allStatements.filter((stmt) => {
    const matchTab =
      activeTab === "accounts" ? stmt.type === "account" : stmt.type === "loan";

    // Update this line to allow an 'All' option
    const matchYear = year === "All" || stmt.year === year;

    const matchAccount = accountType === "" || stmt.accountId === accountType;
    return matchTab && matchYear && matchAccount;
  });

  const handleDownload = (url) => {
    console.log("Initiating secure download for:", url);
  };

  return (
    <>
      <GenerateStatement
        isOpen={showGenerateStatement}
        onClose={() => setShowGenerateStatement(false)}
        onSuccess={() => console.log("Success!")}
      />

      <div className="min-h-screen bg-slate-50 text-[#042159] pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <header className="py-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black tracking-tight">Statements</h1>
              <p className="text-slate-400 text-sm mt-2 max-w-md font-medium">
                Official financial records for Anansi Sacco members. All
                documents are legally encrypted.
              </p>
            </div>
            <button
              onClick={() => setShowGenerateStatement(true)}
              className="flex items-center gap-3 px-8 py-4 bg-[#042159] text-white rounded-[24px] font-bold text-sm shadow-xl shadow-blue-900/20 hover:bg-[#062d7a] transition-all"
            >
              <FileText size={18} />
              Generate Custom Period
            </button>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: FILTERS & LIST */}
            <div className="lg:col-span-8 space-y-6">
              {/* Filter Card */}
              <section className="bg-white rounded-[40px] p-8 shadow-xl shadow-blue-900/5 border border-slate-100">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1 w-full">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">
                      Filter by {activeTab === "accounts" ? "Account" : "Loan"}
                    </label>
                    <div className="relative">
                      <Wallet
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                        size={18}
                      />
                      <select
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4DB8E4]/20 outline-none text-sm font-bold transition-all appearance-none cursor-pointer"
                      >
                        <option value="">
                          All {activeTab === "accounts" ? "Accounts" : "Loans"}
                        </option>
                        {activeTab === "accounts" &&
                          accounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                              {acc.productName} (****
                              {acc.account_number.slice(-4)})
                            </option>
                          ))}
                      </select>
                      <ChevronDown
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        size={18}
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-48">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">
                      Year
                    </label>
                    <div className="relative">
                      <Calendar
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                        size={18}
                      />
                      <select
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4DB8E4]/20 outline-none text-sm font-bold transition-all appearance-none cursor-pointer"
                      >
                        <option value="All">All Years</option>{" "}
                        {/* Added this line */}
                        {["2026", "2025", "2024", "2023"].map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        size={18}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Tabs */}
              <div className="flex gap-4">
                <TabButton
                  active={activeTab === "accounts"}
                  onClick={() => {
                    setActiveTab("accounts");
                    setAccountType("");
                  }}
                  icon={<Wallet size={16} />}
                  label="Accounts"
                />
                <TabButton
                  active={activeTab === "loans"}
                  onClick={() => {
                    setActiveTab("loans");
                    setAccountType("");
                  }}
                  icon={<Receipt size={16} />}
                  label="Loans"
                />
              </div>

              {/* List */}
              <div className="space-y-4">
                {filteredStatements.length > 0 ? (
                  filteredStatements.map((stmt) => (
                    <StatementListItem
                      key={stmt.id}
                      stmt={stmt}
                      onDownload={() => handleDownload(stmt.url)}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-[40px] p-20 border border-dashed border-slate-300 text-center">
                    <FileText
                      className="text-slate-200 mx-auto mb-4"
                      size={48}
                    />
                    <p className="font-bold text-slate-400">
                      No records found for this selection.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: INFO & DISCLAIMERS */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Security Card */}
              <div className="bg-[#042159] rounded-[32px] p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#4DB8E4]/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                <Lock className="text-[#4DB8E4] mb-4" size={28} />
                <h3 className="text-lg font-black mb-2 leading-tight">
                  Password Protected PDFs
                </h3>
                <p className="text-white/50 text-xs leading-relaxed mb-6 font-medium">
                  For your privacy, statements are locked. You will need your
                  credentials to view them.
                </p>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] text-[#4DB8E4] mb-1">
                    Unlocking Key
                  </p>
                  <p className="text-xs font-bold">
                    Last 4 digits of your account number
                  </p>
                </div>
              </div>

              {/* Disclaimer Card */}
              <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-blue-900/5">
                <div className="flex items-center gap-3 mb-6">
                  <ShieldAlert className="text-amber-500" size={20} />
                  <h3 className="font-black text-[11px] uppercase tracking-[0.15em] text-slate-400">
                    Legal Disclaimers
                  </h3>
                </div>
                <ul className="space-y-4">
                  <DisclaimerItem text="Official Use: These statements are legally binding documents of Anansi Sacco Society Ltd." />
                  <DisclaimerItem text="Processing Time: Recent transactions may take 24-48 hours to appear in generated PDF reports." />
                  <DisclaimerItem text="Error Reporting: Please notify the Sacco audit committee of any discrepancies within 14 days of issuance." />
                  <DisclaimerItem text="Stamp Requirement: For visa or legal applications, please visit any branch for an official physical stamp." />
                </ul>
              </div>

              {/* Support Card */}
              <div className="bg-blue-50/50 rounded-[32px] p-8 border border-blue-100/50">
                <div className="flex items-center gap-3 mb-4">
                  <HelpCircle className="text-[#4DB8E4]" size={20} />
                  <h3 className="font-black text-[11px] uppercase tracking-[0.15em]">
                    Need Assistance?
                  </h3>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed mb-4 font-medium">
                  Missing a transaction? Contact our support line or visit your
                  nearest Anansi branch.
                </p>
                <button className="text-[#042159] text-[10px] font-black uppercase tracking-widest hover:text-[#4DB8E4] transition-colors flex items-center gap-2">
                  Contact Support <ArrowLeft size={12} className="rotate-180" />
                </button>
              </div>

              {/* Legal Footer */}
              <div className="px-8 flex items-start gap-3 opacity-50">
                <Clock size={14} className="mt-0.5 shrink-0" />
                <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                  Data Retention: Statements are archived for 7 years as per the
                  Sacco Societies Act.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

/* --- SUB-COMPONENTS --- */

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`px-8 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
      active
        ? "bg-[#4DB8E4] text-white shadow-lg shadow-blue-400/20 scale-105"
        : "bg-white text-slate-400 hover:text-[#042159] border border-transparent hover:border-slate-200"
    }`}
  >
    {icon} {label}
  </button>
);

const StatementListItem = ({ stmt, onDownload }) => (
  <div className="group p-6 bg-white border border-slate-200 rounded-[32px] hover:border-[#4DB8E4]/30 hover:shadow-2xl hover:shadow-blue-900/5 transition-all">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
      <div className="md:col-span-5 flex items-center gap-4">
        <div className="w-14 h-14 shrink-0 rounded-[20px] bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
          {stmt.type === "loan" ? (
            <Receipt className="text-[#042159]" size={24} />
          ) : (
            <FileText className="text-[#042159]" size={24} />
          )}
        </div>
        <div>
          <h4 className="font-black text-[#042159] text-base leading-tight">
            {stmt.product.name}
          </h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {stmt.type === "loan"
              ? "Repayment History"
              : "Monthly Account Summary"}
          </p>
        </div>
      </div>

      <div className="md:col-span-3">
        <p className="text-sm font-black text-[#042159]">
          {new Date(stmt.start_date).toLocaleDateString("en-GB", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          Start Date
        </p>
      </div>

      <div className="md:col-span-3">
        <p className="text-sm font-black text-[#042159]">
          {new Date(stmt.end_date).toLocaleDateString("en-GB", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          End Date
        </p>
      </div>

      <div className="md:col-span-1 flex justify-end">
        <button
          onClick={onDownload}
          className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#4DB8E4] group-hover:text-white transition-all shadow-sm"
        >
          <Download size={20} />
        </button>
      </div>
    </div>
  </div>
);

const DisclaimerItem = ({ text }) => (
  <li className="flex gap-3 items-start">
    <div className="w-1.5 h-1.5 rounded-full bg-[#4DB8E4] mt-1.5 shrink-0" />
    <p className="text-[11px] text-slate-500 leading-normal font-medium">
      {text}
    </p>
  </li>
);

export default MyStatements;

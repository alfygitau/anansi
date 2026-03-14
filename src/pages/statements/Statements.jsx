import React, { useState } from "react";
import {
  Download,
  FileText,
  Calendar,
  Info,
  Wallet,
  ChevronDown,
  Receipt,
} from "lucide-react";
import GenerateStatement from "../../components/statements/GenerateStatement";

const MyStatements = () => {
  const [year, setYear] = useState("2026");
  const [accountType, setAccountType] = useState("");
  const [activeTab, setActiveTab] = useState("accounts"); // 'accounts' or 'loans'

  // Static Data
  const accounts = [
    { id: "acc-01", productName: "Savings Account", account_number: "0011223344" },
    { id: "acc-02", productName: "Current Account", account_number: "9988776655" },
    { id: "acc-03", productName: "Fixed Deposit", account_number: "5544332211" },
  ];

  const allStatements = [
    // Account Type Statements
    { id: 1, type: "account", start_date: "2026-02-01", end_date: "2026-02-28", product: { name: "Savings Account" }, accountId: "acc-01", year: "2026", url: "#" },
    { id: 2, type: "account", start_date: "2026-01-01", end_date: "2026-01-31", product: { name: "Savings Account" }, accountId: "acc-01", year: "2026", url: "#" },
    { id: 3, type: "account", start_date: "2025-12-01", end_date: "2025-12-31", product: { name: "Current Account" }, accountId: "acc-02", year: "2025", url: "#" },
    { id: 4, type: "account", start_date: "2026-02-01", end_date: "2026-02-28", product: { name: "Fixed Deposit" }, accountId: "acc-03", year: "2026", url: "#" },
    
    // Loan Type Statements
    { id: 5, type: "loan", start_date: "2026-01-01", end_date: "2026-03-01", product: { name: "Personal Loan" }, accountId: "loan-01", year: "2026", url: "#" },
    { id: 6, type: "loan", start_date: "2025-11-01", end_date: "2025-12-01", product: { name: "Car Loan" }, accountId: "loan-02", year: "2025", url: "#" },
    { id: 7, type: "loan", start_date: "2026-02-01", end_date: "2026-02-28", product: { name: "Personal Loan" }, accountId: "loan-01", year: "2026", url: "#" },
    { id: 8, type: "loan", start_date: "2024-12-01", end_date: "2024-12-31", product: { name: "Mortgage" }, accountId: "loan-03", year: "2024", url: "#" },
  ];

  // Filtering Logic
  const filteredStatements = allStatements.filter((stmt) => {
    const matchTab = activeTab === "accounts" ? stmt.type === "account" : stmt.type === "loan";
    const matchYear = stmt.year === year;
    const matchAccount = accountType === "" || stmt.accountId === accountType;
    return matchTab && matchYear && matchAccount;
  });

  const handleDownload = (url) => {
    console.log("Downloading:", url);
  };

  const [showGenerateStatement, setShowGenerateStatement] = useState(false);

  return (
    <>
      <GenerateStatement
        isOpen={showGenerateStatement}
        onClose={() => setShowGenerateStatement(false)}
        onSuccess={() => console.log("Success!")}
      />
      <div className="min-h-screen bg-slate-50 text-[#042159] pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header Section */}
          <header className="py-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight">Statements</h1>
              <p className="text-slate-400 text-sm mt-1 max-w-md">
                Access and download your official bank and loan statements.
              </p>
            </div>
            <button
              onClick={() => setShowGenerateStatement(true)}
              className="flex items-center gap-2 px-8 py-4 bg-[#042159] text-white rounded-[24px] font-bold text-sm shadow-xl shadow-blue-900/20 hover:scale-[1.02] transition-all"
            >
              <FileText size={18} />
              Generate Custom Statement
            </button>
          </header>

          {/* Filter Section */}
          <section className="bg-white rounded-[40px] p-8 shadow-xl shadow-blue-900/5 border border-slate-100 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 w-full">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">
                  Select {activeTab === "accounts" ? "Account" : "Loan"}
                </label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4DB8E4]/20 outline-none text-sm font-bold transition-all appearance-none cursor-pointer"
                  >
                    <option value="">All {activeTab === "accounts" ? "Accounts" : "Loans"}</option>
                    {activeTab === "accounts" && accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.productName} - {acc.account_number.slice(-4)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="w-full md:w-48">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-2">Year</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-[#4DB8E4]/20 outline-none text-sm font-bold transition-all appearance-none cursor-pointer"
                  >
                    {["2026", "2025", "2024", "2023"].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>
            </div>
          </section>

          {/* Custom Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => { setActiveTab("accounts"); setAccountType(""); }}
              className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === "accounts" 
                ? "bg-[#4DB8E4] text-white shadow-lg shadow-blue-400/20" 
                : "bg-white text-slate-400 hover:text-[#042159]"
              }`}
            >
              <Wallet size={16} />
              Accounts
            </button>
            <button
              onClick={() => { setActiveTab("loans"); setAccountType(""); }}
              className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === "loans" 
                ? "bg-[#4DB8E4] text-white shadow-lg shadow-blue-400/20" 
                : "bg-white text-slate-400 hover:text-[#042159]"
              }`}
            >
              <Receipt size={16} />
              Loans
            </button>
          </div>

          {/* Results Section */}
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
              <div className="bg-white rounded-[40px] p-20 border border-dashed border-slate-200 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="text-slate-300" size={32} />
                </div>
                <p className="font-bold text-slate-400">
                  No {activeTab} statements found for {year}
                </p>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-12 p-6 bg-blue-50/50 rounded-[32px] border border-blue-100/50 flex items-center gap-4">
            <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm">
              <Info className="text-[#4DB8E4]" size={20} />
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              <span className="font-bold text-[#042159]">Security Note:</span>{" "}
              Your PDF statements are password protected. Use the{" "}
              <span className="text-[#042159] font-bold text-base">last 4 digits</span> of your account/loan number to unlock.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

/* --- List Item Sub-Component --- */

const StatementListItem = ({ stmt, onDownload }) => (
  <div className="group p-6 bg-white border border-slate-100 rounded-[32px] hover:border-[#4DB8E4]/30 hover:shadow-xl transition-all relative overflow-hidden">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
      <div className="md:col-span-5 flex items-center gap-4">
        <div className="w-14 h-14 shrink-0 rounded-[20px] bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
          {stmt.type === "loan" ? <Receipt className="text-[#042159]" size={24} /> : <FileText className="text-[#042159]" size={24} />}
        </div>
        <div>
          <h4 className="font-bold text-[#042159] text-base leading-tight">
            {stmt.product.name}
          </h4>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-1">
            {stmt.type === "loan" ? "Loan Repayment Schedule" : "Standard Monthly Cycle"}
          </p>
        </div>
      </div>

      <div className="md:col-span-3">
        <p className="text-sm font-black text-[#042159]">
          {new Date(stmt.start_date).toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" })}
        </p>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Start Period</p>
      </div>

      <div className="md:col-span-3">
        <p className="text-sm font-black text-[#042159]">
          {new Date(stmt.end_date).toLocaleDateString("en-GB", { month: "short", day: "numeric", year: "numeric" })}
        </p>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">End Period</p>
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

export default MyStatements;
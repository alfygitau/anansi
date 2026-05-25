import { useState } from "react";
import {
  Download,
  FileText,
  Calendar,
  Wallet,
  ChevronDown,
  Receipt,
  ShieldAlert,
  HelpCircle,
  Clock,
  Lock,
  ArrowLeft,
  Plus,
  ChevronRight,
} from "lucide-react";
import GenerateStatement from "../../components/statements/GenerateStatement";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "react-query";
import {
  fetchStatements,
  generateStatement,
} from "../../sdks/statements/statements";
import { useToast } from "../../contexts/ToastProvider";
import LoadStatements from "../../skeletons/LoadStatements";
import { fetchAccounts } from "../../sdks/accounts/accounts";

const MyStatements = () => {
  const [year, setYear] = useState("");
  const [accountType, setAccountType] = useState("");
  const [showGenerateStatement, setShowGenerateStatement] = useState(false);
  const currentYear = new Date().getFullYear(); // 2026
  const yearsArray = Array.from({ length: 6 }, (_, index) =>
    String(currentYear - index),
  );
  const [statements, setStatements] = useState([]);
  const { showToast } = useToast();
  const [accounts, setAccounts] = useState([]);
  const [formData, setFormData] = useState({
    statementType: "",
    duration: "",
    startDate: "",
    endDate: "",
    accountId: "",
  });

  const handleDownload = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "statement.pdf");
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const { refetch, isLoading } = useQuery({
    queryKey: ["get statements", year, accountType],
    queryFn: async () => {
      const response = await fetchStatements(year, accountType);
      return response.data.data;
    },
    onSuccess: (data) => {
      setStatements(data);
    },
    onError: (error) => {
      showToast({
        title: "Authentication glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  useQuery({
    queryKey: ["get accounts"],
    queryFn: async () => {
      const response = await fetchAccounts();
      return response.data.data;
    },
    onSuccess: (data) => {
      setAccounts(data);
    },
    onError: (error) => {
      showToast({
        title: "Authentication glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const { mutate, isLoading: loadingStatement } = useMutation({
    mutationKey: ["generate statement", formData],
    mutationFn: async () => {
      const response = await generateStatement(
        formData?.accountId,
        formData?.duration,
      );
      return response.data;
    },
    onSuccess: (data) => {
      setFormData({
        statementType: "",
        duration: "",
        startDate: "",
        endDate: "",
        accountId: "",
      });
      handleDownload(data?.url);
      refetch();
      setShowGenerateStatement(false);
      showToast({
        title: "Statement Generated",
        type: "success",
        position: "top-right",
        description:
          "Your document has been compiled successfully. The encrypted ledger record is ready and has been dispatched to your secure archive.",
      });
    },
    onError: (error) => {
      showToast({
        title: "Authentication glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await mutate();
  };

  return (
    <>
      <GenerateStatement
        isOpen={showGenerateStatement}
        onClose={() => setShowGenerateStatement(false)}
        formData={formData}
        setFormData={setFormData}
        accounts={accounts}
        isLoading={loadingStatement}
        handleSubmit={handleSubmit}
      />
      {isLoading ? (
        <LoadStatements />
      ) : (
        <div className="bg-slate-50 text-primary">
          <div className="max-w-6xl sm:px-4 mx-auto">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-2xl font-medium tracking-tight">
                  Statements
                </h1>
                <p className="text-slate-400 text-sm mt-1 font-medium">
                  Official financial records for Anansi Sacco members. All
                  documents are legally encrypted.
                </p>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-2 items-start">
              {/* LEFT COLUMN: FILTERS & LIST */}
              <div className="lg:col-span-8 space-y-6">
                {/* Filter Card */}
                <section className="bg-white rounded-[20px] p-5 border border-slate-200">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1 w-full">
                      <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-2 block ml-2">
                        Filter by accounts
                      </label>
                      <div className="relative">
                        <Wallet
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                          size={18}
                        />
                        <select
                          value={accountType}
                          onChange={(e) => setAccountType(e.target.value)}
                          className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-secondary/20 outline-none text-sm font-bold transition-all appearance-none cursor-pointer"
                        >
                          <option value="">All accounts</option>
                          {accounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                              {acc.product?.name} (****
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
                      <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-2 block ml-2">
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
                          className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-secondary/20 outline-none text-sm font-bold transition-all appearance-none cursor-pointer"
                        >
                          <option value="">All Years</option>{" "}
                          {yearsArray.map((y) => (
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

                {/* List */}
                <div className="space-y-4 h-[800px] overflow-y-auto">
                  {statements.length > 0 ? (
                    statements.map((stmt) => (
                      <StatementListItem
                        key={stmt.id}
                        stmt={stmt}
                        onDownload={() => handleDownload(stmt.url)}
                      />
                    ))
                  ) : (
                    <div className="bg-white rounded-[40px] h-[750px] flex flex-col items-center justify-center border border-dashed border-slate-300 text-center">
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
                <ApplyLoanAction
                  onClick={() => setShowGenerateStatement(true)}
                />
                {/* Security Card */}
                <div className="bg-primary rounded-[32px] p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <Lock className="text-secondary mb-4" size={28} />
                  <h3 className="text-lg font-medium mb-2 leading-tight">
                    Password Protected PDFs
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed mb-6 font-medium">
                    For your privacy, statements are locked. You will need your
                    credentials to view them.
                  </p>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[10px] uppercase font-medium tracking-[0.2em] text-secondary mb-1">
                      Unlocking Key
                    </p>
                    <p className="text-xs font-bold">
                      Last 4 digits of your account number
                    </p>
                  </div>
                </div>

                {/* Disclaimer Card */}
                <div className="bg-white rounded-[32px] p-8 border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <ShieldAlert className="text-amber-500" size={20} />
                    <h3 className="font-medium text-[11px] uppercase tracking-[0.15em] text-slate-400">
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
                    <HelpCircle className="text-secondary" size={20} />
                    <h3 className="font-medium text-[11px] uppercase tracking-[0.15em]">
                      Need Assistance?
                    </h3>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4 font-medium">
                    Missing a transaction? Contact our support line or visit
                    your nearest Anansi branch.
                  </p>
                  <button className="text-primary text-[10px] font-medium uppercase tracking-widest hover:text-secondary transition-colors flex items-center gap-2">
                    Contact Support{" "}
                    <ArrowLeft size={12} className="rotate-180" />
                  </button>
                </div>

                {/* Legal Footer */}
                <div className="px-8 flex items-start gap-3 opacity-50">
                  <Clock size={14} className="mt-0.5 shrink-0" />
                  <p className="text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                    Data Retention: Statements are archived for 7 years as per
                    the Sacco Societies Act.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

/* --- SUB-COMPONENTS --- */
const ApplyLoanAction = ({ onClick }) => {
  return (
    <div>
      <motion.button
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -2 }}
        onClick={onClick}
        className="w-full text-left bg-white p-4 rounded-[24px] border border-[#0A2351]/10 flex items-center shadow-sm hover:shadow-md transition-all group"
      >
        {/* 1. Circle Icon (Matching darkBlue color) */}
        <div className="p-3 bg-[#0A2351] rounded-full text-white shrink-0 group-hover:scale-110 transition-transform duration-300">
          <Plus size={20} strokeWidth={3} />
        </div>

        {/* 2. Text Content */}
        <div className="flex-1 ml-4 flex flex-col justify-center">
          <span className="text-[#0A2351] font-medium text-[15px] leading-tight">
            Generate a statement
          </span>
          <span className="text-slate-400 text-[11px] font-medium mt-0.5">
            Instant processing of statements
          </span>
        </div>

        {/* 3. Right Chevron */}
        <ChevronRight
          size={16}
          className="text-slate-300 ml-6 group-hover:translate-x-1 transition-transform"
          strokeWidth={2.5}
        />
      </motion.button>
    </div>
  );
};

const StatementListItem = ({ stmt, onDownload }) => (
  <div className="group p-6 bg-white border border-slate-200 rounded-[32px] hover:border-secondary/30 hover:shadow-2xl hover:shadow-blue-900/5 transition-all">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
      <div className="md:col-span-5 flex items-center gap-4">
        <div className="w-14 h-14 shrink-0 rounded-[20px] bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
          {stmt.type === "loan" ? (
            <Receipt className="text-primary" size={24} />
          ) : (
            <FileText className="text-primary" size={24} />
          )}
        </div>
        <div>
          <h4 className="font-medium text-primary text-base leading-tight">
            {stmt?.product?.name}
          </h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {stmt.type === "loan" ? "Repayment History" : "Account Summary"}
          </p>
        </div>
      </div>

      <div className="md:col-span-3">
        <p className="text-sm font-medium text-primary">
          {new Date(stmt?.start_date)?.toLocaleDateString("en-GB", {
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
        <p className="text-sm font-medium text-primary">
          {new Date(stmt?.end_date)?.toLocaleDateString("en-GB", {
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
          className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-secondary group-hover:text-white transition-all shadow-sm"
        >
          <Download size={20} />
        </button>
      </div>
    </div>
  </div>
);

const DisclaimerItem = ({ text }) => (
  <li className="flex gap-3 items-start">
    <div className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
    <p className="text-[11px] text-slate-500 leading-normal font-medium">
      {text}
    </p>
  </li>
);

export default MyStatements;

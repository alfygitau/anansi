import React, { useState } from "react";
import {
  Smartphone,
  Clock,
  Receipt,
  CheckCircle2,
  CreditCard,
  FileStack,
  ClipboardList,
  LayoutGrid,
  ChevronRight,
  CalendarX,
  CircleCheck,
  AlertCircle,
} from "lucide-react";
import RepayAmount from "../../components/loans/RepayAmount";
import AddRepayAmount from "../../components/loans/AddRepayAmount";
import ConfirmRepayDetails from "../../components/loans/ConfirmRepayDetails";
import AwaitLoanPayment from "../../components/loans/AwaitLoanPayment";
import { useNavigate } from "react-router-dom";

const LoanDetails = () => {
  const loanData = {
    code: "DEV-2024-9902",
    product: "Emergency Fund Loan",
    balance: "KES 450,000",
    period: "12 Months",
    rateType: "Reducing Balance",
    rate: "12% P.A",
    maturityDate: "Mar 30, 2027",
    repaymentAmount: "KES 42,500",
    status: "Active",
  };

  const scheduleData = [
    { dueDate: "15 May 2026", amount: "KES 24,500", status: "PAID" },
    { dueDate: "15 Jun 2026", amount: "KES 24,500", status: "PAID" },
    { dueDate: "15 Jul 2026", amount: "KES 24,500", status: "UPCOMING" },
    { dueDate: "15 Aug 2026", amount: "KES 24,500", status: "UPCOMING" },
    { dueDate: "15 Sep 2026", amount: "KES 24,500", status: "UPCOMING" },
    { dueDate: "15 Oct 2026", amount: "KES 24,500", status: "UPCOMING" },
  ];

  const transactions = [
    {
      id: 1,
      type: "M-PESA Repayment",
      date: "Feb 28, 2026",
      amount: "KES 42,500",
      ref: "SCL90231KL",
    },
    {
      id: 2,
      type: "M-PESA Repayment",
      date: "Jan 30, 2026",
      amount: "KES 42,500",
      ref: "SBC4403940",
    },
    {
      id: 3,
      type: "M-PESA Repayment",
      date: "Dec 29, 2025",
      amount: "KES 42,500",
      ref: "SCK11204OP",
    },
    {
      id: 4,
      type: "M-PESA Repayment",
      date: "Nov 30, 2025",
      amount: "KES 42,500",
      ref: "SBA882011M",
    },
    {
      id: 5,
      type: "M-PESA Repayment",
      date: "Oct 30, 2025",
      amount: "KES 42,500",
      ref: "SBH55621QQ",
    },
  ];
  const navigate = useNavigate();
  const [showRepayAmount, setShowRepayAmount] = useState(false);
  const [showAddRepayAmount, setShowAddRepayAmount] = useState(false);
  const [showConfirmRepayDetails, setShowConfirmRepayDetails] = useState(false);
  const [showAwaitLoanPayment, setShowAwaitLoanPayment] = useState(false);
  const loanInfo = {
    minimumPayable: 4500.0,
    paymentInFull: 125000.0,
    loanId: "LN-2026-X882",
    currency: "KES",
    dueDate: "2026-06-15",
    interestRate: 12.5,
    breakdown: {
      principal: 110000.0,
      accruedInterest: 14500.0,
      lateFees: 500.0,
    },
    isOverdue: false,
    daysToNextPayment: 32,
  };
  const [formData, setFormData] = useState({
    phone: "",
    amount: "",
    accountType: "loan",
  });

  return (
    <>
      <RepayAmount
        isOpen={showRepayAmount}
        onClose={() => setShowRepayAmount(false)}
        loanData={loanInfo}
        onProceed={() => {
          setShowRepayAmount(false);
          setShowAddRepayAmount(true);
        }}
      />
      <AddRepayAmount
        isOpen={showAddRepayAmount}
        onClose={() => setShowAddRepayAmount(false)}
        minimumPayable={2000}
        formData={formData}
        setFormData={setFormData}
        onContinue={() => {
          setShowAddRepayAmount(false);
          setShowConfirmRepayDetails(true);
        }}
      />
      <ConfirmRepayDetails
        isOpen={showConfirmRepayDetails}
        onClose={() => setShowConfirmRepayDetails(false)}
        amount={2000}
        phoneNumber="0769400300"
        onConfirm={() => {
          setShowConfirmRepayDetails(false);
          setShowAwaitLoanPayment(true);
        }}
      />

      <AwaitLoanPayment
        isOpen={showAwaitLoanPayment}
        onClose={() => setShowAwaitLoanPayment(false)}
        onPaymentSuccess={() => {
          setShowAwaitLoanPayment(false);
        }}
      />
      <div className="min-h-screen bg-slate-50 text-primary pb-20">
        <div className="max-w-6xl sm:px-4 mx-auto">
          <header>
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  {loanData.product}
                </h1>
                <p className="text-slate-400 font-mono text-xs mt-1 uppercase tracking-widest">
                  {loanData.code}
                </p>
              </div>
              <div className="bg-primary text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.1em]">
                {loanData.status}
              </div>
            </div>
          </header>
          <div className="flex flex-col lg:flex-row gap-6 py-5 w-full">
            <div className="flex-1 min-w-[320px] bg-gradient-to-br from-[#0A2351] to-[#152E5F] rounded-[35px] p-7 shadow-[0_15px_30px_rgba(10,35,81,0.15)] text-white">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#17C6C6] text-[10px] font-black tracking-[1.8px] uppercase">
                  Emergency Fund Loan
                </span>
                <div className="bg-white/10 px-2 py-1 rounded-lg flex items-center justify-center">
                  <span className="text-[8px] font-bold uppercase tracking-tighter">
                    Active
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                  <span className="text-white/50 text-[10px] font-extrabold tracking-[1.2px] uppercase">
                    Current Balance
                  </span>
                  <h2 className="text-[28px] font-black mt-1 leading-none">
                    KES 142,500.00
                  </h2>
                </div>
                <div className="p-2.5 bg-white/10 rounded-full">
                  <LayoutGrid size={20} className="text-white" />
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white/70 text-[13px] font-semibold">
                    Repayment Progress
                  </span>
                  <span className="text-[#17C6C6] text-[13px] font-black">
                    35%
                  </span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#17C6C6] h-full rounded-full"
                    style={{ width: "35%" }}
                  />
                </div>
              </div>
              <hr className="border-white/10 my-4" />
              <div className="flex justify-between items-center">
                <MiniDetail label="Loan ID" value="#L-9902" />
                <MiniDetail label="Interest" value="1.5%" />
                <MiniDetail label="Period" value="6 Months" />
              </div>
            </div>
            <div className="flex-1 min-w-[320px] bg-[#17C6C6]/5 border border-[#17C6C6]/10 rounded-[24px] p-6 flex flex-col justify-center">
              <div className="space-y-4">
                <PaymentRow label="Principal Amount" value="KES 20,000.00" />
                <PaymentRow label="Interest Charged" value="KES 3,500.00" />
                <PaymentRow label="Service Fee" value="KES 0.00" />

                <hr className="border-black/10 my-3" />

                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-black text-slate-900">
                    Total Due (15 May)
                  </span>
                  <span className="text-[16px] font-black text-teal-900">
                    KES 24,500.00
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowRepayAmount(true)}
                className="mt-6 w-full py-3 bg-[#17C6C6] text-white rounded-xl font-black text-[12px] uppercase tracking-widest shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-transform"
              >
                Pay Installment
              </button>
            </div>
          </div>

          <section className="mb-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickActionButton
                icon={<CreditCard className="text-emerald-500" />}
                label="Pay Loan"
                sub="Direct M-PESA"
                onClick={() => setShowRepayAmount(true)}
                variant="emerald"
              />
              <QuickActionButton
                icon={<FileStack className="text-blue-500" />}
                label="Statements"
                sub="View Ledger"
                onClick={() => navigate("/statements")}
                variant="blue"
              />
              <QuickActionButton
                icon={<ClipboardList className="text-purple-500" />}
                label="Applications"
                sub="Check Status"
                onClick={() => navigate("/all-loan-applications")}
                variant="purple"
              />
              <QuickActionButton
                icon={<LayoutGrid className="text-slate-500" />}
                label="Other Products"
                sub="Explore More"
                onClick={() => navigate("/loan-products")}
                variant="slate"
              />
            </div>
          </section>
          {/* 2. Split View: Schedule & Transactions */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-3">
            {/* Left Side: Schedule (Stepper) */}
            <div className="md:col-span-6">
              <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
                Repayment Progress
              </h3>
              <LoanScheduleList installments={scheduleData} />
            </div>

            {/* Right Side: Transactions */}
            <div className="md:col-span-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Transaction Ledger
                </h3>
                <button className="text-[13px] font-black tracking-widest text-primary hover:underline flex items-center gap-1">
                  Download Statement
                </button>
              </div>

              <div className="space-y-3">
                {transactions.map((tx) => (
                  <MPesaTransactionRow tx={tx} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/* --- Sub-Component: QuickActionButton --- */
const QuickActionButton = ({ icon, label, sub, onClick, variant }) => {
  const themes = {
    emerald: "hover:border-emerald-200 hover:bg-emerald-50/30",
    blue: "hover:border-blue-200 hover:bg-blue-50/30",
    purple: "hover:border-purple-200 hover:bg-purple-50/30",
    slate: "hover:border-slate-200 hover:bg-slate-50/30",
  };

  return (
    <button
      onClick={onClick}
      className={`group p-5 bg-white border border-slate-100 rounded-[32px] shadow-sm transition-all duration-300 flex flex-col items-start text-left relative overflow-hidden ${themes[variant]}`}
    >
      <div className="w-12 h-12 rounded-[20px] bg-slate-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        {React.cloneElement(icon, { size: 24 })}
      </div>

      <div>
        <h4 className="font-bold text-primary text-sm group-hover:text-secondary transition-colors">
          {label}
        </h4>
        <p className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-wider">
          {sub}
        </p>
      </div>

      <ChevronRight
        className="absolute right-6 bottom-6 text-slate-200 group-hover:text-secondary group-hover:translate-x-1 transition-all"
        size={16}
      />
    </button>
  );
};

const MiniDetail = ({ label, value }) => (
  <div className="flex flex-col">
    <span className="text-white/50 text-[9px] font-bold uppercase tracking-wider">
      {label}
    </span>
    <span className="text-[12px] font-black text-white">{value}</span>
  </div>
);

const PaymentRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-[13px] font-medium text-slate-500">{label}</span>
    <span className="text-[13px] font-bold text-slate-900">{value}</span>
  </div>
);

const MPesaTransactionRow = ({ tx }) => {
  const isDisbursement = tx.type.includes("Disbursement");

  return (
    <div className="group p-5 bg-white border border-slate-200 rounded-[28px] hover:border-[#3EB344]/30 transition-all flex items-center justify-between">
      <div className="flex items-center gap-4">
        {/* M-PESA Branded Icon Container */}
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
            isDisbursement
              ? "bg-blue-50 text-primary"
              : "bg-[#3EB344]/10 text-[#3EB344]"
          }`}
        >
          <Smartphone size={22} strokeWidth={2.5} />
        </div>

        <div>
          <h4 className="text-sm font-bold text-primary tracking-tight">
            {tx.type}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
              {tx.ref}
            </span>
            <span className="text-[10px] text-slate-300">•</span>
            <span className="text-[10px] text-slate-400 font-medium">
              {tx.date}
            </span>
          </div>
        </div>
      </div>

      <div className="text-right">
        {/* Color polarity: Blue for money in, Green for repayments */}
        <p
          className={`text-sm font-black ${isDisbursement ? "text-primary" : "text-[#3EB344]"}`}
        >
          {isDisbursement ? "+" : "-"}
          {tx.amount}
        </p>
        <div className="flex items-center justify-end gap-1 mt-0.5">
          <span className="text-[9px] font-black uppercase text-slate-300 tracking-tighter">
            Verified
          </span>
          <CheckCircle2 size={10} className="text-[#3EB344]" />
        </div>
      </div>
    </div>
  );
};

const LoanScheduleList = ({ installments = [], onSelectInstallment }) => {
  const ordinals = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

  // 1. Empty State Component
  if (installments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
          <CalendarX size={32} strokeWidth={1.5} className="text-slate-300" />
        </div>
        <h3 className="text-[16px] font-bold text-slate-900 mb-1">
          No Schedule Found
        </h3>
        <p className="text-[13px] text-slate-500 max-w-[200px] leading-relaxed">
          Your repayment schedule will appear here once the loan is approved.
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {installments.map((item, index) => {
        const isPaid = item.status === "PAID";
        const label = `${ordinals[index] || index + 1 + "th"} Installment`;
        const isOverdue = item.status === "OVERDUE";
        return (
          <div
            key={index}
            onClick={() => !isPaid && onSelectInstallment?.(item)}
            className={`
              group flex items-center p-[18px] rounded-[24px] bg-white border transition-all
              ${isPaid ? "opacity-60 border" : "opacity-100 border-[#F1F4F8] hover:border-[#17C6C6] cursor-pointer active:scale-[0.98] shadow-[0_4px_10px_rgba(0,0,0,0.02)]"}
            `}
          >
            {/* Status Marker */}
            <div className="z-10 mr-4 flex items-center justify-center w-8 h-8 rounded-full bg-white border border-slate-100 shadow-sm">
              {isPaid ? (
                <CircleCheck
                  size={18}
                  className="text-[#17C6C6]"
                  strokeWidth={2.5}
                />
              ) : isOverdue ? (
                <AlertCircle size={18} className="text-red-500 animate-pulse" />
              ) : (
                <Clock size={16} className="text-slate-400" />
              )}
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col min-w-0">
              <span
                className={`
                text-[14px] font-black truncate
                ${isPaid ? "line-through text-slate-400" : "text-[#0A2351]"}
              `}
              >
                {label}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Due: {item.dueDate}
              </span>
            </div>

            {/* Amount & Status Badge */}
            <div className="flex flex-col items-end shrink-0 ml-4">
              <span
                className={`text-[14px] font-black ${isPaid ? "text-slate-400" : "text-slate-900"}`}
              >
                {item.amount}
              </span>
              {isPaid ? (
                <span className="text-[9px] font-black text-[#17C6C6] tracking-wider uppercase">
                  SUCCESS
                </span>
              ) : (
                <span className="text-[9px] flex items-center">
                  PENDING <ChevronRight size={14} className="text-slate-300" />
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LoanDetails;

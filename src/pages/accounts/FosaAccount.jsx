import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Copy,
  ArrowDownCircle,
  Clock,
  Wallet,
  SlidersHorizontal,
  ChevronRight,
  Send,
  Receipt,
  ArrowUpRight,
  Smartphone
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import {
  fetchAccount,
  fetchAccountTransactions,
} from "../../sdks/accounts/accounts";
import { useToast } from "../../contexts/ToastProvider";
import AccountDetailsLoader from "../../skeletons/AccountDetailsLoader";
import TransactionDetails from "../../components/transactions/TransactionDetails";
import { useFormatAmount } from "../../hooks/useFormatAmount";
import { useFormattedDateTime } from "../../hooks/useFormatDateTime";

import DepositAmount from "../../components/deposit-savings/DepositAmount";
import PayBill from "../../components/fosa/PayBill";
import Withdrawal from "../../components/fosa/Withdrawal";
import Transfer from "../../components/fosa/Transfer";

const MyAccountDetails = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const navigate = useNavigate();
  const { accountId, accountNumber } = useParams();
  const [account, setAccount] = useState({});
  const [transactions, setTransactions] = useState([]);
  const { showToast } = useToast();
  const formatAmount = useFormatAmount();

  // FOSA Dynamic Overlay Interaction Triggers
  const [showPaybill, setShowPaybill] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [showDepositAmount, setShowDepositAmount] = useState(false);

  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [transaction, setTransaction] = useState({});

  const { refetch: refetchAccounts } = useQuery({
    queryKey: ["get account"],
    queryFn: async () => {
      const response = await fetchAccount(accountId);
      return response.data.data;
    },
    onSuccess: (data) => setAccount(data),
    onError: (error) => {
      showToast({
        title: "Account glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const { isLoading, refetch: refetchTransactions } = useQuery({
    queryKey: ["get account transactions"],
    queryFn: async () => {
      const response = await fetchAccountTransactions(accountNumber);
      return response.data.data;
    },
    onSuccess: (data) => setTransactions(data),
    onError: (error) => {
      showToast({
        title: "Transactions glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  return (
    <>
      {/* Dynamic FOSA Modals Pipeline Injection */}
      {showPaybill && (
        <PayBill
          isOpen={showPaybill}
          onClose={() => setShowPaybill(false)}
          account={account}
          onSuccess={() => {
            refetchAccounts();
            refetchTransactions();
          }}
        />
      )}
      {showWithdraw && (
        <Withdrawal
          isOpen={showWithdraw}
          onClose={() => setShowWithdraw(false)}
          account={account}
          onSuccess={() => {
            refetchAccounts();
            refetchTransactions();
          }}
        />
      )}
      {showTransfer && (
        <Transfer
          isOpen={showTransfer}
          onClose={() => setShowTransfer(false)}
          account={account}
          onSuccess={() => {
            refetchAccounts();
            refetchTransactions();
          }}
        />
      )}

      <DepositAmount
        isOpen={showDepositAmount}
        onClose={() => setShowDepositAmount(false)}
        onConfirm={() => {
          setShowDepositAmount(false);
          // Standard deposit review pipelines go here
        }}
      />

      <TransactionDetails
        isOpen={showTransactionDetails}
        onClose={() => setShowTransactionDetails(false)}
        transaction={transaction}
      />

      {isLoading ? (
        <AccountDetailsLoader />
      ) : (
        <div className="bg-slate-50 text-primary">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-xl font-medium mb-1 tracking-tight font-sans">
              Current Savings Account
            </h3>
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8 items-stretch">
              {/* Left: Hero Balance Card (Spans 5 Columns) */}
              <div className="xl:col-span-7 w-full bg-primary rounded-[30px] p-6 text-white relative overflow-hidden h-[200px] flex flex-col justify-between shadow-xl shadow-blue-950/10 shrink-0">
                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300/80">
                        {account?.product?.name || "FOSA Ordinary Savings"}
                      </span>
                    </div>
                    <h2 className="text-4xl font-medium tracking-tighter font-sans">
                      {balanceVisible
                        ? `${formatAmount(account?.balance || 0)}`
                        : "KES ••••••••"}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/15 transition-colors"
                  >
                    {balanceVisible ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="relative z-10 flex items-end justify-between border-t border-white/10 pt-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-blue-300/50 mb-1">
                      FOSA Number
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-mono font-medium text-blue-100">
                        {account?.account_number}
                      </p>
                      <Copy
                        size={14}
                        className="text-blue-400 cursor-pointer hover:text-white"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            account?.account_number,
                          );
                          showToast({ title: "Copied!", type: "success" });
                        }}
                      />
                    </div>
                  </div>
                  <Wallet size={24} className="text-blue-400/40" />
                </div>
              </div>

              {/* Right: Primary FOSA Core Actions Grid Section (Spans 7 Columns) */}
              <div className="xl:col-span-5 h-[200px] flex flex-col">
                {/* 🔥 THE FIX: h-full on the grid container combined with h-full on the sub-buttons makes them expand vertically to fit the column */}
                <div className="grid grid-cols-2 gap-4 h-full w-full">
                  <VerticalAction
                    icon={<ArrowDownCircle />}
                    label="Deposit"
                    description="Load FOSA via M-PESA"
                    onClick={() => setShowDepositAmount(true)}
                  />
                  <VerticalAction
                    icon={<ArrowUpRight />}
                    label="Withdraw"
                    description="Withdraw to M-PESA"
                    onClick={() => setShowWithdraw(true)}
                  />
                  <VerticalAction
                    icon={<Receipt />}
                    label="Pay Bill"
                    description="Settle utilities"
                    onClick={() => setShowPaybill(true)}
                  />
                  <VerticalAction
                    icon={<Send />}
                    label="Transfer"
                    description="To MPESA or Bank"
                    onClick={() => setShowTransfer(true)}
                  />
                </div>
              </div>
            </div>

            {/* 3. Operational Transactions View Split Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Ledger Rows */}
              <div className="lg:col-span-7">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-medium tracking-tight">
                    Transactions
                  </h3>
                  <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                    <SlidersHorizontal size={18} />
                  </button>
                </div>

                <div className="space-y-3">
                  {transactions.length > 0 ? (
                    <div className="h-[500px] border rounded-[32px] w-full p-3 flex flex-col gap-3 overflow-y-auto">
                      {transactions.map((tx) => (
                        <TransactionRow
                          key={tx.id}
                          tx={tx}
                          setTransaction={setTransaction}
                          setShowTransactionDetails={setShowTransactionDetails}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-[32px] h-[500px] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center">
                      <Clock size={40} className="text-slate-300 mb-4" />
                      <h4 className="text-base font-medium text-primary mb-1">
                        No Activity Registered
                      </h4>
                      <p className="text-xs text-slate-400 max-w-[260px] mb-6">
                        Transactions initiated via Paybill, App or
                        over-the-counter will show up here.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Information & Compliance parameters */}
              <aside className="lg:col-span-5 space-y-4">
                {/* Existing Security Card */}
                <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-[10px] uppercase tracking-widest text-slate-400">
                      Transaction Security
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    All dynamic FOSA processing requests require 2-Factor
                    dynamic signature authentications or safe transactional PIN
                    confirmations.
                  </p>
                </div>

                {/* Existing Operational Limits Card */}
                <div className="bg-blue-50/40 rounded-[24px] p-5 border border-blue-100/60">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-[10px] uppercase tracking-widest text-blue-500">
                      FOSA Operational Limits
                    </h3>
                  </div>
                  <ul className="space-y-3">
                    <DisclaimerItem text="Daily Mobile Withdrawal Caps stand at KES 250,000." />
                    <DisclaimerItem text="Internal transfers between SACCO ledger lines occur instantly." />
                  </ul>
                </div>

                {/* 🔥 New Card 1: Merchant / Paybill Settlements */}
                <div className="bg-amber-50/40 rounded-[24px] p-5 border border-amber-100/60">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-[10px] uppercase tracking-widest text-amber-600">
                      Merchant & Paybill Routing
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Utility payments (KPLC, Nairobi Water) clear within 30
                    minutes. Always cross-check the business shortcode before
                    confirming, as utility ledger transactions cannot be
                    reversed once broadcasted.
                  </p>
                </div>

                {/* 🔥 New Card 2: Inter-Bank / Transfer Clearing Schedules */}
                <div className="bg-purple-50/40 rounded-[24px] p-5 border border-purple-100/60">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-bold text-[10px] uppercase tracking-widest text-purple-600">
                      Bank Transfer Realities
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Real-Time Gross Settlement (RTGS) requests submitted after
                    3:00 PM will automatically execute on the next business day.
                    Pesalink transfers directly to mobile-linked bank accounts
                    remain instant.
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

/* --- Enhanced Custom Sub-Components with Brand Consistency --- */

const VerticalAction = ({ icon, label, description, onClick }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="w-full p-3 truncate bg-white rounded-2xl 
                 border border-slate-200 shadow-[0_4px_12px_rgba(15,23,42,0.01)]
                 flex items-center justify-between gap-3 
                 transition-all duration-200 ease-out 
                 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:border-slate-200
                 active:scale-[0.98] group text-left"
    >
      <div className="flex items-center gap-3.5">
        <div className="p-3 rounded-xl bg-slate-50 text-slate-600 border border-slate-100/50 transition-all duration-200 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 shrink-0">
          {React.cloneElement(icon, {
            size: 20,
            strokeWidth: 2.2,
          })}
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-bold tracking-wide text-slate-800 uppercase group-hover:text-blue-900 transition-colors">
            {label}
          </span>
          {description && (
            <span className="text-[11px] text-slate-400 font-medium tracking-tight">
              {description}
            </span>
          )}
        </div>
      </div>

      <div className="text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all duration-200 shrink-0 pr-0.5">
        <ChevronRight size={16} strokeWidth={2.5} />
      </div>
    </button>
  );
};

const TransactionRow = ({ tx, setTransaction, setShowTransactionDetails }) => {
  const formatAmount = useFormatAmount();
  const formatDateTime = useFormattedDateTime();

  // Dynamic color coding based on cash direction factors
  const isDebit = ["WITHDRAWAL", "PAYBILL", "TRANSFER_OUT"].includes(
    tx.type?.toUpperCase(),
  );

  return (
    <div
      onClick={() => {
        setTransaction(tx);
        setShowTransactionDetails(true);
      }}
      className="bg-white p-4 cursor-pointer rounded-2xl border border-slate-100 flex items-center justify-between hover:border-slate-200 transition-all group"
    >
      <div className="flex items-center gap-3.5">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
            isDebit
              ? "bg-rose-50 text-rose-600"
              : "bg-emerald-50 text-emerald-600"
          }`}
        >
          <Smartphone size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800 tracking-tight">
            {tx.type || "FOSA Transaction"}
          </h4>
          <p className="text-[10px] text-slate-400 font-mono tracking-tight uppercase">
            {tx.ref_number || tx.public_id} • {formatDateTime(tx.createdAt)}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`text-sm font-bold ${isDebit ? "text-rose-600" : "text-emerald-600"}`}
        >
          {isDebit ? "-" : "+"}
          {formatAmount(tx?.amount)}
        </p>
        <p
          className={`text-[9px] font-bold uppercase tracking-widest ${
            tx.status?.toUpperCase() === "COMPLETED"
              ? "text-emerald-400"
              : "text-amber-500"
          }`}
        >
          {tx.status}
        </p>
      </div>
    </div>
  );
};

const DisclaimerItem = ({ text }) => (
  <li className="flex gap-2 items-start">
    <p className="text-[11px] text-slate-600 leading-normal font-medium">
      {text}
    </p>
  </li>
);

export default MyAccountDetails;

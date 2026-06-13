import {
  X,
  Copy,
  Share2,
  Download,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormatAmount } from "../../hooks/useFormatAmount";

const TransactionDetails = ({ isOpen, onClose, transaction }) => {
  const formatAmount = useFormatAmount();
  if (!transaction) return null;

  const statusColors = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    failed: "bg-rose-50 text-rose-600 border-rose-100",
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Reference copied!");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex justify-end bg-slate-500/10"
        >
          {/* Invisible dismissal zone target click area */}
          <div className="absolute inset-0" onClick={onClose} />
          
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="bg-white relative w-full max-w-[480px] h-full shadow-2xl flex flex-col z-10"
          >
            {/* Circled Grey Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 text-gray-500 hover:text-gray-900 rounded-full transition-all active:scale-95 shadow-sm"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="px-8 pt-8 pb-6 pr-16">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Anansi Sacco • Transaction Details
              </span>
              <h2 className="text-3xl font-bold text-[#074073] tracking-tight mt-1">
                {formatAmount(transaction?.amount)}
              </h2>
              <p className="text-sm font-semibold text-slate-500 capitalize mt-0.5">
                {transaction?.type}
              </p>
              
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider mt-3 ${statusColors[transaction.status]}`}
              >
                {transaction?.status === "pending" ? (
                  <Clock size={12} />
                ) : (
                  <CheckCircle2 size={12} />
                )}
                {transaction?.status}
              </div>
            </div>
            
            <div className="border-b mx-8 border-slate-100"></div>

            {/* Quick Actions Ribbon */}
            <div className="flex justify-center gap-6 py-3.5 bg-slate-50/50 border-b border-slate-100">
              <ActionButton
                icon={<Copy size={18} />}
                label="Copy Ref"
                onClick={() => copyToClipboard(transaction.ref_number)}
              />
              <ActionButton
                icon={<Share2 size={18} />}
                label="Share"
                onClick={() => {}}
              />
              <ActionButton
                icon={<Download size={18} />}
                label="Download"
                onClick={() => {}}
              />
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Reference Info Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-5 bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm">
                <InfoRow
                  label="Reference"
                  value={transaction.ref_number}
                  isRef
                  copy={() => copyToClipboard(transaction.ref_number)}
                />
                <InfoRow
                  label="Date & Time"
                  value={new Date(transaction.createdAt).toLocaleString(
                    "en-GB",
                    { dateStyle: "medium", timeStyle: "short" },
                  )}
                />
                <InfoRow label="Method" value={transaction.deposit_method} />
                <InfoRow
                  label="Platform"
                  value={transaction.platform}
                  className="capitalize"
                />
              </div>

              {/* Parties System Tile Registry */}
              <div className="space-y-3.5 bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm divide-y divide-slate-100/60">
                <div className="pb-3.5">
                  <PartyTile
                    title="Sender"
                    name={transaction.sender_name}
                    sub={transaction.sender_account_number}
                    icon={<ArrowUpRight size={16} />}
                  />
                </div>
                <div className="pt-3.5">
                  <PartyTile
                    title="Recipient"
                    name={transaction.receiver_name}
                    sub={`${transaction.receiver_bank_name} • ${transaction.receiver_account_number}`}
                    icon={<Phone size={16} />}
                  />
                </div>
              </div>

              {/* Notes Condition Block */}
              {transaction.note && (
                <div className="p-4 rounded-[20px] bg-blue-50/40 border border-blue-100/60">
                  <p className="text-[10px] font-bold text-blue-500/90 uppercase tracking-widest mb-1">
                    Note / Remarks
                  </p>
                  <p className="text-sm text-blue-900 font-medium leading-relaxed">
                    {transaction.note}
                  </p>
                </div>
              )}
            </div>

            <div className="border-b mx-8 border-slate-100"></div>

            {/* Footer System Hash */}
            <div className="p-4 bg-white text-center">
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                Transaction ID: {transaction?.ref_number}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const ActionButton = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 group">
    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:border-[#074073] group-hover:text-[#074073] transition-all shadow-sm active:scale-95">
      {icon}
    </div>
    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
      {label}
    </span>
  </button>
);

const InfoRow = ({ label, value, isRef, copy, className = "" }) => (
  <div>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
      {label}
    </p>
    <div className="flex items-center gap-2 group">
      <p className={`text-sm font-semibold text-slate-800 tracking-tight ${className}`}>{value}</p>
      {isRef && (
        <button
          onClick={copy}
          className="text-slate-300 hover:text-[#074073] transition-colors"
        >
          <Copy size={12} />
        </button>
      )}
    </div>
  </div>
);

const PartyTile = ({ title, name, sub, icon }) => (
  <div className="flex items-center gap-4">
    <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        {title}
      </p>
      <p className="text-sm font-bold text-slate-800 tracking-tight mt-0.5">{name}</p>
      <p className="text-xs text-slate-500 font-medium mt-0.5">{sub}</p>
    </div>
  </div>
);

export default TransactionDetails;
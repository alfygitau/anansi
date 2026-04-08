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

const TransactionDetails = ({ isOpen, onClose, transaction }) => {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 bg-slate-900/40">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="relative p-6 text-center border-b border-slate-50">
              <button
                onClick={onClose}
                className="absolute right-2 top-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-3xl font-black text-slate-900">
                {transaction.currency_id.includes("993") ? "KES" : "$"}{" "}
                {parseFloat(transaction.amount).toLocaleString()}
              </h2>
              <p className="text-slate-500 font-medium mt-1">
                {transaction.type}
              </p>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider mt-4 ${statusColors[transaction.status]}`}
              >
                {transaction.status === "pending" ? (
                  <Clock size={12} />
                ) : (
                  <CheckCircle2 size={12} />
                )}
                {transaction.status}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex justify-center gap-4 py-2 bg-slate-50/50">
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

            {/* Content */}
            <div className="p-8 space-y-4">
              {/* Reference Info */}
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <InfoRow
                  label="Reference"
                  value={transaction.ref_number}
                  isRef
                  copy={() => copyToClipboard(transaction.ref_number)}
                />
                <InfoRow
                  label="Date"
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

              <div className="h-px bg-slate-100 w-full" />

              {/* Parties */}
              <div className="space-y-4">
                <PartyTile
                  title="Sender"
                  name={transaction.sender_name}
                  sub={transaction.sender_account_number}
                  icon={<ArrowUpRight size={16} />}
                />
                <PartyTile
                  title="Recipient"
                  name={transaction.receiver_name}
                  sub={`${transaction.receiver_bank_name} • ${transaction.receiver_account_number}`}
                  icon={<Phone size={16} />}
                />
              </div>

              {transaction.note && (
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
                    Note
                  </p>
                  <p className="text-sm text-blue-900 font-medium">
                    {transaction.note}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 pt-0 text-center">
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                Transaction ID: {transaction.id.split("-")[0]}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ActionButton = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 group">
    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 group-hover:border-secondary group-hover:text-secondary transition-all shadow-sm">
      {icon}
    </div>
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
      {label}
    </span>
  </button>
);

const InfoRow = ({ label, value, isRef, copy, className = "" }) => (
  <div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
      {label}
    </p>
    <div className="flex items-center gap-2 group">
      <p className={`font-bold text-slate-800 ${className}`}>{value}</p>
      {isRef && (
        <button
          onClick={copy}
          className="text-slate-300 hover:text-secondary transition-colors"
        >
          <Copy size={12} />
        </button>
      )}
    </div>
  </div>
);

const PartyTile = ({ title, name, sub, icon }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {title}
      </p>
      <p className="text-sm font-bold text-slate-800">{name}</p>
      <p className="text-xs text-slate-500">{sub}</p>
    </div>
  </div>
);

export default TransactionDetails;

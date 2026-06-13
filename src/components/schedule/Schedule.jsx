import React from "react";
import {
  X,
  Calendar,
  Receipt,
  Landmark,
  Scale,
  Clock,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Schedule = ({ isOpen, onClose, onPaymentTrigger, scheduleData }) => {
  if (!scheduleData) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 2,
    }).format(Number(amount));
  };

  const totalDueNum = Number(scheduleData.total_due);
  const totalPaidNum = Number(scheduleData.total_paid);
  const remainingOutstanding = Math.max(0, totalDueNum - totalPaidNum);

  // Status Badge configurations matching your style parameters
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return {
          bg: "bg-emerald-50/60 border-emerald-100 text-emerald-700",
          label: "Fully Paid",
        };
      case "partial":
        return {
          bg: "bg-amber-50/60 border-amber-100 text-amber-700",
          label: "Partially Paid",
        };
      case "overdue":
        return {
          bg: "bg-rose-50/60 border-rose-100 text-rose-700",
          label: "Overdue",
        };
      default:
        return {
          bg: "bg-slate-50 border-slate-100 text-slate-600",
          label: status,
        };
    }
  };

  const statusStyle = getStatusConfig(scheduleData.status);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex justify-end bg-zinc-950/20 transition-opacity"
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
            <div className="px-8 pt-8 pb-6">
              <h2 className="text-2xl font-bold text-[#074073]">
                Installment Details
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Schedule overview for Installment
              </p>
            </div>
            <div className="border-b mx-8 border-slate-100"></div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {/* Overview Summary Panel */}
              <div className="p-5 rounded-[24px] border border-slate-100 bg-slate-50/40 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                    Remaining Balance
                  </p>
                  <p className="text-2xl font-bold text-[#074073] tracking-tight mt-0.5">
                    {formatCurrency(remainingOutstanding.toString())}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 border rounded-full text-[10px] font-bold uppercase tracking-wider ${statusStyle.bg}`}
                >
                  {statusStyle.label}
                </span>
              </div>

              {/* Financial Component Ledger Matrix */}
              <div className="space-y-2.5">
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest ml-1">
                  Payment Allocation
                </p>

                <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm divide-y divide-slate-100/60 overflow-hidden">
                  {/* Ledger Row: Principal */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="size-9 rounded-xl bg-blue-50/60 border border-blue-100/50 flex items-center justify-center text-blue-600 shrink-0">
                        <Landmark size={18} className="stroke-[2.25]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          Principal Base
                        </p>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                          Demanded:{" "}
                          <span className="font-semibold text-slate-600">
                            {formatCurrency(scheduleData.principal_due)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-600">
                        {formatCurrency(scheduleData.principal_paid)}
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        Cleared
                      </p>
                    </div>
                  </div>

                  {/* Ledger Row: Interest */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="size-9 rounded-xl bg-purple-50/60 border border-purple-100/50 flex items-center justify-center text-purple-600 shrink-0">
                        <Receipt size={18} className="stroke-[2.25]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          Interest Fee
                        </p>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                          Demanded:{" "}
                          <span className="font-semibold text-slate-600">
                            {formatCurrency(scheduleData.interest_due)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-emerald-600">
                        {formatCurrency(scheduleData.interest_paid)}
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        Cleared
                      </p>
                    </div>
                  </div>

                  {/* Ledger Row: Penalties */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="size-9 rounded-xl bg-rose-50/60 border border-rose-100/50 flex items-center justify-center text-rose-600 shrink-0">
                        <Scale size={18} className="stroke-[2.25]" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">
                          Accrued Penalties
                        </p>
                        <p className="text-[11px] font-medium text-slate-400 mt-0.5">
                          Demanded:{" "}
                          <span className="font-semibold text-slate-600">
                            {formatCurrency(scheduleData.penalty_due)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-700">
                        {formatCurrency(scheduleData.penalty_paid)}
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        Cleared
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aggregates Summary Ribbon */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-[20px] flex justify-between text-xs font-medium">
                <div>
                  <span className="text-slate-400 block mb-0.5 uppercase text-[9px] tracking-wider">
                    Total Due
                  </span>
                  <span className="font-bold text-slate-800 text-[13px]">
                    {formatCurrency(scheduleData.total_due)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block mb-0.5 uppercase text-[9px] tracking-wider">
                    Total Received
                  </span>
                  <span className="font-bold text-emerald-600 text-[13px]">
                    {formatCurrency(scheduleData.total_paid)}
                  </span>
                </div>
              </div>

              {/* Chronology & Meta Information Grid */}
              <div className="space-y-3 pt-2">
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest ml-1">
                  Chronology Parameter
                </p>
                <div className="space-y-3 text-xs font-medium">
                  {/* Due Date Row */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Calendar size={15} />
                      <span>Maturity Due Date</span>
                    </div>
                    <span className="font-bold text-slate-800">
                      {new Date(scheduleData.due_date).toLocaleDateString(
                        "en-KE",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>

                  {/* System Update Record Row */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock size={15} />
                      <span>Ledger Synchronization</span>
                    </div>
                    <span className="font-semibold text-slate-600">
                      {new Date(scheduleData.updated_at).toLocaleDateString(
                        "en-KE",
                        {
                          month: "short",
                          day: "numeric",
                        },
                      )}{" "}
                      at{" "}
                      {new Date(scheduleData.updated_at).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </span>
                  </div>
                </div>

                {/* Moratorium Dynamic Banner Context block */}
                {scheduleData.is_moratorium && (
                  <div className="flex items-start gap-2.5 p-3.5 bg-amber-50/50 border border-amber-100/60 text-amber-800 rounded-xl mt-3">
                    <ShieldAlert
                      size={16}
                      className="shrink-0 text-amber-600 mt-0.5"
                    />
                    <span className="text-[11px] font-medium leading-relaxed text-amber-700/90">
                      This target payment cycle operation is covered under an
                      authorized active facility holiday grace configuration.
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="border-b mx-8 border-slate-100"></div>

            {/* Sticky Action Footer */}
            <div className="p-8 bg-white">
              {remainingOutstanding > 0 ? (
                <button
                  onClick={() => onPaymentTrigger?.(remainingOutstanding)}
                  className="w-full h-16 bg-[#074073] hover:bg-[#052d52] text-white font-medium rounded-2xl transition-all uppercase tracking-widest text-xs active:scale-[0.98] shadow-md shadow-[#074073]/10"
                >
                  Pay Balance ({formatCurrency(remainingOutstanding.toString())}
                  )
                </button>
              ) : (
                <div className="w-full h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-widest">
                  <CheckCircle2 size={16} /> Installment Settled
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Schedule;

import React, { useState } from "react";
import {
  X,
  ChevronDown,
  Mail,
  Clock,
  Wallet,
  Loader2,
  CheckCircle2,
  FileText,
  Layers,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GenerateStatement = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    statementType: "account",
    duration: "",
    startDate: "",
    endDate: "",
    accountId: "",
    email: localStorage.getItem("email") || "",
  });

  const [accounts] = useState([
    {
      id: "acc-01",
      productName: "Savings",
      account_number: "0011223344",
    },
    {
      id: "acc-02",
      productName: "Shares",
      account_number: "9988776655",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false); // Reset for next time
        onSuccess();
        onClose();
      }, 3000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex justify-end bg-slate-900/60"
        >
          {/* Invisible dismissal zone target click area */}
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="bg-white relative w-full max-w-[480px] h-full shadow-2xl flex flex-col z-10 overflow-hidden"
          >
            {isSuccess ? (
              <div className="p-12 flex flex-col items-center text-center my-auto">
                <div className="w-20 h-20 bg-emerald-50 rounded-[30px] flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} className="text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-primary mb-2">
                  Statement Generated
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                  Your statement has been prepared and sent to{" "}
                  <span className="text-primary font-bold">
                    {formData.email}
                  </span>
                </p>
              </div>
            ) : (
              <>
                <div className="bg-primary p-5 flex items-center justify-between sticky top-0 z-20">
                  <div>
                    <h2 className="text-white text-xl font-bold">
                      Custom Statement
                    </h2>
                    <p className="text-blue-200/60 text-xs">
                      Select your preferences below
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col flex-1 overflow-hidden p-5"
                >
                  {/* SCROLLABLE FORM FIELD CONTAINER */}
                  <div className="flex-1 overflow-y-auto pr-1 space-y-5 pb-6">
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Configure your preferences below. The system will compile
                      your requested account details into a secure document.
                    </p>

                    {/* STATEMENT TYPE DROPDOWN */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                        Statement Type
                      </label>

                      <div className="relative flex items-center bg-slate-50 rounded-2xl transition-all focus-within:ring-2 focus-within:ring-secondary/20">
                        <div className="pl-4 pr-3 flex items-center text-slate-300 border-r border-slate-200 h-6 my-auto">
                          <Layers size={18} />
                        </div>
                        <select
                          required
                          value={formData.statementType}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              statementType: e.target.value,
                            })
                          }
                          className="w-full pl-3 pr-12 py-5 bg-transparent border-none outline-none text-sm font-bold appearance-none cursor-pointer rounded-2xl"
                        >
                          <option value="account">Account</option>
                          <option value="loan">Loan</option>
                        </select>
                        <ChevronDown
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                          size={18}
                        />
                      </div>
                    </div>

                    {/* STATEMENT DURATION */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                        Statement Duration
                      </label>
                      <div className="relative flex items-center bg-slate-50 rounded-2xl transition-all focus-within:ring-2 focus-within:ring-secondary/20">
                        <div className="pl-4 pr-3 flex items-center text-slate-300 border-r border-slate-200 h-6 my-auto">
                          <Clock size={18} />
                        </div>
                        <select
                          value={formData.duration}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              duration: e.target.value,
                            })
                          }
                          className="w-full pl-3 pr-12 py-5 bg-transparent border-none outline-none text-sm font-bold appearance-none cursor-pointer rounded-2xl"
                        >
                          <option value="">Select date range</option>
                          <option value="month_to_date">This Month</option>
                          <option value="last_month">Last Month</option>
                          <option value="three_months">Last 3 Months</option>
                          <option value="six_months">Last 6 Months</option>
                        </select>
                        <ChevronDown
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                          size={18}
                        />
                      </div>
                    </div>

                    {/* CONDITIONAL START & END DATE FIELDS */}
                    <AnimatePresence>
                      {!formData.duration && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid grid-cols-2 gap-4 overflow-hidden"
                        >
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                              Start Date
                            </label>
                            <div className="relative flex items-center bg-slate-50 rounded-2xl">
                              <div className="pl-4 pr-3 flex items-center text-slate-300 border-r border-slate-200 h-6 my-auto">
                                <Calendar size={18} />
                              </div>
                              <input
                                type="date"
                                required={!formData.duration}
                                value={formData.startDate}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    startDate: e.target.value,
                                  })
                                }
                                className="w-full pl-3 pr-4 py-5 bg-transparent border-none outline-none text-sm font-bold transition-all rounded-2xl"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                              End Date
                            </label>
                            <div className="relative flex items-center bg-slate-50 rounded-2xl">
                              <div className="pl-4 pr-3 flex items-center text-slate-300 border-r border-slate-200 h-6 my-auto">
                                <Calendar size={18} />
                              </div>
                              <input
                                type="date"
                                required={!formData.duration}
                                value={formData.endDate}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    endDate: e.target.value,
                                  })
                                }
                                className="w-full pl-3 pr-4 py-5 bg-transparent border-none outline-none text-sm font-bold transition-all rounded-2xl"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* TARGET ACCOUNT */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                        Target Account
                      </label>
                      <div className="relative flex items-center bg-slate-50 rounded-2xl transition-all focus-within:ring-2 focus-within:ring-secondary/20">
                        <div className="pl-4 pr-3 flex items-center text-slate-300 border-r border-slate-200 h-6 my-auto">
                          <Wallet size={18} />
                        </div>
                        <select
                          required
                          value={formData.accountId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              accountId: e.target.value,
                            })
                          }
                          className="w-full pl-3 pr-12 py-5 bg-transparent border-none outline-none text-sm font-bold appearance-none cursor-pointer rounded-2xl"
                        >
                          <option value="">Select Account</option>
                          {accounts.map((acc) => (
                            <option key={acc.id} value={acc.id}>
                              {acc.productName} - {acc.account_number.slice(-4)}
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

                  {/* ANCHORED ACTION BUTTON HOUSING */}
                  <div className="pt-4 bg-white mt-auto">
                    <button
                      disabled={isLoading}
                      type="submit"
                      className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-900/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <FileText size={20} />
                      )}
                      {isLoading ? "Processing..." : "Generate Statement"}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GenerateStatement;

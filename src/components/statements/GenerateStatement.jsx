import React, { useState } from "react";
import {
  X,
  ChevronDown,
  Clock,
  Wallet,
  Loader2,
  FileText,
  Layers,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const GenerateStatement = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  accounts,
  handleSubmit,
  isLoading,
}) => {
  const [touchedFields, setTouchedFields] = useState({});

  const handleBlur = (field) => {
    setTouchedFields((prev) => ({ ...prev, [field]: true }));
  };

  // Evaluate form validation status based on standard required fields
  const isFormInvalid = () => {
    if (!formData.accountId) return true;
    const hasPreset = !!formData.duration;
    const hasCustomRange = !!(formData.startDate && formData.endDate);
    return !((hasPreset && !hasCustomRange) || (hasCustomRange && !hasPreset));
  };

  const isDisabled = isLoading || isFormInvalid();

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
            className="bg-white relative w-full max-w-[480px] h-full shadow-2xl flex flex-col z-10 overflow-hidden"
          >
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
                  {/* TARGET ACCOUNT */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-2">
                      Target Account
                    </label>
                    <div className="relative flex items-center bg-slate-50 rounded-2xl transition-all focus-within:ring-2 focus-within:ring-secondary/20">
                      <div className="pl-4 pr-3 flex items-center text-slate-300 border-r border-slate-200 h-6 my-auto">
                        <Wallet size={18} />
                      </div>
                      <select
                        required
                        value={formData.accountId}
                        onBlur={() => handleBlur("accountId")}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            accountId: e.target.value,
                          })
                        }
                        className="w-full pl-3 pr-12 py-5 bg-transparent border-none outline-none text-sm font-bold appearance-none cursor-pointer rounded-2xl"
                      >
                        <option value="">Select account</option>
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
                    {/* ERROR TEXT LOCATION */}
                    {touchedFields.accountId && !formData.accountId && (
                      <p className="text-[10px] font-bold tracking-wide text-red-500 ml-2">
                        Please select a target account
                      </p>
                    )}
                  </div>

                  {/* STATEMENT DURATION */}
                  <div
                    className={`space-y-2 transition-opacity duration-200 ${formData.startDate || formData.endDate ? "opacity-50" : "opacity-100"}`}
                  >
                    <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-2">
                      Statement Duration
                    </label>
                    <div
                      className={`relative flex items-center bg-slate-50 rounded-2xl transition-all focus-within:ring-2 focus-within:ring-secondary/20 ${formData.startDate || formData.endDate ? "cursor-not-allowed bg-slate-100" : ""}`}
                    >
                      <div className="pl-4 pr-3 flex items-center text-slate-300 border-r border-slate-200 h-6 my-auto">
                        <Clock size={18} />
                      </div>
                      <select
                        value={formData.duration}
                        disabled={!!(formData.startDate || formData.endDate)}
                        onBlur={() => handleBlur("duration")}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            duration: e.target.value,
                            startDate: "",
                            endDate: "",
                          })
                        }
                        className="w-full pl-3 pr-12 py-5 bg-transparent border-none outline-none text-sm font-bold appearance-none cursor-pointer rounded-2xl disabled:cursor-not-allowed"
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

                  {/* MUTUAL EXCLUSION COMPONENT SEPARATOR (Optional visual cue) */}
                  {!formData.duration &&
                    !(formData.startDate || formData.endDate) && (
                      <div className="text-center text-[9px] font-black tracking-widest text-slate-300 uppercase my-1">
                        — OR —
                      </div>
                    )}

                  {/* CONDITIONAL START & END DATE FIELDS */}
                  <div
                    className={`grid grid-cols-2 gap-4 transition-opacity duration-200 ${formData.duration ? "opacity-50" : "opacity-100"}`}
                  >
                    {/* Start Date Field */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-2">
                        Start Date
                      </label>
                      <div
                        className={`relative flex items-center bg-slate-50 rounded-2xl transition-all ${formData.duration ? "cursor-not-allowed bg-slate-100" : ""}`}
                      >
                        <div className="pl-4 pr-3 flex items-center text-slate-300 border-r border-slate-200 h-6 my-auto">
                          <Calendar size={18} />
                        </div>
                        <input
                          type="date"
                          disabled={!!formData.duration} // ⚡ Disabled if a duration preset is active
                          required={!formData.duration}
                          value={formData.startDate}
                          onBlur={() => handleBlur("startDate")}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              startDate: e.target.value,
                              duration: "", // ⚡ Break context hook loop out of duration preset
                            })
                          }
                          className="w-full pl-3 pr-4 py-5 bg-transparent border-none outline-none text-sm font-bold transition-all rounded-2xl disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* End Date Field */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-2">
                        End Date
                      </label>
                      <div
                        className={`relative flex items-center bg-slate-50 rounded-2xl transition-all ${formData.duration ? "cursor-not-allowed bg-slate-100" : ""}`}
                      >
                        <div className="pl-4 pr-3 flex items-center text-slate-300 border-r border-slate-200 h-6 my-auto">
                          <Calendar size={18} />
                        </div>
                        <input
                          type="date"
                          disabled={!!formData.duration} // ⚡ Disabled if a duration preset is active
                          required={!formData.duration}
                          value={formData.endDate}
                          onBlur={() => handleBlur("endDate")}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              endDate: e.target.value,
                              duration: "", // ⚡ Break context hook loop out of duration preset
                            })
                          }
                          className="w-full pl-3 pr-4 py-5 bg-transparent border-none outline-none text-sm font-bold transition-all rounded-2xl disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>
                  {Object.keys(touchedFields).length > 0 && isFormInvalid() && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl mb-4">
                      <span className="text-[11px] font-bold tracking-wide text-red-600 uppercase ml-1">
                        Please select a preset duration OR configure a valid
                        custom date range to proceed.
                      </span>
                    </div>
                  )}
                </div>

                {/* ANCHORED ACTION BUTTON HOUSING */}
                <div className="pt-4 bg-white mt-auto">
                  <button
                    disabled={isDisabled}
                    type="submit"
                    className={`w-full py-4 rounded-2xl font-medium transition-all flex items-center justify-center gap-3 ${
                      isDisabled
                        ? "bg-slate-100 text-slate-500 cursor-not-allowed shadow-none scale-100 active:scale-100"
                        : "bg-primary text-white shadow-xl shadow-blue-900/20 hover:scale-[1.01] active:scale-[0.98]"
                    }`}
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GenerateStatement;

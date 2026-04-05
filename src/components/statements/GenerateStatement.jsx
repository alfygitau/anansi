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
} from "lucide-react";

const GenerateStatement = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    duration: "",
    accountId: "",
    email: localStorage.getItem("email") || "",
  });

  const [accounts] = useState([
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
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // If the modal isn't open, don't render anything
  if (!isOpen) return null;

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
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {isSuccess ? (
          <div className="p-12 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-[30px] flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-primary mb-2">
              Statement Generated
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Your statement has been prepared and sent to{" "}
              <span className="text-primary font-bold">{formData.email}</span>
            </p>
          </div>
        ) : (
          <>
            <div className="bg-primary p-8 flex items-center justify-between">
              <div>
                <h2 className="text-white text-xl font-bold">
                  Custom Statement
                </h2>
                <p className="text-blue-200/60 text-xs mt-1">
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

            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <p className="text-sm text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                Select your duration. Your statement will be sent to your
                registered email once ready for download.
              </p>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  Statement Duration
                </label>
                <div className="relative">
                  <Clock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <select
                    required
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-secondary/20 outline-none text-sm font-bold transition-all appearance-none cursor-pointer"
                  >
                    <option value="">-- Select Duration --</option>
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

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  Target Account
                </label>
                <div className="relative">
                  <Wallet
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <select
                    required
                    value={formData.accountId}
                    onChange={(e) =>
                      setFormData({ ...formData, accountId: e.target.value })
                    }
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-secondary/20 outline-none text-sm font-bold transition-all appearance-none cursor-pointer"
                  >
                    <option value="">-- Select Account --</option>
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

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">
                  Delivery Email
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-secondary/20 outline-none text-sm font-bold transition-all"
                    required
                  />
                </div>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="w-full mt-4 bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-900/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <FileText size={20} />
                )}
                {isLoading ? "Processing..." : "Generate & Send Statement"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default GenerateStatement;

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Phone,
  Info,
  AlertCircle,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const AddRepayAmount = ({
  isOpen,
  onClose,
  onBack,
  minimumPayable,
  formData,
  setFormData,
  onContinue,
}) => {
  const isValid =
    formData.amount >= minimumPayable && formData.phone.length >= 9;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden antialiased">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-[480px] h-full bg-white shadow-2xl flex flex-col"
          >
            {/* Header Area */}
            <div className="px-8 pt-5 pb-6">
              <button
                onClick={onClose}
                className="absolute top-5 right-5 z-10 flex items-center justify-center w-8 h-8 bg-slate-100 hover:bg-slate-200 text-gray-500 hover:text-gray-900 rounded-full transition-all active:scale-95 shadow-sm"
              >
                <X size={20} />
              </button>

              <h2 className="text-2xl font-medium text-primary tracking-tight">
                Custom Repayment
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Enter your preferred amount and payment details.
              </p>
            </div>
            <div className="border-b border-slate-100 mx-8"></div>
            {/* Scrollable Form Body */}
            <div className="flex-grow overflow-y-auto p-8 space-y-8">
              {/* Payment Method Info */}
              <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="bg-[#2EB400] p-2 rounded-lg">
                    {/* Simplified MPESA Icon Representation */}
                    <span className="text-white font-medium text-[10px]">
                      M-PESA
                    </span>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      Method
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      M-Pesa STK Push
                    </p>
                  </div>
                </div>
                <div className="size-2 bg-green-500 rounded-full animate-pulse" />
              </div>

              {/* Input: Phone Number (Using your new design system) */}
              <div className="space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-4">
                  M-Pesa Phone Number
                </label>
                <div className="relative flex group h-16">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                    <Phone
                      size={18}
                      className="text-slate-300 group-focus-within:text-primary transition-colors"
                    />
                    <span className="ml-3 text-sm font-bold text-slate-400">
                      +254
                    </span>
                    <div className="w-[1px] h-6 bg-slate-200 ml-4 group-focus-within:bg-primary/20 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="700 000 000"
                    className="w-full h-full pl-28 pr-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-primary"
                  />
                </div>
              </div>

              {/* Input: Custom Amount */}
              <div className="space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-4">
                  Payment Amount
                </label>
                <div className="relative flex group h-16">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                    <DollarSign
                      size={18}
                      className="text-slate-300 group-focus-within:text-primary transition-colors"
                    />
                    <span className="ml-3 text-sm font-bold text-slate-400 font-medium">
                      KES
                    </span>
                    <div className="w-[1px] h-6 bg-slate-200 ml-4 group-focus-within:bg-primary/20 transition-colors" />
                  </div>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full h-full pl-28 pr-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-primary"
                  />
                </div>
              </div>

              {/* Disclaimer Section */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3">
                  <AlertCircle
                    size={14}
                    className="text-slate-300 mt-0.5 shrink-0"
                  />
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    By clicking continue, an STK push will be sent to your
                    device. Ensure you have the sufficient funds to complete the
                    transaction.
                  </p>
                </div>
              </div>
            </div>
            <div className="border-b border-slate-100 mx-8"></div>
            {/* Footer Action */}
            <div className="p-8 py-6 bg-slate-50/30">
              <button
                onClick={onContinue}
                disabled={!isValid}
                className="w-full h-[60px] bg-primary text-white rounded-2xl font-medium uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#062d7a] transition-all disabled:opacity-20 shadow-xl shadow-blue-900/10 active:scale-95"
              >
                Review Payment <ArrowRight size={18} />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddRepayAmount;

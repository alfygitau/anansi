import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Briefcase,
  Wallet,
  ShieldCheck,
  Loader2,
  ChevronDown,
  Navigation,
} from "lucide-react";
import { useMutation } from "react-query";
import { updateFinancials } from "../../sdks/customer/customer";
import { useToast } from "../../contexts/ToastProvider";
import useAuth from "../../hooks/useAuth";

const EditFinancialDetails = ({ isOpen, onClose, customer, refetch }) => {
  const { showToast } = useToast();
  const { auth } = useAuth();
  const [formData, setFormData] = useState({
    snnOrKra: "",
    employmentType: "",
    occupation: "",
    income: "",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        snnOrKra: customer.kraPin || "",
        employmentType: customer.employment_type || "",
        occupation: customer.occupation || "",
        income: customer.income_range ? String(customer.income_range) : "",
      });
    }
  }, [customer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    updateFinance();
  };

  const { mutate: updateFinance, isLoading } = useMutation({
    mutationKey: ["update finance"],
    mutationFn: () =>
      updateFinancials(
        auth?.user?.id,
        formData?.employmentType,
        formData?.snnOrKra,
        formData?.occupation,
        formData?.income,
      ),
    onSuccess: () => {
      refetch();
      onClose();
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
            className="bg-white relative w-full max-w-[480px] h-full shadow-2xl flex flex-col z-10"
          >
            {/* CLOSE BUTTON ANCHOR */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 text-gray-500 hover:text-gray-900 rounded-full transition-all active:scale-95 shadow-sm"
            >
              <X size={20} />
            </button>

            {/* HEADER TRACK (Pinnned, non-scrollable) */}
            <div className="p-8 pb-4 flex flex-col text-left shrink-0">
              <h2 className="text-xl font-medium text-slate-900">
                Financial Profile
              </h2>
              <p className="text-slate-400 text-xs font-medium">
                Update your employment and tax information
              </p>
            </div>
            <div className="border mx-8 border-slate-100"></div>
            {/* SCROLLABLE CENTRAL CONTAINER */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {/* Tax Identification (KRA PIN) - READ ONLY VARIANT */}
              <div className="w-full space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-2 block">
                  Tax Identification (KRA PIN)
                </label>
                <div className="relative flex items-center bg-slate-50/50 border-2 border-slate-100 rounded-2xl h-14 shadow-sm select-none">
                  <div className="pl-4 pr-3 flex items-center text-slate-300 border-r border-slate-200/60 h-5 my-auto shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <input
                    type="text"
                    value={formData.snnOrKra}
                    readOnly
                    placeholder="A00XXXXXXZ"
                    className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-400 cursor-not-allowed outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none"
                  />
                </div>
              </div>

              {/* Employment Type Select - EDITABLE */}
              <div className="w-full space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-2 block">
                  Employment Type
                </label>
                <div className="relative flex items-center bg-slate-50 border-2 border-slate-100 focus-within:border-slate-900 focus-within:bg-white rounded-2xl h-14 transition-all duration-200 shadow-sm">
                  <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto shrink-0">
                    <Briefcase size={16} />
                  </div>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-none pl-4 pr-10 h-full text-sm font-bold text-slate-900 outline-none focus:ring-0 appearance-none cursor-pointer"
                  >
                    <option value="">Select type</option>
                    <option value="Employed">Employed</option>
                    <option value="Self employed">Self Employed</option>
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    size={16}
                  />
                </div>
              </div>

              {/* Current Occupation - EDITABLE */}
              <div className="w-full space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-2 block">
                  Current Occupation
                </label>
                <div className="relative flex items-center bg-slate-50 border-2 border-slate-100 focus-within:border-slate-900 focus-within:bg-white rounded-2xl h-14 transition-all duration-200 shadow-sm">
                  <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto shrink-0">
                    <Navigation size={16} />
                  </div>
                  <input
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleInputChange}
                    placeholder="e.g. Software Engineer"
                    className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none placeholder:text-slate-300 font-medium"
                  />
                </div>
              </div>

              {/* Monthly Income Range (KES) - EDITABLE */}
              <div className="w-full space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-2 block">
                  Monthly Income Range (KES)
                </label>
                <div className="relative flex items-center bg-slate-50 border-2 border-slate-100 focus-within:border-slate-900 focus-within:bg-white rounded-2xl h-14 transition-all duration-200 shadow-sm">
                  <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto shrink-0">
                    <Wallet size={16} />
                  </div>
                  <input
                    name="income"
                    value={formData.income}
                    onChange={handleInputChange}
                    placeholder="e.g. 50,000 - 100,000"
                    className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none placeholder:text-slate-300 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* ANCHORED FOOTER ACTION PANEL */}
            <div className="mt-auto p-8 bg-slate-50 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={handleSave}
                disabled={isLoading}
                className={`w-full h-14 rounded-2xl font-medium uppercase tracking-widest text-xs text-white shadow-md transition-all flex items-center justify-center gap-3
                  ${isLoading ? "bg-slate-300 cursor-not-allowed" : "bg-[#074073] hover:opacity-95 active:scale-[0.99]"}
                `}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Save Financial Details"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditFinancialDetails;

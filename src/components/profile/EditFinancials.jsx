import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Briefcase,
  Landmark,
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

  const primaryColor = "#074073";
  const darkBlue = "#042159";

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#042159]/40 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[40px] shadow-[0px_20px_50px_rgba(0,0,0,0.2)] overflow-hidden border border-slate-100"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full transition-colors z-10"
            >
              <X size={20} className="text-slate-400" />
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mb-4 mx-auto">
                  <Landmark
                    size={32}
                    className={`text-[${primaryColor}]`}
                    style={{ color: primaryColor }}
                  />
                </div>
                <h2 className={`text-2xl font-black text-[${darkBlue}]`}>
                  Financial Profile
                </h2>
                <p className="text-slate-400 text-sm font-medium mt-1">
                  Update your employment and tax information
                </p>
              </div>

              <div className="space-y-6">
                {/* KRA PIN / SSN (Read Only Styled) */}
                <div className="relative group">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                    Tax Identification (KRA PIN)
                  </label>
                  <div className="relative">
                    <ShieldCheck
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={18}
                    />
                    <input
                      type="text"
                      value={formData.snnOrKra}
                      readOnly
                      className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-sm font-bold text-slate-500 cursor-not-allowed"
                      placeholder="A00XXXXXXZ"
                    />
                  </div>
                </div>

                {/* Employment Type Select */}
                <div className="relative group">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                    Employment Type
                  </label>
                  <div className="relative">
                    <Briefcase
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#074073] transition-colors"
                      size={18}
                    />
                    <select
                      name="employmentType"
                      value={formData.employmentType}
                      onChange={handleInputChange}
                      className="w-full h-14 pl-12 pr-12 bg-slate-50 border border-slate-100 focus:border-[#074073] focus:bg-white rounded-2xl outline-none appearance-none text-sm font-bold text-[#042159] transition-all cursor-pointer"
                    >
                      <option value="">Select type</option>
                      <option value="Employed">Employed</option>
                      <option value="Self employed">Self Employed</option>
                    </select>
                    <ChevronDown
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
                      size={18}
                    />
                  </div>
                </div>

                {/* Job Title / Occupation */}
                <div className="relative group">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                    Current Occupation
                  </label>
                  <div className="relative">
                    <Navigation
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#074073] transition-colors"
                      size={18}
                    />
                    <input
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      placeholder="e.g. Software Engineer"
                      className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 focus:border-[#074073] focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold text-[#042159]"
                    />
                  </div>
                </div>

                {/* Monthly Income */}
                <div className="relative group">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                    Monthly Income Range (KES)
                  </label>
                  <div className="relative">
                    <Wallet
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#074073] transition-colors"
                      size={18}
                    />
                    <input
                      name="income"
                      value={formData.income}
                      onChange={handleInputChange}
                      placeholder="e.g. 50,000 - 100,000"
                      className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 focus:border-[#074073] focus:bg-white rounded-2xl outline-none transition-all text-sm font-bold text-[#042159]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-10">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs text-white shadow-xl transition-all flex items-center justify-center gap-3
                    ${isLoading ? "bg-slate-200 text-slate-400 shadow-none" : `bg-[${primaryColor}] hover:opacity-95 active:scale-[0.98] shadow-blue-900/20`}
                  `}
                  style={{
                    backgroundColor: isLoading ? "#e2e8f0" : primaryColor,
                  }}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Save Financial Details"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditFinancialDetails;

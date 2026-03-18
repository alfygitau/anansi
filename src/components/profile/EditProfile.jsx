import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  Loader2,
  Info,
} from "lucide-react";

const EditProfile = ({ isOpen, onClose, customer }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dob: "",
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstname || "",
        lastName: customer.lastname || "",
        email: customer.email || "",
        phoneNumber: customer.mobileno || "",
        dob: customer.dob || "",
      });
    }
  }, [customer]);

  const primaryColor = "#074073";
  const darkBlue = "#042159";

  const handleSave = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Deep Blue Glass Backdrop */}
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
            className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100"
          >
            {/* Header Area */}
            <div className="p-6 pb-0 flex justify-between items-start">
              <div className="flex-1 text-center">
                <h2 className={`text-2xl font-black text-[${darkBlue}]`}>
                  Profile Identity
                </h2>
                <div className="flex items-center justify-center gap-1.5 mt-2 text-slate-400">
                  <Lock size={14} />
                  <p className="text-xs font-medium uppercase tracking-widest">
                    Verified Information
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="absolute top-8 right-8 p-2 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-300" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Names Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                    First Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={17}
                    />
                    <input
                      value={formData.firstName}
                      readOnly
                      className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>
                <div className="relative group">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                    Last Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={17}
                    />
                    <input
                      value={formData.lastName}
                      readOnly
                      className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="relative">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={17}
                  />
                  <input
                    value={formData.email}
                    readOnly
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              {/* Phone Number Field */}
              <div className="relative">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={17}
                  />
                  <input
                    value={formData.phoneNumber}
                    readOnly
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              {/* Date of Birth Field */}
              <div className="relative">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={17}
                  />
                  <input
                    value={formData.dob}
                    readOnly
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              {/* Security Hint */}
              <div className="flex gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                <Info size={16} className="text-[#074073] shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  Identity details are verified and locked. To update these,
                  please contact the{" "}
                  <span className="text-[#074073] font-bold">
                    Admin Support
                  </span>
                  .
                </p>
              </div>

              {/* Button */}
              <div className="pt-2">
                <button
                  onClick={handleSave}
                  className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs text-white transition-all active:scale-[0.98] shadow-xl shadow-blue-900/20`}
                  style={{ backgroundColor: primaryColor }}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Close Profile"
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

export default EditProfile;

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, Calendar, Loader2, Info } from "lucide-react";

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
            {/* CLOSE BUTTON ANCHOR */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 text-gray-500 hover:text-gray-900 rounded-full transition-all active:scale-95 shadow-sm"
            >
              <X size={20} />
            </button>

            {/* HEADER TRACK (Pinned, non-scrollable) */}
            <div className="p-8 pb-4 flex flex-col shrink-0">
              <h2 className="text-xl font-medium text-slate-900">
                Profile Identity
              </h2>
              <div className="flex items-center gap-1.5 text-slate-400">
                <p className="text-[10px] font-medium uppercase tracking-widest">
                  Verified Vault Information
                </p>
              </div>
            </div>
            <div className="border mx-8 border-slate-100"></div>
            {/* SCROLLABLE CENTRAL CONTAINER */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {/* Names Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* First Name Field */}
                <div className="w-full space-y-2">
                  <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-2 block">
                    First Name
                  </label>
                  <div className="relative flex items-center bg-slate-50/50 border-2 border-slate-100 rounded-2xl h-14 shadow-sm select-none">
                    <div className="pl-4 pr-3 flex items-center text-slate-300 border-r border-slate-200/60 h-5 my-auto shrink-0">
                      <User size={16} />
                    </div>
                    <input
                      value={formData.firstName}
                      readOnly
                      className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-400 cursor-not-allowed outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none"
                    />
                  </div>
                </div>

                {/* Last Name Field */}
                <div className="w-full space-y-2">
                  <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-2 block">
                    Last Name
                  </label>
                  <div className="relative flex items-center bg-slate-50/50 border-2 border-slate-100 rounded-2xl h-14 shadow-sm select-none">
                    <div className="pl-4 pr-3 flex items-center text-slate-300 border-r border-slate-200/60 h-5 my-auto shrink-0">
                      <User size={16} />
                    </div>
                    <input
                      value={formData.lastName}
                      readOnly
                      className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-400 cursor-not-allowed outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none"
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div className="w-full space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-2 block">
                  Email Address
                </label>
                <div className="relative flex items-center bg-slate-50/50 border-2 border-slate-100 rounded-2xl h-14 shadow-sm select-none">
                  <div className="pl-4 pr-3 flex items-center text-slate-300 border-r border-slate-200/60 h-5 my-auto shrink-0">
                    <Mail size={16} />
                  </div>
                  <input
                    value={formData.email}
                    readOnly
                    className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-400 cursor-not-allowed outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none"
                  />
                </div>
              </div>

              {/* Phone Number Field */}
              <div className="w-full space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-2 block">
                  Phone Number
                </label>
                <div className="relative flex items-center bg-slate-50/50 border-2 border-slate-100 rounded-2xl h-14 shadow-sm select-none">
                  <div className="pl-4 pr-3 flex items-center text-slate-300 border-r border-slate-200/60 h-5 my-auto shrink-0">
                    <Phone size={16} />
                  </div>
                  <input
                    value={formData.phoneNumber}
                    readOnly
                    className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-400 cursor-not-allowed outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none"
                  />
                </div>
              </div>

              {/* Date of Birth Field */}
              <div className="w-full space-y-2">
                <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-2 block">
                  Date of Birth
                </label>
                <div className="relative flex items-center bg-slate-50/50 border-2 border-slate-100 rounded-2xl h-14 shadow-sm select-none">
                  <div className="pl-4 pr-3 flex items-center text-slate-300 border-r border-slate-200/60 h-5 my-auto shrink-0">
                    <Calendar size={16} />
                  </div>
                  <input
                    value={formData.dob}
                    readOnly
                    className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-400 cursor-not-allowed outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none"
                  />
                </div>
              </div>

              {/* Security Hint Info Block */}
              <div className="flex gap-3 p-4 bg-slate-50 border border-slate-200/60 shadow-sm rounded-2xl">
                <Info size={16} className="text-[#074073] shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  Identity details are verified and locked. To update these,
                  please contact the{" "}
                  <span className="text-[#074073] font-bold">
                    Admin Support Matrix
                  </span>
                  .
                </p>
              </div>
            </div>

            {/* ANCHORED FOOTER ACTION PANEL */}
            <div className="mt-auto p-8 bg-slate-50 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className={`w-full h-14 rounded-2xl font-medium uppercase tracking-widest text-xs text-white shadow-md transition-all flex items-center justify-center gap-3
                  ${loading ? "bg-slate-300 cursor-not-allowed" : "bg-[#074073] hover:opacity-95 active:scale-[0.99]"}
                `}
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Close Profile"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProfile;

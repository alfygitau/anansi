import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Heart,
  MapPin,
  Phone,
  Calendar,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { useMutation } from "react-query";
import { updateNextOfKin } from "../../sdks/customer/customer";
import { useToast } from "../../contexts/ToastProvider";

const EditNextOfKin = ({ isOpen, onClose, customer, refetch }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    relationship: "",
    location: "",
    phoneNumber: "",
    dob: "",
  });

  useEffect(() => {
    if (customer && customer.nextOfKins && customer.nextOfKins.length > 0) {
      const kin = customer.nextOfKins[0];
      setFormData({
        id: kin?.id || "",
        name: kin.name || "",
        relationship: kin.relationship || "",
        location: kin.location || "",
        phoneNumber: kin.phoneNumber || "",
        dob: kin.dateOfBirth || "",
      });
    }
  }, [customer]);

  const primaryColor = "#074073";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    updateKin();
  };

  const { mutate: updateKin, isLoading } = useMutation({
    mutationKey: ["update kin"],
    mutationFn: () =>
      updateNextOfKin(
        formData?.id,
        formData?.name,
        formData?.dob,
        formData?.relationship,
        formData?.phoneNumber,
        formData?.location,
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

            {/* HEADER TRACK (Pinned, non-scrollable) */}
            <div className="p-5 pb-4 flex flex-col shrink-0">
              <h2 className="text-xl font-black text-slate-900">
                Next of Kin Details
              </h2>
              <p className="text-slate-400 w-[80%] text-xs font-medium mt-1  leading-relaxed">
                Provide information about your next of kin for emergency and
                security purposes. This remains strictly confidential.
              </p>
            </div>
            <div className="border mx-5 border-slate-100"></div>
            {/* SCROLLABLE CENTRAL CONTAINER */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
              {/* Name Field */}
              <div className="relative group">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter kin name"
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 focus:border-[#074073] focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                {/* Relationship Field */}
                <div className="relative group">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                    Relationship
                  </label>
                  <div className="relative">
                    <Heart
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={18}
                    />
                    <input
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleInputChange}
                      placeholder="e.g. Spouse"
                      className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 focus:border-[#074073] focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none"
                    />
                  </div>
                </div>

                {/* Date of Birth Field */}
                <div className="relative group">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                      size={18}
                    />
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 focus:border-[#074073] focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none"
                    />
                  </div>
                </div>
              </div>

              {/* Phone Number Field */}
              <div className="relative group">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. +254 7XX XXX XXX"
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 focus:border-[#074073] focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none"
                  />
                </div>
              </div>

              {/* Location Field */}
              <div className="relative group">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                  Location
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={18}
                  />
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Estate"
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 focus:border-[#074073] focus:bg-white rounded-2xl outline-none text-sm font-bold text-slate-900 transition-all focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none"
                  />
                </div>
              </div>
            </div>

            {/* ANCHORED FOOTER ACTION PANEL */}
            <div className="mt-auto p-5 bg-slate-50 border-t border-slate-100 shrink-0">
              <button
                type="button"
                onClick={handleSave}
                disabled={isLoading}
                className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs text-white shadow-md transition-all flex items-center justify-center gap-3
                  ${isLoading ? "bg-slate-300 cursor-not-allowed" : "bg-[#074073] hover:opacity-95 active:scale-[0.99]"}
                `}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Update Kin Details"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditNextOfKin;

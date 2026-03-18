import React, { useState, useEffect } from "react";
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

const EditNextOfKin = ({ isOpen, onClose, customer }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
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
        name: kin.name || "",
        relationship: kin.relationship || "",
        location: kin.location || "",
        phoneNumber: kin.phoneNumber || "",
        dob: kin.dateOfBirth || "",
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
    setLoading(true);
    // Logic for PATCH (if kinId exists) or POST (if new)
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Glassmorphism Backdrop */}
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
            className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-100"
          >
            {/* Header / Info Section */}
            <div className="p-6 pb-0 text-center">
              <button
                onClick={onClose}
                className="absolute top-8 right-8 p-2 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-300" />
              </button>

              <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mb-4 mx-auto">
                <ShieldAlert size={32} style={{ color: primaryColor }} />
              </div>

              <h2 className={`text-2xl font-black text-[${darkBlue}]`}>
                Next of Kin Details
              </h2>
              <p className="text-slate-400 text-sm font-medium mt-3 max-w-[85%] mx-auto leading-relaxed">
                Provide information about your next of kin for emergency and
                security purposes. This remains strictly confidential.
              </p>
            </div>

            <div className="p-6 space-y-5">
              {/* Name Field */}
              <div className="relative group">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#074073]"
                    size={18}
                  />
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter kin name"
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 focus:border-[#074073] focus:bg-white rounded-2xl outline-none text-sm font-bold text-[#042159] transition-all"
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
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#074073]"
                      size={18}
                    />
                    <input
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleInputChange}
                      placeholder="e.g. Spouse"
                      className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 focus:border-[#074073] focus:bg-white rounded-2xl outline-none text-sm font-bold text-[#042159] transition-all"
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
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#074073]"
                      size={18}
                    />
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 focus:border-[#074073] focus:bg-white rounded-2xl outline-none text-sm font-bold text-[#042159] transition-all"
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#074073]"
                    size={18}
                  />
                  <input
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="e.g. +254 7XX XXX XXX"
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 focus:border-[#074073] focus:bg-white rounded-2xl outline-none text-sm font-bold text-[#042159] transition-all"
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#074073]"
                    size={18}
                  />
                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Estate"
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 focus:border-[#074073] focus:bg-white rounded-2xl outline-none text-sm font-bold text-[#042159] transition-all"
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className={`w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs text-white shadow-xl transition-all flex items-center justify-center gap-3
                    ${loading ? "bg-slate-200 text-slate-400 shadow-none" : "hover:opacity-95 active:scale-[0.98] shadow-blue-900/20"}
                  `}
                  style={{
                    backgroundColor: loading ? "#e2e8f0" : primaryColor,
                  }}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    "Update Kin Details"
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

export default EditNextOfKin;

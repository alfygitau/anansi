import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  CreditCard,
  Hash,
  Calendar,
  ShieldCheck,
  Info,
  ArrowRight,
  ChevronLeft,
  Lock,
  FileCheck,
} from "lucide-react";

const ManualIdEntry = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    dateOfBirth: "",
    kraPin: "",
    gender: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1300px] mx-auto"
    >
      {/* Navigation Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-[#042159] transition-colors mb-8 group"
      >
        <ChevronLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span className="text-xs font-bold uppercase tracking-widest">
          Back to Scanner
        </span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: The Form */}
        <div className="lg:col-span-7">
          <header className="mb-10">
            <h1 className="text-3xl font-black text-[#042159] uppercase tracking-tight mb-2">
              Manual Verification
            </h1>
            <p className="text-slate-500">
              Please enter your details exactly as they appear on your National
              ID or Passport.
            </p>
          </header>

          <form className="space-y-6">
            {/* Full Name Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                Full Name (As per ID)
              </label>
              <div className="relative">
                <User
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                  size={20}
                />
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. JOHN DOE OKOTH"
                  className="w-full h-[64px] bg-slate-50 border-2 border-slate-200 focus:border-[#4DB8E4] focus:bg-white rounded-[24px] pl-14 pr-6 transition-all outline-none font-bold text-[#042159]"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID Number */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                  ID Number
                </label>
                <div className="relative">
                  <Hash
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                    size={20}
                  />
                  <input
                    type="text"
                    name="idNumber"
                    placeholder="12345678"
                    className="w-full h-[64px] bg-slate-50 border-2 border-slate-200 focus:border-[#4DB8E4] focus:bg-white rounded-[24px] pl-14 pr-6 transition-all outline-none font-bold text-[#042159]"
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                    size={20}
                  />
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="w-full h-[64px] bg-slate-50 border-2 border-slate-200 focus:border-[#4DB8E4] focus:bg-white rounded-[24px] pl-14 pr-6 transition-all outline-none font-bold text-[#042159]"
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* KRA PIN */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                KRA PIN Number
              </label>
              <div className="relative">
                <FileCheck
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                  size={20}
                />
                <input
                  type="text"
                  name="kraPin"
                  placeholder="A00XXXXXXXX"
                  className="w-full h-[64px] bg-slate-100 border-2 border-slate-200 focus:border-[#4DB8E4] focus:bg-white rounded-[24px] pl-14 pr-6 transition-all outline-none font-bold text-[#042159] uppercase"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-[72px] bg-[#042159] text-white rounded-[28px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 hover:bg-[#4DB8E4] hover:text-[#042159] transition-all shadow-xl shadow-blue-900/20 mt-8"
            >
              Continue <ArrowRight size={20} />
            </button>

            {/* Compliance Disclaimer Footer */}
            <p className="px-8 text-[11px] text-slate-400 text-center leading-relaxed">
              By proceeding, you authorize Anansi Sacco to verify these details
              against official government databases including IPRS and iTax.
            </p>
          </form>
        </div>

        {/* Right Column: Information & Disclaimers */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#042159] rounded-[40px] p-8 text-white relative overflow-hidden">
            <ShieldCheck className="absolute -right-8 -bottom-8 text-white/5 w-64 h-64" />

            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="text-[#4DB8E4]" size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight mb-4 leading-tight">
                Secure Data
                <br />
                Handling
              </h3>
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                Anansi uses AES-256 encryption to protect your identity. Your
                details are strictly used for mandatory KYC (Know Your Customer)
                compliance as required by the SACCO Societies Regulatory
                Authority (SASRA).
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 py-3 border-t border-white/10">
                  <div className="w-2 h-2 bg-[#4DB8E4] rounded-full" />
                  <p className="text-xs font-bold uppercase tracking-widest">
                    End-to-End Encrypted
                  </p>
                </div>
                <div className="flex items-center gap-3 py-3 border-t border-white/10">
                  <div className="w-2 h-2 bg-[#4DB8E4] rounded-full" />
                  <p className="text-xs font-bold uppercase tracking-widest">
                    SASRA Compliant
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-[40px] p-8 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <Info className="text-[#042159]" size={20} />
              <p className="font-black text-[#042159] uppercase text-xs tracking-widest">
                Why is this needed?
              </p>
            </div>
            <p className="text-slate-500 text-[13px] leading-relaxed">
              We collect this information to verify your membership eligibility
              and to secure your financial future. Incorrect information may
              lead to a delay in account activation.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ManualIdEntry;

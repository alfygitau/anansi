import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Trash2,
  Scale,
  AlertCircle,
  Lock,
  UserCheck,
  ShieldCheck,
  Search,
  ArrowRight,
  Sparkles,
  User,
  Pin,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AddGuarantors = ({ limit = 4 }) => {
  const [guarantors, setGuarantors] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const navigate = useNavigate();

  // Simulated search & add logic
  const handleSearchAndAdd = (e) => {
    e.preventDefault();
    if (guarantors.length < limit) {
      setIsSearching(true);
      setTimeout(() => {
        setGuarantors([
          ...guarantors,
          {
            id: Date.now(),
            name: "Samuel Otieno",
            mobile: "0722***901",
            shares: "KES 450,000",
            status: "Eligible",
          },
        ]);
        setIsSearching(false);
        setMemberName("");
        setIdNumber("");
      }, 800);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] pb-24 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* --- PREMIUM HEADER --- */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
              <ShieldCheck size={12} />
              Secured Guarantee Protocol
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
              Assign <span className="text-blue-600">Guarantors</span>
            </h1>
            <p className="text-slate-500 max-w-xl font-medium">
              To finalize your application, you require
              <span className="text-slate-900 font-semibold">
                {" "}
                {limit} qualified members{" "}
              </span>
              to back your request with their uncommitted deposits.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="size-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={`https://i.pravatar.cc/100?img=${i + 10}`}
                    alt="avatar"
                  />
                </div>
              ))}
              <div className="size-10 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                +{limit}
              </div>
            </div>
            <div className="pr-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Network Strength
              </p>
              <p className="text-sm font-bold text-slate-900">
                High Reliability
              </p>
            </div>
          </div>
        </header>
        <div className="my-6 w-full">
          <p className="text-[13px] leading-relaxed font-medium">
            A guarantor is an active member who pledges their **uncommitted
            deposits** to secure your loan. By accepting this role, they enter a
            legally binding agreement to be held
            <span className="text-secondary font-bold">
              {" "}
              jointly and severally liable{" "}
            </span>
            for the debt should a default occur.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* --- LEFT: SEARCH & QUEUE --- */}
          <div className="lg:col-span-7 space-y-4">
            {/* Search Card */}
            <div className="bg-white rounded-[40px] p-5 md:p-5 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600 flex items-center gap-2">
                    <Search size={16} strokeWidth={3} />
                    Member Lookup
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    Sacco Registry
                  </span>
                </div>

                <form onSubmit={handleSearchAndAdd} className="space-y-6">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Enter Member Name"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      className="w-full pl-12 pr-8 py-4 bg-slate-100 border-2 border-transparent rounded-[12px] text-lg font-bold transition-all outline-none focus:border-blue-100 focus:bg-white focus:shadow-xl focus:shadow-blue-900/5 placeholder:text-slate-300"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <User size={24} />
                    </div>
                  </div>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Enter ID Number"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      className="w-full pl-12 pr-8 py-4 bg-slate-100 border-2 border-transparent rounded-[12px] text-lg font-bold transition-all outline-none focus:border-blue-100 focus:bg-white focus:shadow-xl focus:shadow-blue-900/5 placeholder:text-slate-300"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                      <Pin size={24} />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={
                      !memberName ||
                      !idNumber ||
                      isSearching ||
                      guarantors.length >= limit
                    }
                    className="w-full py-6 bg-blue-600 text-white rounded-[32px] font-bold flex items-center justify-center gap-3 shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    {isSearching ? (
                      <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Verify & Add Guarantor
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Selection Queue */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Guarantors Queue ({guarantors.length}/{limit})
                </h3>
              </div>

              <AnimatePresence mode="popLayout">
                {guarantors.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-32 border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center text-slate-300 bg-white/50"
                  >
                    <Users
                      size={48}
                      strokeWidth={1}
                      className="mb-4 opacity-20"
                    />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                      Queue is currently empty
                    </p>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {guarantors.map((g, idx) => (
                      <motion.div
                        key={g.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all shadow-sm"
                      >
                        <div className="flex items-center gap-4">
                          <div className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                            <UserCheck size={24} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900">
                                {g.name}
                              </h4>
                              <span className="text-[8px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md uppercase tracking-tighter">
                                Verified
                              </span>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                              {g.mobile} •{" "}
                              <span className="text-blue-500">{g.shares}</span>{" "}
                              available
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setGuarantors(
                              guarantors.filter((item) => item.id !== g.id),
                            )
                          }
                          className="size-11 rounded-xl flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* --- RIGHT: LIABILITY & EDUCATION --- */}
          <div className="lg:col-span-5 space-y-4">
            {/* The Responsibility Card */}
            <div className="bg-[#0F172A] mb-10 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-[80px] opacity-20" />

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="size-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                    <Scale size={20} className="text-blue-400" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
                    Legal Framework
                  </h3>
                </div>

                <div className="space-y-6">
                  <LiabilityDetail
                    title="Joint & Several Liability"
                    desc="Guarantors are legally bound to repay the loan if the borrower defaults. This is a binding commitment."
                  />
                  <LiabilityDetail
                    title="The Lien Clause"
                    desc="A portion of the guarantor's deposits equivalent to the guaranteed amount will be frozen."
                  />
                </div>

                <div className="mt-10 p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex gap-4">
                    <AlertCircle
                      className="text-amber-400 shrink-0"
                      size={20}
                    />
                    <p className="text-[11px] leading-relaxed text-slate-400">
                      <strong className="text-white block mb-1 uppercase tracking-widest text-[10px]">
                        Warning
                      </strong>
                      All guarantors will receive an encrypted SMS and Email
                      link. They must digitally sign the guarantee within{" "}
                      <span className="text-white font-bold">48 hours</span>.
                    </p>
                  </div>
                </div>

                {guarantors.length >= limit && (
                  <button
                    onClick={() => navigate("/add-statements")}
                    className="w-full mt-10 group bg-blue-600 hover:bg-blue-500 text-white py-6 rounded-[32px] font-bold transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3"
                  >
                    Proceed to Statements
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Check Grid */}
            <div className="grid grid-cols-1 gap-4 px-2">
              <div className="flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-[32px]">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                  <Lock size={18} />
                </div>
                <div>
                  <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                    Encrypted Pledging
                  </h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    Guarantor data is obfuscated until they authorize the
                    request via their secure portal.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 bg-white border border-slate-100 rounded-[32px]">
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-900">
                    Auto-Check
                  </h5>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1">
                    Our system automatically verifies the guarantor's 'Free
                    Shares' ratio before allowing them to be added.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */
const LiabilityDetail = ({ title, desc }) => (
  <div className="group">
    <div className="flex items-center gap-3 mb-2">
      <div className="size-1.5 rounded-full bg-blue-500" />
      <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-200 group-hover:text-blue-400 transition-colors">
        {title}
      </h4>
    </div>
    <p className="text-xs text-slate-500 leading-relaxed pl-4 border-l border-white/10 ml-0.5">
      {desc}
    </p>
  </div>
);

export default AddGuarantors;

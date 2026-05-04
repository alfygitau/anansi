import { useState } from "react";
import {
  Users,
  Trash2,
  ShieldCheck,
  Search,
  ArrowRight,
  User,
  Fingerprint,
  Info,
  Gavel,
  History,
  AlertCircle,
  CheckCircle2,
  Lock,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const AddGuarantors = ({ limit = 4 }) => {
  const [guarantors, setGuarantors] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [memberName, setMemberName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const navigate = useNavigate();

  const handleSearchAndAdd = (e) => {
    e.preventDefault();
    if (guarantors.length < limit) {
      setIsSearching(true);
      setTimeout(() => {
        setGuarantors([
          ...guarantors,
          {
            id: Date.now(),
            name: memberName || "Samuel Otieno",
            idNo: idNumber || "29330101",
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
    <div className="antialiased">
      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* --- LEFT SIDE: ADDING (THE ACTION) --- */}
          <div className="space-y-10">
            <header className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                Nominate <span className="text-blue-600">Guarantors</span>
              </h2>
              <p className="text-slate-500 text-base leading-relaxed">
                Enter the details of the members you wish to have back your loan
                facility. They will receive a secure notification to approve
                your request.
              </p>
            </header>

            <div className="bg-slate-50 border border-slate-200 rounded-[32px] p-8 space-y-8">
              <div className="flex items-center gap-2 text-blue-600">
                <Search size={18} />
                <h3 className="text-[11px] font-black uppercase tracking-widest">
                  Internal Registry Search
                </h3>
              </div>

              <form onSubmit={handleSearchAndAdd} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">
                      Full Member Name
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        type="text"
                        value={memberName}
                        onChange={(e) => setMemberName(e.target.value)}
                        className="w-full h-[54px] pl-12 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-600 outline-none transition-all font-semibold"
                        placeholder="Search by name..."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">
                      National ID / Member Number
                    </label>
                    <div className="relative">
                      <Fingerprint
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={18}
                      />
                      <input
                        type="text"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                        className="w-full h-[54px] pl-12 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-50 focus:border-blue-600 outline-none transition-all font-semibold"
                        placeholder="e.g. 29440101"
                      />
                    </div>
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
                  className="w-full h-[60px] bg-blue-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-20"
                >
                  {isSearching
                    ? "Validating Member..."
                    : "Verify & Add to Queue"}
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>

            {/* Disclaimer Grid */}
            <div className="grid grid-cols-2 gap-6">
              <InfoBlock
                icon={<Lock size={16} className="text-slate-400" />}
                title="Data Privacy"
                text="Member shares are only visible after they grant permission."
              />
              <InfoBlock
                icon={<Gavel size={16} className="text-slate-400" />}
                title="Legal Binding"
                text="Nomination creates a pending legal lien on deposits."
              />
            </div>
          </div>

          {/* --- RIGHT SIDE: LISTING (THE RESULTS) --- */}
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <History size={20} className="text-slate-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Assignment Queue
                </h3>
              </div>
              <div className="px-4 py-1.5 bg-slate-100 rounded-full text-[11px] font-bold">
                Capacity: {guarantors.length} / {limit}
              </div>
            </div>

            <div className="min-h-[480px] space-y-4">
              <AnimatePresence mode="popLayout">
                {guarantors.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="h-[480px] border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center text-center"
                  >
                    <UserPlus size={40} className="text-slate-200 mb-4" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      Queue is Empty
                    </p>
                    <p className="text-xs text-slate-300 mt-2 max-w-[200px]">
                      Nominate members on the left to populate your list.
                    </p>
                  </motion.div>
                ) : (
                  guarantors.map((g) => (
                    <motion.div
                      key={g.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group bg-white border border-slate-100 p-6 rounded-2xl flex items-center justify-between hover:border-blue-200 hover:shadow-xl hover:shadow-slate-100/50 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {g.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900">
                              {g.name}
                            </h4>
                            <CheckCircle2
                              size={14}
                              className="text-emerald-500"
                            />
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                            ID: {g.idNo} •{" "}
                            <span className="text-blue-600">
                              {g.shares} Shares
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setGuarantors(guarantors.filter((x) => x.id !== g.id))
                        }
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>

            {/* Summary & Final Action */}
            <div className="mt-3 space-y-6">
              <div className="flex gap-4 p-5 bg-amber-50/50 border border-amber-100 rounded-2xl">
                <AlertCircle size={20} className="text-amber-500 shrink-0" />
                <p className="text-[11px] leading-relaxed text-amber-800 font-medium">
                  <span className="font-bold uppercase block mb-1">
                    Final Authorization
                  </span>
                  Requests will be sent simultaneously via SMS. Members have 48
                  hours to digitally sign the guarantee form before the link
                  expires.
                </p>
              </div>

              {guarantors.length >= limit && (
                <button
                  onClick={() => navigate("/add-statements")}
                  className="w-full h-[64px] bg-[#0F172A] text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-200"
                >
                  Send Invites & Proceed
                  <ArrowRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* --- MINI COMPONENTS --- */
const InfoBlock = ({ icon, title, text }) => (
  <div className="flex gap-3">
    <div className="mt-1">{icon}</div>
    <div>
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-800">
        {title}
      </h4>
      <p className="text-[10px] text-slate-500 leading-normal mt-1 font-medium">
        {text}
      </p>
    </div>
  </div>
);

export default AddGuarantors;

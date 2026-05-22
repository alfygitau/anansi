import { useState } from "react";
import {
  Trash2,
  Search,
  ArrowRight,
  User,
  Fingerprint,
  Gavel,
  History,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  ShieldCheck,
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
    <div className="w-full text-primary antialiased">
      <main className="max-w-6xl mx-auto">
        <header className="space-y-2 mb-4">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Nominate Guarantors
          </h1>
          <div className="space-y-4">
            <p className="text-slate-500 text-base leading-relaxed">
              Nominate eligible members to act as guarantors for your credit
              facility. Once submitted, your nominees will receive a secure
              digital invitation via the Anansi portal to review your
              application details, verify their available shares, and provide
              legal authorization for the request.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Real-time Validation
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Digital Consent
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Instant Notification
                </span>
              </div>
            </div>
          </div>
        </header>
        <div className="grid grid-cols-1 mb-2 lg:grid-cols-12 gap-8">
          {/* --- LEFT SIDE: CONFIGURATION (7 Cols) --- */}
          <div className="lg:col-span-6 space-y-12">
            <div className="bg-white h-[400px] border border-slate-200 rounded-[32px] p-8 space-y-8">
              <div className="flex items-center gap-3 text-primary">
                <Search size={18} />
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">
                  Registry Search
                </h3>
              </div>

              {/* Search Form Wrapper */}
              <div className="flex items-start">
                <form
                  onSubmit={handleSearchAndAdd}
                  className="space-y-6 w-full"
                >
                  <div className="flex flex-col gap-2">
                    {/* Name Input */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        Member Name
                      </label>
                      <div className="group relative flex items-center">
                        {/* Changed h-full to h-7 to make it shorter than the input */}
                        <div className="absolute left-4 h-7 flex items-center pr-3 border-r border-slate-200 group-focus-within:border-primary/30 transition-colors">
                          <User size={18} className="text-slate-300" />
                        </div>
                        <input
                          type="text"
                          value={memberName}
                          onChange={(e) => setMemberName(e.target.value)}
                          className="w-full h-14 pl-16 bg-white border border-slate-200 rounded-xl focus:border-primary outline-none transition-all font-semibold text-sm"
                          placeholder="Search name..."
                        />
                      </div>
                    </div>

                    {/* ID Input */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        National ID
                      </label>
                      <div className="group relative flex items-center">
                        {/* Changed h-full to h-6 to make the vertical divider float in the center */}
                        <div className="absolute left-4 h-6 flex items-center pr-3 border-r border-slate-200 group-focus-within:border-primary/30 transition-colors">
                          <Fingerprint size={18} className="text-slate-300" />
                        </div>
                        <input
                          type="text"
                          value={idNumber}
                          onChange={(e) => setIdNumber(e.target.value)}
                          className="w-full h-14 pl-16 bg-white border border-slate-200 rounded-xl focus:border-primary outline-none transition-all font-semibold text-sm"
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
                    className="w-full h-16 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-secondary transition-all shadow-xl shadow-primary/10 disabled:opacity-20"
                  >
                    {isSearching
                      ? "Validating Registry..."
                      : "Verify & Add to Queue"}
                    <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {guarantors.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-[400px] border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center text-center p-8"
                  >
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <UserPlus size={24} className="text-slate-200" />
                    </div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Your queue is empty
                    </p>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Search and verify members on the left to add them to your
                      application.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-[400px] border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col gap-2 text-center p-3 overflow-y-auto"
                  >
                    {guarantors.map((g) => (
                      <motion.div
                        key={g.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{
                          opacity: 0,
                          scale: 0.9,
                          transition: { duration: 0.2 },
                        }}
                        className="group bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between hover:border-primary/20 hover:shadow-lg hover:shadow-slate-100 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="size-12 bg-slate-50 rounded-xl flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-white transition-all text-lg">
                            {g.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-900 text-sm tracking-tight">
                                {g.name}
                              </h4>
                              <CheckCircle2
                                size={14}
                                className="text-emerald-500"
                              />
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                              ID: {g.idNo} •{" "}
                              <span className="text-primary">{g.shares}</span>
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            setGuarantors(
                              guarantors.filter((x) => x.id !== g.id),
                            )
                          }
                          className="p-2.5 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        {/* --- RIGHT SIDE: QUEUE (5 Cols) --- */}
        <div>
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <History size={16} className="text-slate-400" />
              <h3 className="text-[11px] font-black uppercase text-slate-400">
                Assignment Queue
              </h3>
            </div>
            <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full">
              {guarantors.length} / {limit} SELECTED
            </span>
          </div>
          {/* Bottom Actions */}
          <div className="pt-5 mb-8 space-y-6">
            <div className="flex gap-4 p-2 bg-amber-50/40 border border-amber-100 rounded-2xl items-center">
              <AlertCircle size={20} className="text-amber-500 shrink-0" />
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-900">
                  Important Notice
                </span>
                <p className="text-[11px] leading-relaxed text-amber-800 font-medium">
                  Nominated members must electronically sign and ratify this
                  guarantee indemnity agreement via the Anansi secure member
                  portal within 48 hours of issuance. Unsigned payloads
                  automatically expire, requiring full configuration
                  re-submission.
                </p>
              </div>
            </div>

            {guarantors.length > 0 && (
              <button
                onClick={() => navigate("/add-statements")}
                className="w-full h-16 bg-[#1A1C1E] text-white rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-200 group"
              >
                Send Invites & Continue
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            )}
          </div>
        </div>
        {/* Regulatory & Security Detail Section */}
        <div className="flex items-start gap-5 w-full">
          <InfoBlock
            icon={<ShieldCheck size={20} className="text-[#005C53]" />}
            title="Privacy & Data Encapsulation"
            text={
              <>
                We utilize{" "}
                <span className="text-slate-900 font-semibold">
                  AES-256 bit encryption
                </span>{" "}
                to shield member financial data. Your nominees' share balances
                and contribution history remain strictly confidential and are
                only revealed to the system's credit engine once they provide
                explicit digital consent through the secure portal.
              </>
            }
          />
          <InfoBlock
            icon={<Gavel size={20} className="text-[#005C53]" />}
            title="Collateral & Lien Protocol"
            text={
              <>
                By nominating a member, you initiate a{" "}
                <span className="text-slate-900 font-semibold">
                  conditional lien
                </span>{" "}
                request. Upon their approval, an amount equivalent to the
                guaranteed portion is legally earmarked within their savings.
                This ensures compliance with Sacco bylaws while protecting the
                mutual interests of all participating members.
              </>
            }
          />
        </div>
      </main>
    </div>
  );
};

const InfoBlock = ({ icon, title, text }) => (
  <div className="flex items-center border p-3 rounded-xl gap-4">
    <div className="shrink-0">{icon}</div>
    <div className="space-y-1">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-800">
        {title}
      </h4>
      <p className="text-[11px] text-slate-500 leading-normal font-medium">
        {text}
      </p>
    </div>
  </div>
);

export default AddGuarantors;

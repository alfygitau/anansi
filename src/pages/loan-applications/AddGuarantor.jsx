import { useState } from "react";
import {
  Users,
  UserPlus,
  ShieldAlert,
  Info,
  Trash2,
  Scale,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddGuarantors = ({ onBack, limit = 3 }) => {
  const [guarantors, setGuarantors] = useState([]);
  const [guarantorName, setGuarantorName] = useState("");
  const [guarantorMobile, setGuarantorMobile] = useState("");
  const navigate = useNavigate();

  const handleAdd = () => {
    // Logic to simulate finding a member
    if (guarantors.length < limit) {
      setGuarantors([
        ...guarantors,
        { id: Date.now(), name: "Samuel Otieno", mobile: "0722***901" },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-[#042159] pb-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <header className="py-6">
          <h1 className="text-3xl font-black tracking-tight">
            Assign Guarantors
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Secure your loan by adding qualified members to guarantee your
            request.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Search & List (7/12) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Search Input Box */}
            <div className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-xl shadow-blue-900/5">
              {/* Header Section */}
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-blue-50 rounded-xl">
                  <UserPlus size={20} className="text-[#042159]" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#042159]">
                  Add New Guarantor
                </h3>
              </div>

              {/* Vertical Input Stack */}
              <div className="flex flex-col gap-6">
                {/* Name Input Group */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4 block">
                    Guarantor Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Samuel Otieno"
                    value={guarantorName}
                    onChange={(e) => setGuarantorName(e.target.value)}
                    className="w-full px-6 py-5 bg-slate-50 border-none rounded-[24px] focus:ring-2 focus:ring-[#4DB8E4]/20 outline-none font-bold text-[#042159] placeholder:text-slate-300 transition-all"
                  />
                </div>

                {/* Mobile Input Group */}
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4 block">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 0722 000 000"
                    value={guarantorMobile}
                    onChange={(e) => setGuarantorMobile(e.target.value)}
                    className="w-full px-6 py-5 bg-slate-50 border-none rounded-[24px] focus:ring-2 focus:ring-[#4DB8E4]/20 outline-none font-bold text-[#042159] placeholder:text-slate-300 transition-all"
                  />
                </div>

                {/* Vertical Action Button */}
                <button
                  onClick={handleAdd}
                  disabled={!guarantorName || !guarantorMobile}
                  className="w-full py-5 bg-[#042159] text-white rounded-[24px] text-[10px] font-black uppercase tracking-[0.15em] hover:bg-[#4DB8E4] transition-all active:scale-[0.98] disabled:opacity-20 disabled:grayscale shadow-lg shadow-blue-900/10"
                >
                  Confirm & Add to List
                </button>
              </div>

              {/* Helpful Tip */}
              <div className="mt-4 pt-4 border-t border-slate-50 px-2 flex items-start gap-3">
                <div className="mt-0.5">
                  <Info size={14} className="text-[#4DB8E4]" />
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase leading-relaxed tracking-tight">
                  Verification needed: Guarantors will receive a secure link to
                  authorize this guarantee via the member portal.
                </p>
              </div>
            </div>

            {/* Selection Queue */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Your Selection ({guarantors.length}/{limit})
                </h3>
              </div>

              {guarantors.length === 0 ? (
                <div className="py-12 border-2 border-dashed border-slate-200 rounded-[40px] flex flex-col items-center justify-center text-slate-300">
                  <UserPlus size={40} strokeWidth={1} />
                  <p className="text-[10px] font-black uppercase tracking-widest mt-4">
                    No guarantors added yet
                  </p>
                </div>
              ) : (
                guarantors.map((g) => (
                  <div
                    key={g.id}
                    className="bg-white p-6 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:border-[#4DB8E4]/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[#042159]">
                        <Users size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{g.name}</h4>
                        <p className="text-[10px] font-mono text-slate-400 uppercase">
                          {g.mobile}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setGuarantors(
                          guarantors.filter((item) => item.id !== g.id),
                        )
                      }
                      className="p-3 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Liability & Legal Info (5/12) */}
          <div className="lg:col-span-5">
            <div className="space-y-6">
              {/* Educational Card */}
              <div className="bg-[#042159] rounded-[40px] p-8 text-white shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <Scale className="text-[#4DB8E4]" size={24} />
                  <h3 className="text-sm font-black uppercase tracking-widest text-white">
                    Guarantor Liability
                  </h3>
                </div>

                <div className="space-y-8">
                  <LiabilityPoint
                    title="Joint & Several Liability"
                    desc="Guarantors are legally bound to repay the loan if the borrower defaults. This is a binding commitment recognized by law."
                  />
                  <LiabilityPoint
                    title="Pledged Security"
                    desc="A portion of the guarantor's deposits/shares equivalent to the amount guaranteed will be frozen until the loan is fully settled."
                  />
                  <LiabilityPoint
                    title="Credit Rating Impact"
                    desc="Default by the borrower may negatively affect the guarantor's ability to borrow and their future credit standing with the institution."
                  />
                </div>

                <div className="mt-10 p-5 bg-white/5 rounded-3xl border border-white/10">
                  <div className="flex gap-3">
                    <ShieldAlert
                      className="text-amber-400 shrink-0"
                      size={20}
                    />
                    <p className="text-[10px] leading-relaxed text-white/60">
                      <strong className="text-white block mb-1 uppercase">
                        Warning
                      </strong>
                      Do not add members who have not explicitly agreed to
                      guarantee your loan. They will receive an SMS notification
                      to accept or decline.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Note */}
              <div className="p-6 bg-white rounded-[32px] border border-slate-100 flex items-center gap-4">
                <Info className="text-[#4DB8E4]" size={20} />
                <p className="text-[10px] font-bold text-slate-400 leading-tight uppercase">
                  Each guarantor must be an active member with sufficient free
                  shares to cover their portion.
                </p>
              </div>

              {guarantors.length >= limit && (
                <button
                  onClick={() => navigate("/normal-loan-terms-conditions")}
                  className="w-full py-5 bg-[#4DB8E4] text-white rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-sky-900/10 hover:scale-[1.02] transition-all"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Sub-Component --- */
const LiabilityPoint = ({ title, desc }) => (
  <div>
    <h4 className="text-[11px] font-black uppercase tracking-widest text-[#4DB8E4] mb-2">
      {title}
    </h4>
    <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
  </div>
);

export default AddGuarantors;

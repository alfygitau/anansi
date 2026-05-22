import { useState } from "react";
import {
  Plus,
  Camera,
  Trash2,
  ShieldCheck,
  Car,
  Home,
  Smartphone,
  Briefcase,
  ChevronRight,
  FileText,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CollateralRegistry = () => {
  const [assets, setAssets] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();

  // Form State
  const [form, setForm] = useState({
    type: "",
    name: "",
    value: "",
    condition: "Excellent",
    description: "",
    image: null,
  });

  const assetTypes = [
    { id: "vehicle", label: "Motor Vehicle", icon: <Car size={20} /> },
    { id: "land", label: "Land / Property", icon: <Home size={20} /> },
    { id: "electronic", label: "Electronics", icon: <Smartphone size={20} /> },
    {
      id: "chattel",
      label: "Household Chattels",
      icon: <Briefcase size={20} />,
    },
  ];

  const handleAddAsset = () => {
    if (form.name && form.value) {
      setAssets([...assets, { ...form, id: Date.now() }]);
      setIsAdding(false);
      setForm({
        type: "",
        name: "",
        value: "",
        condition: "Excellent",
        description: "",
        image: null,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <div className="max-w-6xl sm:px-3 mx-auto overflow-hidden">
        {/* Header Section */}
        <div className="border-b border-slate-50 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-primary uppercase tracking-tight">
              Collateral & Assets
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Register assets to strengthen your loan application and increase
              your limit.
            </p>
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-medium hover:bg-[#062d7a] transition-all shadow-lg shadow-blue-900/10"
          >
            <Plus size={20} /> Add Asset
          </button>
        </div>
        <div className="mt-4 space-y-3">
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Enhance your borrowing power by documenting your physical and
            digital assets. A robust asset portfolio serves as **supplementary
            credit security**, allowing our automated appraisal system to offer
            higher loan limits and more competitive interest rates.
          </p>

          <div className="flex flex-col mb-4 gap-2">
            <div className="flex items-start gap-2">
              <div className="mt-1 bg-secondary w-1.5 h-1.5 rounded-full shrink-0" />
              <p className="text-[11px] text-slate-500 leading-tight">
                <strong className="text-slate-700">Dynamic Limits:</strong>{" "}
                Verified assets can increase your eligible loan ceiling by up to
                40% of the asset's current forced-sale value.
              </p>
            </div>

            <div className="flex items-start gap-2">
              <div className="mt-1 bg-secondary w-1.5 h-1.5 rounded-full shrink-0" />
              <p className="text-[11px] text-slate-500 leading-tight">
                <strong className="text-slate-700">Chattel Security:</strong>{" "}
                Registered household or business items are treated as
                non-possessory collateral, meaning you retain full use of the
                items while they secure your credit facility.
              </p>
            </div>

            <div className="flex items-start gap-2">
              <div className="mt-1 bg-secondary w-1.5 h-1.5 rounded-full shrink-0" />
              <p className="text-[11px] text-slate-500 leading-tight">
                <strong className="text-slate-700">Fast-Track Approval:</strong>{" "}
                Applications backed by verifiable collateral often bypass manual
                credit committee reviews, moving directly to disbursement.
              </p>
            </div>
          </div>
        </div>

        <div>
          {/* Detailed Disclaimer */}
          <div className="my-6 p-5 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-4 items-center">
            <div className="bg-secondary/10 p-2 h-fit rounded-lg text-secondary">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-2">
              <h4 className="text-[11px] font-black text-primary uppercase tracking-widest">
                Asset Valuation & Security
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Assets submitted are used as **security (chattels)** for your
                credit facility. By providing these details, you authorize a
                digital valuation based on current market rates. Images must be
                clear and show the current condition of the asset.
              </p>
            </div>
          </div>

          {/* Assets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.length === 0 ? (
              <div className="col-span-full py-20 bg-white border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                  <Briefcase size={32} />
                </div>
                <p className="text-slate-400 font-medium">
                  No assets registered yet.
                </p>
                <button
                  onClick={() => setIsAdding(true)}
                  className="text-secondary text-sm font-bold mt-2 hover:underline"
                >
                  Click here to start
                </button>
              </div>
            ) : (
              assets.map((asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  onDelete={(id) =>
                    setAssets(assets.filter((a) => a.id !== id))
                  }
                />
              ))
            )}
          </div>
          {/* --- BOTTOM ACTION BAR --- */}
          <div className="mt-12 border-t border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-[11px] font-black text-primary uppercase tracking-widest leading-none">
                  Registry Status
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {assets.length > 0
                    ? `${assets.length} Asset(s) secured. Your credit limit is being optimized.`
                    : "No assets added. You can still continue, but your limit may be restricted."}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/normal-loan-terms-conditions")}
              className="group w-full md:w-[280px] h-16 bg-primary text-white rounded-2xl font-medium uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 hover:bg-[#062d7a] transition-all active:scale-[0.98]"
            >
              Finalize & Continue
              <ChevronRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Add Asset Slide-out Modal */}
      <AnimatePresence>
        {isAdding && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="fixed inset-0 bg-primary/40 bg-slate-900/40 z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[480px] bg-white z-50 shadow-2xl flex flex-col p-6 overflow-y-auto"
            >
              <h2 className="text-xl font-black text-primary uppercase tracking-tight">
                Register Collateral
              </h2>
              <p className="text-sm text-slate-500">Add a collateral</p>
              <div className="space-y-6  mt-6">
                {/* Asset Type Selector */}
                <div className="grid grid-cols-2 gap-3">
                  {assetTypes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setForm({ ...form, type: t.id })}
                      className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${form.type === t.id ? "border-secondary bg-blue-50 text-primary" : "border-slate-100 text-slate-400 hover:border-slate-200"}`}
                    >
                      {t.icon}
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {t.label}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="w-full space-y-2">
                    {/* Label Track */}
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 block">
                      Asset Name / Model
                    </label>

                    {/* Unified Housing Deck Wrapper */}
                    <div className="relative flex items-center bg-slate-50 border-2 border-slate-100 focus-within:border-slate-900 focus-within:bg-white rounded-2xl h-14 transition-all duration-200 shadow-sm">
                      {/* Left Guard Icon Prefix Section */}
                      <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto select-none">
                        <FileText size={16} />
                      </div>

                      {/* Clean Data Field Input */}
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder="e.g. Toyota Corolla 2018"
                        className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:ring-0 placeholder:text-slate-300 font-medium"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="w-full space-y-2">
                        {/* Label Track */}
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 block">
                          Estimated Value (KES)
                        </label>

                        {/* Unified Housing Deck Wrapper */}
                        <div className="relative flex items-center bg-slate-50 border-2 border-slate-100 focus-within:border-slate-900 focus-within:bg-white rounded-2xl h-14 transition-all duration-200 shadow-sm">
                          {/* Left Currency Badge Section */}
                          <div className="pl-5 pr-4 flex items-center text-slate-400 text-xs font-black tracking-wider border-r border-slate-200/60 h-5 my-auto select-none">
                            KES
                          </div>

                          {/* Clean Data Field Input */}
                          <input
                            type="number"
                            value={form.value}
                            onChange={(e) =>
                              setForm({ ...form, value: e.target.value })
                            }
                            placeholder="0.00"
                            className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:ring-0 placeholder:text-slate-300 font-medium"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-[200px] space-y-2">
                      {/* Label Track */}
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-2">
                        Condition
                      </label>

                      {/* Unified Housing Deck Wrapper */}
                      <div className="relative flex items-center bg-slate-50 border-2 border-slate-100 focus-within:border-slate-900 focus-within:bg-white rounded-2xl h-14 transition-all duration-200 shadow-sm">
                        {/* Left Setting Icon Prefix Section */}
                        <div className="pl-4 pr-2.5 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto select-none">
                          <SlidersHorizontal size={14} />
                        </div>

                        {/* Clean Select Interaction Option */}
                        <select
                          value={form.condition}
                          onChange={(e) =>
                            setForm({ ...form, condition: e.target.value })
                          }
                          className="w-full bg-transparent border-none pl-3 pr-8 h-full text-xs font-bold text-slate-900 outline-none focus:ring-0 appearance-none cursor-pointer"
                        >
                          <option value="Excellent">Excellent</option>
                          <option value="Good">Good</option>
                          <option value="Fair">Fair</option>
                        </select>

                        {/* Custom Chevron Indicator to support crisp appearance-none resets */}
                        <ChevronDown
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                          size={14}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 block">
                      Description
                    </label>
                    <textarea
                      rows="3"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-secondary transition-all"
                      placeholder="Identify specific features, serial numbers, or location..."
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </div>

                  {/* Image Upload Placeholder */}
                  <div className="border-2 border-dashed border-slate-200 rounded-[24px] p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-white transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-secondary transition-colors">
                      <Camera size={24} />
                    </div>
                    <p className="text-[10px] font-bold text-slate-500 mt-3 uppercase tracking-wider">
                      Upload Asset Photo / Documentation
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleAddAsset}
                  className="w-full h-16 bg-primary text-white rounded-2xl font-medium uppercase tracking-widest shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-all"
                >
                  Save to Registry
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const AssetCard = ({ asset, onDelete }) => (
  <div className="bg-white border border-slate-100 rounded-[24px] p-5 shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#074073]">
        {asset.type === "vehicle" ? (
          <Car size={24} />
        ) : asset.type === "land" ? (
          <Home size={24} />
        ) : (
          <Briefcase size={24} />
        )}
      </div>
      <button
        onClick={() => onDelete(asset.id)}
        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
      >
        <Trash2 size={18} />
      </button>
    </div>
    <h3 className="font-bold text-slate-800 mb-1">{asset.name}</h3>
    <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-3">
      KES {Number(asset.value).toLocaleString()}
    </p>

    <div className="flex items-center gap-2 mb-4">
      <span
        className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${asset.condition === "Excellent" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
      >
        {asset.condition}
      </span>
    </div>

    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
      <span className="text-[10px] text-slate-400 font-medium italic truncate max-w-[120px]">
        {asset.description || "No description provided"}
      </span>
      <ChevronRight
        size={16}
        className="text-slate-300 group-hover:translate-x-1 transition-transform"
      />
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-primary uppercase tracking-widest block">
      {label}
    </label>
    <input
      className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 transition-all"
      {...props}
      onChange={(e) => props.onChange(e.target.value)}
    />
  </div>
);

export default CollateralRegistry;

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
  RefreshCw,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import {
  addColleteral,
  fetchChattels,
} from "../../sdks/collaterals/collateral";

const CollateralRegistry = () => {
  const [assets, setAssets] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const navigate = useNavigate();
  const { appId } = useParams();
  const { showToast } = useToast();
  // Form State
  const [form, setForm] = useState({
    type: "",
    name: "",
    value: "",
    condition: "Excellent",
    description: "",
    image: null,
    image: [],
    image: [],
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

  const [errors, setErrors] = useState({
    type: "",
    name: "",
    value: "",
    description: "",
  });
  // 2. Asset Type Blur Watcher
  const handleTypeSelect = (typeId) => {
    setForm({ ...form, type: typeId });
    if (errors.type) setErrors((prev) => ({ ...prev, type: "" }));
  };

  // 3. Name Field Blur Validation
  const handleNameBlur = () => {
    let errorMsg = "";
    if (!form.name.trim()) {
      errorMsg = "Asset verification model name is required.";
    } else if (form.name.trim().length < 3) {
      errorMsg = "Please supply a descriptive name (min 3 characters).";
    }
    setErrors((prev) => ({ ...prev, name: errorMsg }));
  };

  // 4. Value Field Blur Validation
  const handleValueBlur = () => {
    let errorMsg = "";
    const numericValue = Number(form.value);
    if (!form.value || isNaN(numericValue) || numericValue <= 0) {
      errorMsg = "Please enter a valid estimated valuation.";
    }
    setErrors((prev) => ({ ...prev, value: errorMsg }));
  };

  // 5. Description Field Blur Validation
  const handleDescriptionBlur = () => {
    let errorMsg = "";
    if (!form.description.trim()) {
      errorMsg = "A short collateral validation summary is required.";
    } else if (form.description.trim().length < 15) {
      errorMsg = "Provide more details (minimum 15 characters).";
    }
    setErrors((prev) => ({ ...prev, description: errorMsg }));
  };

  const { mutate, isLoading } = useMutation({
    mutationKey: ["add chattels", appId],
    mutationFn: async () => {
      const response = await addColleteral(
        appId,
        form?.name,
        form?.type,
        form?.value,
        form?.images,
        form?.documents,
      );
      return response?.data?.data;
    },
    onSuccess: (data) => {
      refetch();
      setForm({
        type: "",
        name: "",
        value: "",
        condition: "Excellent",
        description: "",
        image: null,
        image: [],
        image: [],
      });
      setIsAdding(false);
    },
    onError: (error) => {
      showToast({
        title: "Application Failure",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const { refetch } = useQuery({
    queryKey: ["get chattels", appId],
    queryFn: async () => {
      const response = await fetchChattels(appId);
      return response.data?.data;
    },
    onSuccess: (data) => {
      setAssets(data);
    },
    onError: (error) => {
      showToast({
        title: "Application Failure",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const handleAddAsset = async () => {
    mutate();
  };

  const isCollateralValid = () => {
    const isTypeValid = !!form.type;
    const isNameValid = form.name.trim().length >= 3;
    const isValueValid = !isNaN(Number(form.value)) && Number(form.value) > 0;
    const isDescValid = form.description.trim().length >= 15;

    return (
      isTypeValid &&
      isNameValid &&
      isValueValid &&
      isDescValid &&
      !errors.name &&
      !errors.value &&
      !errors.description &&
      !errors.type
    );
  };

  return (
    <div className="bg-[#F8FAFC] font-sans">
      <div className="max-w-6xl sm:px-3 mx-auto overflow-hidden">
        {/* Header Section */}
        <div className="border-b border-slate-50 mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-medium text-primary uppercase tracking-tight">
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
              <h4 className="text-[11px] font-medium text-primary uppercase tracking-widest">
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
              assets?.map((asset) => (
                <AssetCard
                  key={asset?.id}
                  asset={asset}
                  onDelete={(id) =>
                    setAssets(assets?.filter((a) => a.id !== id))
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
                <p className="text-[11px] font-medium text-primary uppercase tracking-widest leading-none">
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
              onClick={() => navigate(`/loan-terms-conditions/${appId}`)}
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
              className="fixed inset-0 bg-slate-900/40 z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[480px] bg-white z-50 shadow-2xl flex flex-col p-6 overflow-y-auto"
            >
              <h2 className="text-xl font-medium text-primary uppercase tracking-tight">
                Register Collateral
              </h2>
              <p className="text-sm text-slate-500">Add a collateral asset</p>

              <div className="space-y-6 mt-6">
                {/* ====== 1. ASSET TYPE SELECTOR SECTION ====== */}
                <div className="space-y-1.5 relative">
                  <div className="grid grid-cols-2 gap-3">
                    {assetTypes.map((t) => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => handleTypeSelect(t.id)}
                        className={`p-2 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                          form.type === t.id
                            ? "border-secondary bg-blue-50 text-primary font-bold shadow-sm"
                            : errors.type
                              ? "border-rose-300 bg-rose-50/20 text-slate-400 hover:border-rose-400"
                              : "border-slate-100 text-slate-400 hover:border-slate-200"
                        }`}
                      >
                        {t.icon}
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          {t.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  {/* Absolute Error Slot */}
                  <div className="absolute left-1 bottom-0 h-4 overflow-visible">
                    <p
                      className={`text-[10px] font-bold text-rose-500 transition-opacity duration-200 ${errors.type ? "opacity-100" : "opacity-0"}`}
                    >
                      {errors.type}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* ====== 2. ASSET NAME INPUT SECTION ====== */}
                  <div className="w-full space-y-1.5 relative pb-4">
                    <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-2 block">
                      Asset Name / Model
                    </label>
                    <div
                      className={`relative flex items-center bg-slate-50 border-2 rounded-2xl h-14 transition-all duration-200 shadow-sm focus-within:bg-white ${
                        errors.name
                          ? "border-rose-500 focus-within:border-rose-600"
                          : "border-slate-100 focus-within:border-slate-900"
                      }`}
                    >
                      <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto select-none">
                        <FileText size={16} />
                      </div>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => {
                          setForm({ ...form, name: e.target.value });
                          if (errors.name)
                            setErrors((prev) => ({ ...prev, name: "" }));
                        }}
                        onBlur={handleNameBlur}
                        placeholder="e.g. Toyota Corolla 2018"
                        className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:ring-0 placeholder:text-slate-300"
                      />
                    </div>
                    {/* Absolute Error Slot */}
                    <div className="absolute left-2 bottom-0 h-4 overflow-visible">
                      <p
                        className={`text-[10px] font-bold text-rose-500 transition-opacity duration-200 ${errors.name ? "opacity-100" : "opacity-0"}`}
                      >
                        {errors.name}
                      </p>
                    </div>
                  </div>

                  {/* ====== 3. VALUE & CONDITION SECTION ====== */}
                  <div className="flex gap-4 items-start">
                    {/* Estimated Value */}
                    <div className="flex-1 space-y-1.5 relative pb-4">
                      <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-2 block">
                        Estimated Value (KES)
                      </label>
                      <div
                        className={`relative flex items-center bg-slate-50 border-2 rounded-2xl h-14 transition-all duration-200 shadow-sm focus-within:bg-white ${
                          errors.value
                            ? "border-rose-500 focus-within:border-rose-600"
                            : "border-slate-100 focus-within:border-slate-900"
                        }`}
                      >
                        <div className="pl-5 pr-4 flex items-center text-slate-400 text-xs font-medium tracking-wider border-r border-slate-200/60 h-5 my-auto select-none">
                          KES
                        </div>
                        <input
                          type="number"
                          value={form.value}
                          onChange={(e) => {
                            setForm({ ...form, value: e.target.value });
                            if (errors.value)
                              setErrors((prev) => ({ ...prev, value: "" }));
                          }}
                          onBlur={handleValueBlur}
                          placeholder="0.00"
                          className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:ring-0 placeholder:text-slate-300"
                        />
                      </div>
                      {/* Absolute Error Slot */}
                      <div className="absolute left-2 bottom-0 h-4 overflow-visible">
                        <p
                          className={`text-[10px] font-bold text-rose-500 transition-opacity duration-200 ${errors.value ? "opacity-100" : "opacity-0"}`}
                        >
                          {errors.value}
                        </p>
                      </div>
                    </div>

                    {/* Condition Options Selector */}
                    <div className="w-[180px] space-y-1.5 pb-4">
                      <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest block ml-2">
                        Condition
                      </label>
                      <div className="relative flex items-center bg-slate-50 border-2 border-slate-100 focus-within:border-slate-900 focus-within:bg-white rounded-2xl h-14 transition-all duration-200 shadow-sm">
                        <div className="pl-4 pr-2.5 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto select-none">
                          <SlidersHorizontal size={14} />
                        </div>
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
                        <ChevronDown
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                          size={14}
                        />
                      </div>
                    </div>
                  </div>

                  {/* ====== 4. DESCRIPTION TEXTAREA SECTION ====== */}
                  <div className="space-y-1.5 relative pb-4">
                    <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-2 block">
                      Description
                    </label>
                    <textarea
                      rows="3"
                      value={form.description}
                      onChange={(e) => {
                        setForm({ ...form, description: e.target.value });
                        if (errors.description)
                          setErrors((prev) => ({ ...prev, description: "" }));
                      }}
                      onBlur={handleDescriptionBlur}
                      className={`w-full p-4 bg-slate-50 border rounded-2xl text-sm outline-none transition-all ${
                        errors.description
                          ? "border-rose-500 focus:border-rose-600"
                          : "border-slate-100 focus:border-secondary"
                      }`}
                      placeholder="Identify specific features, serial numbers, or location..."
                    />
                    {/* Absolute Error Slot */}
                    <div className="absolute left-2 bottom-0 h-4 overflow-visible">
                      <p
                        className={`text-[10px] font-bold text-rose-500 transition-opacity duration-200 ${errors.description ? "opacity-100" : "opacity-0"}`}
                      >
                        {errors.description}
                      </p>
                    </div>
                  </div>

                  {/* Image Upload Block Placeholder */}
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
                  type="button"
                  onClick={() => {
                    if (isLoading) return;

                    if (isCollateralValid()) {
                      handleAddAsset();
                    } else {
                      handleNameBlur();
                      handleValueBlur();
                      handleDescriptionBlur();
                    }
                  }}
                  disabled={!isCollateralValid() || isLoading}
                  className="w-full h-16 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-blue-900/10 active:scale-[0.98] transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw
                        size={14}
                        className="animate-spin text-white/80"
                      />
                      <span>Saving to Registry...</span>
                    </>
                  ) : (
                    /* Standard Idle State UI */
                    <span>Save to Registry</span>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const AssetCard = ({ asset, onDelete, onClickDetails }) => {
  // Safe Date Formatting Routine (Handles ISO Strings gracefully)
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(dateString));
    } catch (e) {
      return "Invalid Date";
    }
  };

  // Centralized theme resolver for condition badges
  const getConditionTheme = (condition = "") => {
    switch (condition.toLowerCase().trim()) {
      case "excellent":
        return "bg-emerald-50 border-emerald-100 text-emerald-700";
      case "good":
        return "bg-blue-50 border-blue-100 text-blue-700";
      case "fair":
      default:
        return "bg-amber-50 border-amber-100 text-amber-700";
    }
  };

  return (
    <div
      onClick={onClickDetails}
      className="bg-white border border-slate-100 rounded-[28px] p-5 shadow-[0_8px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.03)] hover:border-slate-200/80 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Header Row Action Deck */}
        <div className="flex justify-between items-start mb-4">
          {/* Asset Category Branded Icon Context */}
          <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-[#0A2351] transition-transform duration-300 group-hover:scale-105">
            {asset.type === "vehicle" ? (
              <Car size={22} strokeWidth={2} />
            ) : asset.type === "land" ? (
              <Home size={22} strokeWidth={2} />
            ) : (
              <Briefcase size={22} strokeWidth={2} />
            )}
          </div>

          {/* Destructive Delete Execution Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation(); // ⚡ CRITICAL: Blocks container click event bubbling
              onDelete(asset.id);
            }}
            className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-95"
            title="Remove asset registry profile"
          >
            <Trash2 size={16} strokeWidth={2.25} />
          </button>
        </div>

        {/* Primary Meta Content Stack */}
        <div className="space-y-1 mb-4">
          <h3 className="font-bold text-[#0A2351] text-[15px] tracking-tight truncate">
            {asset.asset_name}
          </h3>
          <p className="text-sm font-semibold text-slate-900 tracking-tight">
            KES{" "}
            {Number(asset.estimated_value ?? 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        {/* Context Information Meta Badges Row */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          {/* Dynamic Condition Status Capsule */}
          <span
            className={`px-2.5 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-wider ${getConditionTheme(asset.condition)}`}
          >
            {asset.condition || "Excellent"}
          </span>

          {/* ⚡ NEW: Date Created Metadata Badge Row */}
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium pl-1">
            <Calendar size={11} className="text-slate-300 shrink-0" />
            <span>Added {formatDate(asset.created_at || asset.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Card Secondary Action Drawer Footer Divider */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-[11px] text-slate-400 font-medium leading-normal line-clamp-1 flex-1 pr-4">
          {asset.description || "No specific metadata notes supplied."}
        </span>
        <ChevronRight
          size={16}
          className="text-slate-300 group-hover:text-[#0A2351] group-hover:translate-x-1 transition-all duration-300 shrink-0"
          strokeWidth={2.5}
        />
      </div>
    </div>
  );
};

export default CollateralRegistry;

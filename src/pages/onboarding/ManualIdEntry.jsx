import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  Hash,
  Calendar,
  ShieldCheck,
  Info,
  ArrowRight,
  Lock,
  Loader2,
  Fingerprint,
} from "lucide-react";
import { useStore } from "../../store/useStore";
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import useAuth from "../../hooks/useAuth";
import { updateCustomerPersonalInformation } from "../../sdks/customer/customer";

const ManualIdEntry = () => {
  const { auth } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const kycDetails = useStore((state) => state.kyc_details);

  const splitName = (fullName) => {
    if (!fullName) return { firstName: "", middleName: "", lastName: "" };
    const parts = fullName.trim().split(/\s+/);
    return {
      firstName: parts[0] || "",
      lastName: parts.length > 1 ? parts[parts.length - 1] : "",
      middleName: parts.slice(1, -1).join(" ") || "",
    };
  };

  const names = splitName(kycDetails?.fullNames || kycDetails?.fullName);
  const todayString = useMemo(() => {
    const today = new Date();
    const year = today.getFullYear();
    // Ensure month and day are padded with a leading zero if they are single digits
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`; // Outputs: "2026-05-22"
  }, []);

  const [formData, setFormData] = useState({
    firstName: names.firstName,
    middleName: names.middleName,
    lastName: names.lastName,
    idNumber: kycDetails?.idNumber || "",
    dateOfBirth: kycDetails?.dateOfBirth || "",
    gender: kycDetails?.gender || "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateField = (name, value) => {
    let error = "";
    if (!value || value.trim() === "") {
      error = `${name.replace(/([A-Z])/g, " $1")} is required`;
    }
    if (name === "idNumber" && value.length < 6) {
      error = "ID Number must be at least 6 digits";
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const isInvalid =
    !formData.firstName ||
    !formData.lastName ||
    !formData.idNumber ||
    !formData.dateOfBirth ||
    Object.values(errors).some((error) => error !== "");

  const { mutate: updateCustomerMutate, isLoading } = useMutation({
    mutationKey: ["update-customer-personal-info"],
    mutationFn: () =>
      updateCustomerPersonalInformation(
        auth?.user?.id,
        formData?.firstName,
        formData?.middleName,
        formData?.lastName,
        formData?.idNumber,
        formData?.gender,
        formData?.dateOfBirth,
      ),
    onSuccess: async () => {
      showToast({
        title: "Identity Verified",
        type: "success",
        position: "top-right",
        description:
          "Your details have been synced. Moving you to the next step...",
      });
      navigate("/onboarding/facial-identity");
    },
    onError: (error) => {
      showToast({
        title: "Onboarding glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const handleManualEntry = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "middleName" && !formData[key]) {
        newErrors[key] = "Field is required";
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(
        Object.keys(formData).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {},
        ),
      );
      showToast({
        title: "Check your details",
        type: "error",
        position: "top-right",
        description: "Please correct the highlighted errors before proceeding.",
      });
      return;
    }
    await updateCustomerMutate();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[1300px] md:px-6 sm:px-4 mb-10 mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT COLUMN: REGISTRY CONFIGURATION WORKSPACE */}
        <div className="lg:col-span-7">
          <header className="mb-10">
            <h1 className="text-2xl font-extrabold tracking-tight text-primary">
              Manual ID Entry
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Please declare your details precisely as they appear on your
              National ID or Passport framework.
            </p>
          </header>

          <form className="space-y-8" onSubmit={handleManualEntry}>
            {/* CATEGORY 1: LEGAL IDENTITY NAME REGISTER */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Personal Identity
                </h3>
              </div>

              {/* First & Middle Name Side-by-Side Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="w-full space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 block">
                    First Name
                  </label>
                  <div className="relative flex items-center bg-white border-2 border-slate-100 focus-within:border-slate-900 focus-within:bg-white rounded-2xl h-16 transition-all duration-200">
                    <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto select-none shrink-0">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={formData?.firstName}
                      onBlur={handleBlur}
                      onChange={handleInputChange}
                      placeholder="e.g. JOHN"
                      className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:outline-none border-0 focus:border-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none placeholder:text-slate-300 font-medium"
                    />
                  </div>
                  {errors.firstName && touched.firstName && (
                    <p className="text-[10px] text-red-500 font-bold ml-2 uppercase tracking-tight">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Middle Name */}
                <div className="w-full space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 block">
                    Middle Name (Optional)
                  </label>
                  <div className="relative flex items-center bg-white border-2 border-slate-100 focus-within:border-slate-900 focus-within:bg-white rounded-2xl h-16 transition-all duration-200">
                    <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto select-none shrink-0">
                      <User size={16} />
                    </div>
                    <input
                      type="text"
                      name="middleName"
                      value={formData?.middleName}
                      onBlur={handleBlur}
                      onChange={handleInputChange}
                      placeholder="e.g. DOE"
                      className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:outline-none border-0 focus:border-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none placeholder:text-slate-300 font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Last Name */}
              <div className="w-full space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 block">
                  Last Name / Surname
                </label>
                <div className="relative flex items-center bg-white border-2 border-slate-100 focus-within:border-slate-900 focus-within:bg-white rounded-2xl h-16 transition-all duration-200">
                  <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto select-none shrink-0">
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData?.lastName}
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    placeholder="e.g. OKOTH"
                    className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:outline-none border-0 focus:border-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none placeholder:text-slate-300 font-medium"
                  />
                </div>
                {errors.lastName && touched.lastName && (
                  <p className="text-[10px] text-red-500 font-bold ml-2 uppercase tracking-tight">
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* CATEGORY 2: STATUTORY PARAMETERS & META DATA */}
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Statutory Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ID Number */}
                <div className="w-full space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 block">
                    ID Number
                  </label>
                  <div className="relative flex items-center bg-white border-2 border-slate-100 focus-within:border-slate-900 focus-within:bg-white rounded-2xl h-16 transition-all duration-200">
                    <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto select-none shrink-0">
                      <Hash size={16} />
                    </div>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData?.idNumber}
                      onBlur={handleBlur}
                      onChange={handleInputChange}
                      placeholder="12345678"
                      className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:outline-none border-0 focus:border-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none placeholder:text-slate-300 font-medium"
                    />
                  </div>
                  {errors.idNumber && touched.idNumber && (
                    <p className="text-[10px] text-red-500 font-bold ml-2 uppercase tracking-tight">
                      {errors.idNumber}
                    </p>
                  )}
                </div>

                {/* Date of Birth */}
                <div className="w-full space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 block">
                    Date of Birth
                  </label>
                  <div className="relative flex items-center bg-white border-2 border-slate-100 focus-within:border-slate-900 focus-within:bg-white rounded-2xl h-16 transition-all duration-200">
                    <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto select-none shrink-0">
                      <Calendar size={16} />
                    </div>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData?.dateOfBirth}
                      max={todayString}
                      onBlur={handleBlur}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:outline-none border-0 focus:border-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none cursor-pointer"
                    />
                  </div>
                  {errors.dateOfBirth && touched.dateOfBirth && (
                    <p className="text-[10px] text-red-500 font-bold ml-2 uppercase tracking-tight">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>
              </div>

              {/* Gender Select Dropdown */}
              <div className="w-full space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2 block">
                  Gender Configuration
                </label>
                <div className="relative flex items-center bg-white border-2 border-slate-100 focus-within:border-slate-900 focus-within:bg-white rounded-2xl h-16 transition-all duration-200">
                  <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto select-none shrink-0">
                    <Fingerprint size={16} />
                  </div>
                  <select
                    name="gender"
                    value={formData?.gender}
                    onBlur={handleBlur}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-none pl-4 pr-10 h-full text-sm font-bold text-slate-900 outline-none focus:ring-0 appearance-none cursor-pointer"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {errors.gender && touched.gender && (
                  <p className="text-[10px] text-red-500 font-bold ml-2 uppercase tracking-tight">
                    {errors.gender}
                  </p>
                )}
              </div>
            </div>

            {/* PROGRESS ACTIONS CONTROLLER BLOCK */}
            <button
              type="submit"
              disabled={isLoading || isInvalid}
              className={`w-full h-14 rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all mt-8 shadow-sm
                ${
                  isLoading || isInvalid
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/40 shadow-none"
                    : "bg-slate-900 text-white hover:bg-slate-800 active:scale-[0.99]"
                }
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 text-slate-400" />
                  <span>Processing Verification Ledger...</span>
                </>
              ) : (
                <>
                  <span>Verify & Proceed</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: DESATURATED COMPLIANCE SIDEBARS */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Vault Declaration Box */}
          <div className="bg-slate-50/50 border border-slate-200/60 rounded-[32px] p-6 space-y-6">
            <div className="flex justify-between items-start border-b border-slate-200/60 pb-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Cryptographic Vault
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-semibold">
                  Secure Identity Ledger Core
                </p>
              </div>
              <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 shadow-sm">
                <Lock size={16} />
              </div>
            </div>

            <p className="text-slate-500 text-xs leading-relaxed font-medium">
              Anansi handles personal documentation pools using full
              industry-grade AES-256 protocols. Your verified indices are logged
              exclusively for mandatory KYC matching routines mandated by SASRA
              financial guidelines.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/40 shadow-sm">
                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                  End-to-End Encrypted Tunnel
                </p>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200/40 shadow-sm">
                <div className="w-1.5 h-1.5 bg-slate-900 rounded-full" />
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                  SASRA Regulatory Protocol Bound
                </p>
              </div>
            </div>
          </div>

          {/* Context Advisory Box */}
          <div className="bg-slate-50/50 border border-slate-200/60 rounded-[32px] p-6">
            <div className="flex items-center gap-2.5 mb-3">
              <Info className="text-slate-500" size={16} />
              <p className="font-black text-slate-700 uppercase text-[10px] tracking-widest">
                Context Advisory
              </p>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">
              We compile these metrics to establish clean profile indexing keys
              on the shared registry. Discrepancies or mismatch vectors can
              pause system activation sequences during processing.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ManualIdEntry;

import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  Hash,
  Calendar,
  ShieldCheck,
  Info,
  ArrowRight,
  ChevronLeft,
  Lock,
  FileCheck,
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
  const firstName = names.firstName;
  const middleName = names.middleName;
  const lastName = names.lastName;

  const [formData, setFormData] = useState({
    firstName: firstName,
    middleName: middleName,
    lastName: lastName,
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
      className="max-w-[1300px] sm:px-4 md:px-6 mx-auto"
    >
      {/* Navigation Header */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 group"
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
            <h1 className="text-3xl font-black text-primary uppercase tracking-tight mb-2">
              Manual ID Entry
            </h1>
            <p className="text-slate-500">
              Please enter your details exactly as they appear on your National
              ID or Passport.
            </p>
          </header>

          <form className="space-y-6" onSubmit={handleManualEntry}>
            {/* Full Name Input */}
            <div className="space-y-4">
              {/* First & Middle Name Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                    First Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                      size={20}
                    />
                    <input
                      type="text"
                      name="firstName"
                      value={formData?.firstName}
                      onBlur={handleBlur}
                      placeholder="e.g. JOHN"
                      className="w-full h-[64px] bg-slate-50 border-2 border-slate-200 focus:border-secondary focus:bg-white rounded-[20px] pl-14 pr-6 transition-all outline-none font-bold text-primary"
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.firstName && touched.firstName && (
                    <p className="text-[10px] text-red-500 font-bold ml-4 uppercase tracking-tighter">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Middle Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                    Middle Name (Optional)
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                      size={20}
                    />
                    <input
                      type="text"
                      name="middleName"
                      value={formData?.middleName}
                      onBlur={handleBlur}
                      placeholder="e.g. DOE"
                      className="w-full h-[64px] bg-slate-50 border-2 border-slate-200 focus:border-secondary focus:bg-white rounded-[20px] pl-14 pr-6 transition-all outline-none font-bold text-primary"
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.middleName && touched.middleName && (
                    <p className="text-[10px] text-red-500 font-bold ml-4 uppercase tracking-tighter">
                      {errors.middleName}
                    </p>
                  )}
                </div>
              </div>

              {/* Last Name (Full Width) */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                  Last Name / Surname
                </label>
                <div className="relative">
                  <User
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                    size={20}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData?.lastName}
                    onBlur={handleBlur}
                    placeholder="e.g. OKOTH"
                    className="w-full h-[64px] bg-slate-50 border-2 border-slate-200 focus:border-secondary focus:bg-white rounded-[20px] pl-14 pr-6 transition-all outline-none font-bold text-primary"
                    onChange={handleInputChange}
                  />
                </div>
                {errors.lastName && touched.lastName && (
                  <p className="text-[10px] text-red-500 font-bold ml-4 uppercase tracking-tighter">
                    {errors.lastName}
                  </p>
                )}
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
                    value={formData?.idNumber}
                    onBlur={handleBlur}
                    placeholder="12345678"
                    className="w-full h-[64px] bg-slate-50 border-2 border-slate-200 focus:border-secondary focus:bg-white rounded-[20px] pl-14 pr-6 transition-all outline-none font-bold text-primary"
                    onChange={handleInputChange}
                  />
                </div>
                {errors.idNumber && touched.idNumber && (
                  <p className="text-[10px] text-red-500 font-bold ml-4 uppercase tracking-tighter">
                    {errors.idNumber}
                  </p>
                )}
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
                    value={formData?.dateOfBirth}
                    onBlur={handleBlur}
                    className="w-full h-[64px] bg-slate-50 border-2 border-slate-200 focus:border-secondary focus:bg-white rounded-[20px] pl-14 pr-6 transition-all outline-none font-bold text-primary"
                    onChange={handleInputChange}
                  />
                </div>
                {errors.dateOfBirth && touched.dateOfBirth && (
                  <p className="text-[10px] text-red-500 font-bold ml-4 uppercase tracking-tighter">
                    {errors.dateOfBirth}
                  </p>
                )}
              </div>
            </div>

            {/* KRA PIN */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">
                Gender
              </label>
              <div className="relative">
                <FileCheck
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                  size={20}
                />
                <input
                  type="text"
                  name="gender"
                  value={formData?.gender}
                  onBlur={handleBlur}
                  placeholder="e.g male"
                  className="w-full h-[64px] bg-slate-100 border-2 border-slate-200 focus:border-secondary focus:bg-white rounded-[24px] pl-14 pr-6 transition-all outline-none font-bold text-primary"
                  onChange={handleInputChange}
                />
              </div>
              {errors.gender && touched.gender && (
                <p className="text-[10px] text-red-500 font-bold ml-4 uppercase tracking-tighter">
                  {errors.gender}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || isInvalid}
              className={`w-full h-[72px] rounded-[28px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all shadow-xl mt-8 ${
                isLoading || isInvalid
                  ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  : "bg-primary text-white hover:bg-secondary hover:text-primary shadow-blue-900/20 active:scale-[0.98]"
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-slate-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Continue <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Compliance Disclaimer Footer */}
            <p className="text-[11px] text-slate-400 leading-relaxed">
              By proceeding, you authorize Anansi Sacco to verify these details
              against official government databases including IPRS and iTax.
            </p>
          </form>
        </div>

        {/* Right Column: Information & Disclaimers */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-primary rounded-[40px] p-8 text-white relative overflow-hidden">
            <ShieldCheck className="absolute -right-8 -bottom-8 text-white/5 w-64 h-64" />

            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <Lock className="text-secondary" size={24} />
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
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <p className="text-xs font-bold uppercase tracking-widest">
                    End-to-End Encrypted
                  </p>
                </div>
                <div className="flex items-center gap-3 py-3 border-t border-white/10">
                  <div className="w-2 h-2 bg-secondary rounded-full" />
                  <p className="text-xs font-bold uppercase tracking-widest">
                    SASRA Compliant
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-[40px] p-8 border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <Info className="text-primary" size={20} />
              <p className="font-black text-primary uppercase text-xs tracking-widest">
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

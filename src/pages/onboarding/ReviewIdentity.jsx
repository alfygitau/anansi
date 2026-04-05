import { useNavigate } from "react-router-dom";
import MyProgress from "../../components/progress-bar/MyProgress";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Fingerprint,
  Info,
  Loader2,
  Lock,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import useAuth from "../../hooks/useAuth";
import { updateCustomerPersonalInformation } from "../../sdks/customer/customer";
import { useStore } from "../../store/useStore";

const ReviewIdentity = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { showToast } = useToast();
  const kycDetails = useStore((state) => state.kyc_details);
  const idUrls = useStore((state) => state.id_images);

  const splitName = (fullName) => {
    if (!fullName) return { firstName: "", middleName: "", lastName: "" };
    const parts = fullName.trim().split(/\s+/);
    return {
      firstName: parts[0] || "",
      lastName: parts.length > 1 ? parts[parts.length - 1] : "",
      middleName: parts.slice(1, -1).join(" ") || "",
    };
  };

  const names = splitName(kycDetails.fullNames || kycDetails.fullName);
  const firstName = names.firstName;
  const middleName = names.middleName;
  const lastName = names.lastName;

  const handleUpdate = async () => {
    await updateCustomerMutate();
  };

  const inputFields = [
    { label: "First Name", value: firstName },
    { label: "Middle Name(s)", value: middleName },
    { label: "Last Name", value: lastName },
    { label: "ID / Passport Number", value: kycDetails?.idNumber },
    { label: "Gender", value: kycDetails?.sex },
    { label: "Date of Birth", value: kycDetails?.dateOfBirth },
  ];

  const { mutate: updateCustomerMutate, isLoading } = useMutation({
    mutationKey: ["update-customer-personal-info"],
    mutationFn: () =>
      updateCustomerPersonalInformation(
        auth?.user?.id,
        firstName,
        middleName,
        lastName,
        kycDetails?.idNumber,
        kycDetails?.sex,
        kycDetails?.dateOfBirth,
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

  return (
    <div className="w-full max-w-[1300px] mb-[50px] md:px-4 sm:px-4 mx-auto flex flex-col lg:flex-row lg:gap-3 min-h-screen font-sans">
      {/* 1. Left Sidebar: Progress (Anansi Brand Styling) */}
      <div className="hidden lg:block w-[27%] h-full">
        <MyProgress
          currentTitle="Identity Verification"
          currentSubtitle="Upload Government Document"
        />

        {/* Verification Tips Sidebar Section */}
        <div className="space-y-6 pr-[30px] w-full">
          <div className="p-5 bg-white rounded-[24px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Fingerprint className="text-secondary" size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                Why Verify?
              </span>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed">
              To secure your Anansi Sacco account, we match these details with
              the
              <span className="font-bold">
                {" "}
                Integrated Population Registration Services (IPRS)
              </span>
              .
            </p>
          </div>

          <div className="flex items-start gap-3 px-2">
            <Info className="text-slate-300 shrink-0" size={16} />
            <p className="text-[11px] text-slate-400 italic">
              Need to change your document type? Go back to the initial upload
              screen.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1">
        {/* Header with Modern Disclaimer */}
        <header className="mb-3 w-full">
          <h1 className="text-3xl font-black text-primary uppercase tracking-tight mb-4">
            Review Extracted Details
          </h1>
          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-start gap-3">
            <ShieldCheck className="text-primary shrink-0 mt-0.5" size={18} />
            <p className="text-slate-600 text-[14px] leading-relaxed">
              Our AI has scanned your ID. Please ensure the
              <span className="text-primary font-bold">
                Names, ID Number, and DOB
              </span>
              exactly match your physical document to avoid SASRA compliance
              rejection.
            </p>
          </div>
        </header>

        {/* Document Visuals Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[
            { label: "Front of ID", img: idUrls?.front },
            { label: "Back of ID", img: idUrls?.back },
          ].map((doc, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="relative h-[240px] rounded-[32px] overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-sm group"
            >
              {doc.img ? (
                <img
                  src={doc.img}
                  alt={doc.label}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300">
                  <RefreshCw className="animate-spin-slow mb-2" size={24} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Processing Image...
                  </span>
                </div>
              )}
              <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-white rounded-full text-[9px] font-black uppercase tracking-widest">
                {doc.label}
              </div>
            </motion.div>
          ))}
        </section>

        {/* Data Fields: The "Anansi" Grid */}
        <div className="bg-white border border-slate-100 p-6 mb-6 rounded-[32px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {inputFields.map((field, idx) => {
              // 1. Determine if the field is empty
              const isMissing =
                !field.value || field.value.toString().trim() === "";

              return (
                <div key={idx} className="group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={isMissing ? "Not found in document" : field.value}
                      className={`h-[60px] w-full px-6 rounded-[22px] border-2 font-bold text-sm transition-all outline-none 
                ${
                  isMissing
                    ? "border-amber-100 bg-amber-50/30 text-amber-600 italic"
                    : "border-slate-50 bg-slate-50 text-primary group-hover:bg-white group-hover:border-slate-100"
                }`}
                    />

                    <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      {isMissing ? (
                        // 2. "Not Verified" / "Missing" UI
                        <>
                          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-tight">
                            Action Required
                          </span>
                          <AlertCircle className="text-amber-500" size={18} />
                        </>
                      ) : (
                        // 3. Verified UI
                        <>
                          <span className="text-[10px] font-bold text-green-500 uppercase tracking-tight">
                            Verified
                          </span>
                          <CheckCircle2 className="text-green-500" size={18} />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer: Trust & Actions */}
        <footer className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3 text-slate-400">
            <Lock size={16} />
            <p className="text-[11px] leading-tight">
              Your data is encrypted with AES-256 bits.
              <br />
              Processed securely by Anansi Sacco Systems.
            </p>
          </div>

          <div className="flex flex-col sm:w-full sm:flex-row items-center gap-4 w-1/3 md:w-auto">
            <button
              onClick={() => navigate("/onboarding/verify-identity")}
              className="w-full border sm:w-full px-8 h-[60px] rounded-[22px] text-xs font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-all flex items-center justify-center gap-2"
            >
              <AlertCircle size={16} />
              Re-scan Document
            </button>
          </div>
          <div className="w-1/3 sm:w-full">
            <button
              onClick={handleUpdate}
              disabled={isLoading}
              className="w-full sm:w-full px-10 h-[64px] bg-primary text-white rounded-[24px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-3 hover:bg-secondary hover:text-primary hover:shadow-lg hover:shadow-secondary/20 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  Confirm Details <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ReviewIdentity;

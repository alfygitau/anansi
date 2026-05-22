import { useState, useRef } from "react";
import {
  Upload,
  CheckCircle2,
  ChevronRight,
  Info,
  Loader2,
  FileText,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import MyProgress from "../../components/progress-bar/MyProgress";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import {
  extractBackIdDetails,
  extractIdDetails,
  uploadSingleFile,
} from "../../sdks/upload-files/upload";
import OCRFailure from "../../components/onboarding/OcrFailure";
import { useStore } from "../../store/useStore";
import SuccessVerification from "../../components/onboarding/VerifySuccess";
import DocumentError from "../../components/onboarding/DocumentError";

const IdentityVerification = () => {
  const [documentType, setDocumentType] = useState("National Id");
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showOcrFailure, setShowOcrFailure] = useState(false);
  const [showVerifySuccess, setShowVerifySuccess] = useState(false);
  const [showDocumentError, setShowDocumentError] = useState(false);
  const setKycDetails = useStore((state) => state.setKycDetails);
  const setIdImages = useStore((state) => state.setIdImages);
  const [files, setFiles] = useState({
    front: null,
    back: null,
    passport: null,
  });

  const [urls, setUrls] = useState({
    front: null,
    back: null,
    passport: null,
  });

  const fileInputs = {
    front: useRef(null),
    back: useRef(null),
    passport: useRef(null),
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [type]: file }));
      await uploadUrlMutate({ file, type });
    }
  };

  const triggerUpload = (type) => {
    fileInputs[type].current.click();
  };

  const handleContinue = () => {
    extractFrontIdDetailsMutate();
  };

  const handlePassportContinue = () => {
    extractPassportDetailsMutate();
  };

  const { mutate: uploadUrlMutate } = useMutation({
    mutationKey: ["upload-file"],
    mutationFn: async ({ file, type }) => {
      const response = await uploadSingleFile(file);
      return response?.data?.data?.url;
    },
    onSuccess: async (data, variables) => {
      const { type } = variables;
      setUrls((prev) => ({
        ...prev,
        [type]: data,
      }));
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

  const { mutate: extractFrontIdDetailsMutate } = useMutation({
    mutationKey: ["extract-front-id-details"],
    mutationFn: async () => {
      const response = await extractIdDetails(files.front);
      return response.data.data;
    },
    onSuccess: async (data) => {
      const hasId = !!data?.idNumber;
      const nameValue = data?.fullNames || data?.fullName;
      const hasName = nameValue && nameValue.trim().length > 0;
      if (!hasId || !hasName) {
        showToast({
          title: "Scan Unsuccessful",
          type: "error",
          position: "top-right",
          description:
            "We couldn't read your ID details. Please ensure the document is not blurry and try again.",
        });
        setShowOcrFailure(true);
        return;
      }
      setKycDetails(data);
      await extractBackIdDetailsMutate();
    },
    onError: (error) => {
      showToast({
        title: "Onboarding glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
      setShowOcrFailure(true);
    },
  });

  const { mutate: extractBackIdDetailsMutate, isLoading } = useMutation({
    mutationKey: ["extract-back-id-details"],
    mutationFn: async () => {
      const response = await extractBackIdDetails(files.back);
      return response.data.data.foundAny;
    },
    onSuccess: async (data) => {
      if (!data) {
        showToast({
          title: "Verification Failed",
          type: "error",
          position: "top-right",
          description:
            "The back of the ID you uploaded is invalid. Please ensure it is clear and well-lit before trying again.",
        });
      } else {
        showToast({
          title: "Identity Verified",
          type: "success",
          position: "top-right",
          description:
            "We've successfully read your ID details and updated your profile automatically.",
        });
        setIdImages(urls);
        handleConfirm();
      }
    },
    onError: (error) => {
      showToast({
        title: "Onboarding glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
      setShowOcrFailure(true);
    },
  });

  const { mutate: extractPassportDetailsMutate, isLoadingPassport } =
    useMutation({
      mutationKey: ["extract-back-id-details"],
      mutationFn: async () => {
        const response = await extractBackIdDetails(files.passport);
        return response.data.data;
      },
      onSuccess: async (data) => {
        showToast({
          title: "Identity Verified",
          type: "success",
          position: "top-right",
          description:
            "We've successfully read your Passport details and updated your profile automatically.",
        });
        setIdImages(urls);
        setKycDetails(data);
        handleConfirm();
      },
      onError: (error) => {
        showToast({
          title: "Onboarding glitch",
          type: "error",
          position: "top-right",
          description: error?.response?.data?.message || error.message,
        });
        setShowOcrFailure(true);
      },
    });

  const handleConfirm = () => {
    setShowVerifySuccess(true);
    setTimeout(() => {
      setShowVerifySuccess(false);
      navigate("/onboarding/review-identity");
    }, 3000);
  };

  return (
    <>
      <OCRFailure
        isOpen={showOcrFailure}
        onClose={() => setShowOcrFailure(false)}
      />

      <SuccessVerification
        isOpen={showVerifySuccess}
        onClose={() => setShowVerifySuccess(false)}
      />

      <DocumentError
        isOpen={showDocumentError}
        onClose={() => setShowDocumentError(false)}
      />

      <div className="sm:px-4 flex justify-center items-start">
        <div className="w-full max-w-[1300px] md:px-6 flex flex-col lg:flex-row gap-6">
          {/* Left Progress Sidebar */}
          <aside className="w-full hidden lg:block lg:w-[22%] shrink-0">
            <MyProgress
              currentTitle="Identity Verification"
              currentSubtitle="Upload Government Document"
            />
          </aside>

          {/* Main Full-Width Form Workspace */}
          <main className="flex-1 flex flex-col justify-between">
            <div className="space-y-8">
              <header>
                <h1 className="text-xl font-black text-primary tracking-tight mb-2">
                  Upload Identity Document
                </h1>
                <p className="text-gray-500 text-sm max-w-3xl">
                  Let's get started by uploading your ID or Passport. This will
                  help us automatically fill in your details and verify your
                  citizenship.
                </p>
              </header>

              {/* 1. INPUTS ROW: Config Selectors Side-By-Side */}
              {/* 💡 Changed 'grid-cols-1 sm:grid-cols-2' to 'grid-cols-2' to force them side-by-side everywhere */}
              <div className="grid grid-cols-2 gap-4">
                {/* Select Country */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Country of Citizenship
                  </label>
                  <select
                    className="h-14 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 
 hover:border-gray-300 
 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 
 cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23042159' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1.25rem",
                    }}
                  >
                    <option>Kenya</option>
                    <option>United States</option>
                  </select>
                </div>

                {/* Select Document Type */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Select Document Type
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="h-14 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 
 hover:border-gray-300 
 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 
 cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23042159' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 1rem center",
                      backgroundSize: "1.25rem",
                    }}
                  >
                    <option value="National Id">National ID</option>
                    <option value="Passport">Passport</option>
                  </select>
                </div>
              </div>

              {/* 2. UPLOADERS ROW: Document Fields Side-By-Side */}
              <div>
                {documentType === "National Id" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <UploadBox
                      label="Front page of ID"
                      file={files.front}
                      onUpload={() => triggerUpload("front")}
                    />
                    <UploadBox
                      label="Back page of ID"
                      file={files.back}
                      onUpload={() => triggerUpload("back")}
                    />
                  </div>
                ) : (
                  <div className="w-full">
                    <UploadBox
                      label="Double page of passport"
                      file={files.passport}
                      onUpload={() => triggerUpload("passport")}
                      large
                    />
                  </div>
                )}
              </div>

              {/* 3. GUIDELINES & DISCLAIMERS ROW: Nested Beneath Upload Blocks */}
              <div className="space-y-4">
                <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-3xl p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300/80">
                  {/* Header Block */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5 text-slate-800">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
                          Compliance Guard
                        </h3>
                        <h4 className="text-sm font-bold text-slate-800 mt-0.5">
                          Verification Checklist
                        </h4>
                      </div>
                    </div>

                    {/* Micro Metric Tag */}
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-100">
                      OCR Ready
                    </span>
                  </div>

                  {/* Checklist Grid Matrix */}
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <PremiumRequirement
                      title="Validity Check"
                      desc="Your ID or Passport must not be expired"
                    />
                    <PremiumRequirement
                      title="Full Visibility"
                      desc="All personal details must be completely uncovered"
                    />
                    <PremiumRequirement
                      title="Scan Resolution"
                      desc="Image must be perfectly clear and easy to read"
                    />
                    <PremiumRequirement
                      title="Accepted Formats"
                      desc="Standard image extensions: JPEG, PNG, or JPG"
                      isMeta
                    />
                  </ul>
                </div>

                {/* Passport Specific Warning Block */}
                {documentType === "Passport" && (
                  <div className="bg-orange-50 border border-orange-100 rounded-[24px] p-5 animate-in fade-in duration-200">
                    <p className="text-orange-800 text-[10px] font-black mb-1.5 uppercase tracking-wider">
                      [Important Note] Uploading Passport
                    </p>
                    <p className="text-orange-700 text-xs leading-relaxed font-medium">
                      Ensure you include both the Bio Data page and the
                      Signature page in one single frame layout.
                    </p>
                  </div>
                )}
              </div>

              {/* Hidden Structural System Inputs */}
              <input
                type="file"
                ref={fileInputs.front}
                onChange={(e) => handleFileChange(e, "front")}
                className="hidden"
                accept="image/*"
              />
              <input
                type="file"
                ref={fileInputs.back}
                onChange={(e) => handleFileChange(e, "back")}
                className="hidden"
                accept="image/*"
              />
              <input
                type="file"
                ref={fileInputs.passport}
                onChange={(e) => handleFileChange(e, "passport")}
                className="hidden"
                accept="image/*"
              />
            </div>

            {/* Bottom Form Actions Execution Line */}
            <div className="mt-4 pt-4">
              {documentType === "National Id" && (
                <button
                  disabled={isLoading}
                  onClick={handleContinue}
                  className="w-full md:w-auto md:float-right px-8 h-14 bg-primary hover:bg-secondary text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/10"
                >
                  {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {documentType === "Passport" && (
                <button
                  disabled={isLoadingPassport}
                  onClick={handlePassportContinue}
                  className="w-full md:w-auto md:float-right px-8 h-14 bg-primary hover:bg-secondary text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/10"
                >
                  {isLoadingPassport && (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  )}
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

const UploadBox = ({ label, file, onUpload, large }) => (
  <div className="space-y-2 w-full">
    <p className="text-sm font-medium text-gray-700">{label}</p>
    <div
      onClick={onUpload}
      className={`${large ? "h-48" : "h-32"} cursor-pointer rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-primary transition-all flex flex-col items-center justify-center group`}
    >
      {file ? (
        <div className="text-center px-4">
          <FileText className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-xs font-medium text-gray-900 truncate max-w-[200px]">
            {file.name}
          </p>
          <p className="text-[10px] text-gray-500">
            {(file.size / 1024).toFixed(2)} KB
          </p>
        </div>
      ) : (
        <>
          <Upload className="w-8 h-8 text-gray-400 group-hover:text-primary mb-2 transition-colors" />
          <p className="text-xs text-gray-500">
            Drag & drop or{" "}
            <span className="text-primary font-semibold underline">
              Choose file
            </span>
          </p>
        </>
      )}
    </div>
  </div>
);

const PremiumRequirement = ({ title, desc, isMeta }) => (
  <li className="flex items-start gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100 transition-colors hover:bg-slate-50">
    <div className="mt-0.5 shrink-0">
      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
    </div>
    <div className="space-y-0.5">
      <p className="text-xs font-bold text-slate-800 leading-tight">{title}</p>
      <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
        {desc}
      </p>
    </div>
  </li>
);

export default IdentityVerification;

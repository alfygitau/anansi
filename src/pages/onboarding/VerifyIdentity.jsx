import { useState, useRef } from "react";
import {
  Upload,
  CheckCircle2,
  ChevronRight,
  Loader2,
  FileText,
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

  // 1. ADDED: Named Loading State Tracker for Front ID Extraction
  const { mutate: extractFrontIdDetailsMutate, isLoading: isFrontLoading } =
    useMutation({
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
          setShowOcrFailure(true);
          return;
        }
        setKycDetails(data);
        await extractBackIdDetailsMutate();
      },
      onError: (error) => {
        setShowOcrFailure(true);
      },
    });

  // 2. ADDED: Named Loading State Tracker for Back ID Extraction
  const { mutate: extractBackIdDetailsMutate, isLoading: isBackLoading } =
    useMutation({
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
          setIdImages(urls);
          handleConfirm();
        }
      },
      onError: (error) => {
        setShowOcrFailure(true);
      },
    });

  const { mutate: extractPassportDetailsMutate, isLoading: isLoadingPassport } =
    useMutation({
      mutationKey: ["extract-passport-details"],
      mutationFn: async () => {
        const response = await extractBackIdDetails(files.passport);
        return response.data.data;
      },
      onSuccess: async (data) => {
        setIdImages(urls);
        setKycDetails(data);
        handleConfirm();
      },
      onError: (error) => {
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

  // DYNAMIC CONFIGURATION CHECKS FOR LOADING BOUTIQUES
  const isIdDisabled = !files.front || !files.back;
  const isPassportDisabled = !files.passport;

  // 3. UNIFIED MATRIX LOOKUPS FOR COMBINED STATE TRACKING
  const isProcessingId = isFrontLoading || isBackLoading;

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
        <div className="w-full max-w-[1300px] md:px-6 mb-[20px] flex flex-col lg:flex-row gap-6">
          <aside className="w-full hidden lg:block lg:w-[22%] shrink-0">
            <MyProgress
              currentTitle="Identity Verification"
              currentSubtitle="Upload Government Document"
            />
          </aside>

          <main className="flex-1 flex flex-col justify-between">
            <div className="space-y-8">
              <header>
                <h1 className="text-xl font-medium text-primary tracking-tight mb-2">
                  Upload Identity Document
                </h1>
                <p className="text-gray-500 text-sm w-full">
                  Let's get started by uploading your ID or Passport. This will
                  help us automatically fill in your details and verify your
                  citizenship.
                </p>
              </header>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Country of Citizenship
                  </label>
                  <select className="h-14 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 cursor-pointer">
                    <option>Kenya</option>
                    <option>United States</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Select Document Type
                  </label>
                  <select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="h-14 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 hover:border-gray-300 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 cursor-pointer"
                  >
                    <option value="National Id">National ID</option>
                    <option value="Passport">Passport</option>
                  </select>
                </div>
              </div>

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

              <div className="space-y-2">
                <h3 className="text-xs font-medium uppercase tracking-widest text-slate-400">
                  Pre-Scan Note
                </h3>
                <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-3xl p-4 transition-all duration-300">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2.5 text-slate-800">
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-medium uppercase tracking-widest text-slate-400">
                          Compliance Guard
                        </h3>
                        <h4 className="text-sm font-bold text-slate-800 mt-0.5">
                          Verification Checklist
                        </h4>
                      </div>
                    </div>
                    <span className="text-[10px] font-medium uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-100">
                      OCR Ready
                    </span>
                  </div>
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
                    />
                  </ul>
                </div>

                {documentType === "Passport" && (
                  <div className="bg-orange-50 border border-orange-100 rounded-[24px] p-5 animate-in fade-in duration-200">
                    <p className="text-orange-800 text-[10px] font-medium mb-1.5 uppercase tracking-wider">
                      [Important Note] Uploading Passport
                    </p>
                    <p className="text-orange-700 text-xs leading-relaxed font-medium">
                      Ensure you include both the Bio Data page and the
                      Signature page in one single frame layout.
                    </p>
                  </div>
                )}
              </div>

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

            {/* BOTTOM ACTION DECK: ASYMMETRIC SYSTEM INTEGRATION */}
            <div className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* LEFT COLUMN: LEGAL & PRIVACY DECLARATION SAFEGUARDS (8 COLS) */}
                <div className="lg:col-span-8 bg-slate-50/60 border border-slate-200/50 rounded-2xl p-4">
                  <div className="flex items-start gap-3 text-[11px] leading-relaxed text-slate-400 font-medium">
                    <p>
                      <span className="text-slate-600 font-bold">
                        Data Privacy Ledger:
                      </span>{" "}
                      By initiating this cryptographic document scan, you
                      authorize the automated system to parse your identity
                      registry metadata via high-fidelity optical extraction
                      protocols. Your payloads are completely encrypted and
                      strictly handled according to the Data Protection Act.
                    </p>
                  </div>
                </div>

                {/* RIGHT COLUMN: CALL TO ACTION EXECUTION ENGINE (4 COLS) */}
                <div className="lg:col-span-4 flex justify-end">
                  {documentType === "National Id" && (
                    <button
                      type="button"
                      disabled={isProcessingId || isIdDisabled}
                      onClick={handleContinue}
                      className={`w-full lg:w-[200px] h-14 rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all
            ${
              isProcessingId || isIdDisabled
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/40 shadow-none"
                : "bg-primary text-white hover:bg-secondary active:scale-[0.99] shadow-lg shadow-blue-900/10"
            }
          `}
                    >
                      {isProcessingId && (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                      )}
                      <span>Continue</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}

                  {documentType === "Passport" && (
                    <button
                      type="button"
                      disabled={isLoadingPassport || isPassportDisabled}
                      onClick={handlePassportContinue}
                      className={`w-full lg:w-[200px] h-14 rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all
            ${
              isLoadingPassport || isPassportDisabled
                ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/40 shadow-none"
                : "bg-primary text-white hover:bg-secondary active:scale-[0.99] shadow-lg shadow-blue-900/10"
            }
          `}
                    >
                      {isLoadingPassport && (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                      )}
                      <span>Continue</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

// Sub components unchanged for structure preservation
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

const PremiumRequirement = ({ title, desc }) => (
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

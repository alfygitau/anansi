import { useState, useRef } from "react";
import {
  Upload,
  CheckCircle2,
  ChevronRight,
  Info,
  Loader2,
  FileText,
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

      <div className="h-full bg-gray-50 md:px-6 sm:px-4 flex justify-center">
        {/* 80% Width Container */}
        <div className="w-full max-w-[1300px] mb-[20px] flex flex-col lg:flex-row gap-4">
          {/* Left Section: Progress Bar (20%) */}
          <aside className="w-full hidden lg:block md:block lg:w-[22%]">
            <MyProgress
              currentTitle="Identity Verification"
              currentSubtitle="Upload Government Document"
            />
          </aside>

          {/* Middle Section: Upload Form (45%) */}
          <main className="flex-1 px-6 space-y-4">
            <section>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Upload Government issued ID
              </h1>
              <p className="text-gray-500 text-sm mb-8">
                Let's get started by uploading your ID or Passport. This will
                help us automatically fill in your details and verify your
                citizenship.
              </p>

              <div className="space-y-6">
                {/* Select Country */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Country of Citizenship
                  </label>
                  <select
                    className="h-14 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 
             hover:border-gray-300 
             focus:border-[#042159] focus:outline-none focus:ring-4 focus:ring-[#042159]/10 
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
                    className="h-14 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 
             hover:border-gray-300 
             focus:border-[#042159] focus:outline-none focus:ring-4 focus:ring-[#042159]/10 
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

                {/* Upload Areas */}
                <div className="space-y-4">
                  {documentType === "National Id" ? (
                    <>
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
                    </>
                  ) : (
                    <UploadBox
                      label="Double page of passport"
                      file={files.passport}
                      onUpload={() => triggerUpload("passport")}
                      large
                    />
                  )}
                </div>

                {/* Hidden Inputs */}
                <input
                  type="file"
                  ref={fileInputs.front}
                  onChange={(e) => handleFileChange(e, "front")}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={fileInputs.back}
                  onChange={(e) => handleFileChange(e, "back")}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={fileInputs.passport}
                  onChange={(e) => handleFileChange(e, "passport")}
                  className="hidden"
                />

                {documentType === "National Id" && (
                  <button
                    disabled={isLoading}
                    onClick={handleContinue}
                    className="w-full h-14 bg-[#042159] hover:bg-[#4DB8E4] text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-purple-100"
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
                    className="w-full h-14 bg-[#042159] hover:bg-[#4DB8E4] text-white font-semibold rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-purple-100"
                  >
                    {isLoadingPassport && (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    )}
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </section>
          </main>

          {/* Right Section: Instructions (30%) */}
          <aside className="w-full lg:w-[20%] space-y-4">
            <div className="bg-[#F0FFFE] border border-[#d1f7f5] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4 text-[#008080]">
                <Info className="w-5 h-5" />
                <span className="font-bold text-sm uppercase tracking-wider">
                  Make Sure That
                </span>
              </div>
              <ul className="space-y-3">
                <Requirement text="Your ID or Passport is not expired" />
                <Requirement text="All your details can be seen" />
                <Requirement text="It’s clear and easy to read" />
                <Requirement text="Edges of the document are visible" />
                <Requirement text="Formats: JPEG, PNG, JPG" />
              </ul>
            </div>

            {documentType === "Passport" && (
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
                <p className="text-orange-800 text-xs font-bold mb-2 uppercase">
                  [Note] Uploading Passport
                </p>
                <p className="text-orange-700 text-sm leading-relaxed mb-4">
                  Ensure you include both the Bio Data page and the Signature
                  page in one clear frame.
                </p>
                <div className="aspect-video bg-white rounded-lg border border-dashed border-orange-200 flex items-center justify-center italic text-orange-400 text-xs">
                  Passport Preview Placeholder
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
};

const UploadBox = ({ label, file, onUpload, large }) => (
  <div className="space-y-2">
    <p className="text-sm font-medium text-gray-700">{label}</p>
    <div
      onClick={onUpload}
      className={`${large ? "h-48" : "h-32"} bg-white cursor-pointer rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-[#042159] transition-all flex flex-col items-center justify-center group`}
    >
      {file ? (
        <div className="text-center px-4">
          <FileText className="w-8 h-8 text-[#042159] mx-auto mb-2" />
          <p className="text-xs font-medium text-gray-900 truncate max-w-[200px]">
            {file.name}
          </p>
          <p className="text-[10px] text-gray-500">
            {(file.size / 1024).toFixed(2)} KB
          </p>
        </div>
      ) : (
        <>
          <Upload className="w-8 h-8 text-gray-400 group-hover:text-[#042159] mb-2 transition-colors" />
          <p className="text-xs text-gray-500">
            Drag & drop or{" "}
            <span className="text-[#042159] font-semibold underline">
              Choose file
            </span>
          </p>
        </>
      )}
    </div>
  </div>
);

const Requirement = ({ text }) => (
  <li className="flex gap-3 text-[12px] text-gray-700">
    <CheckCircle2 className="w-4 h-4 text-[#008080] mt-0.5" />
    {text}
  </li>
);

export default IdentityVerification;

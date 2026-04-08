import MyProgress from "../../components/progress-bar/MyProgress";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import { getCustomer } from "../../sdks/customer/customer";
import { useNavigate } from "react-router-dom";

const EmailLink = () => {
  const [error, setError] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const { refetch: refetchCustomerDetails, isFetching } = useQuery({
    queryKey: ["get customer info"],
    queryFn: async () => {
      const response = await getCustomer();
      return response.data.data;
    },
    enabled: false,
    onSuccess: (data) => {
      if (data?.selfie_image) {
        navigate("/onboarding/personal-information");
      } else {
        setError(true);
        showToast({
          title: "Verification Incomplete",
          type: "error",
          position: "top-right",
          description:
            "We haven't detected your selfie yet. Please complete the process on your phone.",
        });
      }
    },
    onError: (error) => {
      showToast({
        title: "Authentication glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const handleCheckSelfie = () => {
    refetchCustomerDetails();
  };

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-[1300px] md:px-6 mb-[30px] mx-auto bg-gray-50 min-h-screen">
      <div className="hidden lg:block w-[25%] h-full">
        <MyProgress
          currentTitle="Identity Verification"
          currentSubtitle="Selfie Verification"
        />
      </div>
      <div className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex-1 gap-12 items-center">
            {/* Right Column: Instructions & Action */}
            <div className="lg:col-span-7">
              <header className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 mb-4">
                  <CheckCircle2 size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Link Sent Successfully
                  </span>
                </div>
                <h1 className="text-2xl font-black text-primary uppercase tracking-tight leading-none mb-4">
                  Selfie Verification
                </h1>
                <p className="text-slate-500 text-lg leading-relaxed">
                  A secure authentication link has been sent to your inbox.
                  Because our verification system utilizes your smartphone's
                  camera to perform a high-resolution biometric scan, this
                  process{" "}
                  <span className="text-primary font-bold">
                    must be completed on a mobile device.
                  </span>
                  &nbsp; Simply open the email on your phone, click the link,
                  and follow the guided instructions to secure your profile.
                </p>
              </header>

              <div className="space-y-8 mb-12">
                {/* Step 1: Email Access */}
                <div className="flex gap-6 group">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-base shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform">
                    1
                  </div>
                  <div className="space-y-1">
                    <p className="text-primary font-black uppercase text-xs tracking-widest">
                      Access your Inbox
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Open the verification email on your{" "}
                      <span className="font-bold text-primary">smartphone</span>
                      . If you don't see it within 2 minutes, please check your{" "}
                      <span className="underline decoration-secondary decoration-2">
                        Spam or Promotions
                      </span>{" "}
                      folder.
                    </p>
                  </div>
                </div>

                {/* Step 2: Mobile Action */}
                <div className="flex gap-6 group">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-base shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform">
                    2
                  </div>
                  <div className="space-y-1">
                    <p className="text-primary font-black uppercase text-xs tracking-widest">
                      Biometric Scan
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Tap the secure link to launch the{" "}
                      <span className="font-bold text-primary">
                        Facial Liveness
                      </span>{" "}
                      interface. Position your face within the frame in a
                      well-lit area and follow the on-screen prompts to confirm
                      your identity.
                    </p>
                  </div>
                </div>

                {/* Step 3: Confirmation */}
                <div className="flex gap-6 group">
                  <div className="flex-shrink-0 w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-base shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform">
                    3
                  </div>
                  <div className="space-y-1">
                    <p className="text-primary font-black uppercase text-xs tracking-widest">
                      Sync & Finalize
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Once the mobile app displays a "Success" message, return
                      to this screen and click
                      <span className="font-bold text-primary"> Continue</span>.
                      We will automatically sync your biometric data to your
                      Anansi Sacco profile.
                    </p>
                  </div>
                </div>
              </div>

              {/* Error State */}
              {error && (
                <motion.div
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-start gap-4 rounded-r-2xl"
                >
                  <AlertCircle className="text-red-500 mt-1" size={20} />
                  <div>
                    <p className="text-red-800 font-bold text-sm uppercase tracking-tight">
                      Verification Pending
                    </p>
                    <p className="text-red-600 text-xs mt-1">
                      We haven't received your selfie data yet. Please ensure
                      you finished the process on your mobile browser.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Main Action Button */}
              <button
                onClick={handleCheckSelfie}
                disabled={isFetching}
                className={`w-full h-[72px] rounded-[28px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all shadow-xl ${
                  isFetching
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-secondary hover:text-primary shadow-blue-900/20"
                }`}
              >
                {isFetching ? (
                  <div className="flex items-center gap-3">
                    <svg
                      className="animate-spin h-5 w-5 text-slate-400"
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
                    <span>Verifying Status...</span>
                  </div>
                ) : (
                  <>
                    Continue KYC <ArrowRight size={20} />
                  </>
                )}
              </button>

              {/* Compliance & Help Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-3 pt-8 border-t border-slate-100">
                {/* Security & Regulatory Compliance */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <ShieldCheck className="text-primary" size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-600">
                      Regulatory Compliance & Security
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Anansi Sacco utilizes bank-grade{" "}
                      <span className="text-slate-600 font-bold">
                        AES-256 encryption
                      </span>{" "}
                      for all biometric data transmission. Our facial liveness
                      protocols are fully compliant with the{" "}
                      <span className="text-slate-600 font-bold">
                        Data Protection Act (2019)
                      </span>{" "}
                      and meet the stringent digital KYC standards set by the{" "}
                      <span className="text-slate-600 font-bold">
                        Sacco Societies Regulatory Authority (SASRA)
                      </span>
                      . Your biometric profile is used strictly for identity
                      verification and is never shared with third parties.
                    </p>
                  </div>
                </div>

                {/* Support & Troubleshooting */}
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <Info className="text-primary" size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-600">
                      Troubleshooting & Support
                    </p>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                      If you haven't received the verification email within 5
                      minutes, please inspect your{" "}
                      <span className="text-primary font-bold underline decoration-secondary">
                        Spam, Junk, or Promotions
                      </span>{" "}
                      folders. Ensure your device is connected to a stable
                      internet network. If the link remains undelivered or
                      expires, you can request a manual re-send or contact our
                      dedicated{" "}
                      <span className="text-primary font-bold underline decoration-secondary">
                        Anansi Support Team
                      </span>{" "}
                      for immediate technical assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailLink;

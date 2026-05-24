import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import {
  Smartphone,
  ShieldCheck,
  Lock,
  ArrowRight,
  Info,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import MyProgress from "../../components/progress-bar/MyProgress";
import useAuth from "../../hooks/useAuth";
import { useMutation } from "react-query";
import { getCustomer } from "../../sdks/customer/customer";
import { useToast } from "../../contexts/ToastProvider";

const SelfieQRCode = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [selfieUrl, setSelfieUrl] = useState("");
  const { auth } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    let url = process.env.REACT_APP_SELFIE_URL;
    let token = auth?.tokens?.access_token ?? "";

    setSelfieUrl(`${url}?token=${token}`);
  }, [auth]);

  const handleContinue = async () => {
    refetch();
  };

  const { isLoading, mutate: refetch } = useMutation({
    mutationKey: ["get customers"],
    mutationFn: async () => {
      const response = await getCustomer();
      console.log(response.data.data);
      return response.data.data;
    },
    onSuccess: (data) => {
      console.log(data);
      if (data?.selfie_image) {
        navigate("/onboarding/personal-information");
      } else {
        setError(true);
      }
    },
    onError: (error) => {
      showToast({
        title: "Verification Pending",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  return (
    <div className="w-full md:px-6 max-w-[1300px] mb-[30px] mx-auto flex flex-col lg:flex-row font-sans">
      {/* 1. Left Sidebar: Progress */}
      <div className="hidden lg:block w-[23%] bg-slate-50/50">
        <MyProgress
          currentTitle="Identity Verification"
          currentSubtitle="Selfie Verification"
        />
      </div>
      {/* 2. Main Area: QR Workstation */}
      <div className="flex-1 md:px-3 sm:px-3">
        <header className="mb-6">
          <h1 className="text-2xl font-medium text-primary uppercase tracking-tight mb-2">
            Scan to Start
          </h1>
          <p className="text-slate-500 text-[15px] leading-relaxed w-full">
            To ensure the highest level of security, we use smartphone-optimized
            biometric technology.{" "}
            <span className="text-primary font-semibold">Scan the QR code</span>{" "}
            with your phone’s camera to open our secure mobile portal. This
            allows us to capture a high-definition selfie to verify your
            identity in real-time.
          </p>
        </header>
        <div className="w-full grid grid-cols-1 md:grid-cols-12 mb-5 gap-8 items-center bg-white border border-slate-200/60 p-5 rounded-[32px]">
          {/* LEFT COLUMN: SECURE SYNC INSTRUCTIONS (7 COLS) */}
          <div className="md:col-span-7 space-y-5">
            {/* Error Context Banner (Fires down smoothly within the left context bracket if true) */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 p-4 bg-red-50/60 border border-red-100 rounded-2xl"
              >
                <AlertCircle
                  className="text-red-500 shrink-0 mt-0.5"
                  size={16}
                />
                <p className="text-xs text-red-700 font-medium leading-normal">
                  Biometric payload absent. Please complete the capture process
                  on your phone before triggering validation checks.
                </p>
              </motion.div>
            )}

            {/* Informational Bridge Deck Card */}
            <div className="bg-slate-50 border border-slate-200/40 rounded-2xl p-5 relative overflow-hidden">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-7 h-7 bg-white border border-slate-200/60 rounded-lg flex items-center justify-center text-[#074073]">
                  <Lock size={14} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Secure Session Sync
                </span>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Scanning this node establishes a{" "}
                  <span className="font-bold text-slate-900">
                    one-time encrypted bridge
                  </span>{" "}
                  between your computer and mobile device framework. No raw
                  identity footprints are logged or cached on the temporary
                  mobile terminal window interface post-execution.
                </p>

                <div className="flex items-start gap-2.5 pt-4 border-t border-slate-200/60 text-slate-400">
                  <Info className="shrink-0 mt-0.5" size={14} />
                  <p className="text-[11px] font-medium leading-normal italic">
                    Keep this browser tab open. Once the facial biometric
                    snapshot registers on your remote device, the terminal
                    control deck will unlock immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ENCRYPTED QR CODE CONTAINER (5 COLS) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 bg-white border-2 border-slate-100 rounded-[28px] shadow-md shadow-blue-900/5 select-none shrink-0"
            >
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl">
                <QRCodeCanvas
                  value={selfieUrl}
                  size={190}
                  level={"H"}
                  includeMargin={true}
                  imageSettings={{
                    src: "/logo-icon.png",
                    x: undefined,
                    y: undefined,
                    height: 32,
                    width: 32,
                    excavate: true,
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/50 p-6 rounded-[32px] border border-slate-200/60">
          {/* RIGHT COLUMN: SYSTEM GUIDANCE MODULE */}
          <div className="p-6 bg-white rounded-[24px] border border-slate-200/60 flex flex-col justify-center">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-center text-emerald-600">
                <ShieldCheck size={16} />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Biometric Capture Diagnostics
              </h4>
            </div>

            <ul className="space-y-3">
              {[
                "Situate portrait framing against a flat, untextured background layout.",
                "Ensure dynamic, clean environmental lighting arrays block facial glare.",
                "Maintain a calm, centered physical expression inside terminal sight lines.",
              ].map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-xs text-slate-600 font-medium leading-relaxed"
                >
                  <CheckCircle2
                    size={14}
                    className="text-emerald-500 mt-0.5 shrink-0"
                  />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* LEFT COLUMN: INTERACTIVE CONTROL CENTER */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4 p-6 bg-white border border-slate-100 rounded-[24px] flex-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-center text-[#074073]">
                  <Smartphone size={16} />
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Mobile Sync Engine
                </h4>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Your session is securely linked across device nodes. Once the
                high-definition biometric capture process finishes successfully
                on your mobile platform, this terminal unlocks immediately.
              </p>

              {/* ISO Encryption Badge Tag */}
              <div className="flex items-center gap-3 p-3.5 bg-slate-50/80 border border-slate-100 rounded-xl mt-4">
                <Lock className="text-[#074073] shrink-0" size={14} />
                <p className="text-[11px] text-slate-400 font-medium leading-tight">
                  Anansi deploys ISO-standard neural matching metrics.
                  Biometrics are permanently discarded post-match.
                </p>
              </div>
            </div>

            {/* Primary Execution Target Trigger */}
            <button
              type="button"
              onClick={handleContinue}
              disabled={isLoading}
              className={`w-full h-14 rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all shadow-sm shrink-0
        ${
          isLoading
            ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/40"
            : "bg-[#074073] text-white hover:bg-[#052d52] active:scale-[0.99]"
        }
      `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin text-slate-400" size={16} />
                  <span>Verifying Sync Registers...</span>
                </>
              ) : (
                <>
                  <span>Continue Verification</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Right Sidebar: Info & Disclaimers */}
    </div>
  );
};

export default SelfieQRCode;

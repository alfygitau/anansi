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
    <div className="w-full max-w-[1300px] mb-[40px] mx-auto flex flex-col lg:flex-row font-sans">
      {/* 1. Left Sidebar: Progress */}
      <div className="hidden lg:block w-1/4 bg-slate-50/50">
        <MyProgress
          currentTitle="Identity Verification"
          currentSubtitle="Selfie Verification"
        />
      </div>

      {/* 2. Main Area: QR Workstation */}
      <div className="flex-1 sm:px-3">
        <header className="mb-6">
          <h1 className="text-2xl font-black text-[#042159] uppercase tracking-tight mb-4">
            Scan to Start
          </h1>
          <p className="text-slate-500 text-[15px] leading-relaxed max-w-xl">
            To ensure the highest level of security, we use smartphone-optimized
            biometric technology.{" "}
            <span className="text-[#042159] font-semibold">
              Scan the QR code
            </span>{" "}
            with your phone’s camera to open our secure mobile portal. This
            allows us to capture a high-definition selfie to verify your
            identity in real-time.
          </p>
        </header>

        <div className="flex flex-col items-center  lg:items-center">
          {/* QR Code Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-white border-2 border-slate-100 rounded-[40px] shadow-2xl shadow-blue-900/5 mb-6"
          >
            <div className="p-4 bg-slate-50 rounded-[32px]">
              <QRCodeCanvas
                value={selfieUrl}
                size={240}
                level={"H"}
                includeMargin={true}
                imageSettings={{
                  src: "/logo-icon.png",
                  x: undefined,
                  y: undefined,
                  height: 40,
                  width: 40,
                  excavate: true,
                }}
              />
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl mb-8 w-full"
            >
              <AlertCircle className="text-red-500 shrink-0" size={18} />
              <p className="text-[13px] text-red-700 font-medium">
                We couldn't find your selfie yet. Please complete the process on
                your phone before clicking continue.
              </p>
            </motion.div>
          )}

          <div className="bg-slate-50 border border-slate-100 rounded-[24px] mb-6 p-5 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="text-[#042159]" size={16} />
                <span className="text-[11px] font-black uppercase tracking-widest text-[#042159]">
                  Secure Session Sync
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-[13px] text-slate-600 leading-relaxed">
                  This QR code creates a{" "}
                  <span className="font-bold text-slate-800">
                    one-time encrypted bridge
                  </span>{" "}
                  between this computer and your mobile device. No personal data
                  is stored on the mobile browser after the session ends.
                </p>

                <div className="flex items-start gap-2 pt-3 border-t border-slate-200/60">
                  <Info className="text-[#4DB8E4] shrink-0 mt-0.5" size={14} />
                  <p className="text-[11px] text-slate-500 italic leading-snug">
                    Ensure you stay on this page. Once the mobile capture is
                    successful, the "Continue" button below will activate your
                    final verification step.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={isLoading}
            className="w-full h-[64px] bg-[#042159] text-white rounded-[24px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-3 hover:bg-[#4DB8E4] hover:text-[#042159] transition-all shadow-xl shadow-blue-900/10"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>
                Continue <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Right Sidebar: Info & Disclaimers */}
      <div className="lg:w-[350px] px-3 sm:mt-6 bg-slate-50/50">
        <div className="space-y-8 sticky top-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Smartphone className="text-[#042159]" size={20} />
              <h4 className="text-[12px] font-black uppercase tracking-widest text-[#042159]">
                Mobile Sync
              </h4>
            </div>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              Your session is securely linked. Once you finish on mobile, this
              screen will allow you to proceed.
            </p>
          </div>

          <div className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="text-[#4DB8E4]" size={18} />
              <h4 className="text-[11px] font-black uppercase tracking-widest text-[#042159]">
                Capture Tips
              </h4>
            </div>
            <ul className="space-y-3">
              {[
                "Use a plain background",
                "Ensure bright, even lighting",
                "Keep a neutral expression",
              ].map((tip, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-[12px] text-slate-600"
                >
                  <CheckCircle2 size={14} className="text-green-500" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-start gap-3 p-4 bg-[#042159]/5 rounded-2xl border border-[#042159]/10">
            <Lock className="text-[#042159] shrink-0" size={16} />
            <p className="text-[11px] text-slate-500 leading-tight">
              Anansi uses ISO-standard biometric encryption. Your selfie is only
              used for one-time identity matching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfieQRCode;

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Glasses,
  User,
  Sun,
  Info,
  ShieldAlert,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "react-query";
import { updateSelfie } from "../../sdks/customer/customer";
import { useToast } from "../../contexts/ToastProvider";
import { uploadSingleFile } from "../../sdks/upload-files/upload";
import MyProgress from "../../components/progress-bar/MyProgress";
import useAuth from "../../hooks/useAuth";

const WebCapture = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [capturedImage, setCapturedImage] = useState(null);
  const [photoBlob, setPhotoBlob] = useState(null);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { auth } = useAuth();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    if (videoRef.current?.srcObject?.active) return;

    setCameraError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 720 },
          height: { ideal: 720 },
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setCameraError(true);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      console.error("Camera or Canvas ref not found");
      return;
    }
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setCapturedImage(dataUrl);
    canvas.toBlob((blob) => {
      setPhotoBlob(blob);
      stopCamera();
    }, "image/png");
  };

  const { mutate: uploadUrlMutate, isLoading } = useMutation({
    mutationFn: async (file) => (await uploadSingleFile(file))?.data?.data?.url,
    onSuccess: (url) => updateCustomerMutate(url),
    onError: (error) => {
      showToast({
        title: "Onboarding glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const { mutate: updateCustomerMutate } = useMutation({
    mutationFn: (file) => updateSelfie(auth?.user?.id, file),
    onSuccess: () => navigate("/onboarding/personal-information"),
    onError: (error) => {
      showToast({
        title: "Onboarding glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const handleUpload = () => {
    if (photoBlob) {
      const file = new File([photoBlob], "selfie.png", { type: "image/png" });
      uploadUrlMutate(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <main className="flex-1 w-full max-w-[1300px] mx-auto py-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Instructions (Visible lg+) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col gap-6">
          <MyProgress
            currentTitle="Identity Verification"
            currentSubtitle="Selfie Verification"
          />
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <h3 className="text-[12px] font-black text-primary uppercase tracking-widest mb-4">
              Capture Guide
            </h3>
            <div className="space-y-6">
              <GuideStep
                icon={<Sun />}
                title="Lighting"
                desc="Ensure your face is evenly lit without harsh shadows."
              />
              <GuideStep
                icon={<User />}
                title="Position"
                desc="Center your face within the oval guide."
              />
              <GuideStep
                icon={<Glasses />}
                title="Accessories"
                desc="Remove glasses, hats, or face masks."
              />
            </div>
          </div>
          <div className="bg-blue-50/50 p-6 rounded-[32px] border border-blue-100/50">
            <div className="flex gap-3 mb-2">
              <Info size={18} className="text-secondary" />
              <span className="text-[11px] font-black text-primary uppercase tracking-widest">
                Pro Tip
              </span>
            </div>
            <p className="text-[12px] text-slate-600 leading-relaxed">
              Hold your device at eye level and look directly at the camera
              lens, not the screen.
            </p>
          </div>
        </div>

        {/* CENTER COLUMN: Camera Viewport */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="text-left mb-8">
            <h1 className="text-2xl lg:text-3xl font-black text-primary uppercase tracking-tight">
              {capturedImage ? "Verify Your Capture" : "Facial Biometrics"}
            </h1>
            <p className="text-slate-500 text-sm mt-2 w-full">
              {capturedImage
                ? "Ensure your facial features are clearly visible."
                : "Align your face within the guide below for automatic scanning."}
            </p>
          </div>
          <div className="relative w-full w-full aspect-[4/4] rounded-[50px] overflow-hidden bg-slate-900 shadow-2xl ring-[12px] ring-white">
            <AnimatePresence mode="wait">
              {!capturedImage ? (
                <motion.div
                  key="cam"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full w-full"
                >
                  {cameraError ? (
                    <div className="h-full flex flex-col items-center justify-center p-12 text-center text-white bg-primary">
                      <AlertCircle size={56} className="text-rose-400 mb-4" />
                      <h4 className="font-bold">Camera Access Required</h4>
                      <p className="text-xs text-slate-400 mt-2">
                        Check your browser settings to allow camera permissions.
                      </p>
                      <button
                        onClick={startCamera}
                        className="mt-6 px-6 py-3 bg-secondary rounded-xl text-[11px] font-black uppercase"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="h-full w-full object-cover scale-x-[-1]"
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="w-[80%] h-[70%] border-2 border-dashed border-white/40 rounded-[140px] shadow-[0_0_0_999px_rgba(4,33,89,0.6)]" />
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="pre"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full w-full relative"
                >
                  <img
                    src={capturedImage}
                    className="h-full w-full object-cover"
                    alt="Selfie"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons (Desktop Center) */}
          <div className="w-full w-full mt-8 flex flex-col gap-4">
            {!capturedImage ? (
              <button
                onClick={takePhoto}
                disabled={cameraError}
                className="w-full h-16 bg-primary text-white rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-[#072d7a] transition-all active:scale-[0.98]"
              >
                <Camera size={20} /> Capture Selfie
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setCapturedImage(null);
                    startCamera();
                  }}
                  className="h-16 rounded-[24px] border-2 border-slate-200 text-primary font-black uppercase tracking-widest text-[11px] hover:bg-slate-50 transition-all"
                >
                  Retake
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isLoading}
                  className="h-16 bg-primary text-white rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-[#072d7a] transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Verify Now"
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Security & Disclaimers */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-[32px] border border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="text-secondary" size={18} />
              <h3 className="text-[11px] font-black text-primary uppercase tracking-widest">
                Compliance
              </h3>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed mb-4">
              This verification is required by **SASRA** regulations for digital
              Sacco membership onboarding.
            </p>
            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                <CheckCircle2 size={14} className="text-green-500" />
                GDPR Compliant
              </div>
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                <CheckCircle2 size={14} className="text-green-500" />
                Biometric Encryption
              </div>
            </div>
          </div>

          <div className="p-6 bg-primary rounded-[32px] text-white shadow-xl shadow-blue-900/20">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-secondary">
              Data Privacy
            </h4>
            <p className="text-[11px] text-white/70 leading-relaxed">
              Your selfie is used solely for identity verification against your
              ID document. We never share biometric data with third parties.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

const GuideStep = ({ icon, title, desc }) => (
  <div className="flex gap-4">
    <div className="w-10 h-10 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center text-secondary">
      {icon}
    </div>
    <div>
      <h4 className="text-[13px] font-black text-primary leading-tight mb-1">
        {title}
      </h4>
      <p className="text-[11px] text-slate-400 leading-snug">{desc}</p>
    </div>
  </div>
);

export default WebCapture;

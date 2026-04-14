import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Camera,
  RotateCcw,
  CheckCircle2,
  Headphones,
  Loader2,
  ShieldCheck,
  AlertCircle,
  Glasses,
  User,
  Sun,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery } from "react-query";
import { getCustomerDetails, updateSelfie } from "../../sdks/customer/customer";
import { useToast } from "../../contexts/ToastProvider";
import { uploadSingleFile } from "../../sdks/upload-files/upload";

const SelfieCapture = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const { showToast } = useToast();
  const [capturedImage, setCapturedImage] = useState(null);
  const [photoBlob, setPhotoBlob] = useState(null);
  const [cameraError, setCameraError] = useState(false);
  const [customer, setCustomer] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    startCamera();

    return () => stopCamera();
  }, []);

  useQuery({
    queryKey: ["get customer details"],
    queryFn: async () => {
      const response = await getCustomerDetails(token);
      return response?.data?.data;
    },
    onSuccess: (data) => {
      setCustomer(data);
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
    onSuccess: (url) => {
      window.alert(url);
      updateCustomerMutate(url);
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

  const { mutate: updateCustomerMutate } = useMutation({
    mutationKey: ["update-customer-selfie"],
    mutationFn: (file) => updateSelfie(customer?.id, file),
    onSuccess: async () => {
      showToast({
        title: "Selfie Verified",
        type: "success",
        position: "center",
        description:
          "Your identity has been successfully captured and synced with your profile.",
      });
      navigate("/kyc-selfie/selfie-capture-success");
    },
    onError: (error) => {
      showToast({
        title: "Onboarding glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
      navigate("/kyc-selfie/selfie-capture-fail");
    },
  });

  const handleUpload = async () => {
    if (photoBlob) {
      const file = new File([photoBlob], "selfie.png", { type: "image/png" });
      await uploadUrlMutate(file);
    }
  };

  const tips = [
    {
      icon: <CheckCircle2 size={18} className="text-secondary" />,
      text: "Allow camera access on your browser",
    },
    {
      icon: <Sun size={18} className="text-secondary" />,
      text: "Position yourself in a well-lit area",
    },
    {
      icon: <User size={18} className="text-secondary" />,
      text: "Keep your selfie centered in the frame",
    },
    {
      icon: <Glasses size={18} className="text-secondary" />,
      text: "Take off any hats, glasses, or masks",
    },
  ];

  return (
    <div className="h-screen bg-white flex flex-col font-sans overflow-hidden">
      <div className="w-full flex justify-center bg-white border-b border-slate-50 sticky top-0 z-50">
        {/* The header is constrained to 400px and uses justify-between for its internal items */}
        <header className="w-full max-w-[400px] h-[92px] flex items-center justify-between">
          {/* Logo / Shield */}
          <div className="w-12 h-12 bg-primary rounded-[10px] flex items-center justify-center shadow-lg shadow-blue-900/10">
            <ShieldCheck className="text-secondary" size={32} />
          </div>

          {/* Help Section */}
          <div className="flex items-center gap-2 text-primary cursor-pointer active:opacity-60 transition-opacity">
            <Headphones size={24} />
            <span className="text-[13px] font-black uppercase tracking-widest">
              Help
            </span>
          </div>
        </header>
      </div>
      {/* Scrollable Area */}
      <main className="flex-1 overflow-y-auto relative bg-white custom-scrollbar">
        {/* Container for content - Added pb-40 to ensure space for the sticky footer */}
        <div className="flex flex-col items-center py-3 px-6 pb-10">
          <div className="text-center mb-6">
            <h1 className="text-xl font-black text-primary uppercase tracking-tight">
              {capturedImage ? "Verify Identity" : "Take a Selfie"}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {capturedImage
                ? "Does this look clear and centered?"
                : "Align your face within the circle below"}
            </p>
          </div>

          {/* Camera Viewport */}
          <div className="relative w-full max-w-[400px] aspect-[3/4] rounded-[40px] overflow-hidden bg-slate-900 shadow-2xl ring-8 ring-slate-50">
            <AnimatePresence mode="wait">
              {!capturedImage ? (
                <motion.div
                  key="camera"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative h-full w-full"
                >
                  {cameraError ? (
                    <div className="h-full flex flex-col items-center justify-center p-8 text-center text-white">
                      <AlertCircle size={48} className="text-red-400 mb-4" />
                      <p className="text-sm font-bold">Camera Access Denied</p>
                      <p className="text-xs text-slate-400 mt-2">
                        Please enable camera permissions.
                      </p>
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
                        <div className="w-[85%] h-[75%] border-2 border-dashed border-white/50 rounded-[120px] shadow-[0_0_0_999px_rgba(4,33,89,0.5)]" />
                      </div>
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ scale: 1.1, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="h-full w-full"
                >
                  <img
                    src={capturedImage}
                    className="h-full w-full object-cover"
                    alt="Captured"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full shadow-lg">
                    <CheckCircle2 size={20} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Success Checklist */}
          {!capturedImage && (
            <div className="mt-6 w-full max-w-[400px] grid grid-cols-2 gap-3">
              <Tip icon={<ShieldCheck size={14} />} text="Clear Face" />
              <Tip icon={<RotateCcw size={14} />} text="Good Light" />
            </div>
          )}

          {/* Requirements */}
          <div className="w-full max-w-[400px] mt-6">
            <p className="text-[11px] font-black uppercase tracking-[0.1em] text-primary mb-4 opacity-60">
              Verification Requirements
            </p>
            <div className="grid grid-cols-1 gap-3">
              {tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-slate-50/50 rounded-2xl border border-slate-200"
                >
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm">
                    {tip.icon}
                  </div>
                  <p className="text-[13px] font-medium text-slate-700 leading-tight">
                    {tip.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      {/* STICKY FOOTER - Fixed at the very bottom of the screen */}
      <footer className="flex-none p-6 bg-white/90 bg-slate-900/40 border-t border-slate-100 z-[100]">
        <div className="max-w-[400px] mx-auto">
          {!capturedImage ? (
            <button
              onClick={takePhoto}
              disabled={cameraError}
              className="w-full h-16 bg-primary text-white rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-transform disabled:bg-slate-300"
            >
              <Camera size={20} /> Capture Photo
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <button
                onClick={handleUpload}
                disabled={isLoading}
                className="w-full h-16 bg-primary text-white rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-[0.98] transition-transform"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Submit Verification"
                )}
              </button>
              <button
                onClick={() => {
                  setCapturedImage(null);
                  startCamera();
                }}
                disabled={isLoading}
                className="w-full h-16 rounded-[24px] text-primary border font-black uppercase text-[11px] tracking-widest active:opacity-60 transition-opacity"
              >
                Retake Photo
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

// Helper Mini-Component
const Tip = ({ icon, text }) => (
  <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
    <span className="text-secondary">{icon}</span>
    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
      {text}
    </span>
  </div>
);

export default SelfieCapture;

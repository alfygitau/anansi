import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Lightbulb,
  ShieldCheck,
  Headphones,
  Lock,
  CheckCircle2,
  ArrowRight,
  UserRound,
  Scan,
} from "lucide-react";
import { motion } from "framer-motion";

const MobileSelfieLanding = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const startCapture = () => {
    navigate(`/kyc-selfie/take-photo?token=${token}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center font-sans">
      {/* 1. Header Navigation */}
      <header className="w-full max-w-[600px] h-[92px] bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="w-12 h-12 bg-primary rounded-[10px] flex items-center justify-center shadow-2xl shadow-blue-900/20">
          <ShieldCheck className="text-secondary" size={32} />
        </div>
        <button className="flex items-center gap-2 text-primary group">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
            <Headphones size={16} />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest">
            Help
          </span>
        </button>
      </header>

      <main className="w-full max-w-[600px] px-6 py-8 flex flex-col items-center">
        {/* 2. Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-full text-secondary mb-4">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Secure Verification
            </span>
          </div>
          <h1 className="text-2xl font-black text-primary uppercase tracking-tight mb-2">
            Selfie Verification
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed px-4">
            To protect your account, we need to confirm it’s really you. Ensure
            your face is clearly visible in the frame.
          </p>
        </div>

        {/* 3. Visual Guide Area */}
        {/* Updated Container with mobile-specific height and aspect ratio */}
        <div className="relative w-full mb-[15px] aspect-square min-h-[350px] sm:min-h-[350px] flex items-center justify-center bg-slate-50/50 rounded-full border border-slate-100 overflow-hidden">
          {/* 1. Animated "Scanning" Beam */}
          <motion.div
            initial={{ top: "-10%" }}
            animate={{ top: "110%" }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent z-20 shadow-[0_0_15px_#4DB8E4]"
          />

          {/* 2. The Facial Silhouette - Scaled up for the new height */}
          <div className="relative z-10 flex items-center justify-center scale-110 sm:scale-125">
            <UserRound
              size={180} // Increased size
              strokeWidth={0.5}
              className="text-primary/20"
            />
            {/* Inner focus points */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-36 h-48 border-[0.5px] border-secondary/30 rounded-[60px]" />
            </div>
          </div>

          {/* 3. The Outer Scan Corners */}
          <div className="absolute inset-8 z-20 pointer-events-none">
            <Scan
              size="100%"
              strokeWidth={1}
              className="text-secondary opacity-40 animate-pulse"
            />
          </div>

          {/* 4. Background Tech Circles */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] border border-primary/5 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] border border-primary/5 rounded-full border-dashed" />
          </div>
        </div>

        {/* 4. Checklist Card */}
        <div className="w-full bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm mb-6">
          <h3 className="text-[12px] font-black text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <Lightbulb size={16} className="text-secondary" />
            Success Checklist
          </h3>

          <div className="grid gap-5">
            {[
              {
                text: "Allow camera access on your browser",
                sub: "Required for identity capture",
              },
              {
                text: "Position yourself in a well-lit area",
                sub: "Avoid bright light behind you",
              },
              {
                text: "Remove hats, glasses, or masks",
                sub: "Ensure face is fully unobstructed",
              },
              {
                text: "Keep a neutral expression",
                sub: "Look directly into the camera",
              },
            ].map((tip, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-6 w-6 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={14} className="text-green-600" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-slate-800 leading-none">
                    {tip.text}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 font-medium">
                    {tip.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Privacy Disclaimer */}
        <div className="w-full px-4 mb-10 flex items-start gap-3 opacity-60">
          <Lock size={14} className="text-slate-400 shrink-0 mt-1" />
          <p className="text-[11px] text-slate-500 leading-relaxed">
            <span className="font-bold">Privacy Note:</span> Your biometric data
            is processed securely following SASRA guidelines. Anansi Sacco never
            stores raw facial images on your device.
          </p>
        </div>

        {/* 6. Action Button */}
        <footer className="w-full sticky bottom-6 px-6">
          <button
            onClick={startCapture}
            className="w-full h-[64px] bg-primary text-white rounded-[24px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/30 active:scale-[0.98] transition-all"
          >
            Start Verification
            <ArrowRight size={20} className="text-secondary" />
          </button>
        </footer>
      </main>
    </div>
  );
};

export default MobileSelfieLanding;

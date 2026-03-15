import { motion } from "framer-motion";
import {
  AlertCircle,
  Headphones,
  ShieldCheck,
  Camera,
  RotateCcw,
  Lightbulb,
  WifiOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CaptureFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">
      {/* Header */}
      <div className="w-full flex justify-center bg-white border-b border-slate-50 sticky top-0 z-50">
        <header className="w-full max-w-[400px] h-[92px] flex items-center justify-between">
          <div className="w-12 h-12 bg-[#042159] rounded-[10px] flex items-center justify-center shadow-lg shadow-blue-900/10">
            <ShieldCheck className="text-[#4DB8E4]" size={32} />
          </div>
          <div className="flex items-center gap-2 text-[#042159] cursor-pointer active:opacity-60 transition-opacity">
            <Headphones size={24} />
            <span className="text-[13px] font-black uppercase tracking-widest">
              Help
            </span>
          </div>
        </header>
      </div>

      <main className="flex-1 flex flex-col items-center px-6 pt-6 pb-12">
        {/* Animated Error Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8"
        >
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg shadow-red-200">
            <AlertCircle className="text-white" size={40} />
          </div>
        </motion.div>

        {/* Text Content */}
        <div className="text-center max-w-[400px] mb-10">
          <h1 className="text-2xl font-black text-[#042159] uppercase tracking-tight mb-4">
            Upload Failed
          </h1>
          <p className="text-slate-500 text-[15px] leading-relaxed">
            Something went wrong while processing your selfie. This usually
            happens due to
            <span className="font-bold text-[#042159]"> poor lighting</span> or
            a<span className="font-bold text-[#042159]"> weak connection</span>.
          </p>
        </div>

        {/* Troubleshooting Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-[400px] bg-slate-50 rounded-[32px] p-8 py-8 border border-slate-100 flex flex-col items-center relative overflow-hidden"
        >
          <p className="text-[#042159] font-black uppercase text-[12px] tracking-widest mb-8">
            Let's try these fixes
          </p>

          <div className="grid grid-cols-1 gap-6 w-full">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                <Lightbulb size={20} className="text-amber-500" />
              </div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                Find a brighter spot
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                <WifiOff size={20} className="text-blue-500" />
              </div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                Check your data/Wi-Fi
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                <RotateCcw size={20} className="text-purple-500" />
              </div>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                Remove glasses or hats
              </p>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="mt-12 w-full max-w-[400px] space-y-4">
          <button
            onClick={() => navigate("/kyc-selfie/take-photo")}
            className="w-full h-16 bg-[#042159] text-white rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 active:scale-[0.98] transition-transform"
          >
            <Camera size={20} /> Try Again
          </button>

          <button
            onClick={() => window.location.reload()}
            className="w-full h-14 bg-white text-[#042159] border-2 border-[#042159]/10 rounded-[24px] font-black uppercase tracking-widest text-xs active:opacity-60 transition-opacity"
          >
            Refresh Page
          </button>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="flex justify-center pb-8 opacity-20">
        <div className="w-12 h-12 bg-[#042159] rounded-[18px] flex items-center justify-center">
          <ShieldCheck className="text-[#4DB8E4]" size={24} />
        </div>
      </footer>
    </div>
  );
};

export default CaptureFailed;

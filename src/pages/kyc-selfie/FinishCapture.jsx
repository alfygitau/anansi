import { motion } from "framer-motion";
import {
  Monitor,
  ArrowRight,
  Headphones,
  ShieldCheck,
  Lock,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

const FinishCapture = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">
      {/* Header */}
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

      <main className="flex-1 flex flex-col items-center px-6 pt-6 pb-12">
        {/* Animated Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8"
        >
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
            <CheckCircle2 className="text-white" size={32} />
          </div>
        </motion.div>

        {/* Text Content */}
        <div className="text-center max-w-[400px] mb-12">
          <h1 className="text-2xl font-black text-primary uppercase tracking-tight mb-4">
            Selfie Verified
          </h1>
          <p className="text-slate-500 text-[15px] leading-relaxed">
            Great job! Your identity verification is complete. Now, please
            <span className="font-bold text-primary">
              {" "}
              return to your computer
            </span>{" "}
            to finalize your application.
          </p>
        </div>

        {/* Desktop Transition Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-[400px] bg-slate-50 rounded-[32px] p-8 py-6 border border-slate-100 flex flex-col items-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Monitor size={120} />
          </div>

          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
            <Monitor className="text-primary" size={28} />
          </div>
          <p className="text-primary font-black uppercase text-[12px] tracking-widest mb-6 mt-6">
            What to do next?
          </p>

          <ul className="space-y-4 w-full">
            <li className="flex items-start gap-3">
              <div className="mt-1">
                <ArrowRight size={14} className="text-secondary" />
              </div>
              <p className="text-xs font-medium text-slate-600">
                The page on your computer will update automatically.
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1">
                <ArrowRight size={14} className="text-secondary" />
              </div>
              <p className="text-xs font-medium text-slate-600">
                If it doesn't, simply refresh the browser on your desktop.
              </p>
            </li>
          </ul>
        </motion.div>

        {/* Security Disclaimers */}
        <div className="mt-12 w-full max-w-[400px] space-y-3">
          <div className="flex gap-4 p-4 rounded-2xl bg-blue-50/30 border border-blue-100/50">
            <Lock size={18} className="text-blue-500 flex-shrink-0" />
            <p className="text-[11px] text-blue-800/70 leading-relaxed italic">
              Your session is protected by end-to-end encryption. You can safely
              close this mobile tab once the desktop page updates.
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-300">
            <div className="h-[1px] flex-1 bg-slate-100"></div>
            <RefreshCw size={12} className="animate-spin-slow" />
            <div className="h-[1px] flex-1 bg-slate-100"></div>
          </div>

          <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
            Waiting for desktop sync...
          </p>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className="flex justify-center grayscale">
        <div className="w-16 h-16 bg-primary rounded-[22px] flex items-center justify-center shadow-2xl shadow-blue-900/20 mb-6">
          <ShieldCheck className="text-secondary" size={32} />
        </div>
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `,
        }}
      />
    </div>
  );
};

export default FinishCapture;

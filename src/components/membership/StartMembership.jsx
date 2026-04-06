import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ArrowRight, LogOut, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StartMembership = ({ isOpen, onPay, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const deviceId = localStorage.getItem("anansi_device_id");
    localStorage.clear();
    sessionStorage.clear();
    if (deviceId) localStorage.setItem("anansi_device_id", deviceId);

    if (onLogout) onLogout();
    navigate("/auth/login");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-primary/80 bg-slate-900/40"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[460px] bg-primary border border-white/10 rounded-[32px] overflow-hidden shadow-2xl shadow-black/50"
          >
            {/* Decorative Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />

            <div className="p-8 md:p-10 flex flex-col gap-8">
              {/* Header & Icon */}
              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                  <ShieldCheck
                    className="text-secondary"
                    size={36}
                    strokeWidth={1.5}
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    Setup Membership
                  </h2>
                  <p className="text-secondary text-xs font-bold uppercase tracking-[0.2em] mt-1">
                    Anansi Sacco Community
                  </p>
                </div>
              </div>

              {/* Body Content */}
              <div className="space-y-4">
                <p className="text-slate-300 text-[15px] leading-relaxed">
                  Start your smart financial journey today. Simply make a
                  one-time membership payment of{" "}
                  <span className="text-white font-bold">KES 1,000.00</span> to
                  unlock all premium benefits, savings products, and loan
                  facilities.
                </p>

                {/* Secure Disclaimer Box */}
                <div className="flex gap-3 p-4 bg-black/20 rounded-2xl border border-white/5">
                  <Lock className="text-secondary flex-shrink-0" size={18} />
                  <p className="text-[11px] text-slate-400 leading-relaxed italic">
                    This is a one-time fee. Your transaction is encrypted and
                    secured via our licensed payment gateways.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-2">
                <button
                  onClick={onPay}
                  className="group w-full h-14 bg-secondary hover:bg-[#3da8d4] text-primary rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-secondary/20"
                >
                  Pay and get access
                  <ArrowRight
                    size={20}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors py-2"
                >
                  <span className="text-xs font-bold uppercase tracking-widest underline decoration-slate-600 underline-offset-8">
                    Pay Later, log out
                  </span>
                  <LogOut size={14} />
                </button>
              </div>
            </div>

            {/* Bottom Footer Indicator */}
            <div className="h-2 w-full bg-gradient-to-r from-transparent via-secondary/30 to-transparent opacity-50" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StartMembership;

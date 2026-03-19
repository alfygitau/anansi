import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/useStore";

const Logout = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const resetStore = useStore((state) => state.resetStore);

  const clearLocalStorageExcept = (keysToKeep) => {
    const saved = {};
    keysToKeep.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value !== null) saved[key] = value;
    });
    localStorage.clear();
    for (const key in saved) {
      localStorage.setItem(key, saved[key]);
    }
  };

  const handleLogout = () => {
    clearLocalStorageExcept(["anansi_device_id"]);
    sessionStorage.clear();
    resetStore();
    navigate("/");
    onClose();
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
            onClick={onClose}
            className="absolute inset-0 bg-[#042159]/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-[500px] bg-white rounded-[32px] shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-10 pt-12 flex flex-col items-center">
              {/* Animated Icon Header */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-[#074073] opacity-5 rounded-full scale-[1.4] animate-pulse" />
                <div className="relative h-20 w-20 bg-blue-50 rounded-3xl flex items-center justify-center text-[#074073]">
                  {/* Your original SVG or a Lucide alternative */}
                  <LogOut size={36} strokeWidth={1.5} />
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center space-y-3 mb-6">
                <h3 className="text-[22px] font-black text-[#042159]">
                  Confirm Logout
                </h3>
                <p className="text-[14px] text-slate-500 leading-relaxed max-w-[320px] mx-auto">
                  Your progress is safe. You can resume your account
                  verification exactly where you left off at any time.
                </p>
              </div>

              {/* Info Notice */}
              <div className="w-full flex items-center gap-3 p-4 bg-slate-50 rounded-2xl mb-6 border border-slate-100">
                <AlertCircle size={18} className="text-[#4DB8E4] shrink-0" />
                <p className="text-[12px] text-slate-600 font-medium">
                  Signing out will end your current active session.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                <button
                  onClick={onClose}
                  className="w-full sm:flex-1 h-14 rounded-2xl text-[14px] font-bold text-[#042159] bg-slate-100 hover:bg-slate-200 transition-all active:scale-[0.98]"
                >
                  No, Stay Logged In
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full sm:flex-1 h-14 rounded-2xl text-[14px] font-bold text-white bg-[#074073] hover:bg-[#042159] shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
                >
                  Yes, Log Out
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Logout;

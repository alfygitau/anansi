import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Bell, ArrowRight } from "lucide-react";

const Notification = ({ isOpen, onClose, notification }) => {
  if (!notification) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 bg-slate-900/40 z-[99]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl shadow-blue-900/20 overflow-hidden pointer-events-auto"
            >
              {/* Top Banner / Header Decor */}
              <div className="h-24 bg-gradient-to-r from-primary to-blue-600 p-6 flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-white/20 backdrop-blur-md rounded-2xl">
                    <Bell className="text-white" size={24} />
                  </div>
                  <span className="text-white text-[13px] font-bold uppercase tracking-wider rounded-full">
                    {notification.module || "System"}
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content Section */}
              <div className="px-8 pb-8 -mt-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-blue-50 text-primary text-[10px] font-bold uppercase tracking-wider rounded-full">
                      {notification.module || "System"}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                      <Calendar size={12} />
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
                    Notification Details
                  </h3>

                  <p className="text-slate-600 leading-relaxed text-sm">
                    {notification.message}
                  </p>
                </div>
                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <button className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                    View Activity <ArrowRight size={18} />
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full py-4 bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 rounded-2xl font-semibold transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Notification;

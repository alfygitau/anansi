import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X, ShieldCheck } from "lucide-react";

const CustomToast = ({
  isVisible,
  onClose,
  title,
  description,
  type = "success",
  position = "center",
}) => {
  const icons = {
    success: <CheckCircle2 className="text-emerald-500" size={24} />,
    error: <AlertCircle className="text-rose-500" size={24} />,
    info: <Info className="text-blue-500" size={24} />,
    brand: <ShieldCheck className="text-secondary" size={24} />,
  };

  const positionClasses = {
    center: "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
    "top-right": "top-8 right-8",
    "bottom-right": "bottom-8 right-8",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`fixed z-[100] ${positionClasses[position]} w-full max-w-sm`}
        >
          <div className="bg-white rounded-[32px] shadow-2xl shadow-blue-900/10 border border-slate-100 p-6 flex items-center gap-4 overflow-hidden relative">
            {/* Side Accent Line */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                type === "success"
                  ? "bg-emerald-500"
                  : type === "error"
                    ? "bg-rose-500"
                    : "bg-primary"
              }`}
            />

            <div className="flex-shrink-0 mt-1">{icons[type]}</div>

            <div className="flex-grow pr-4">
              <h3 className="text-primary font-black text-sm uppercase tracking-wider mb-1">
                {title}
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed font-medium whitespace-pre-line">
                {description}
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex-shrink-0 text-slate-300 hover:text-slate-500 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomToast;

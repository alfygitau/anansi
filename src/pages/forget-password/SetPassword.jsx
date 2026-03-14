import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  LockKeyhole,
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

const CreateNewPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  // Real-time validation criteria
  const validations = {
    length: formData.password.length >= 8,
    number: /[0-9]/.test(formData.password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
    upperLower:
      /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password),
    match:
      formData.password === formData.confirmPassword &&
      formData.confirmPassword !== "",
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!Object.values(validations).every((v) => v)) return;

    setLoading(true);
    try {
      setTimeout(() => {
        setLoading(false);
        navigate("/auth/login");
      }, 2000);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white rounded-[40px] shadow-xl shadow-blue-900/5 border border-slate-100 p-10"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
            <LockKeyhole size={32} className="text-[#4DB8E4]" />
          </div>
          <h1 className="text-2xl font-black text-[#042159] mb-2">
            Secure Account
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed px-2">
            Choose a strong password to keep your Anansi account protected.
          </p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          {/* PASSWORD FIELD */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full h-14 px-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-[#4DB8E4] focus:bg-white transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#042159]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* CONFIRM FIELD */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="••••••••"
                className={`w-full h-14 px-5 bg-slate-50 border rounded-2xl outline-none transition-all font-medium
                  ${formData.confirmPassword && !validations.match ? "border-rose-200" : "border-slate-100 focus:border-[#4DB8E4] focus:bg-white"}
                `}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#042159]"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* VALIDATION CHECKLIST */}
          <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
              Security Checklist
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <ValidationItem
                met={validations.length}
                label="Minimum 8 characters"
              />
              <ValidationItem
                met={validations.upperLower}
                label="Uppercase & Lowercase"
              />
              <ValidationItem
                met={validations.number}
                label="At least one number"
              />
              <ValidationItem
                met={validations.special}
                label="One special character (@#$%...)"
              />
              <ValidationItem met={validations.match} label="Passwords match" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !Object.values(validations).every((v) => v)}
            className="w-full h-14 bg-[#042159] hover:bg-[#062d7a] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-30 disabled:grayscale"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Update Password"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// Helper component for checklist items
const ValidationItem = ({ met, label }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${met ? "bg-emerald-500" : "bg-slate-200"}`}
    >
      {met ? (
        <Check size={10} className="text-white" strokeWidth={4} />
      ) : (
        <X size={10} className="text-white" />
      )}
    </div>
    <span
      className={`text-xs font-bold transition-colors ${met ? "text-emerald-600" : "text-slate-400"}`}
    >
      {label}
    </span>
  </div>
);

export default CreateNewPassword;

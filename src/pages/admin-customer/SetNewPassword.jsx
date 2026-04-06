import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  Lock,
  Eye,
  EyeOff,
  Check,
  Loader2,
  ArrowRight,
  ShieldAlert,
  Zap,
} from "lucide-react";
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";

const SetNewPassword = () => {
  const [formData, setFormData] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Real-time Validation Engine
  const strength = useMemo(() => {
    const p = formData.new;
    return {
      hasUpper: /[A-Z]/.test(p),
      hasNumber: /[0-9]/.test(p),
      hasSpecial: /[\W]/.test(p),
      hasLength: p.length >= 8,
      isMatch: formData.new === formData.confirm && formData.confirm !== "",
    };
  }, [formData.new, formData.confirm]);

  const allValid = Object.values(strength).every(Boolean);

  const { mutate: handleUpdate, isLoading } = useMutation({
    mutationFn: async (payload) => {
      return new Promise((resolve) => setTimeout(resolve, 2000));
    },
    onSuccess: () => {
      showToast({
        title: "Vault Secured",
        description: "Your new password is active.",
        type: "success",
      });
      navigate("/auth/login");
    },
  });

  const toggleVisibility = (field) =>
    setShowPass((prev) => ({ ...prev, [field]: !prev[field] }));

  return (
    <div className="mt-[20px] h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl mx-auto bg-white overflow-hidden flex flex-col lg:row-reverse lg:flex-row"
      >
        {/* Left Side: Security Education (Strength Meter) */}
        <div className="lg:w-5/12 bg-primary p-8 lg:p-8 text-white flex flex-col justify-between relative">
          <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
            <Lock size={150} />
          </div>

          <div className="relative z-10">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-blue-300 hover:text-white transition-colors mb-12 text-[10px] font-black uppercase tracking-widest"
            >
              <ChevronLeft size={16} /> Previous Step
            </button>

            <h1 className="text-3xl font-black tracking-tighter mb-4 leading-tight">
              Secure Your <br /> Access Vault.
            </h1>
            <p className="text-blue-100/60 text-sm mb-10 font-medium">
              We use military-grade encryption to store your credentials. Help
              us protect you by choosing a strong key.
            </p>

            {/* Live Strength Checklist */}
            <div className="space-y-3 bg-white/5 p-6 rounded-[32px] border border-white/5 bg-slate-900/40">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary mb-4">
                Strength Guard
              </h4>
              {[
                { label: "One Uppercase Letter", met: strength.hasUpper },
                { label: "One Numeric Digit", met: strength.hasNumber },
                { label: "Special Character (@#$)", met: strength.hasSpecial },
                { label: "8+ Characters Minimum", met: strength.hasLength },
                { label: "Passwords Match", met: strength.isMatch },
              ].map((req, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${req.met ? "bg-emerald-500 scale-110" : "bg-white/10"}`}
                  >
                    {req.met ? (
                      <Check size={12} strokeWidth={4} />
                    ) : (
                      <div className="w-1 h-1 bg-white/20 rounded-full" />
                    )}
                  </div>
                  <span
                    className={`text-xs font-bold transition-colors ${req.met ? "text-white" : "text-white/30"}`}
                  >
                    {req.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 p-4 bg-blue-400/10 rounded-2xl border border-blue-400/10">
            <ShieldAlert size={18} className="text-secondary" />
            <p className="text-[9px] text-blue-100/70 font-medium leading-relaxed uppercase tracking-wider">
              Avoid using birthdays or common names. Your security is our
              priority.
            </p>
          </div>
        </div>

        {/* Right Side: Password Inputs */}
        <div className="lg:w-7/12 p-8 lg:py-12 lg:px-10 bg-slate-50/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (allValid) handleUpdate(formData);
            }}
            className="max-w-md mx-auto w-full space-y-6"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-black text-primary tracking-tight">
                Set Password
              </h2>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
                Identity Verification
              </p>
            </div>

            {/* Input Fields */}
            {[
              {
                id: "current",
                label: "Current Password",
                placeholder: "Temporary password sent",
              },
              {
                id: "new",
                label: "New Secure Password",
                placeholder: "Min. 8 characters",
              },
              {
                id: "confirm",
                label: "Confirm New Password",
                placeholder: "Repeat your new password",
              },
            ].map((field) => (
              <div key={field.id} className="space-y-2">
                <label className="text-[10px] font-black text-primary uppercase tracking-[0.15em] ml-2">
                  {field.label}
                </label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPass[field.id] ? "text" : "password"}
                    value={formData[field.id]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field.id]: e.target.value })
                    }
                    placeholder={field.placeholder}
                    className="w-full h-[55px] pl-14 pr-14 bg-gray-100 border-2 border-transparent rounded-[24px] text-sm font-bold text-primary transition-all outline-none shadow-sm focus:border-secondary focus:ring-8 focus:ring-blue-500/5"
                  />
                  <button
                    type="button"
                    onClick={() => toggleVisibility(field.id)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors"
                  >
                    {showPass[field.id] ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading || !allValid}
                className="w-full h-[55px] bg-primary text-white rounded-[24px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 shadow-xl shadow-blue-900/20 hover:bg-[#062d7a] active:scale-[0.98] disabled:opacity-20 disabled:grayscale transition-all"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Secure My Account <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-2 opacity-20 mb-4">
              <div className="h-[1px] w-12 bg-slate-400" />
              <Zap size={12} />
              <div className="h-[1px] w-12 bg-slate-400" />
            </div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest px-12">
              Encrypted with AES-256 standards. Your password is never stored in
              plain text.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SetNewPassword;

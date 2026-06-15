import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { resetPassword } from "../../sdks/auth/auth";
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import { useStore } from "../../store/useStore";

const CreateNewPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { showToast } = useToast();
  const forgetEmail = useStore((state) => state.forgetEmail);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

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
    await resetPasswordMutate();
  };

  const { mutate: resetPasswordMutate, isLoading } = useMutation({
    mutationKey: ["set new password"],
    mutationFn: () => resetPassword(forgetEmail, formData.password),
    onSuccess: () => {
      showToast({
        title: "Success!",
        type: "success",
        position: "top-right",
        description:
          "Securely updated. You're all set to log in with your new password.",
      });
      navigate("/auth/login");
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

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-6 sm:p-2 antialiased">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-[28px] shadow-[0_12px_40px_-12px_rgba(7,64,115,0.06)] border border-slate-100 overflow-hidden"
      >
        {/* LEFT PANEL: Security & Context (Hidden on Mobile/Tablet) */}
        <div className="hidden lg:flex bg-primary/[0.02] border-r border-slate-100/80 flex-col justify-between p-10">
          <div className="space-y-8">
            {/* Sacco Branding Header Tag */}
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs">
                A
              </div>
              <span className="text-xs font-bold text-primary tracking-widest uppercase">
                Anansi Sacco
              </span>
            </div>

            {/* Core Security Value Proposition */}
            <div className="space-y-4 pt-4">
              <h1 className="text-3xl font-bold text-primary">
                Secure Credentials
              </h1>
              <p className="text-[13px] text-slate-500 font-normal">
                Establish a resilient authentication layer to shield your
                financial footprint and safeguard cross-session security
                parameters.
              </p>
            </div>

            {/* System Security Features Ledger */}
            <div className="space-y-6 pt-2">
              <SecurityFeatureRow
                icon={<ShieldCheck size={16} />}
                title="Complex Character Enforcement"
                desc="Enforcing dynamic matrices of mixed casing, numbers, and symbols mitigates automated profile dictionary intercept attacks."
              />
              <SecurityFeatureRow
                icon={<LockKeyhole size={16} />}
                title="Cryptographic Hashing Layout"
                desc="Plain text data entries are converted instantly using salted one-way hash arrays prior to database storage commits."
              />
              <SecurityFeatureRow
                icon={<LockKeyhole size={16} />}
                title="Active Session Revocation"
                desc="Committing a new password phase instantly invalidates and flushes all secondary active login sessions across legacy hardware profiles."
              />
            </div>
          </div>

          {/* Security Compliance Footer Label */}
          <p className="text-[10px] text-slate-400 font-medium tracking-wide pt-6">
            Anansi Sacco Security Core • System Version 2026.4
          </p>
        </div>

        {/* RIGHT PANEL: Create Password Workspace Area */}
        <div className="w-full flex flex-col justify-between p-6 sm:p-8 md:p-10">
          <div className="flex-grow">
            {/* ICON & HEADER */}
            <div className="flex items-center mb-4 gap-3">
              <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center">
                <LockKeyhole size={32} className="text-secondary" />
              </div>
              <h1 className="text-2xl font-medium text-primary mb-2">
                Secure Account
              </h1>
            </div>

            {/* FORM */}
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* PASSWORD FIELD */}
              <div className="space-y-2">
                <label className="text-[11px] font-medium uppercase tracking-widest text-slate-400 ml-1">
                  New Password
                </label>
                <div className="relative flex items-center group">
                  {/* Absolute Prefix Block with Icon & Vertical Divider */}
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <LockKeyhole
                      size={18}
                      className="text-slate-300 group-focus-within:text-secondary transition-colors"
                    />
                    <div className="w-[1px] h-5 bg-slate-200 ml-3 group-focus-within:bg-secondary/20 transition-colors" />
                  </div>

                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Enter a strong password"
                    className="w-full h-14 pl-[60px] pr-12 bg-slate-50 border border-slate-100 rounded-2xl outline-none transition-all text-sm font-medium focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/5"
                  />

                  {/* Suffix Visibility Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* CONFIRM FIELD */}
              <div className="space-y-2">
                <label className="text-[11px] font-medium uppercase tracking-widest text-slate-400 ml-1">
                  Confirm Password
                </label>
                <div className="relative flex items-center group">
                  {/* Absolute Prefix Block with Icon & Vertical Divider */}
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                    <LockKeyhole
                      size={18}
                      className={`transition-colors ${
                        formData.confirmPassword && !validations.match
                          ? "text-rose-300 group-focus-within:text-rose-400"
                          : "text-slate-300 group-focus-within:text-secondary"
                      }`}
                    />
                    <div
                      className={`w-[1px] h-5 ml-3 transition-colors ${
                        formData.confirmPassword && !validations.match
                          ? "bg-rose-200 group-focus-within:bg-rose-400/20"
                          : "bg-slate-200 group-focus-within:bg-secondary/20"
                      }`}
                    />
                  </div>

                  <input
                    type={showConfirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    placeholder="Confirm your password"
                    className={`w-full h-14 pl-[60px] pr-12 bg-slate-50 border rounded-2xl outline-none transition-all font-medium text-sm
      ${
        formData.confirmPassword && !validations.match
          ? "border-rose-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/5"
          : "border-slate-100 focus:border-secondary focus:bg-white focus:ring-4 focus:ring-secondary/5"
      }
    `}
                  />

                  {/* Suffix Visibility Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* VALIDATION CHECKLIST */}
              <div className="bg-slate-50 rounded-2xl p-5 space-y-3 border border-slate-100/50">
                <h4 className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-2">
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
                  <ValidationItem
                    met={validations.match}
                    label="Passwords match"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={
                  isLoading || !Object.values(validations).every((v) => v)
                }
                className="w-full h-14 bg-primary hover:bg-[#062d7a] text-white rounded-2xl font-medium uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-30 disabled:grayscale hover:scale-[1.01] active:scale-[0.99]"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>
        </div>
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

// Internal supportive sub-row layout item template
const SecurityFeatureRow = ({ icon, title, desc }) => (
  <div className="flex items-start gap-3">
    <div className="size-7 rounded-md bg-white border border-slate-200/60 shadow-sm flex items-center justify-center text-primary shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="text-[12px] font-bold text-primary tracking-tight">
        {title}
      </h4>
      <p className="text-[11px] text-slate-400 font-medium mt-0.5 leading-normal">
        {desc}
      </p>
    </div>
  </div>
);

export default CreateNewPassword;

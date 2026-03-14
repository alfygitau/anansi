import { useState } from "react";
import {
  ShieldCheck,
  User,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // --- Validation Logic ---
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone) => {
    const trimmed = phone.trim();
    return /^0[71]\d{8}$/.test(trimmed) || /^[71]\d{8}$/.test(trimmed);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* LEFT PANEL: Trust & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-[35%] bg-[#042159] p-16 flex-col justify-between relative overflow-hidden">
        {/* Abstract Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#4DB8E4]/10 rounded-full blur-3xl -mr-32 -mt-32" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-[#4DB8E4] rounded-2xl flex items-center justify-center shadow-lg shadow-sky-400/20">
              <ShieldCheck className="text-[#042159]" size={28} />
            </div>
            <span className="text-xl font-black text-white tracking-tighter uppercase">
              Anansi Sacco
            </span>
          </div>

          <h2 className="text-5xl font-black text-white leading-tight mb-8">
            Empowering your <br />
            <span className="text-[#4DB8E4]">financial future.</span>
          </h2>

          <div className="space-y-8">
            <TrustPoint
              title="Quick Onboarding"
              desc="Create your account in just a few simple steps and start saving."
            />
            <TrustPoint
              title="Secure & Reliable"
              desc="Bank-grade encryption for all your financial information."
            />
            <TrustPoint
              title="Always Available"
              desc="Our support team is here to help you 24/7."
            />
          </div>
        </div>

        <div className="relative z-10 border-t border-white/10 pt-8">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
            Registered Financial Institution © 2026
          </p>
        </div>
      </div>

      {/* RIGHT PANEL: Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-slate-50">
        <div className="w-full max-w-[620px] bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-blue-900/5">
          <header className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-[#042159] tracking-tight">
              Create Account
            </h1>
            <p className="text-slate-400 text-sm mt-2">
              Join the community and start your journey.
            </p>
          </header>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Username */}
            <InputGroup label="Username">
              <User
                size={18}
                className="absolute left-6 text-slate-300 group-focus-within:text-[#4DB8E4] transition-colors"
              />
              <input
                name="username"
                type="text"
                placeholder="Samuel Otieno"
                className="modern-input"
                onChange={handleInputChange}
              />
            </InputGroup>

            {/* Email */}
            <InputGroup label="Email Address">
              <Mail
                size={18}
                className="absolute left-6 text-slate-300 group-focus-within:text-[#4DB8E4] transition-colors"
              />
              <input
                name="email"
                type="email"
                placeholder="sam@example.com"
                className="modern-input"
                onChange={handleInputChange}
              />
            </InputGroup>

            {/* Mobile with +254 Prefix */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4 block">
                Mobile Number
              </label>
              <div className="relative flex group">
                <div className="h-[60px] px-5 bg-slate-100 rounded-l-[24px] flex items-center justify-center font-bold text-[#042159] border-r border-white">
                  +254
                </div>
                <input
                  name="mobile"
                  type="text"
                  placeholder="e.g 712 345 678"
                  className="w-full h-[60px] px-6 bg-slate-50 border-none rounded-r-[24px] focus:ring-2 focus:ring-[#4DB8E4]/20 outline-none font-bold text-[#042159]"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup label="Password">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="modern-input pl-6 pr-12"
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 text-slate-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </InputGroup>

              <InputGroup label="Confirm">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="modern-input pl-6 pr-12"
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 text-slate-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </InputGroup>
            </div>

            {/* Privacy Checkbox */}
            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="privacy"
                className="w-5 h-5 rounded-md border-slate-200 text-[#4DB8E4] focus:ring-[#4DB8E4]/20"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <label
                htmlFor="privacy"
                className="text-[11px] text-slate-500 font-medium leading-relaxed"
              >
                I agree to the{" "}
                <span className="text-[#4DB8E4] underline cursor-pointer">
                  Privacy Policy
                </span>{" "}
                and allow Anansi Sacco to process my data.
              </label>
            </div>

            {/* Submit */}
            <button
              disabled={loading || !agreedToTerms}
              className="w-full h-[64px] bg-[#042159] text-white rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#4DB8E4] transition-all disabled:opacity-20 disabled:grayscale shadow-xl shadow-blue-900/10"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-tighter pt-4">
              Already a member?{" "}
              <span
                onClick={() => navigate("/auth/login")}
                className="text-[#4DB8E4] cursor-pointer hover:underline"
              >
                Sign In
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Helper Components ---
const TrustPoint = ({ title, desc }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1">
      <CheckCircle2 className="text-[#4DB8E4]" size={20} />
    </div>
    <div>
      <h4 className="text-white font-bold text-lg leading-none mb-1">
        {title}
      </h4>
      <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const InputGroup = ({ label, children }) => (
  <div className="w-full">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4 block">
      {label}
    </label>
    <div className="relative flex items-center group">{children}</div>
  </div>
);

export default Registration;

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
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import useAuth from "../../hooks/useAuth";
import { initRegister, loginUser } from "../../sdks/auth/auth";

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { setAuth } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "username":
        if (!value.trim()) error = "Username is required";
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email format";
        break;
      case "mobile":
        const phoneRegex = /^0[71]\d{8}$|^[71]\d{8}$/;
        if (!value.trim()) error = "Mobile number is required";
        else if (!phoneRegex.test(value.trim()))
          error = "Invalid format (07xxxxxxxx)";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 8) error = "Min 8 characters required";
        break;
      case "confirmPassword":
        if (value !== formData.password) error = "Passwords do not match";
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const { mutate: loginMutate } = useMutation({
    mutationKey: ["login"],
    mutationFn: () => loginUser(formData.email, formData.password),
    onSuccess: (data) => {
      setAuth(data?.data?.data);
      navigate("/onboarding/verify-email");
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

  const { mutate: registerMutate, isLoading } = useMutation({
    mutationKey: ["register"],
    mutationFn: () =>
      initRegister(
        formData.username,
        formData.email,
        formData.mobile,
        formData.password,
      ),
    onSuccess: () => {
      showToast({
        title: "Registration Success",
        type: "success",
        position: "top-right",
        description: "Welcome to Anansi.\nYour session is active for 24 hours.",
      });
      loginMutate();
    },
    onError: (error) => {
      showToast({
        title: "Registration glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    registerMutate();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-[40%] bg-primary p-16 flex-col justify-center relative overflow-hidden">
        {/* Abstract Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32" />

        {/* Centering Wrapper */}
        <div className="relative z-10 w-[85%] mx-auto">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-sky-400/20">
              <ShieldCheck className="text-primary" size={28} />
            </div>
            <span className="text-xl font-black text-white tracking-tighter uppercase">
              Anansi Sacco
            </span>
          </div>

          <h2 className="text-5xl font-black text-white leading-tight mb-8">
            Empowering your <br />
            <span className="text-secondary">financial future.</span>
          </h2>

          <div className="space-y-8">
            <TrustPoint
              title="Quick Onboarding"
              desc="Create your account in just a few simple steps."
            />
            <TrustPoint
              title="Secure & Reliable"
              desc="Bank-grade encryption for all your data."
            />
            <TrustPoint
              title="Always Available"
              desc="Our support team is here to help you 24/7."
            />
          </div>
        </div>

        {/* Optional: Footer text kept at the bottom if you prefer */}
        <div className="absolute bottom-16 left-0 w-full flex justify-center">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
            © {new Date().getFullYear()} Anansi Sacco | Registered Financial
            Institution
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-10 bg-slate-50">
        <div className="w-full max-w-[620px] bg-white p-8 md:p-12 rounded-[40px] shadow-2xl shadow-blue-900/5">
          <header className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-primary tracking-tight">
              Create Account
            </h1>
          </header>

          <form onSubmit={handleRegister} className="space-y-5">
            <InputGroup label="Username" error={errors.username}>
              <User
                size={18}
                className="absolute left-6 text-slate-300 group-focus-within:text-secondary"
              />
              <input
                name="username"
                type="text"
                className="modern-input"
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="e.g Samuel Otieno"
              />
            </InputGroup>

            <InputGroup label="Email Address" error={errors.email}>
              <Mail
                size={18}
                className="absolute left-6 text-slate-300 group-focus-within:text-secondary"
              />
              <input
                name="email"
                type="email"
                className="modern-input"
                onChange={handleInputChange}
                onBlur={handleBlur}
                placeholder="e.g sam@example.com"
              />
            </InputGroup>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4 block">
                Mobile Number
              </label>
              <div className="relative flex group">
                <div className="h-[60px] px-5 bg-slate-100 rounded-l-[24px] flex items-center justify-center font-bold text-primary border-r border-white">
                  +254
                </div>
                <input
                  name="mobile"
                  type="text"
                  className="w-full h-[60px] px-6 bg-slate-50 border-none rounded-r-[24px] focus:ring-2 focus:ring-secondary/20 outline-none font-bold text-primary"
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="e.g 0712 345 678"
                />
              </div>
              {errors.mobile && (
                <p className="text-[10px] text-red-500 font-bold mt-1 ml-4 uppercase">
                  {errors.mobile}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup label="Password" error={errors.password}>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="modern-input pl-6 pr-12"
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="e.g ••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 text-slate-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </InputGroup>

              <InputGroup label="Confirm" error={errors.confirmPassword}>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="modern-input pl-6 pr-12"
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="e.g ••••••••"
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

            {/* Checkbox & Button (Existing Logic) */}
            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="privacy"
                className="w-5 h-5"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <label htmlFor="privacy" className="text-[11px] text-slate-500">
                I agree to the Privacy Policy
              </label>
            </div>

            <button
              disabled={
                isLoading ||
                !agreedToTerms ||
                Object.values(errors).some(
                  (error) => error !== null && error !== "",
                )
              }
              className="w-full h-[64px] bg-primary text-white rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#062d7a] transition-all disabled:opacity-20 disabled:grayscale shadow-xl shadow-blue-900/10"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="mt-8 w-full text-center">
              <p className="text-sm font-medium text-slate-500">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/auth/login")}
                  className="text-primary font-black uppercase tracking-widest text-[11px] hover:text-secondary transition-colors ml-1"
                >
                  Log In
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, children, error }) => (
  <div className="w-full">
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4 block">
      {label}
    </label>
    <div className="relative flex items-center group">{children}</div>
    {error && (
      <p className="text-[10px] text-red-500 font-bold mt-1 ml-4 uppercase">
        {error}
      </p>
    )}
  </div>
);

const TrustPoint = ({ title, desc }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1">
      <CheckCircle2 className="text-secondary" size={20} />
    </div>
    <div>
      <h4 className="text-white font-bold text-lg leading-none mb-1">
        {title}
      </h4>
      <p className="text-white/40 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default Registration;

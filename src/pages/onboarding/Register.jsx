import { useState } from "react";
import {
  User,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Phone,
  Lock,
  ShieldCheck,
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

  const isFormValid =
    Object.values(formData).every((value) => value.trim() !== "") &&
    Object.values(errors).every((error) => !error) &&
    agreedToTerms;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white px-3 overflow-hidden">
        {/* LEFT PANEL: Branding (Condensed Height) */}
        <div className="hidden lg:flex bg-white flex-col justify-between p-6 relative overflow-hidden border-r border-slate-100">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/10">
                <span className="text-white text-2xl font-medium">A</span>
              </div>
              <span className="text-lg font-medium text-primary tracking-tighter uppercase">
                Anansi Sacco
              </span>
            </div>

            <h2 className="text-slate-900 text-4xl font-medium leading-tight mb-8">
              Empowering your <br />
              <span className="text-primary">financial future.</span>
            </h2>

            <div className="space-y-6">
              <TrustPoint
                title="Seamless Onboarding"
                desc="Join in under 2 minutes with automated identity verification and instant profile activation."
                isDark={false}
              />
              <TrustPoint
                title="Bank-Grade Security"
                desc="Your data is shielded by AES-256 encryption and full SASRA compliance for total peace of mind."
                isDark={false}
              />
              <TrustPoint
                title="Omnichannel Support"
                desc="Access dedicated financial assistance 24/7 via in-app chat, email, or our priority help line."
                isDark={false}
              />
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-slate-100">
            <p className="text-slate-400 text-[9px] font-medium uppercase tracking-[0.2em]">
              © {new Date().getFullYear()} Anansi Sacco | Registered Financial
              Institution
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: Form Area */}
        <div className="flex-1 w-full flex items-center justify-center p-6 lg:p-6 bg-white">
          <div className="w-full">
            <header className="mb-4 text-center lg:text-left">
              <h1 className="text-3xl font-medium text-slate-900 tracking-tight">
                Create Profile
              </h1>
            </header>
            <form onSubmit={handleRegister} className="space-y-4">
              <InputGroup
                label="Username"
                icon={User}
                name="username"
                placeholder="e.g. Samuel Otieno"
                value={formData.username}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.username}
              />

              <InputGroup
                label="Email Address"
                icon={Mail}
                name="email"
                type="email"
                placeholder="e.g. sam@example.com"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                error={errors.email}
              />

              <div className="space-y-1.5">
                <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-4 block">
                  Mobile Number
                </label>
                <div className="relative flex group h-16">
                  {/* Prefix Icon, Country Code & Separator */}
                  <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                    <Phone
                      size={18}
                      className="text-slate-300 group-focus-within:text-primary transition-colors"
                    />
                    <span className="ml-3 text-sm font-bold text-slate-400 group-focus-within:text-primary transition-colors">
                      +254
                    </span>
                    <div className="w-[1px] h-6 bg-slate-200 ml-4 group-focus-within:bg-primary/20 transition-colors" />
                  </div>

                  <input
                    name="mobile"
                    type="text"
                    className="w-full h-full pl-28 pr-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-primary placeholder:text-slate-300 placeholder:font-medium"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="0712 345 678"
                  />
                </div>
                {errors.mobile && (
                  <p className="text-[10px] text-rose-500 font-bold mt-1 ml-4 uppercase tracking-tighter">
                    {errors.mobile}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <InputGroup
                  label="Create Password"
                  icon={Lock}
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.password}
                >
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 text-slate-300 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </InputGroup>

                <InputGroup
                  label="Confirm"
                  icon={ShieldCheck} // Changed icon to ShieldCheck for visual variety/confirmation feel
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  error={errors.confirmPassword}
                >
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 text-slate-300 hover:text-primary transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </InputGroup>
              </div>

              <div className="flex items-center gap-3 py-2 px-1">
                <input
                  type="checkbox"
                  id="privacy"
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-secondary"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                />
                <label
                  htmlFor="privacy"
                  className="text-[11px] font-medium text-slate-500 cursor-pointer"
                >
                  I agree to the{" "}
                  <span className="text-primary font-bold">Privacy Policy</span>
                </label>
              </div>

              <button
                disabled={isLoading || !isFormValid}
                className="w-full h-[58px] bg-primary text-white rounded-2xl font-medium uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-secondary transition-all disabled:opacity-30 shadow-lg shadow-blue-900/10 mt-2"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Create Account <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div className="mt-6 w-full text-center">
                <p className="text-xs font-medium text-slate-500">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/auth/login")}
                    className="text-primary font-medium uppercase tracking-widest text-[10px] hover:underline ml-1"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, icon: Icon, error, children, ...props }) => (
  <div className="w-full space-y-1.5">
    <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-4 block">
      {label}
    </label>
    <div className="relative flex items-center group">
      {/* Prefix Icon & Separator */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
        <Icon
          size={18}
          className="text-slate-300 group-focus-within:text-primary transition-colors duration-200"
        />
        <div className="w-[1px] h-6 bg-slate-200 ml-4 group-focus-within:bg-primary/20 transition-colors duration-200" />
      </div>
      <input
        className="w-full h-16 pl-16 pr-6 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-primary placeholder:text-slate-300 placeholder:font-medium"
        {...props}
      />
      {children} {/* For Password Toggle Buttons */}
    </div>
    {error && (
      <p className="text-[10px] text-rose-500 font-bold mt-1 ml-4 uppercase tracking-tighter">
        {error}
      </p>
    )}
  </div>
);

const TrustPoint = ({ title, desc, isDark = true }) => (
  <div className="flex items-start gap-4">
    <div>
      <ShieldCheck className="text-primary" size={18} />
    </div>
    <div>
      <h4
        className={`${isDark ? "text-white" : "text-slate-900"} font-bold text-base leading-none mb-1`}
      >
        {title}
      </h4>
      <p
        className={`${isDark ? "text-white/40" : "text-slate-500"} text-xs leading-relaxed`}
      >
        {desc}
      </p>
    </div>
  </div>
);

export default Registration;

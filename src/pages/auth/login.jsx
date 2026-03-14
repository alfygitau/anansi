import { useState } from "react";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Fingerprint,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ memberId: "", password: "" });
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-sky-100/50 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-[440px]">
        {/* Logo / Brand Area */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-[#042159] rounded-[22px] flex items-center justify-center shadow-2xl shadow-blue-900/20 mb-6">
            <ShieldCheck className="text-[#4DB8E4]" size={32} />
          </div>
          <h1 className="text-2xl font-black text-[#042159] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">
            Secure Member Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-blue-900/5">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* Member ID Input */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-2 block">
                Member ID / Mobile
              </label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4DB8E4] transition-colors">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Enter ID number"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[24px] focus:ring-2 focus:ring-[#4DB8E4]/20 outline-none font-bold text-[#042159] transition-all"
                  value={formData.memberId}
                  onChange={(e) =>
                    setFormData({ ...formData, memberId: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-3 ml-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                  Security Password
                </label>
                <button className="text-[10px] font-black uppercase text-[#4DB8E4] hover:text-[#042159]">
                  Forgot?
                </button>
              </div>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4DB8E4] transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-14 py-5 bg-slate-50 border-none rounded-[24px] focus:ring-2 focus:ring-[#4DB8E4]/20 outline-none font-bold text-[#042159] transition-all"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#042159] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => navigate("/home")}
              className="w-full bg-[#042159] text-white py-5 rounded-[24px] font-black uppercase tracking-[0.15em] flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 hover:bg-[#062d7a] transition-all active:scale-[0.98] mt-4"
            >
              Sign In <ArrowRight size={20} />
            </button>
          </form>

          {/* Biometric Prompt (Optional Mobile Feature) */}
          <div className="mt-8 pt-8 border-t border-slate-50 flex flex-col items-center">
            <button className="flex items-center gap-2 text-slate-400 hover:text-[#042159] transition-colors group">
              <Fingerprint
                size={24}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Use Biometrics
              </span>
            </button>
          </div>
        </div>

        {/* Footer Links */}
        <p className="text-center mt-10 text-slate-400 text-[11px] font-bold uppercase tracking-tight">
          Not a member yet?{" "}
          <button className="text-[#4DB8E4] ml-1">Open an account</button>
        </p>
      </div>
    </div>
  );
};

export default Login;

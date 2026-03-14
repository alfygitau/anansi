import { useState, useEffect } from "react";
import { Mail, ArrowRight, RefreshCw, ShieldCheck, Edit3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = ({ email = "sam***@example.com", onResend }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  // Handle OTP Input focus shift
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value) {
      element.nextSibling.focus();
    }
  };

  const handleVerify = () => {
    console.log(otp.join(""));
    navigate("/verify-mobile");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) setTimer(timer - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-[500px] bg-white rounded-[40px] p-10 md:p-14 shadow-2xl shadow-blue-900/5 text-center">
        {/* Animated Icon Header */}
        <div className="relative w-20 h-20 bg-blue-50 rounded-[28px] flex items-center justify-center mx-auto mb-8">
          <Mail className="text-[#042159]" size={32} />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#4DB8E4] rounded-full border-4 border-white flex items-center justify-center">
            <ShieldCheck size={14} className="text-white" />
          </div>
        </div>

        <h1 className="text-2xl font-black text-[#042159] tracking-tight mb-3">
          Check your inbox
        </h1>
        <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed px-4">
          We've sent a 6-digit verification code to <br />
          <span className="text-[#042159] font-bold flex items-center justify-center gap-2 mt-1">
            {email}{" "}
            <Edit3 size={14} className="text-[#4DB8E4] cursor-pointer" />
          </span>
        </p>

        {/* Segmented OTP Input */}
        <div className="flex justify-between gap-2 mb-10">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="w-full h-16 text-center text-2xl font-black text-[#042159] bg-slate-50 border-2 rounded-2xl focus:border-[#4DB8E4] focus:bg-white focus:ring-4 focus:ring-[#4DB8E4]/10 transition-all outline-none"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        {/* Primary Action */}
        <button
          onClick={handleVerify}
          className="w-full h-[64px] bg-[#042159] text-white rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#4DB8E4] transition-all shadow-xl shadow-blue-900/10 mb-8"
        >
          Continue <ArrowRight size={20} />
        </button>

        {/* Resend Logic */}
        <div className="flex flex-col items-center gap-4">
          {timer > 0 ? (
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
              Resend code in <span className="text-[#4DB8E4]">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={onResend}
              className="flex items-center gap-2 text-[#4DB8E4] hover:text-[#042159] transition-colors group"
            >
              <RefreshCw
                size={16}
                className={`${isResending ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`}
              />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Resend Verification Code
              </span>
            </button>
          )}
        </div>

        {/* Footer Security Note */}
        <div className="mt-12 pt-8 border-t border-slate-50">
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tight flex items-center justify-center gap-2">
            <ShieldCheck size={12} /> Secure 256-bit encrypted verification
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

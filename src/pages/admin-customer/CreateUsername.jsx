import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  UserCircle,
  Check,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  AtSign,
  Info,
  Lock,
  Zap,
} from "lucide-react";
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import useAuth from "../../hooks/useAuth";

const CreateUsername = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { showToast } = useToast();

  const validation = useMemo(() => {
    const res = {
      length: username.length >= 4 && username.length <= 16,
      format: /^[a-zA-Z0-9_]+$/.test(username),
    };
    return { ...res, isValid: res.length && res.format };
  }, [username]);

  const { mutate: handleUpdate, isLoading } = useMutation({
    mutationFn: async (payload) => {
      return new Promise((resolve) => setTimeout(resolve, 1500));
    },
    onSuccess: () => {
      showToast({
        title: "Identity Secured",
        description: "Username updated.",
        type: "success",
      });
      navigate("/admin-customer/set-new-password");
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    if (validation.isValid) handleUpdate({ username });
  };

  return (
    <div className="mt-[30px] h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl mx-auto bg-white overflow-hidden flex flex-col lg:flex-row"
      >
        {/* Left Side: Information & Branding (Reduces white space by filling the width) */}
        <div className="lg:w-5/12 bg-[#042159] p-8 lg:p-8 text-white flex flex-col justify-between relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <Zap className="absolute -bottom-10 -left-10 w-64 h-64 text-white" />
          </div>

          <div className="relative z-10">
            <div className="w-20 h-20 bg-[#4DB8E4]/20 rounded-[28px] flex items-center justify-center mb-8 border border-white/10">
              <UserCircle className="text-[#4DB8E4]" size={40} />
            </div>

            <h1 className="text-4xl font-black tracking-tighter mb-6 leading-tight">
              Your Anansi <br /> Identity.
            </h1>

            <p className="text-blue-100/60 text-sm leading-relaxed mb-10 max-w-xs font-medium">
              Choose a handle that reflects your professional standing. This
              will be your global ID for all P2P transactions.
            </p>

            {/* Disclaimers moved here to fill space effectively */}
            <div className="space-y-6">
              <div className="flex gap-4 p-4 rounded-3xl bg-white/5 border border-white/5">
                <Info size={18} className="text-[#4DB8E4] shrink-0" />
                <p className="text-[11px] leading-snug text-blue-100/80 font-medium">
                  <span className="font-bold text-white block mb-1 uppercase tracking-wider">
                    Permanency
                  </span>
                  Usernames are unique and tied to your vault. Changes require
                  multi-factor authorization.
                </p>
              </div>
              <div className="flex gap-4 p-4 rounded-3xl bg-white/5 border border-white/5">
                <Lock size={18} className="text-[#4DB8E4] shrink-0" />
                <p className="text-[11px] leading-snug text-blue-100/80 font-medium">
                  <span className="font-bold text-white block mb-1 uppercase tracking-wider">
                    Privacy First
                  </span>
                  We use zero-knowledge protocols to ensure your username is all
                  others see.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-white/10 flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400">
              Anansi
            </span>
            <ShieldCheck size={16} className="text-blue-400" />
          </div>
        </div>

        {/* Right Side: Action & Input */}
        <div className="lg:w-7/12 p-8 lg:p-16 flex flex-col justify-center bg-slate-50/30">
          <form
            onSubmit={onSubmit}
            className="max-w-md mx-auto w-full space-y-10"
          >
            <div className="text-center lg:text-left mb-2">
              <h2 className="text-2xl font-black text-[#042159] tracking-tight mb-2">
                Create Username
              </h2>
            </div>

            <div className="space-y-6">
              {/* Input Group */}
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4DB8E4] transition-colors">
                  <AtSign size={22} />
                </div>
                <input
                  type="text"
                  autoFocus
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.toLowerCase().trim())
                  }
                  placeholder="enter_username"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-[24px] focus:ring-2 focus:ring-[#4DB8E4]/20 outline-none font-bold text-[#042159] transition-all"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                  <AnimatePresence mode="wait">
                    {username && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        {validation.isValid ? (
                          <Check className="text-emerald-500" size={24} />
                        ) : (
                          <AlertCircle className="text-rose-400" size={24} />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Validation Grid - Tighter layout */}
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "4-16 Characters", met: validation.length },
                  { label: "Alphanumeric", met: validation.format },
                ].map((req, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-wider transition-all
                      ${req.met ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-white border-slate-100 text-slate-300"}`}
                  >
                    <Check
                      size={12}
                      className={
                        req.met ? "text-emerald-500" : "text-slate-200"
                      }
                      strokeWidth={4}
                    />
                    {req.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || !validation.isValid}
                className="w-full h-20 bg-[#042159] text-white rounded-[30px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-4 shadow-xl shadow-blue-900/20 hover:bg-[#062d7a] active:scale-[0.98] disabled:opacity-20 disabled:grayscale transition-all"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Register My Identity <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="mt-8 text-[9px] text-slate-400 leading-relaxed text-center px-4">
                By clicking Register, you confirm this username follows our
                community guidelines and member service agreement.
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default CreateUsername;

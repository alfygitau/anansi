import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smartphone, ShieldCheck, Lock, ArrowRight } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useStore } from "../../store/useStore";

const JoinMembership = ({ isOpen, onNext }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const amount = "1,000";
  const { auth } = useAuth();
  const setMembershipMobile = useStore((state) => state.setMembershipMobile);

  useEffect(() => {
    setPhoneNumber(auth?.user?.mobileno);
  }, [auth]);

  const onContinue = () => {
    setMembershipMobile(phoneNumber);
    onNext();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#042159]/60 backdrop-blur-sm"
          />

          {/* Centered Modal Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[480px] bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header / Close button */}
            {/* Content Container */}
            <div className="p-10 space-y-6">
              {/* Top Section / Progress */}
              <div className="space-y-4">
                <div className="bg-[#042159] rounded-2xl p-5 text-white relative overflow-hidden">
                  <div className="absolute right-4 top-4 opacity-10">
                    <ShieldCheck size={50} />
                  </div>
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="bg-white/20 w-10 h-10 rounded-md flex items-center justify-center">
                      <Smartphone className="text-[#4DB8E4]" size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black tracking-tight">
                        Setup Membership
                      </h2>
                      Welcome to Anansi Sacco!
                      <br />
                      Join Anansi Sacco today with a
                      <span class="font-bold">one-time payment</span> of
                      <span class="font-bold">KES 1,000.00</span>
                      to unlock all the benefits and services we offer.
                    </div>
                  </div>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-5">
                {/* Fixed Amount */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    Membership Amount
                  </label>
                  <div className="flex h-12 w-full items-center bg-slate-50 border border-slate-200 rounded-xl px-4">
                    <span className="font-bold text-slate-400 text-xs mr-3">
                      KES
                    </span>
                    <input
                      type="text"
                      value={amount}
                      readOnly
                      className="bg-transparent font-bold text-[#042159] outline-none w-full"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      M-PESA Phone Number
                    </label>
                    <img
                      src="/mpesa.svg"
                      alt="Mpesa"
                      className="h-4 w-auto grayscale opacity-50"
                    />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 0712345678"
                    className="h-14 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold focus:border-[#042159] focus:ring-4 focus:ring-[#042159]/5 outline-none transition-all shadow-sm"
                  />

                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="w-4 h-4 rounded border-slate-300 text-[#042159] focus:ring-[#042159]"
                    />
                    <span className="text-[11px] text-slate-500 font-medium">
                      Save this number for future Sacco transactions
                    </span>
                  </label>
                </div>
              </div>

              {/* Secure Footer Section */}
              <div className="space-y-4 pt-2">
                <div className="bg-cyan-50/50 p-4 rounded-xl flex gap-3 border border-cyan-100">
                  <Lock size={16} className="text-[#042159] shrink-0" />
                  <p className="text-[11px] text-slate-600 leading-relaxed italic">
                    By clicking continue, an{" "}
                    <span className="font-bold">STK push</span> will be sent to
                    your phone. Ensure your phone is unlocked.
                  </p>
                </div>

                <button
                  onClick={onContinue}
                  className="group w-full h-14 bg-[#042159] hover:bg-[#062d7a] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/10 active:scale-[0.98]"
                >
                  Pay & Activate
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform text-[#4DB8E4]"
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default JoinMembership;

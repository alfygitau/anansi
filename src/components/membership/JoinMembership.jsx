import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, ShieldCheck, Lock, ArrowRight, Phone } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useStore } from "../../store/useStore";

const JoinMembership = ({ isOpen, onClose, onNext }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const amount = "1,000";
  const { auth } = useAuth();
  const setMembershipMobile = useStore((state) => state.setMembershipMobile);

  useEffect(() => {
    setPhoneNumber(auth?.user?.mobileno || "");
  }, [auth]);

  const onContinue = () => {
    setMembershipMobile(phoneNumber);
    onNext();
  };

  const isFormValid = phoneNumber.length >= 10;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex justify-end bg-slate-900/60"
        >
          {/* Invisible dismissal zone target click area */}
          <div className="absolute inset-0" onClick={onClose} />
          
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="bg-white relative w-full max-w-[480px] h-full shadow-2xl flex flex-col z-10"
          >
            {/* Circled Grey Close Button Anchor */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 flex items-center justify-center w-10 h-10 bg-slate-100 hover:bg-slate-200 text-gray-500 hover:text-gray-900 rounded-full transition-all active:scale-95 shadow-sm"
            >
              <X size={20} />
            </button>

            {/* Header Track */}
            <div className="px-8 pt-5 pb-6">
              <h2 className="text-2xl font-bold text-[#074073]">
                Setup Membership
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Welcome to Anansi Sacco membership terminal
              </p>
            </div>
            <div className="border-b mx-8 border-slate-100"></div>

            {/* Scrollable Core Body Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              
              {/* Premium Informational Pitch Deck */}
              <div className="p-5 rounded-[24px] border border-blue-100 bg-blue-50/30 relative overflow-hidden">
                <div className="absolute right-4 top-4 opacity-5 text-[#074073] pointer-events-none">
                  <ShieldCheck size={80} />
                </div>
                <div className="relative z-10 flex gap-4 items-start">
                  <div className="bg-white border border-blue-100 w-10 h-10 rounded-xl flex items-center justify-center text-[#074073] shrink-0 shadow-sm">
                    <Smartphone size={18} />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Unlock institutional credit facilities, high-yield dividend pools, and premium savings ledgers by initializing your membership registration structure.
                  </p>
                </div>
              </div>

              {/* Input Configuration Categories */}
              <div className="space-y-6">
                
                {/* Fixed Membership Fee Vector - PREFERRED SYSTEM INPUT DESIGN */}
                <div className="w-full space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">
                    Membership Activation Fee
                  </label>
                  <div className="relative flex items-center bg-slate-50 border-2 border-slate-100 rounded-2xl h-14 shadow-sm select-none">
                    <div className="pl-6 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto shrink-0 font-bold text-[11px] tracking-wider">
                      KES
                    </div>
                    <input
                      type="text"
                      value={amount}
                      readOnly
                      className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-500 cursor-not-allowed outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none"
                    />
                  </div>
                </div>

                {/* M-PESA Target Billing Node - PREFERRED SYSTEM INPUT DESIGN */}
                <div className="w-full space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">
                      M-PESA Phone Number
                    </label>
                    <img
                      src="/mpesa.svg"
                      alt="M-Pesa Core Logo"
                      className="h-4 opacity-60 grayscale"
                    />
                  </div>
                  
                  <div className="relative flex items-center bg-slate-50 border-2 border-slate-100 focus-within:border-slate-900 focus-within:bg-white rounded-2xl h-14 transition-all duration-200 shadow-sm">
                    <div className="pl-5 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto shrink-0">
                      <Phone size={16} />
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. 0712345678"
                      className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none focus:shadow-none placeholder:text-xs placeholder:text-slate-300 font-medium"
                    />
                  </div>

                  {/* Vault Persistence Remember Checklist Token */}
                  <label className="flex items-start gap-2.5 cursor-pointer mt-3 select-none group pl-1">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#074073] focus:ring-[#074073]/20"
                    />
                    <span className="text-[11px] text-slate-400 group-hover:text-slate-600 font-medium leading-normal transition-colors">
                      Persist this validation parameter node for future Sacco processing pipelines
                    </span>
                  </label>
                </div>

              </div>

              {/* Secure STK Real-time Advisory Prompt */}
              <div className="p-4 rounded-xl flex gap-3 bg-slate-50 border border-slate-200/60 shadow-sm">
                <Lock size={14} className="text-[#074073] shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  <span className="text-slate-800 font-bold">STK Network Protocol Notice:</span> Advancing past this initialization stage fires an instant payment authentication request to your handset terminal window. Ensure the display is active.
                </p>
              </div>

            </div>
            
            <div className="border-b mx-8 border-slate-100"></div>

            {/* Pinned Execution Footer Card */}
            <div className="p-8 bg-white">
              <button
                onClick={onContinue}
                disabled={!isFormValid}
                className={`group w-full h-16 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all
                  ${
                    isFormValid
                      ? "bg-[#074073] hover:bg-[#052d52] text-white active:scale-[0.98] shadow-md"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                <span>Pay & Activate Membership</span>
                <ArrowRight
                  size={14}
                  className={`transition-transform duration-200 ${isFormValid ? "group-hover:translate-x-0.5" : ""}`}
                />
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default JoinMembership;
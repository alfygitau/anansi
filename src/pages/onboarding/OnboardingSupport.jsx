import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  Image as ImageIcon,
  Maximize,
  FileText,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  Lightbulb,
  Check,
  X,
  MessageCircle,
  Clock,
  ChevronLeft,
  Phone,
  MessageSquare,
  Mail,
  Globe,
} from "lucide-react";

const HelpPage = () => {
  const navigate = useNavigate();

  const tips = [
    {
      icon: <ShieldCheck className="text-secondary" size={20} />,
      text: "Ensure your ID document hasn't expired.",
    },
    {
      icon: <ImageIcon className="text-secondary" size={20} />,
      text: "All personal details and photos must be clearly visible.",
    },
    {
      icon: <Maximize className="text-secondary" size={20} />,
      text: "Make sure all four edges of the document are within the frame.",
    },
    {
      icon: <FileText className="text-secondary" size={20} />,
      text: "Accepted formats: High-quality JPEG, PNG, or PDF.",
    },
  ];

  const contactMethods = [
    {
      icon: <Phone size={24} />,
      title: "Call Center",
      detail: "+254 700 000 000",
      sub: "Available 8:00 AM - 5:00 PM",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: <MessageSquare size={24} />,
      title: "WhatsApp Support",
      detail: "+254 711 111 111",
      sub: "Average response: 15 mins",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: <Mail size={24} />,
      title: "Email Inquiry",
      detail: "support@sacco.co.ke",
      sub: "For formal disputes & documents",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: <Globe size={24} />,
      title: "Physical Branch",
      detail: "Anansi Plaza, 4th Floor",
      sub: "Nairobi, Kenya",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1300px] mb-[30px] mx-auto"
    >
      {/* Header */}
      <div className="text-left mb-6">
        {/* Navigation Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-3 group"
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-xs font-bold uppercase tracking-widest">
            Back to Scanner
          </span>
        </button>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-full mb-3">
            <HelpCircle className="text-primary" size={28} />
          </div>
          <h1 className="text-2xl font-black text-primary uppercase tracking-tight">
            Support Center
          </h1>
        </div>
        <p className="text-slate-500 text-sm max-w-md">
          Having trouble with identity verification? Let's get you back on
          track.
        </p>
      </div>

      {/* 1. Detailed Contact Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {contactMethods.map((method, idx) => (
          <div
            key={idx}
            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-blue-900/5 hover:border-secondary/40 transition-all group cursor-pointer"
          >
            <div
              className={`w-12 h-12 ${method.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
            >
              {method.icon}
            </div>
            <h3 className="font-black text-sm mb-1">{method.title}</h3>
            <p className="text-primary font-bold text-xs mb-2">
              {method.detail}
            </p>
            <p className="text-slate-400 text-[10px] font-medium leading-tight">
              {method.sub}
            </p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Guidelines & Visuals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-xl shadow-blue-900/5">
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="text-amber-500" size={20} />
              <p className="text-[12px] font-black uppercase tracking-[0.2em] text-primary">
                Verification Tips
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">{tip.icon}</div>
                    <p className="text-slate-700 text-[14px] leading-snug font-medium">
                      {tip.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Visual Do/Don't Mini-Guides */}
              <div className="bg-slate-50 rounded-2xl p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-1 rounded-full">
                    <Check size={14} className="text-green-600" />
                  </div>
                  <p className="text-[12px] text-slate-600 italic">
                    "Lay ID on a dark, flat surface for better contrast."
                  </p>
                </div>
                <div className="flex items-center gap-3 border-t border-slate-200 pt-3">
                  <div className="bg-red-100 p-1 rounded-full">
                    <X size={14} className="text-red-600" />
                  </div>
                  <p className="text-[12px] text-slate-600 italic">
                    "Avoid using camera flash to prevent glare on the text."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mini FAQ Section */}
          <div className="px-4">
            <h4 className="text-sm font-bold text-primary mb-4 uppercase tracking-widest">
              Common Questions
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 hover:border-secondary/30 transition-colors">
                <p className="text-[13px] font-bold text-slate-800 mb-1">
                  Why is my KRA PIN not scanning?
                </p>
                <p className="text-[12px] text-slate-500">
                  Ensure it's the official iTax certificate and not a photocopy.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 hover:border-secondary/30 transition-colors">
                <p className="text-[13px] font-bold text-slate-800 mb-1">
                  What if I only have a waiting card?
                </p>
                <p className="text-[12px] text-slate-500">
                  Currently, Anansi requires a valid National ID or Passport.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Contact */}
        <div className="space-y-4">
          <div className="bg-primary p-6 rounded-[32px] text-white">
            <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-4">
              Quick Actions
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/onboarding/verify-identity")}
                className="w-full h-[56px] bg-white text-primary rounded-[20px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-secondary hover:text-primary transition-all"
              >
                Retake Photo <ArrowRight size={18} />
              </button>
              <button
                onClick={() => navigate("/onboarding/id-manual-entry")}
                className="w-full h-[56px] border border-white/20 text-white rounded-[20px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
              >
                Manual Entry
              </button>
            </div>
          </div>

          <div className="p-6 border border-slate-200 rounded-[32px] bg-white">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[12px] font-bold text-slate-800">
                Direct Support
              </p>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-green-600 font-bold uppercase">
                  Online
                </span>
              </div>
            </div>

            <button className="w-full py-3 flex items-center justify-center gap-2 text-primary text-[13px] font-bold border border-primary/10 rounded-xl hover:bg-slate-50 transition-all">
              <MessageCircle size={16} />
              Chat with an Agent
            </button>

            <div className="flex items-center gap-2 mt-4 text-slate-400">
              <Clock size={14} />
              <p className="text-[11px]">Avg. response time: 2 mins</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl">
            <AlertCircle className="text-amber-600 shrink-0" size={16} />
            <p className="text-[11px] text-amber-800 leading-tight">
              Anansi uses bank-grade encryption to secure your documents. Data
              is only used for legally mandated KYC checks.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HelpPage;

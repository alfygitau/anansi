import { useNavigate } from "react-router-dom";
import MyProgress from "../../components/progress-bar/MyProgress";
import {
  Camera,
  ChevronRight,
  Info,
  Lock,
  Mail,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import { sendEmailLink } from "../../sdks/customer/customer";

const FacialIdentity = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { showToast } = useToast();

  const sendMyEmailLink = async () => {
    sendEmailLinkMutate();
  };

  const scanQrCode = () => {
    navigate("/onboarding/scan-qrcode");
  };
  const openWebcam = () => {
    navigate("/onboarding/use-webcamera");
  };

  const selectionCards = [
    {
      id: "email",
      title: "Get link by email",
      subtitle: `We will email you at ${auth?.user?.email || "your email"}`,
      icon: <Mail size={22} className="text-[#074073]" />,
      action: sendMyEmailLink,
    },
    {
      id: "qr",
      title: "Scan a QR code",
      subtitle: "Use your phone camera or a QR code scanner",
      icon: <QrCode size={22} className="text-[#074073]" />,
      action: scanQrCode,
    },
    {
      id: "webcam",
      title: "Capture with webcam",
      subtitle: "Use your desktop camera to take a selfie now",
      icon: <Camera size={22} className="text-[#074073]" />,
      action: openWebcam,
    },
  ];

  const { mutate: sendEmailLinkMutate } = useMutation({
    mutationKey: ["send email link"],
    mutationFn: () =>
      sendEmailLink(auth?.user?.email, auth?.tokens?.access_token),
    onSuccess: async () => {
      showToast({
        title: "Email Sent",
        type: "success",
        position: "top-right",
        description: "Check your inbox for the secure verification link.",
      });
      navigate("/onboarding/email-link");
    },
    onError: (error) => {
      showToast({
        title: "Onboarding glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  return (
    <div className="flex w-full max-w-[1300px] mx-auto bg-gray-50">
      {/* Sidebar Progress - 20% */}
      <div className="w-[25%] hidden lg:block md:block">
        <MyProgress
          currentTitle="Identity Verification"
          currentSubtitle="Selfie Verification"
        />
      </div>

      {/* Main Content Area (Left/Center) */}
      <div className="flex-1 lg:pr-6">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-[#042159] uppercase tracking-tight mb-4">
            Selfie Verification
          </h1>

          <div className="bg-blue-50/50 border-l-4 border-[#4DB8E4] p-5 rounded-r-[24px] mb-8">
            <p className="text-[14px] text-slate-700 leading-relaxed">
              <span className="font-bold text-[#042159]">Pro Tip:</span> For the
              fastest verification, use your smartphone. Mobile cameras provide
              better focus for facial biometrics.
            </p>
          </div>
        </header>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 gap-4">
          {selectionCards.map((card) => (
            <div
              key={card.id}
              onClick={card.action}
              className="group relative h-[100px] p-4 mb-4 border border-slate-100 cursor-pointer w-full bg-white rounded-[24px] flex items-center justify-between transition-all duration-300 hover:border-[#4DB8E4]/30 hover:shadow-2xl hover:shadow-blue-900/10 active:scale-[0.98]"
            >
              {/* Modern Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4DB8E4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[24px]" />

              <div className="flex items-center gap-5 relative z-10">
                {/* Icon Container with subtle gradient and shadow */}
                <div className="h-[64px] w-[64px] rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner group-hover:bg-[#042159] transition-all duration-300">
                  <div className="group-hover:text-white transition-colors duration-300">
                    {card.icon}
                  </div>
                </div>

                {/* Text Content */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-[15px] font-black text-[#042159] uppercase tracking-tight leading-none">
                    {card.title}
                  </h3>
                  <p className="text-[12px] text-slate-500 font-medium group-hover:text-slate-700 transition-colors">
                    {card.subtitle}
                  </p>
                </div>
              </div>

              {/* Right Arrow with background circle on hover */}
              <div className="relative z-10 h-10 w-10 flex items-center justify-center rounded-full bg-slate-50 text-[#042159] group-hover:bg-[#4DB8E4] group-hover:text-[#042159] transition-all duration-300">
                <ChevronRight
                  size={20}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-100">
          <button
            onClick={openWebcam}
            className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-[#042159] transition-colors"
          >
            I don’t have access to a camera
          </button>
        </div>
      </div>

      {/* Info & Disclaimer Sidebar (Right) */}
      <div className="lg:w-[380px] bg-slate-50/50 p-10">
        <div className="sticky top-10 space-y-8">
          {/* Security Box */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="text-[#042159]" size={18} />
              <h4 className="text-[12px] font-black uppercase tracking-widest text-[#042159]">
                Privacy & Security
              </h4>
            </div>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              Your biometric data is encrypted immediately and is only used to
              match your identity against your uploaded ID.
            </p>
          </div>

          {/* Tips Section */}
          <div className="space-y-4 pt-8 border-t border-slate-200/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-[#4DB8E4]" size={18} />
              <h4 className="text-[12px] font-black uppercase tracking-widest text-[#042159]">
                Capture Tips
              </h4>
            </div>
            <ul className="space-y-3">
              {[
                "Find a well-lit area (avoid backlighting)",
                "Remove glasses or face coverings",
                "Keep a neutral expression",
                "Hold your device at eye level",
              ].map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[12px] text-slate-600"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-[#4DB8E4] mt-1.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance Footer */}
          <div className="p-5 bg-[#042159] rounded-[24px] text-white">
            <div className="flex items-center gap-2 mb-2">
              <Info size={14} className="text-[#4DB8E4]" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Compliance
              </span>
            </div>
            <p className="text-[11px] text-white/60 leading-tight">
              Anansi Sacco follows SASRA guidelines for electronic membership
              onboarding and identity verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacialIdentity;

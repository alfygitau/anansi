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
    <div className="flex flex-col lg:flex-row w-full max-w-[1300px] mb-[30px] mx-auto bg-gray-50 min-h-screen">
      {/* Sidebar Progress - Hidden on mobile/tablet, shown on lg */}
      <div className="hidden lg:block w-[22%] h-full">
        <MyProgress
          currentTitle="Identity Verification"
          currentSubtitle="Selfie Verification"
        />
      </div>

      {/* Main Content Area */}
      {/* 2. Added responsive padding (px-6 on mobile, lg:pr-6 for desktop) */}
      <div className="flex-1 pr-5 pl-3">
        <header className="mb-10">
          {/* 3. Adjusted text size for mobile (text-2xl -> text-3xl) */}
          <h1 className="text-2xl lg:text-2xl font-black text-primary uppercase tracking-tight mb-2">
            Selfie Verification
          </h1>

          <div className="bg-blue-50/50 border-l-4 border-secondary p-5 rounded-r-[24px] mb-4">
            <p className="text-[14px] text-slate-700 leading-relaxed">
              <span className="font-bold text-primary">Pro Tip:</span> For the
              fastest verification, use your smartphone. Mobile cameras provide
              better focus for facial biometrics.
            </p>
          </div>
          {/* Detailed Instruction Description */}
          <div className="space-y-4 px-1">
            <p className="text-[15px] text-slate-600 leading-relaxed font-medium">
              To protect your account and ensure the security of our community,
              we require a quick biometric selfie check. This helps us confirm
              that the person opening the account matches the identity document
              provided.
            </p>
            <div className="flex flex-col gap-2">
              <h4 className="text-[11px] font-black uppercase tracking-[0.1em] text-primary">
                How it works:
              </h4>
              <ol className="text-[13px] text-slate-500 space-y-2 list-decimal list-inside ml-1">
                <li>
                  Select your preferred capture method from the options below.
                </li>
                <li>
                  Follow the on-screen prompts to position your face within the
                  frame.
                </li>
                <li>
                  Our secure system will instantly compare the capture with your
                  ID photo.
                </li>
              </ol>
            </div>
          </div>
        </header>

        {/* Selection Cards */}
        <div className="grid grid-cols-1 gap-4">
          {selectionCards.map((card) => (
            <div
              key={card.id}
              onClick={card.action}
              /* 4. Made height auto on mobile to prevent text clipping, h-[100px] on desktop */
              className="group relative min-h-[90px] lg:h-[100px] p-4 border border-slate-100 cursor-pointer w-full bg-white rounded-[24px] flex items-center justify-between transition-all duration-300 hover:border-secondary/30 hover:shadow-2xl hover:shadow-blue-900/10 active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[24px]" />

              <div className="flex items-center gap-4 lg:gap-5 relative z-10">
                {/* Scaled down icon slightly for mobile */}
                <div className="h-[50px] w-[50px] lg:h-[64px] lg:w-[64px] shrink-0 rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner group-hover:bg-primary transition-all duration-300">
                  <div className="group-hover:text-white transition-colors duration-300 scale-90 lg:scale-100">
                    {card.icon}
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-[13px] lg:text-[15px] font-black text-primary uppercase tracking-tight leading-none">
                    {card.title}
                  </h3>
                  <p className="text-[11px] lg:text-[12px] text-slate-500 font-medium group-hover:text-slate-700 transition-colors">
                    {card.subtitle}
                  </p>
                </div>
              </div>

              <div className="relative z-10 h-8 w-8 lg:h-10 lg:w-10 flex items-center justify-center rounded-full bg-slate-50 text-primary group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                <ChevronRight
                  size={18}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-100 pb-10 lg:pb-0">
          <button
            onClick={openWebcam}
            className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
          >
            I don’t have access to a camera
          </button>
        </div>
      </div>

      {/* Info & Disclaimer Sidebar (Right) */}
      {/* 5. Changed width to full on mobile, fixed width on desktop. Adjusted padding. */}
      <div className="w-full lg:w-[320px] px-3 bg-slate-100/30 lg:bg-slate-50/50 sm:px-5 border-t lg:border-t-0">
        <div className="lg:sticky lg:top-10 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center sm:mt-5 gap-2">
              <Lock className="text-primary" size={18} />
              <h4 className="text-[12px] font-black uppercase tracking-widest text-primary">
                Privacy & Security
              </h4>
            </div>
            <p className="text-[13px] text-slate-500 leading-relaxed">
              Your biometric data is encrypted immediately and is only used to
              match your identity against your uploaded ID.
            </p>
          </div>

          <div className="space-y-4 pt-8 border-t border-slate-200/60">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-secondary" size={18} />
              <h4 className="text-[12px] font-black uppercase tracking-widest text-primary">
                Capture Tips
              </h4>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
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
                  <div className="h-1.5 w-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 bg-primary rounded-[24px] text-white">
            <div className="flex items-center gap-2 mb-2">
              <Info size={14} className="text-secondary" />
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

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
    <div className="flex flex-col lg:flex-row w-full max-w-[1300px] md:px-6 mb-[30px] mx-auto bg-gray-50">
      {/* Sidebar Progress - Locked to 22% Width */}
      <div className="hidden lg:block w-[22%] h-full shrink-0">
        <MyProgress
          currentTitle="Identity Verification"
          currentSubtitle="Selfie Verification"
        />
      </div>

      {/* Main Content Area - Expands to occupy full remaining right-side width */}
      <div className="flex-1 space-y-4">
        {/* Header Block Section */}
        <header>
          <h1 className="text-xl font-black text-primary tracking-tight mb-2">
            Selfie Verification
          </h1>

          <div className="bg-blue-50/50 border-l-4 border-secondary p-5 rounded-r-[24px] mb-4">
            <p className="text-[14px] text-slate-700 leading-relaxed">
              <span className="font-bold text-primary">Pro Tip:</span> For the
              fastest verification, use your smartphone. Mobile cameras provide
              better focus for facial biometrics.
            </p>
          </div>

          <div className="space-y-3 px-1">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectionCards.map((card) => (
            <div
              key={card.id}
              onClick={card.action}
              className="group relative min-h-[90px] lg:h-[100px] p-4 border border-slate-100 cursor-pointer w-full bg-white rounded-[24px] flex items-center justify-between transition-all duration-300 hover:border-secondary/30 hover:shadow-2xl hover:shadow-blue-900/10 active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[24px]" />

              <div className="flex items-center gap-4 lg:gap-5 relative z-10 w-full pr-2">
                <div className="h-[50px] w-[50px] lg:h-[64px] lg:w-[64px] shrink-0 rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner group-hover:bg-primary transition-all duration-300">
                  <div className="group-hover:text-white transition-colors duration-300 scale-90 lg:scale-100">
                    {card.icon}
                  </div>
                </div>

                {/* truncate utilities ensure text clips elegantly if subtext content runs too long inside a smaller 2-column box */}
                <div className="flex flex-col gap-1 min-w-0">
                  <h3 className="text-[13px] lg:text-[14px] font-black text-primary uppercase tracking-tight leading-none truncate">
                    {card.title}
                  </h3>
                  <p className="text-[11px] lg:text-[12px] text-slate-500 font-medium group-hover:text-slate-700 transition-colors truncate">
                    {card.subtitle}
                  </p>
                </div>
              </div>

              <div className="relative z-10 h-8 w-8 lg:h-10 lg:w-10 flex items-center justify-center rounded-full bg-slate-50 text-primary group-hover:bg-secondary group-hover:text-primary transition-all duration-300 shrink-0">
                <ChevronRight
                  size={18}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </div>
            </div>
          ))}
        </div>

        <div>
          <button
            onClick={openWebcam}
            className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-primary transition-colors"
          >
            I don’t have access to a camera
          </button>
        </div>

        {/* PREMIUM DISCLAIMERS SECTION: Replaced the sidebar, now sits beautifully below the components */}
        <div className="pt-4 border-t border-slate-200/60 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Privacy & Security Card */}
          <div className="md:col-span-4 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Lock className="text-primary" size={16} />
              <h4 className="text-[11px] font-black uppercase tracking-widest text-primary">
                Privacy & Security
              </h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Your biometric data is encrypted immediately and is only used to
              match your identity against your uploaded ID.
            </p>
          </div>

          {/* Capture Tips Card */}
          <div className="md:col-span-5 bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="text-secondary" size={16} />
              <h4 className="text-[11px] font-black uppercase tracking-widest text-primary">
                Capture Tips
              </h4>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {[
                "Find a well-lit area",
                "Remove face coverings",
                "Keep neutral expression",
                "Hold device at eye level",
              ].map((tip, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-xs text-slate-600 font-medium"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Compliance Card */}
          <div className="md:col-span-3 bg-[#042159] text-white rounded-3xl p-6 shadow-sm flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <Info size={14} className="text-secondary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/90">
                Compliance
              </span>
            </div>
            <p className="text-[11px] text-white/70 leading-relaxed font-medium">
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

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MyProgress from "../../components/progress-bar/MyProgress";

const FacialIdentity = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const sendEmailLink = async () => {
    setLoading(true);
    try {
      navigate("/onboarding/email-link");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const selectionCards = [
    {
      id: "email",
      title: "Get link by email",
      subtitle: `We will email you at example@gmail.com || "your email"}`,
      icon: (
        <svg width="20" height="18" viewBox="0 0 18 16" fill="none">
          <path
            d="M16.3125 14.8571H1.6875C0.75375 14.8571 0 14.0914 0 13.1428V2.85711C0 1.90854 0.75375 1.14282 1.6875 1.14282H16.3125C17.2463 1.14282 18 1.90854 18 2.85711V13.1428C18 14.0914 17.2463 14.8571 16.3125 14.8571ZM1.6875 2.28568C1.3725 2.28568 1.125 2.53711 1.125 2.85711V13.1428C1.125 13.4628 1.3725 13.7143 1.6875 13.7143H16.3125C16.6275 13.7143 16.875 13.4628 16.875 13.1428V2.85711C16.875 2.53711 16.6275 2.28568 16.3125 2.28568H1.6875Z"
            fill="#042159"
          />
          <path
            d="M8.99997 10.2401C8.21247 10.2401 7.49247 9.92007 6.95247 9.33721L1.04622 2.96007C0.832475 2.73149 0.843725 2.36578 1.06872 2.14864C1.29372 1.93149 1.65372 1.94292 1.86747 2.17149L7.77372 8.54864C8.41497 9.24578 9.58498 9.24578 10.2262 8.54864L16.1325 2.18292C16.3462 1.95435 16.7062 1.94292 16.9312 2.16007C17.1562 2.37721 17.1675 2.74292 16.9537 2.97149L11.0475 9.34864C10.5075 9.93149 9.78747 10.2515 8.99997 10.2515V10.2401Z"
            fill="#042159"
          />
        </svg>
      ),
      action: sendEmailLink,
    },
    {
      id: "qr",
      title: "Scan a QR code",
      subtitle: "Use your phone camera or a QR code scanner",
      icon: (
        <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
          <path
            d="M4.0625 4.0625V10.5625H5.6875V12.1875H7.3125V10.5625H10.5625V4.0625H4.0625ZM10.5625 10.5625V12.1875H12.1875V13.8125H8.9375V15.4375H4.0625V21.9375H10.5625V15.4375H15.4375V13.8125H13.8125V12.1875H17.0625V10.5625H18.6875V12.1875H20.3125V10.5625H21.9375V4.0625H15.4375V10.5625H10.5625ZM20.3125 12.1875V13.8125H21.9375V12.1875H20.3125ZM20.3125 13.8125H18.6875V15.4375H20.3125V13.8125ZM20.3125 15.4375V17.0625H21.9375V15.4375H20.3125ZM20.3125 17.0625H18.6875V15.4375H17.0625V17.0625H13V21.9375H14.625V18.6875H17.875V20.3125H19.5V18.6875H20.3125V17.0625ZM17.875 20.3125H16.25V21.9375H17.875V20.3125ZM18.6875 13.8125V12.1875H17.0625V13.8125H18.6875ZM8.9375 13.8125V12.1875H7.3125V13.8125H8.9375ZM5.6875 12.1875H4.0625V13.8125H5.6875V12.1875ZM12.1875 4.0625V7.3125H11.375V8.9375H12.1875V9.75H13.8125V7.3125H14.625V5.6875H13.8125V4.0625H12.1875ZM5.6875 5.6875H8.9375V8.9375H5.6875V5.6875ZM17.0625 5.6875H20.3125V8.9375H17.0625V5.6875ZM6.5 6.5V8.125H8.125V6.5H6.5ZM17.875 6.5V8.125H19.5V6.5H17.875ZM5.6875 17.0625H8.9375V20.3125H5.6875V17.0625ZM6.5 17.875V19.5H8.125V17.875H6.5ZM20.3125 20.3125V21.9375H21.9375V20.3125H20.3125Z"
            fill="#042159"
          />
        </svg>
      ),
      action: () => navigate("/onboarding/scan-qrcode"),
    },
  ];

  return (
    <div className="flex w-full max-w-[1300px] mx-auto h-screen bg-gray-50">
      {/* Sidebar Progress - 20% */}
      <div className="w-[25%] hidden lg:block md:block">
        <MyProgress
          currentTitle="Identity Verification"
          currentSubtitle="Selfie Verification"
        />
      </div>

      {/* Main Content - 80% */}
      <div className="flex-1 lg:w-[75%] sm:px-5 overflow-y-auto">
        <div className="w-full">
          <header className="mb-10">
            <h1 className="text-xl font-bold text-gray-900 mb-4">
              Selfie Verification on Phone
            </h1>
            <div className="space-y-4 mb-10">
              <div className="bg-blue-50 border-l-4 border-[#042159] p-4 rounded-r-xl">
                <p className="text-[14px] text-gray-700 leading-relaxed">
                  <span className="font-bold text-[#042159]">Pro Tip:</span> For
                  the fastest verification, we recommend using your smartphone.
                  Mobile cameras provide higher resolution and better autofocus,
                  ensuring your selfie is captured clearly on the first try.
                </p>
              </div>

              <p className="text-[15px] text-gray-600 font-medium">
                Select your preferred method to securely sync this session to
                your mobile device:
              </p>
            </div>
          </header>

          <div className="space-y-6">
            {selectionCards.map((card) => (
              <button
                key={card.id}
                onClick={card.action}
                disabled={loading}
                className="w-full h-24 p-5 flex items-center justify-between border border-gray-200 rounded-2xl bg-white transition-all hover:border-[#042159] hover:shadow-md active:scale-[0.99] group text-left"
              >
                <div className="flex items-center gap-6">
                  <div className="h-14 w-14 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#042159]/5 transition-colors">
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-gray-900">
                      {card.title}
                    </h3>
                    <p className="text-[12px] text-gray-500 mt-1">
                      {card.subtitle}
                    </p>
                  </div>
                </div>
                <div className="text-gray-300 group-hover:text-[#042159] transition-colors">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-gray-100">
            <button
              onClick={() => navigate("/onboarding/personal-information")}
              className="w-full h-12 flex items-center justify-center rounded-xl border border-gray-300 text-[#042159] font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              I don’t have a phone
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacialIdentity;

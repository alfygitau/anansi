import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MyProgress from "../../components/progress-bar/MyProgress";
import useAuth from "../../hooks/useAuth";
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import { createNextOfKin, updateKinStatus } from "../../sdks/customer/customer";
import {
  ShieldAlert,
  User,
  Calendar,
  Heart,
  Phone,
  MapPin,
  AlertCircle,
} from "lucide-react";

const NextOfKin = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const { auth } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    relationship: "",
    phone: "",
    location: "",
  });

  const [errors, setErrors] = useState({});

  const isValidKenyaPhone = (phone) => {
    const cleanPhone = phone.replace(/\D/g, "");
    return /^(?:2547\d{8}|2541\d{8}|07\d{8}|01\d{8})$/.test(cleanPhone);
  };

  const isFormValid = useMemo(() => {
    return (
      formData.fullName &&
      formData.birthDate &&
      formData.birthDate <= today &&
      formData.relationship &&
      isValidKenyaPhone(formData.phone) &&
      formData.location
    );
  }, [formData, today]);

  const handlePhoneInput = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length === 1 && !["0", "2"].includes(value)) value = "";
    if (value.startsWith("2") && value.length <= 3 && !"254".startsWith(value))
      value = "";

    // Enforce lengths
    if (value.startsWith("0")) value = value.slice(0, 10);
    else if (value.startsWith("254")) value = value.slice(0, 12);

    setFormData({ ...formData, phone: value });
  };

  const validateField = (name, value) => {
    let error = "";
    if (!value) error = "This field is required.";
    else if (name === "birthDate" && value > today)
      error = "Date cannot be in the future.";
    else if (name === "phone" && !isValidKenyaPhone(value))
      error = "Enter a valid Kenyan number.";

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const { mutate: kinMutate, isLoading } = useMutation({
    mutationKey: ["create next of kin"],
    mutationFn: () =>
      createNextOfKin(
        auth?.user?.id,
        formData.fullName,
        formData.birthDate,
        formData.relationship,
        formData.phone,
        formData.location,
      ),
    onSuccess: async () => {
      await updateCustomerMutate();
    },
    onError: (error) => {
      showToast({
        title: "Authentication glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const { mutate: updateCustomerMutate } = useMutation({
    mutationKey: ["update kin status"],
    mutationFn: () => updateKinStatus(auth?.user?.id),
    onSuccess: async () => {
      showToast({
        title: "Profile Updated",
        type: "success",
        position: "top-right",
        description:
          "Your next of kin details have been securely saved to your profile.",
      });
      navigate("/onboarding/terms-conditions");
    },
    onError: (error) => {
      showToast({
        title: "Authentication glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
    },
  });

  const handleContinue = async () => {
    if (!isFormValid) return;
    await kinMutate();
  };

  return (
    <div className="flex w-full max-w-[1300px] md:px-6 mx-auto min-h-screen">
      {/* Sidebar - 20% of the 85% layout */}
      <div className="w-[25%] hidden lg:block md:block">
        <MyProgress
          currentTitle="Profile Information"
          currentSubtitle="Add Next of Kin"
        />
      </div>

      {/* Main Content - 80% */}
      <div className="flex-1 lg:w-[75%] sm:px-5 overflow-y-auto">
        <div>
          <header className="mb-10">
            <h2 className="text-2xl font-medium text-primary tracking-tight mb-1">
              Add Next of Kin
            </h2>
            <p className="text-[14px] text-gray-600 leading-relaxed">
              To ensure the safety and security of your membership, we kindly
              request that you provide information about your next of kin. This
              will be kept confidential and used only in emergencies.
            </p>
            <p className="text-slate-500 text-sm mt-2 w-full">
              Please nominate a trusted person to act as your primary contact or
              beneficiary. This ensures your records remain accessible and your
              interests are protected in accordance with **Sacco bylaws**.
            </p>
            <div className="mt-6 p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex gap-4 items-center">
              <div className="bg-amber-500/10 p-2 rounded-lg">
                <ShieldAlert size={20} className="text-amber-600" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[11px] font-medium text-primary uppercase tracking-widest">
                  Statutory Requirement
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Under the **Data Protection Act**, you confirm that you have
                  obtained consent from the individual named below to share
                  their contact details for the purpose of identity verification
                  and benefit administration.
                </p>
              </div>
            </div>
          </header>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {[
                {
                  label: "Full Name",
                  name: "fullName",
                  type: "text",
                  placeholder: "Enter full name",
                  icon: <User size={16} />,
                },
                {
                  label: "Date of Birth",
                  name: "birthDate",
                  type: "date",
                  placeholder: "",
                  icon: <Calendar size={16} />,
                },
                {
                  label: "Relationship",
                  name: "relationship",
                  type: "text",
                  placeholder: "e.g. Spouse, Sibling",
                  icon: <Heart size={16} />,
                },
                {
                  label: "Phone Number",
                  name: "phone",
                  type: "text",
                  placeholder: "07... or 254...",
                  inputMode: "numeric",
                  icon: <Phone size={16} />,
                },
                {
                  label: "Location",
                  name: "location",
                  type: "text",
                  placeholder: "Enter residential location",
                  fullWidth: true,
                  icon: <MapPin size={16} />,
                },
              ].map((field) => (
                <div
                  key={field.name}
                  className={`flex flex-col gap-2 ${field.fullWidth ? "md:col-span-2" : ""}`}
                >
                  {/* Fine, tracking-spaced upper category label system */}
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                    {field.label}
                  </label>

                  {/* Preferred Input Outer Shell Framework */}
                  <div
                    className={`relative flex items-center bg-slate-50/50 border-2 rounded-2xl h-14 transition-all duration-200
            ${
              errors[field.name]
                ? "border-red-500 bg-white"
                : "border-slate-100 focus-within:border-slate-900 focus-within:bg-white"
            }
          `}
                  >
                    {/* Absolute Left Vertical Boundary Prefix Bay */}
                    <div
                      className={`pl-4 pr-3 flex items-center border-r h-5 my-auto shrink-0 select-none transition-colors duration-200
              ${errors[field.name] ? "text-red-400 border-red-200" : "text-slate-400 border-slate-200/60"}
            `}
                    >
                      {field.icon}
                    </div>

                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ""}
                      inputMode={field.inputMode}
                      max={field.name === "birthDate" ? today : undefined}
                      onChange={(e) =>
                        field.name === "phone"
                          ? handlePhoneInput(e)
                          : setFormData({
                              ...formData,
                              [field.name]: e.target.value,
                            })
                      }
                      onBlur={(e) => validateField(field.name, e.target.value)}
                      className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:ring-0 placeholder:text-slate-300 font-medium cursor-text"
                    />
                  </div>

                  {/* Dynamic Verification Error Stack Notifications */}
                  {errors[field.name] && (
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-tight ml-1 flex items-center gap-1.5 mt-0.5">
                      <AlertCircle size={12} className="shrink-0" />
                      <span>{errors[field.name]}</span>
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button
              disabled={!isFormValid || isLoading}
              onClick={handleContinue}
              className={`w-full h-14 rounded-xl font-bold mt-4 flex items-center justify-center gap-3 transition-all ${
                isFormValid && !isLoading
                  ? "bg-primary text-white shadow-lg shadow-blue-900/20 hover:bg-[#062d7a]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoading && (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextOfKin;

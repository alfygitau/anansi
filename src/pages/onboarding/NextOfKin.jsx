import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import MyProgress from "../../components/progress-bar/MyProgress";

const NextOfKin = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    birthDate: "",
    relationship: "",
    phone: "",
    location: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validation Logic
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

  const handleContinue = async () => {
    if (!isFormValid) return;
    setLoading(true);
    try {
      navigate("/onboarding/terms-conditions");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-[1300px] mx-auto min-h-screen">
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
            <h1 className="text-xl font-bold text-gray-900 mb-4">
              Add Next of Kin
            </h1>
            <p className="text-[14px] text-gray-600 leading-relaxed">
              To ensure the safety and security of your membership, we kindly
              request that you provide information about your next of kin. This
              will be kept confidential and used only in emergencies.
            </p>
          </header>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
              {[
                {
                  label: "Full Name",
                  name: "fullName",
                  type: "text",
                  placeholder: "Enter full name",
                },
                {
                  label: "Date of Birth",
                  name: "birthDate",
                  type: "date",
                  placeholder: "",
                },
                {
                  label: "Relationship",
                  name: "relationship",
                  type: "text",
                  placeholder: "e.g. Spouse, Sibling",
                },
                {
                  label: "Phone Number",
                  name: "phone",
                  type: "text",
                  placeholder: "07... or 254...",
                  inputMode: "numeric",
                },
                {
                  label: "Location",
                  name: "location",
                  type: "text",
                  placeholder: "Enter residential location",
                  fullWidth: true,
                },
              ].map((field) => (
                <div
                  key={field.name}
                  className={`flex flex-col gap-1.5 ${field.fullWidth ? "md:col-span-2" : ""}`}
                >
                  <label className="text-sm font-semibold text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
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
                    className={`h-12 px-4 rounded-xl border transition-all outline-none bg-gray-50 focus:ring-2 focus:ring-[#042159]/20 ${
                      errors[field.name]
                        ? "border-red-500 shadow-sm shadow-red-50"
                        : "border-gray-200 focus:border-[#042159] focus:bg-white"
                    }`}
                  />
                  {errors[field.name] && (
                    <span className="text-[11px] text-red-500 font-bold uppercase tracking-tight ml-1">
                      {errors[field.name]}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <button
              disabled={!isFormValid || loading}
              onClick={handleContinue}
              className={`w-full h-14 rounded-xl font-bold mt-4 flex items-center justify-center gap-3 transition-all ${
                isFormValid && !loading
                  ? "bg-[#042159] text-white shadow-lg shadow-blue-900/20 hover:bg-[#062d7a]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {loading && (
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

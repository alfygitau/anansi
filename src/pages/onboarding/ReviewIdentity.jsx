import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyProgress from "../../components/progress-bar/MyProgress";

const ReviewIdentity = () => {
  const navigate = useNavigate();

  const kyc_details = {
    fullName: "JOHN JUMA OMONDI",
    idNumber: "32456789",
    dateOfBirth: "12/05/1994",
    sex: "MALE",
    documentType: "National ID",
    issueDate: "2020-01-15",
    id_front_image:
      "https://api.yourdomain.com/uploads/front_id_scan_sample.jpg",
    id_back_image: "https://api.yourdomain.com/uploads/back_id_scan_sample.jpg",
  };

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    idNumber: "",
    dob: "",
    gender: "",
  });

  useEffect(() => {
    fetchCustomer();
    if (kyc_details) {
      const names = splitName(kyc_details.fullNames || kyc_details.fullName);
      setFormData({
        firstName: names.firstName,
        middleName: names.middleName,
        lastName: names.lastName,
        dob: kyc_details.dateOfBirth || "",
        gender: kyc_details.sex || "",
        idNumber: kyc_details.idNumber || kyc_details.passportNumber || "",
      });
    }
  }, []);

  const splitName = (fullName) => {
    if (!fullName) return { firstName: "", middleName: "", lastName: "" };
    const parts = fullName.trim().split(/\s+/);
    return {
      firstName: parts[0] || "",
      lastName: parts.length > 1 ? parts[parts.length - 1] : "",
      middleName: parts.slice(1, -1).join(" ") || "",
    };
  };

  const fetchCustomer = async () => {
    try {
    } catch (err) {}
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const payload = {
        firstname: formData.firstName,
        middlename: formData.middleName,
        lastname: formData.lastName,
        identification: formData.idNumber,
        onboarding_stage: "facial-identity",
      };
      navigate("/onboarding/facial-identity");
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { label: "First Name", value: formData.firstName },
    { label: "Middle Name(s)", value: formData.middleName },
    { label: "Last Name", value: formData.lastName },
    { label: "ID / Passport Number", value: formData.idNumber },
    { label: "Gender", value: formData.gender },
    { label: "Date of Birth", value: formData.dob },
  ];

  return (
    <div className="w-full max-w-[1300px] mx-auto flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar Progress */}
      <div className="hidden lg:block md:block w-[25%] bg-gray-50/30">
        <MyProgress
          currentTitle="Identity Verification"
          currentSubtitle="Upload Government Document"
        />
      </div>

      {/* Main Form Area */}
      <div className="flex-1 sm:px-5">
        <header className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Review your Details
          </h1>
          <p className="mt-2 text-gray-500 text-[15px] leading-relaxed">
            We've scanned your document. Please verify the information below
            matches your legal records.
          </p>
        </header>

        {/* Document Cards */}
        <section className="flex flex-row sm:flex-col gap-4 mb-6">
          {[
            { label: "Front of ID", img: customer?.id_front_image },
            { label: "Back of ID", img: customer?.id_back_image },
          ].map((doc, i) => (
            <div
              key={i}
              className="relative lg:flex-1 md:flex-1 h-[180px] rounded-xl overflow-hidden border border-gray-200 bg-gray-50 transition-all hover:border-[#042159]/30 shadow-sm"
            >
              {doc.img ? (
                <img
                  src={doc.img}
                  alt={doc.label}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-1">
                  <svg
                    className="w-5 h-5 opacity-30"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="text-[9px] uppercase font-bold tracking-tighter">
                    Missing Scan
                  </span>
                </div>
              )}

              {/* Label Overlay - Minimalist pill */}
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/90 backdrop-blur rounded-full border border-gray-100 shadow-sm text-[8px] font-bold uppercase tracking-tight text-gray-600">
                {doc.label}
              </div>

              {/* Subtle Inner Glow/Scan Border */}
              <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 rounded-xl"></div>
            </div>
          ))}
        </section>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {inputFields.map((field, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-600">
                {field.label}
              </label>
              <div className="relative group">
                <input
                  type="text"
                  readOnly
                  value={field.value}
                  className="h-12 w-full px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 font-medium cursor-default focus:outline-none"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <svg
                    className="w-4 h-4 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex flex-col-reverse items-center gap-4 pt-8 border-t border-gray-100">
          <button
            onClick={() => navigate("/onboarding/verify-identity")}
            className="w-full sm:w-auto px-6 h-12 text-sm font-semibold text-gray-500 hover:text-red-500 transition-colors"
          >
            Details are wrong? Re-upload
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full h-12 bg-[#042159] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-3 transition-all hover:bg-[#062d7a] active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-[#042159]/10"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            Yes, this looks correct
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewIdentity;

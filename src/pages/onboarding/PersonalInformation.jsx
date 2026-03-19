import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyProgress from "../../components/progress-bar/MyProgress";
import useAuth from "../../hooks/useAuth";
import { useMutation, useQuery } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import {
  createCustomerAddress,
  getCounties,
  getCountries,
  getStates,
  updateCustomerFinancials,
} from "../../sdks/customer/customer";
import { AlertCircle } from "lucide-react";

const ProfileInformation = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [countries, setCountries] = useState([]);
  const [counties, setCounties] = useState([]);
  const [subcounties, setSubcounties] = useState([]);
  const [states, setStates] = useState([]);
  const [errors, setErrors] = useState({});
  const { auth } = useAuth();

  const setError = (field, message) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const [form, setForm] = useState({
    country: "",
    county: "",
    subcounty: "",
    physicalAddress: "",
    address_1: "",
    address_2: "",
    state: "",
    city: "",
    employment_type: "",
    jobTitle: "",
    income: "",
    kra: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
      } catch (err) {}
    };
    fetchData();
  }, []);

  const handleCountyChange = (e) => {
    const selected = e.target.value;
    setForm({ ...form, county: selected, subcounty: "" });
    const match = counties.find((c) => c.county === selected);
    setSubcounties(match ? match.sub_counties : []);
  };

  const validateField = (name, value) => {
    let error = "";
    const kraRegex = /^[AP]\d{9}[A-Z]$/;

    switch (name) {
      case "country":
        if (!value) error = "Country of residence is required.";
        break;
      case "county":
        if (!value) error = "County is required.";
        break;
      case "subcounty":
        if (!value) error = "Sub-county is required.";
        break;
      case "physicalAddress":
        if (!value) error = "Physical address is required.";
        break;
      case "employment_type":
        if (!value) error = "Please select employment type.";
        break;
      case "jobTitle":
        if (!value) error = "Job title is required.";
        break;
      case "income":
        if (!value || value <= 0)
          error = "Please enter a valid monthly income.";
        break;
      case "kra":
        if (value && !kraRegex.test(value))
          error = "Invalid KRA PIN format (e.g., A123456789Z).";
        break;
      case "address_1":
        if (!value) error = "Address 1 is required.";
        break;
      case "state":
        if (!value) error = "State is required.";
        break;
      case "city":
        if (!value) error = "City is required.";
        break;
      default:
        break;
    }

    setError(name, error);
    return error;
  };

  const isFormInvalid = () => {
    // Check if any error messages exist
    const hasErrors = Object.values(errors).some((error) => error !== "");

    // Define mandatory fields based on country
    const requiredFields = ["country", "employment_type", "jobTitle", "income"];

    if (form.country === "KENYA") {
      requiredFields.push("county", "subcounty", "physicalAddress");
    } else if (form.country && form.country !== "Kenya") {
      requiredFields.push("address_1", "state", "city");
    }

    // Check if any required field is empty
    const hasEmptyFields = requiredFields.some((field) => !form[field]);

    return hasErrors || hasEmptyFields;
  };

  const { mutate: addressMutate } = useMutation({
    mutationKey: ["create address"],
    mutationFn: () =>
      createCustomerAddress(
        auth?.user?.id,
        form.physicalAddress,
        form.county,
        form.subcounty,
      ),
    onSuccess: () => {
      showToast({
        title: "Profile Updated",
        type: "success",
        position: "top-right",
        description:
          "Your employment and financial details have been securely saved to your profile.",
      });
      navigate("/onboarding/next-of-kin");
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

  const { mutate: updateFinancialsMutate, isLoading } = useMutation({
    mutationKey: ["update financial"],
    mutationFn: () =>
      updateCustomerFinancials(
        auth?.user?.id,
        form.employment_type,
        form.kra,
        form.jobTitle,
        form.income,
        form.country,
      ),
    onSuccess: async () => {
      await addressMutate();
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
    updateFinancialsMutate();
  };

  useQuery({
    queryKey: ["get counties"],
    queryFn: async () => {
      const response = await getCounties();
      return response?.data?.data;
    },
    onSuccess: (data) => {
      setCounties(data);
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

  useQuery({
    queryKey: ["get countries"],
    queryFn: async () => {
      const response = await getCountries();
      return response?.data?.data;
    },
    onSuccess: (data) => {
      setCountries(data);
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

  useQuery({
    queryKey: ["get states"],
    queryFn: async () => {
      const response = await getStates();
      return response?.data?.data;
    },
    onSuccess: (data) => {
      setStates(data);
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

  return (
    <div className="flex w-full max-w-[1300px] mx-auto min-h-screen relative">
      {/* Sidebar - 20% of the 85% total container if using global wrapper */}
      <div className="w-[25%] hidden lg:block md:block">
        <MyProgress
          currentTitle="Profile Information"
          currentSubtitle="Employment & KRA Verification"
        />
      </div>

      {/* Main Content - 80% */}
      <div className="flex-1 lg:w-[75%] sm:px-5 overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-2xl lg:text-3xl font-black text-[#042159] uppercase tracking-tight">
            Complete Your Profile
          </h1>
          <p className="text-slate-500 text-sm mt-1 w-full">
            To provide you with tailored financial services and ensure
            compliance with **SASRA (Sacco Societies Regulatory Authority)**
            guidelines, please provide your current residential and employment
            details.
          </p>

          {/* --- DISCLAIMER BOX --- */}
          <div className="mt-3 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex gap-4 items-center">
            <div className="bg-[#4DB8E4]/10 p-2 rounded-lg">
              <AlertCircle size={20} className="text-[#4DB8E4]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-[11px] font-black text-[#042159] uppercase tracking-widest">
                Data Privacy & Security
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The information provided, including your **KRA PIN** and
                **Monthly Income**, is encrypted and used strictly for credit
                scoring and identity verification. We do not share your
                financial data with unauthorized third parties.
              </p>
            </div>
          </div>
        </div>
        <div>
          {/* Keeps form readable on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Address */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-4">
                Address Information
              </h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Country of Residence
                </label>
                <select
                  value={form.country}
                  onBlur={(e) => validateField("country", e.target.value)}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  className="h-14 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 
             hover:border-gray-300 
             focus:border-[#042159] focus:outline-none focus:ring-4 focus:ring-[#042159]/10 
             cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23042159' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.25rem",
                  }}
                >
                  <option value="">Select country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.country}
                  </span>
                )}
              </div>

              {form.country === "KENYA" || !form.country ? (
                <>
                  {/* Address Details - Vertical Stack */}
                  <div className="flex flex-col gap-[20px]">
                    {/* County Selection */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        County
                      </label>
                      <select
                        value={form.county}
                        onChange={handleCountyChange}
                        onBlur={(e) => validateField("county", e.target.value)}
                        className="h-14 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 
             hover:border-gray-300 
             focus:border-[#042159] focus:outline-none focus:ring-4 focus:ring-[#042159]/10 
             cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23042159' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1.25rem",
                        }}
                      >
                        <option value="">Select county</option>
                        {counties.map((c) => (
                          <option key={c.code} value={c.county}>
                            {c.county}
                          </option>
                        ))}
                      </select>
                      {errors.county && (
                        <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.county}
                        </span>
                      )}
                    </div>

                    {/* Sub-County Selection */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        Sub-County
                      </label>
                      <select
                        value={form.subcounty}
                        onBlur={(e) =>
                          validateField("subcounty", e.target.value)
                        }
                        onChange={(e) =>
                          setForm({ ...form, subcounty: e.target.value })
                        }
                        className="h-14 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 
             hover:border-gray-300 
             focus:border-[#042159] focus:outline-none focus:ring-4 focus:ring-[#042159]/10 
             cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23042159' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1.25rem",
                        }}
                      >
                        <option value="">Select sub-county</option>
                        {subcounties.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {errors.subcounty && (
                        <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.subcounty}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Physical Address
                    </label>
                    <input
                      type="text"
                      value={form.physicalAddress}
                      onBlur={(e) =>
                        validateField("physicalAddress", e.target.value)
                      }
                      onChange={(e) =>
                        setForm({ ...form, physicalAddress: e.target.value })
                      }
                      placeholder="House/Street/Building"
                      className="h-14 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#042159]"
                    />
                    {errors.physicalAddress && (
                      <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.physicalAddress}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    value={form.address_1}
                    onBlur={(e) => validateField("address_1", e.target.value)}
                    onChange={(e) =>
                      setForm({ ...form, address_1: e.target.value })
                    }
                    className="h-12 w-full px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none"
                  />
                  {errors.address_1 && (
                    <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} /> {errors.address_1}
                    </span>
                  )}
                  <div className="flex flex-col gap-[20px]">
                    <div className="w-full">
                      <select
                        value={form.state}
                        onBlur={(e) => validateField("state", e.target.value)}
                        onChange={(e) =>
                          setForm({ ...form, state: e.target.value })
                        }
                        className="h-14 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 
             hover:border-gray-300 
             focus:border-[#042159] focus:outline-none focus:ring-4 focus:ring-[#042159]/10 
             cursor-pointer"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23042159' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 1rem center",
                          backgroundSize: "1.25rem",
                        }}
                      >
                        <option value="">State</option>
                        {states.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      {errors.kra && (
                        <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.kra}
                        </span>
                      )}
                    </div>
                    <div className="w-full">
                      <input
                        type="text"
                        placeholder="City"
                        value={form.city}
                        onBlur={(e) => validateField("city", e.target.value)}
                        onChange={(e) =>
                          setForm({ ...form, city: e.target.value })
                        }
                        className="h-14 px-4 w-full rounded-xl border border-gray-200 bg-gray-50 outline-none"
                      />
                      {errors.city && (
                        <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.city}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Employment */}
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-4">
                Additional Information
              </h2>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Employment Type
                </label>
                <select
                  value={form.employment_type}
                  onBlur={(e) =>
                    validateField("employment_type", e.target.value)
                  }
                  onChange={(e) =>
                    setForm({ ...form, employment_type: e.target.value })
                  }
                  className="h-14 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 shadow-sm transition-all duration-200 
             hover:border-gray-300 
             focus:border-[#042159] focus:outline-none focus:ring-4 focus:ring-[#042159]/10 
             cursor-pointer"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23042159' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1.25rem",
                  }}
                >
                  <option value="">Select type</option>
                  <option value="Employed">Employed</option>
                  <option value="Self employed">Self Employed</option>
                </select>
                {errors.employment_type && (
                  <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.employment_type}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Job Title
                </label>
                <input
                  type="text"
                  value={form.jobTitle}
                  onChange={(e) =>
                    setForm({ ...form, jobTitle: e.target.value })
                  }
                  onBlur={(e) => validateField("jobTitle", e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="h-14 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none"
                />
                {errors.jobTitle && (
                  <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.jobTitle}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Monthly Income
                </label>
                <div className="flex">
                  <div className="h-14 px-4 flex items-center bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl text-xs font-bold text-gray-500">
                    KES
                  </div>
                  <input
                    type="number"
                    value={form.income}
                    onBlur={(e) => validateField("income", e.target.value)}
                    onChange={(e) =>
                      setForm({ ...form, income: e.target.value })
                    }
                    className="h-14 flex-1 px-4 border border-gray-200 rounded-r-xl outline-none focus:ring-1 focus:ring-[#042159]"
                    placeholder="0.00"
                  />
                </div>
                {errors.income && (
                  <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.income}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  KRA PIN (Optional)
                </label>
                <input
                  type="text"
                  value={form.kra}
                  onBlur={(e) => validateField("kra", e.target.value)}
                  onChange={(e) =>
                    setForm({ ...form, kra: e.target.value.toUpperCase() })
                  }
                  placeholder="A00XXXXXXXXZ"
                  className="h-14 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none uppercase"
                />
                {errors.kra && (
                  <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.kra}
                  </span>
                )}
              </div>

              <button
                disabled={isLoading || isFormInvalid()}
                onClick={handleContinue}
                className="w-full h-14 bg-[#042159] text-white rounded-xl font-bold mt-4 shadow-lg shadow-blue-900/10 
             hover:bg-[#062d7a] transition-all flex items-center justify-center gap-3 
             disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Save & Continue"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInformation;

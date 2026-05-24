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
import {
  AlertCircle,
  ArrowRight,
  Loader2,
  Globe,
  MapPin,
  Briefcase,
  DollarSign,
  FileText,
} from "lucide-react";

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
    <div className="flex w-full max-w-[1300px] md:px-6 mx-auto min-h-screen relative">
      {/* Sidebar - 20% of the 85% total container if using global wrapper */}
      <div className="w-[25%] hidden lg:block md:block">
        <MyProgress
          currentTitle="Profile Information"
          currentSubtitle="Employment & KRA Verification"
        />
      </div>

      {/* Main Content - 80% */}
      <div className="flex-1 lg:w-[75%] sm:px-5 overflow-y-auto">
        <div className="mb-5">
          <h1 className="text-2xl lg:text-2xl font-medium text-primary uppercase tracking-tight">
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
            <div className="bg-secondary/10 p-2 rounded-lg">
              <AlertCircle size={20} className="text-secondary" />
            </div>
            <div className="space-y-1">
              <h4 className="text-[11px] font-medium text-primary uppercase tracking-widest">
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

            {/* LEFT COLUMN: ADDRESS INFORMATION */}
            <div className="space-y-6">
              <h2 className="text-lg font-black text-gray-900 border-b pb-4 uppercase tracking-tight">
                Address Information
              </h2>

              {/* Country of Residence */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Country of Residence
                </label>
                <div className="relative flex items-center bg-white border-2 border-slate-100 focus-within:border-slate-900 rounded-2xl h-14 transition-all duration-200">
                  <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto shrink-0 select-none">
                    <Globe size={16} />
                  </div>
                  <select
                    value={form.country}
                    onBlur={(e) => validateField("country", e.target.value)}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                    className="w-full bg-transparent border-none pl-4 pr-10 h-full text-sm font-bold text-slate-900 outline-none focus:ring-0 appearance-none cursor-pointer"
                  >
                    <option value="">Select country</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {errors.country && (
                  <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1 ml-1">
                    <AlertCircle size={12} /> {errors.country}
                  </span>
                )}
              </div>

              {form.country === "KENYA" || !form.country ? (
                <>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      County
                    </label>
                    <div className="relative flex items-center bg-white border-2 border-slate-100 focus-within:border-slate-900 rounded-2xl h-14 transition-all duration-200">
                      <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto shrink-0 select-none">
                        <MapPin size={16} />
                      </div>
                      <select
                        value={form.county}
                        onChange={handleCountyChange}
                        onBlur={(e) => validateField("county", e.target.value)}
                        className="w-full bg-transparent border-none pl-4 pr-10 h-full text-sm font-bold text-slate-900 outline-none focus:ring-0 appearance-none cursor-pointer"
                      >
                        <option value="">Select county</option>
                        {counties.map((c) => (
                          <option key={c.code} value={c.county}>
                            {c.county}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.county && (
                      <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1 ml-1">
                        <AlertCircle size={12} /> {errors.county}
                      </span>
                    )}
                  </div>

                  {/* Sub-County Selection */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Sub-County
                    </label>
                    <div className="relative flex items-center bg-white border-2 border-slate-100 focus-within:border-slate-900 rounded-2xl h-14 transition-all duration-200">
                      <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto shrink-0 select-none">
                        <MapPin size={16} />
                      </div>
                      <select
                        value={form.subcounty}
                        onBlur={(e) =>
                          validateField("subcounty", e.target.value)
                        }
                        onChange={(e) =>
                          setForm({ ...form, subcounty: e.target.value })
                        }
                        className="w-full bg-transparent border-none pl-4 pr-10 h-full text-sm font-bold text-slate-900 outline-none focus:ring-0 appearance-none cursor-pointer"
                      >
                        <option value="">Select sub-county</option>
                        {subcounties.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.subcounty && (
                      <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1 ml-1">
                        <AlertCircle size={12} /> {errors.subcounty}
                      </span>
                    )}
                  </div>

                  {/* Physical Address */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Physical Address
                    </label>
                    <div className="relative flex items-center bg-white border-2 border-slate-100 focus-within:border-slate-900 rounded-2xl h-14 transition-all duration-200">
                      <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto shrink-0 select-none">
                        <MapPin size={16} />
                      </div>
                      <input
                        type="text"
                        value={form.physicalAddress}
                        onBlur={(e) =>
                          validateField("physicalAddress", e.target.value)
                        }
                        onChange={(e) =>
                          setForm({
                            ...form,
                            physicalAddress: e.target.value,
                          })
                        }
                        placeholder="House/Street/Building"
                        className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:ring-0 placeholder:text-slate-300 font-medium"
                      />
                    </div>
                    {errors.physicalAddress && (
                      <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1 ml-1">
                        <AlertCircle size={12} /> {errors.physicalAddress}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {/* Address Line 1 */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Address Line 1
                    </label>
                    <div className="relative flex items-center bg-white border-2 border-slate-100 focus-within:border-slate-900 rounded-2xl h-14 transition-all duration-200">
                      <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto shrink-0 select-none">
                        <MapPin size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="Address Line 1"
                        value={form.address_1}
                        onBlur={(e) =>
                          validateField("address_1", e.target.value)
                        }
                        onChange={(e) =>
                          setForm({ ...form, address_1: e.target.value })
                        }
                        className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:ring-0 placeholder:text-slate-300 font-medium"
                      />
                    </div>
                    {errors.address_1 && (
                      <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1 ml-1">
                        <AlertCircle size={12} /> {errors.address_1}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* State Selection */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        State
                      </label>
                      <div className="relative flex items-center bg-white border-2 border-slate-100 focus-within:border-slate-900 rounded-2xl h-14 transition-all duration-200">
                        <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto shrink-0 select-none">
                          <MapPin size={16} />
                        </div>
                        <select
                          value={form.state}
                          onBlur={(e) => validateField("state", e.target.value)}
                          onChange={(e) =>
                            setForm({ ...form, state: e.target.value })
                          }
                          className="w-full bg-transparent border-none pl-4 pr-10 h-full text-sm font-bold text-slate-900 outline-none focus:ring-0 appearance-none cursor-pointer"
                        >
                          <option value="">State</option>
                          {states.map((s) => (
                            <option key={s.id} value={s.name}>
                              {s.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                      {errors.kra && (
                        <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1 ml-1">
                          <AlertCircle size={12} /> {errors.kra}
                        </span>
                      )}
                    </div>

                    {/* City Input */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                        City
                      </label>
                      <div className="relative flex items-center bg-white border-2 border-slate-100 focus-within:border-slate-900 rounded-2xl h-14 transition-all duration-200">
                        <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto shrink-0 select-none">
                          <MapPin size={16} />
                        </div>
                        <input
                          type="text"
                          placeholder="City"
                          value={form.city}
                          onBlur={(e) => validateField("city", e.target.value)}
                          onChange={(e) =>
                            setForm({ ...form, city: e.target.value })
                          }
                          className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:ring-0 placeholder:text-slate-300 font-medium"
                        />
                      </div>
                      {errors.city && (
                        <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1 ml-1">
                          <AlertCircle size={12} /> {errors.city}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: ADDITIONAL INFORMATION */}
            <div className="space-y-6">
              <h2 className="text-lg font-black text-gray-900 border-b pb-4 uppercase tracking-tight">
                Additional Information
              </h2>

              {/* Employment Type */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Employment Type
                </label>
                <div className="relative flex items-center bg-white border-2 border-slate-100 focus-within:border-slate-900 rounded-2xl h-14 transition-all duration-200">
                  <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto shrink-0 select-none">
                    <Briefcase size={16} />
                  </div>
                  <select
                    value={form.employment_type}
                    onBlur={(e) =>
                      validateField("employment_type", e.target.value)
                    }
                    onChange={(e) =>
                      setForm({ ...form, employment_type: e.target.value })
                    }
                    className="w-full bg-transparent border-none pl-4 pr-10 h-full text-sm font-bold text-slate-900 outline-none focus:ring-0 appearance-none cursor-pointer"
                  >
                    <option value="">Select type</option>
                    <option value="Employed">Employed</option>
                    <option value="Self employed">Self Employed</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                {errors.employment_type && (
                  <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1 ml-1">
                    <AlertCircle size={12} /> {errors.employment_type}
                  </span>
                )}
              </div>

              {/* Job Title */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Job Title
                </label>
                <div className="relative flex items-center bg-white border-2 border-slate-100 focus-within:border-slate-900 rounded-2xl h-14 transition-all duration-200">
                  <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto shrink-0 select-none">
                    <Briefcase size={16} />
                  </div>
                  <input
                    type="text"
                    value={form.jobTitle}
                    onChange={(e) =>
                      setForm({ ...form, jobTitle: e.target.value })
                    }
                    onBlur={(e) => validateField("jobTitle", e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:ring-0 placeholder:text-slate-300 font-medium"
                  />
                </div>
                {errors.jobTitle && (
                  <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1 ml-1">
                    <AlertCircle size={12} /> {errors.jobTitle}
                  </span>
                )}
              </div>

              {/* Monthly Income */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  Monthly Income
                </label>
                <div className="relative flex items-center bg-white border-2 border-slate-100 focus-within:border-slate-900 rounded-2xl h-14 transition-all duration-200">
                  <div className="pl-6 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto shrink-0 font-bold text-[11px] tracking-wider select-none">
                    KES
                  </div>
                  <input
                    type="number"
                    value={form.income}
                    onBlur={(e) => validateField("income", e.target.value)}
                    onChange={(e) =>
                      setForm({ ...form, income: e.target.value })
                    }
                    placeholder="0.00"
                    className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:ring-0 placeholder:text-slate-300 font-medium"
                  />
                </div>
                {errors.income && (
                  <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1 ml-1">
                    <AlertCircle size={12} /> {errors.income}
                  </span>
                )}
              </div>

              {/* KRA PIN */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                  KRA PIN (Optional)
                </label>
                <div className="relative flex items-center bg-white border-2 border-slate-100 focus-within:border-slate-900 rounded-2xl h-14 transition-all duration-200">
                  <div className="pl-4 pr-3 flex items-center text-slate-400 border-r border-slate-200/60 h-5 my-auto shrink-0 select-none">
                    <FileText size={16} />
                  </div>
                  <input
                    type="text"
                    value={form.kra}
                    onBlur={(e) => validateField("kra", e.target.value)}
                    onChange={(e) =>
                      setForm({ ...form, kra: e.target.value.toUpperCase() })
                    }
                    placeholder="A00XXXXXXXXZ"
                    className="w-full bg-transparent border-none pl-4 pr-6 h-full text-sm font-bold text-slate-900 outline-none focus:ring-0 uppercase placeholder:text-slate-300 placeholder:normal-case font-medium"
                  />
                </div>
                {errors.kra && (
                  <span className="text-[11px] font-bold text-red-500 mt-1 flex items-center gap-1 ml-1">
                    <AlertCircle size={12} /> {errors.kra}
                  </span>
                )}
              </div>

              {/* Primary Actions Controller */}
              <button
                type="button"
                disabled={isLoading || isFormInvalid()}
                onClick={handleContinue}
                className={`w-full h-16 rounded-xl font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 transition-all mt-4
          ${
            isLoading || isFormInvalid()
              ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/40 shadow-none"
              : "bg-primary text-white hover:bg-slate-800 active:scale-[0.99]"
          }
        `}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin w-4 h-4 text-slate-400" />
                    <span>Syncing Onboarding Register...</span>
                  </>
                ) : (
                  <>
                    <span>Save & Continue</span>
                    <ArrowRight size={14} />
                  </>
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

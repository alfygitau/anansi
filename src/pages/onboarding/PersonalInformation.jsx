import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MyProgress from "../../components/progress-bar/MyProgress";

const ProfileInformation = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({
    loadingKra: false,
    isKraFailed: false,
    isKraVerified: false,
  });
  const [countries, setCountries] = useState([]);
  const [counties, setCounties] = useState([]);
  const [subcounties, setSubcounties] = useState([]);
  const [states, setStates] = useState([]);

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

  const validateForm = () => {
    const kraRegex = /^[AP]\d{9}[A-Z]$/;
    if (!form.country) return "Country of residence is required.";
    if (form.country === "Kenya") {
      if (!form.county || !form.subcounty || !form.physicalAddress)
        return "Complete all address fields.";
    } else {
      if (!form.address_1 || !form.state || !form.city)
        return "Complete all address fields.";
    }
    if (!form.employment_type || !form.jobTitle || !form.income)
      return "Employment details are required.";
    if (form.kra && !kraRegex.test(form.kra)) return "KRA PIN is invalid.";
    return null;
  };

  const handleContinue = async () => {
    navigate("/onboarding/next-of-kin");
    const error = validateForm();
    if (error) return;
    setLoading(true);
    try {
      const customerPayload = {
        onboarding_stage: "nextOfKin",
        country_of_residence: form.country,
        employment_type: form.employment_type,
        kraPin: form.kra,
        occupation: form.jobTitle,
        income_range: form.income,
      };
      const addressPayload =
        form.country === "Kenya"
          ? {
              physical_address: form.physicalAddress,
              customer_id: "",
              county: form.county,
              subcounty: form.subcounty,
            }
          : {
              address_1: form.address_1,
              address_2: form.address_2,
              state: form.state,
              city: form.city,
              customer_id: "id",
            };
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

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
              </div>

              {form.country === "Kenya" || !form.country ? (
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
                    </div>

                    {/* Sub-County Selection */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700">
                        Sub-County
                      </label>
                      <select
                        value={form.subcounty}
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
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Physical Address
                    </label>
                    <input
                      type="text"
                      value={form.physicalAddress}
                      onChange={(e) =>
                        setForm({ ...form, physicalAddress: e.target.value })
                      }
                      placeholder="House/Street/Building"
                      className="h-14 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none focus:border-[#042159]"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Address Line 1"
                    value={form.address_1}
                    onChange={(e) =>
                      setForm({ ...form, address_1: e.target.value })
                    }
                    className="h-12 w-full px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={form.state}
                      onChange={(e) =>
                        setForm({ ...form, state: e.target.value })
                      }
                      className="h-12 px-3 rounded-xl border border-gray-200 bg-gray-50 outline-none"
                    >
                      <option value="">State</option>
                      {states.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="City"
                      value={form.city}
                      onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                      }
                      className="h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none"
                    />
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
                  placeholder="e.g. Software Engineer"
                  className="h-14 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none"
                />
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
                    onChange={(e) =>
                      setForm({ ...form, income: e.target.value })
                    }
                    className="h-14 flex-1 px-4 border border-gray-200 rounded-r-xl outline-none focus:ring-1 focus:ring-[#042159]"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  KRA PIN (Optional)
                </label>
                <input
                  type="text"
                  value={form.kra}
                  onChange={(e) =>
                    setForm({ ...form, kra: e.target.value.toUpperCase() })
                  }
                  placeholder="A00XXXXXXXXZ"
                  className="h-14 px-4 rounded-xl border border-gray-200 bg-gray-50 outline-none uppercase"
                />
              </div>

              <button
                disabled={loading}
                onClick={handleContinue}
                className="w-full h-14 bg-[#042159] text-white rounded-xl font-bold mt-4 shadow-lg shadow-blue-900/10 hover:bg-[#062d7a] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading && (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInformation;

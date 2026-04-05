import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Globe,
  Navigation,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { useMutation } from "react-query";
import { updateCustomerAddress } from "../../sdks/customer/customer";
import { useToast } from "../../contexts/ToastProvider";

const EditAddress = ({
  isOpen,
  onClose,
  customer,
  counties,
  subCounties,
  setSubCounties,
  countries,
  refetch,
}) => {
  const { showToast } = useToast();
  const [country, setCountry] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    physicalAddress: "",
    county: "",
    subcounty: "",
    city: "",
    state: "",
    zipcode: "",
    address_1: "",
    address_2: "",
  });

  useEffect(() => {
    if (customer && customer.addresses && customer.addresses.length > 0) {
      const addr = customer.addresses[0];
      setFormData({
        id: addr?.id || "",
        physicalAddress: addr.physical_address || "",
        county: addr.county || "",
        subcounty: addr.subcounty || "",
        city: addr.city || "",
        state: addr.state || "",
        zipcode: addr.zip_code || "",
        address_1: addr.address_1 || "",
        address_2: addr.address_2 || "",
      });
      setCountry(customer?.country_of_residence || "");
    }
  }, [customer]);

  const primaryColor = "#074073";
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountyInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      subcounty: "",
    }));
    const selectedCounty = counties.find((c) => c.county === value);
    if (selectedCounty) {
      setSubCounties(selectedCounty.sub_counties);
    } else {
      setSubCounties([]);
    }
  };

  const handleSave = async () => {
    updateAddress();
  };

  const { mutate: updateAddress, isLoading } = useMutation({
    mutationKey: ["update address"],
    mutationFn: () =>
      updateCustomerAddress(
        formData?.id,
        formData?.physicalAddress,
        formData?.county,
        formData?.subcounty,
      ),
    onSuccess: () => {
      refetch();
      onClose();
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#042159]/40 backdrop-blur-sm"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
          >
            {/* Header Area */}
            <div className="p-8 pb-0 flex justify-between items-start">
              <div>
                <h2 className={`text-2xl font-black text-[${primaryColor}]`}>
                  Update Address
                </h2>
                <p className="text-slate-400 text-sm font-medium mt-1">
                  Ensure your location details are accurate for logistics.
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-300" />
              </button>
            </div>

            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="relative group">
                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                  Country of Residence
                </label>
                <div className="relative group">
                  <Globe
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"
                    size={18}
                  />
                  <select
                    name="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full h-14 pl-12 pr-12 bg-slate-50 border border-slate-100 focus:border-[#074073] focus:bg-white rounded-2xl outline-none appearance-none text-sm font-bold text-[#042159] transition-all cursor-pointer"
                  >
                    <option value="">Select Country</option>
                    {countries?.map((sub) => (
                      <option key={sub?.id} value={sub?.name}>
                        {sub?.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-transform"
                    size={18}
                  />
                </div>
              </div>

              {country === "Kenya" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Physical Address - Full Width */}
                  <div className="md:col-span-2 relative">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1 mb-2 block">
                      Physical Address
                    </label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                        size={18}
                      />
                      <input
                        name="physicalAddress"
                        value={formData.physicalAddress}
                        onChange={handleInputChange}
                        placeholder="e.g. Apartment, Suite, Floor"
                        className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 focus:border-[#074073] rounded-2xl outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* County Select */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      County
                    </label>
                    <div className="relative group">
                      {/* Left Side Decorative Icon */}
                      <MapPin
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#074073] transition-colors"
                        size={18}
                      />

                      <select
                        name="county"
                        value={formData.county}
                        onChange={handleCountyInputChange}
                        className="w-full h-14 pl-12 pr-12 bg-slate-50 border border-slate-100 focus:border-[#074073] focus:bg-white rounded-2xl outline-none appearance-none text-sm font-bold text-[#042159] transition-all cursor-pointer"
                      >
                        <option value="">Select County</option>
                        {counties?.map((sub) => (
                          <option key={sub.county} value={sub.county}>
                            {sub.county}
                          </option>
                        ))}
                      </select>

                      {/* Right Side Custom Dropdown Arrow */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                        <ChevronDown size={20} strokeWidth={2.5} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">
                      Sub-County
                    </label>
                    <div className="relative group">
                      {/* Left Icon: Navigation/Pointer for Sub-locality */}
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <Navigation
                          className="text-slate-300 group-focus-within:text-[#074073] transition-colors"
                          size={18}
                          fill="currentColor"
                          fillOpacity={0.1}
                        />
                      </div>

                      <select
                        name="subcounty"
                        value={formData.subcounty}
                        onChange={handleInputChange}
                        // Added pl-12 for the icon space and pr-12 for the custom arrow
                        className="w-full h-14 pl-12 pr-12 bg-slate-50 border border-slate-100 focus:border-[#074073] focus:bg-white rounded-2xl outline-none appearance-none text-sm font-bold text-[#042159] transition-all cursor-pointer disabled:opacity-50"
                        disabled={!formData.county} // Disable until a county is picked
                      >
                        <option value="">Select Sub-County</option>
                        {subCounties?.map((sub) => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>

                      {/* Right Icon: Custom Dropdown Arrow */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-focus-within:text-[#074073] transition-transform group-focus-within:rotate-180 duration-300">
                        <ChevronDown size={20} strokeWidth={2.5} />
                      </div>
                    </div>

                    {!formData.county && (
                      <p className="text-[10px] text-slate-400 ml-1 italic">
                        Please select a county first
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                /* International Address Layout */
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-4">
                    {/* Similar input pattern for City, State, Zipcode, Address 1 & 2 */}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="p-8 bg-slate-50/50 flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 h-14 bg-white border border-slate-200 text-[#042159] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className={`flex-[2] h-14 rounded-2xl font-black uppercase tracking-widest text-xs text-white shadow-xl transition-all flex items-center justify-center gap-2
                  ${isLoading ? "bg-slate-300" : `bg-[${primaryColor}] hover:opacity-90 active:scale-[0.98] shadow-blue-900/20`}
                `}
                style={{
                  backgroundColor: isLoading ? "#cbd5e1" : primaryColor,
                }}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditAddress;

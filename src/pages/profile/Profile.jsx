import { useState, useRef, useEffect } from "react";
import {
  Camera,
  Edit3,
  User,
  MapPin,
  Briefcase,
  Heart,
  X,
  Upload,
  AlertTriangle,
  Info,
  Handshake,
  Ban,
  UserMinus,
  Scale,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation } from "react-query";
import { getCustomer, updateProfilePhoto } from "../../sdks/customer/customer";
import { useToast } from "../../contexts/ToastProvider";
import ProfileLoader from "../../skeletons/ProfileLoader";
import useAuth from "../../hooks/useAuth";
import EditAddress from "../../components/profile/EditAddress";
import EditFinancialDetails from "../../components/profile/EditFinancials";
import EditNextOfKin from "../../components/profile/EditKin";
import EditProfile from "../../components/profile/EditProfile";
import {
  getCounties,
  getCountries,
  getStates,
} from "../../sdks/customer/customer";
import { uploadSingleFile } from "../../sdks/upload-files/upload";

const ProfilePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selfieUrl, setSelfieUrl] = useState("");
  const [selfieFile, setSelfieFile] = useState("");
  const fileInputRef = useRef(null);
  const { auth } = useAuth();
  const [customer, setCustomer] = useState({});
  const [nextOfKin, setNextOfKin] = useState({});
  const [address, setAddress] = useState({});
  const { showToast } = useToast();
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [showEditFinancials, setShowEditFinancials] = useState(false);
  const [showEditKin, setShowEditKin] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [countries, setCountries] = useState([]);
  const [counties, setCounties] = useState([]);
  const [subCounties, setSubCounties] = useState([]);
  const [states, setStates] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const { isLoading, refetch } = useQuery({
    queryKey: ["get customer"],
    queryFn: async () => {
      const response = await getCustomer();
      return response.data.data;
    },
    onSuccess: (data) => {
      setCustomer(data);
      setNextOfKin(data?.nextOfKins?.[0]);
      setAddress(data?.addresses);
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

  const { mutate: uploadUrlMutate } = useMutation({
    mutationKey: ["upload-file"],
    mutationFn: async (file) => {
      const response = await uploadSingleFile(file);
      return response?.data?.data?.url;
    },
    onSuccess: async (data) => {
      setSelfieFile(data);
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

  const { mutate: updateProfilePictureMutate, isLoading: isLoadingProfile } =
    useMutation({
      mutationKey: ["update profile picture"],
      mutationFn: () => updateProfilePhoto(auth?.user?.id, selfieFile),
      onSuccess: () => {
        showToast({
          title: "Success!",
          type: "success",
          position: "top-right",
          description:
            "Securely updated. You're all set with the new profile picture.",
        });
        setSelfieUrl("");
        refetch();
        setIsOpen(false);
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

  useEffect(() => {
    if (address?.[0]?.county) {
      const selected = counties?.find((c) => c.county === address?.[0]?.county);
      setSubCounties(selected?.sub_counties ?? subCounties);
    }
  }, [counties, address, subCounties]);

  const handleUpdateProfilePhoto = () => {
    updateProfilePictureMutate();
  };

  return (
    <>
      <EditProfile
        isOpen={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        customer={customer}
      />
      <EditNextOfKin
        isOpen={showEditKin}
        onClose={() => setShowEditKin(false)}
        customer={customer}
        refetch={refetch}
      />
      <EditAddress
        isOpen={showEditAddress}
        onClose={() => setShowEditAddress(false)}
        customer={customer}
        counties={counties}
        subCounties={subCounties}
        countries={countries}
        setCounties={setCounties}
        setSubCounties={setSubCounties}
        setCountries={setCountries}
        state={states}
        refetch={refetch}
      />
      <EditFinancialDetails
        isOpen={showEditFinancials}
        onClose={() => setShowEditFinancials(false)}
        customer={customer}
        refetch={refetch}
      />
      {isLoading ? (
        <ProfileLoader />
      ) : (
        <div className="max-w-6xl sm:px-4 mx-auto bg-slate-50 pb-20 pt-2 font-sans">
          <div className="w-full mx-auto space-y-6">
            {/* TOP SECTION: SIDE-BY-SIDE */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* PROFILE SUMMARY CARD (4 Cols) */}
              <div className="lg:col-span-4 bg-primary rounded-[32px] p-8 shadow-xl shadow-blue-900/20 flex flex-col items-center justify-center text-center">
                <div className="relative group">
                  <div className="w-28 h-28 rounded-full border-4 border-blue-400/30 overflow-hidden bg-white/10 flex items-center justify-center">
                    {customer?.profile_photo ? (
                      <img
                        src={customer?.profile_photo}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={50} className="text-blue-200" />
                    )}
                  </div>
                  <button
                    onClick={() => setIsOpen(true)}
                    className="absolute bottom-0 right-0 w-9 h-9 bg-secondary text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-all border-4 border-primary"
                  >
                    <Camera size={16} />
                  </button>
                </div>
                <h2 className="mt-4 text-xl font-black text-white">
                  {customer?.firstname} {customer?.lastname}
                </h2>
                <p className="text-blue-200 text-xs font-medium opacity-80 mt-1">
                  {customer?.email}
                </p>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-white/10 px-4 py-1.5 rounded-full mt-6">
                  ID: {customer?.public_id}
                </span>
              </div>

              {/* MAIN PERSONAL INFO CARD (8 Cols) */}
              <div className="lg:col-span-8">
                <InfoCard
                  title="Personal Information"
                  icon={<User size={18} />}
                  fullHeight
                  onEdit={() => setShowEditProfile(true)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    <DataField label="First Name" value={customer?.firstname} />
                    <DataField label="Last Name" value={customer?.lastname} />
                    <DataField
                      label="Phone Number"
                      value={customer?.mobileno}
                    />
                    <DataField
                      label="Date of Birth"
                      value={formatDate(customer?.dob)}
                    />
                    <DataField
                      label="Country"
                      value={customer?.country_of_residence}
                    />
                    <DataField
                      label="Identification Type"
                      value={customer?.identification_type}
                    />
                    <DataField
                      label="Identification"
                      value={customer?.identification}
                    />
                    <DataField label="Gender" value={customer?.gender} />
                  </div>
                </InfoCard>
              </div>
            </div>

            {/* BOTTOM SECTION: SIDE-BY-SIDE GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoCard
                onEdit={() => setShowEditAddress(true)}
                title="Residential Address"
                icon={<MapPin size={18} />}
              >
                <div className="space-y-4">
                  <DataField
                    label="Country of Residence"
                    value={customer?.country_of_residence}
                  />
                  <DataField
                    label="County / City"
                    value={address?.[0]?.county}
                  />
                  <DataField
                    label="Sub County / Town"
                    value={address?.[0]?.subcounty}
                  />
                  <DataField
                    label="Physical Address"
                    value={address?.[0]?.physical_address}
                  />
                </div>
              </InfoCard>

              <InfoCard
                onEdit={() => setShowEditFinancials(true)}
                title="Employment & Financials"
                icon={<Briefcase size={18} />}
              >
                <div className="space-y-4">
                  <DataField label="KRA PIN" value={customer?.kraPin} />
                  <DataField label="Job Title" value={customer?.occupation} />
                  <DataField
                    label="Job Type"
                    value={customer?.employment_type}
                  />
                  <DataField
                    label="Income Range"
                    value={customer?.income_range}
                    isMonetary
                  />
                </div>
              </InfoCard>

              <InfoCard
                onEdit={() => setShowEditKin(true)}
                title="Next of Kin"
                icon={<Heart size={18} />}
              >
                <div className="space-y-4">
                  <DataField label="Full Name" value={nextOfKin?.name} />
                  <DataField
                    label="Relationship"
                    value={nextOfKin?.relationship}
                  />
                  <DataField
                    label="Phone Number"
                    value={nextOfKin?.phoneNumber}
                  />
                  <DataField label="Location" value={nextOfKin?.location} />
                </div>
              </InfoCard>
            </div>

            {/* MODERNISED DISCLAIMER CONTAINER */}
            <section className="bg-white rounded-[32px] p-8 shadow-xl shadow-blue-900/5 border border-slate-100 relative overflow-hidden">
              {/* Subtle background graphic for depth */}
              <div className="absolute -top-10 -right-10 text-slate-100 opacity-30">
                <Scale size={180} strokeWidth={1} />
              </div>

              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 bg-rose-50 rounded-2xl text-rose-500">
                    <UserMinus size={28} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">
                      SACCO Exit Policy
                    </h3>
                    <h2 className="text-xl font-black text-primary">
                      Termination of SACCO Membership
                    </h2>
                  </div>
                </div>

                <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
                  Membership withdrawal is a permanent action. Please review the
                  mandatory requirements below to proceed with your application.
                </p>

                {/* Modern Icon-based requirements checklist */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <RequirementCard
                    icon={<Ban size={20} />}
                    title="No Active Loans"
                    description="Your loan account balance must be zero."
                  />
                  <RequirementCard
                    icon={<Handshake size={20} />}
                    title="No Guarantorship Obligations"
                    description="You must not be guaranteeing any active loans."
                  />
                </div>

                {/* Modernized Policy Note Box */}
                <div className="flex items-start gap-4 p-5 bg-[#F0FFFE] rounded-2xl border border-secondary/20 mt-8">
                  <Info className="text-secondary mt-0.5" size={20} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-bold text-primary">
                      Disbursement of Funds
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Savings and current shares are disbursed within 60 days of
                      approval, following deduction of statutory fees per our
                      policy.
                    </p>
                  </div>
                </div>

                {/* Action Section */}
                <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between gap-6 flex-wrap">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="text-amber-500" size={22} />
                    <p className="text-sm font-medium text-slate-700">
                      <span className="font-bold text-rose-600">
                        This action cannot be reversed.
                      </span>{" "}
                      Ensure you have met all requirements.
                    </p>
                  </div>
                  <button className="flex items-center gap-2.5 px-8 py-4 bg-rose-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-rose-600/20 hover:bg-rose-700 hover:scale-[1.02] transition-all">
                    Submit Exit Application
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* MODAL remains the same but with slightly tightened padding */}
          {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <div
                className="absolute inset-0 bg-primary/40 bg-slate-900/40"
                onClick={() => setIsOpen(false)}
              />
              <div className="relative bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-6 right-6 text-slate-400 hover:text-rose-500"
                >
                  <X size={20} />
                </button>
                <div className="text-center">
                  <h3 className="text-lg font-black text-primary mb-6">
                    Update Profile Photo
                  </h3>
                  <div className="w-40 h-40 rounded-full bg-slate-50 mx-auto mb-6 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                    {selfieUrl ? (
                      <img
                        src={selfieUrl}
                        className="w-full h-full object-cover"
                        alt="Preview"
                      />
                    ) : (
                      <Upload size={32} className="text-slate-300" />
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setUploading(true);
                        setTimeout(() => {
                          setSelfieUrl(URL.createObjectURL(file));
                          uploadUrlMutate(file);
                          setSelfieFile(file);
                          setUploading(false);
                        }, 1000);
                      }
                    }}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="text-xs font-bold text-secondary underline underline-offset-4"
                  >
                    {uploading ? "Processing..." : "Choose image from device"}
                  </button>
                  <button
                    onClick={handleUpdateProfilePhoto}
                    disabled={!selfieUrl || isLoadingProfile}
                    className="w-full mt-8 h-14 rounded-xl font-bold bg-primary text-white flex items-center justify-center gap-2 transition-all hover:bg-[#062d7a] active:scale-[0.98] disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                  >
                    {isLoadingProfile ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        <span>Updating...</span>
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

const RequirementCard = ({ icon, title, description }) => (
  <div className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100">
    <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-rose-500">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-primary text-sm leading-tight">{title}</h4>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    </div>
    <div className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-600">
      Pending Verification
    </div>
  </div>
);

// --- SUB-COMPONENTS ---

const InfoCard = ({ title, icon, children, fullHeight, onEdit }) => (
  <div
    className={`bg-white rounded-[28px] p-6 border border-slate-100 shadow-sm flex flex-col ${fullHeight ? "h-full" : ""}`}
  >
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2.5">
        <div className="p-2 bg-blue-50 text-secondary rounded-lg">{icon}</div>
        <h3 className="text-[12px] font-black uppercase tracking-wider text-primary">
          {title}
        </h3>
      </div>
      <button
        onClick={onEdit}
        className="p-1.5 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
      >
        <Edit3 size={16} />
      </button>
    </div>
    <div className="flex-grow">{children}</div>
  </div>
);

const DataField = ({ label, value, isMonetary }) => (
  <div className="group">
    <p className="text-[9px] font-black uppercase tracking-[0.1em] text-slate-400 mb-0.5 group-hover:text-secondary transition-colors">
      {label}
    </p>
    <p
      className={`text-[13px] font-bold text-primary ${isMonetary ? "font-mono" : ""}`}
    >
      {value || "—"}
    </p>
  </div>
);

export default ProfilePage;

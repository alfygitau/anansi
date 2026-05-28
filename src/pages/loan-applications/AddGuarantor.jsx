import { useState } from "react";
import {
  Trash2,
  Search,
  ArrowRight,
  User,
  Fingerprint,
  Gavel,
  History,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "react-query";
import {
  addApplicationGuarantors,
  applicationGuarantors,
} from "../../sdks/guarantors/guarantor";
import { useToast } from "../../contexts/ToastProvider";
import { getLoanProduct } from "../../sdks/loans/loans";

const AddGuarantors = ({ limit = 4 }) => {
  const [guarantors, setGuarantors] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const navigate = useNavigate();
  const { productId, appId } = useParams();
  const { showToast } = useToast();
  const [errors, setErrors] = useState({ memberName: "", mobileNumber: "" });
  const [requireCollateral, setRequireCollateral] = useState(false);
  const [requireGuarantors, setRequireGuarantors] = useState(false);
  const [requireStatements, setRequireStatements] = useState(false);
  const [numberOfGuarantors, setNumberOfGuarantors] = useState(0);
  const [loanProduct, setLoanProduct] = useState({});

  const handleNameBlur = () => {
    let errorMsg = "";
    const trimmedName = memberName.trim();

    if (!trimmedName) {
      errorMsg = "Member name is mandatory to execute registry verification.";
    } else if (trimmedName.length < 3) {
      errorMsg = "Please supply a valid search term (minimum 3 characters).";
    }

    setErrors((prev) => ({ ...prev, memberName: errorMsg }));
  };

  const handleMobileBlur = () => {
    let errorMsg = "";
    const trimmedMobile = mobileNumber.trim();
    const phoneRegex = /^(?:254|\+254|0)?(7|1)\d{8}$/;

    if (!trimmedMobile) {
      errorMsg = "Mobile connection number is required for guarantor search.";
    } else if (!phoneRegex.test(trimmedMobile)) {
      errorMsg =
        "Please enter a valid mobile number (e.g., 0712345678 or 07XXXXXXXX).";
    }

    setErrors((prev) => ({ ...prev, mobileNumber: errorMsg }));
  };

  const isFormValid = () => {
    const trimmedName = memberName.trim();
    const trimmedMobile = mobileNumber.trim();
    const phoneRegex = /^(?:254|\+254|0)?(7|1)\d{8}$/;

    return (
      trimmedName.length >= 3 &&
      phoneRegex.test(trimmedMobile) &&
      !errors.memberName &&
      !errors.mobileNumber
    );
  };

  const { isFetching } = useQuery({
    queryKey: ["explore product", productId],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await getLoanProduct(productId);
      return response?.data?.data;
    },
    onSuccess: (data) => {
      setLoanProduct(data);
      setRequireGuarantors(data?.requires_guarantor);
      setRequireCollateral(data?.requires_collateral);
      setRequireStatements(data?.require_statement);
      setNumberOfGuarantors(data?.min_guarantors);
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

  const { mutate, isLoading } = useMutation({
    mutationKey: ["add guarantors"],
    mutationFn: async () => {
      const response = await addApplicationGuarantors(
        appId,
        memberName,
        mobileNumber,
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      refetch();
      setMemberName("");
      setMobileNumber("");
      showToast({
        title: "Guarantor Linked Successfully",
        type: "success",
        position: "top-right",
        description: `Guarantor has been added to the validation queue.`,
      });
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

  const { refetch, isFetching: fetchingGuarantors } = useQuery({
    queryKey: ["get guarantors"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await applicationGuarantors(appId);
      return response.data.data;
    },
    onSuccess: (data) => {
      setGuarantors(data?.guarantors);
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

  const handleAddGuarantor = async (e) => {
    e.preventDefault();
    await mutate();
  };

  return (
    <div className="w-full text-primary antialiased">
      <main className="max-w-6xl mx-auto">
        <header className="space-y-2 mb-4">
          <h1 className="text-2xl font-medium tracking-tight text-primary">
            Nominate Guarantors
          </h1>
          <div className="space-y-2">
            <p className="text-slate-500 text-base leading-relaxed">
              Nominate eligible members to act as guarantors for your credit
              facility. Once submitted, your nominees will receive a secure
              digital invitation via the Anansi portal to review your
              application details, verify their available shares, and provide
              legal authorization for the request.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Real-time Validation
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Digital Consent
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Instant Notification
                </span>
              </div>
            </div>
          </div>
        </header>
        <div className="grid grid-cols-1 mb-2 lg:grid-cols-12 gap-8">
          {/* --- LEFT SIDE: CONFIGURATION (7 Cols) --- */}
          <div className="lg:col-span-6 space-y-12">
            <div className="bg-white h-[420px] border border-slate-200 rounded-[32px] p-8 space-y-8">
              <div className="flex items-center gap-3 text-primary">
                <Search size={18} />
                <h3 className="text-[11px] font-medium uppercase tracking-[0.2em]">
                  Registry Search
                </h3>
              </div>

              {/* Search Form Wrapper */}
              <div className="flex items-start">
                <form
                  onSubmit={handleAddGuarantor}
                  className="space-y-6 w-full"
                >
                  <div className="flex flex-col gap-4">
                    {/* 1. MEMBER NAME INPUT SECTION */}
                    <div className="space-y-1 relative pb-4">
                      <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-1">
                        Member Name
                      </label>
                      <div className="group relative flex items-center">
                        <div className="absolute left-4 h-7 flex items-center pr-3 border-r border-slate-200 group-focus-within:border-primary/30 transition-colors">
                          <User size={18} className="text-slate-300" />
                        </div>
                        <input
                          type="text"
                          value={memberName}
                          onChange={(e) => {
                            setMemberName(e.target.value);
                            if (errors.memberName)
                              setErrors((prev) => ({
                                ...prev,
                                memberName: "",
                              }));
                          }}
                          onBlur={handleNameBlur}
                          className={`w-full h-14 pl-16 bg-white border rounded-xl outline-none transition-all font-semibold text-sm ${
                            errors.memberName
                              ? "border-rose-500 focus:border-rose-600 shadow-sm shadow-rose-900/[0.02]"
                              : "border-slate-200 focus:border-primary"
                          }`}
                          placeholder="Search name..."
                        />
                      </div>
                      {/* Absolute Error Placeholder: Prevents layout shifting */}
                      <div className="absolute left-1 bottom-[-1px] h-4 overflow-visible">
                        <p
                          className={`text-[10px] font-bold text-rose-500 transition-opacity duration-200 ${errors.memberName ? "opacity-100" : "opacity-0"}`}
                        >
                          {errors.memberName}
                        </p>
                      </div>
                    </div>

                    {/* 2. MOBILE NUMBER INPUT SECTION */}
                    <div className="space-y-1 relative pb-4">
                      <label className="text-[10px] font-medium uppercase tracking-widest text-slate-400 ml-1">
                        Mobile Number
                      </label>
                      <div className="group relative flex items-center">
                        <div className="absolute left-4 h-6 flex items-center pr-3 border-r border-slate-200 group-focus-within:border-primary/30 transition-colors">
                          <Fingerprint size={18} className="text-slate-300" />
                        </div>
                        <input
                          type="text"
                          value={mobileNumber}
                          onChange={(e) => {
                            setMobileNumber(e.target.value);
                            if (errors.mobileNumber)
                              setErrors((prev) => ({
                                ...prev,
                                mobileNumber: "",
                              }));
                          }}
                          onBlur={handleMobileBlur}
                          className={`w-full h-14 pl-16 bg-white border rounded-xl outline-none transition-all font-semibold text-sm ${
                            errors.mobileNumber
                              ? "border-rose-500 focus:border-rose-600 shadow-sm shadow-rose-900/[0.02]"
                              : "border-slate-200 focus:border-primary"
                          }`}
                          placeholder="e.g. 0700000000"
                        />
                      </div>
                      {/* Absolute Error Placeholder: Prevents layout shifting */}
                      <div className="absolute left-1 bottom-[-1px] h-4 overflow-visible">
                        <p
                          className={`text-[10px] font-bold text-rose-500 transition-opacity duration-200 ${errors.mobileNumber ? "opacity-100" : "opacity-0"}`}
                        >
                          {errors.mobileNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 3. DYNAMIC VERIFICATION SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={!isFormValid() || isLoading}
                    className="w-full h-16 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-secondary transition-all shadow-xl shadow-primary/10 disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    {isLoading
                      ? "Validating Registry..."
                      : "Verify & Add to Queue"}
                    <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {guarantors?.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-[420px] border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center text-center p-8"
                  >
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <UserPlus size={24} className="text-slate-200" />
                    </div>
                    <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
                      Your queue is empty
                    </p>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Search and verify members on the left to add them to your
                      application.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-[420px] border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col gap-2 text-center p-3 overflow-y-auto"
                  >
                    {fetchingGuarantors
                      ? Array.from({ length: 4 }).map((_, idx) => (
                          <GuarantorRowSkeleton key={idx} />
                        ))
                      : guarantors?.map((g) => (
                          <motion.div
                            key={g.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{
                              opacity: 0,
                              scale: 0.95,
                              transition: { duration: 0.2 },
                            }}
                            className="group bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between hover:border-slate-300 hover:bg-white hover:shadow-sm transition-all duration-200"
                          >
                            {/* LEFT: AVATAR & CREDENTIAL DATA FIELDS */}
                            <div className="flex items-center gap-4 flex-1">
                              {/* Minimalist Premium Initial Avatar */}
                              <div className="size-10 bg-white border border-slate-200/60 rounded-xl flex items-center justify-center text-slate-700 font-medium text-sm shadow-sm select-none shrink-0">
                                {g.guarantor_name.charAt(0).toUpperCase()}
                              </div>

                              {/* Metadata Rows */}
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-slate-900 text-sm tracking-tight">
                                    {g.guarantor_name}
                                  </h4>
                                  <CheckCircle2
                                    size={14}
                                    className="text-emerald-500 shrink-0"
                                  />
                                </div>

                                {/* ALIGNED DETAILS ROW */}
                                <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-widest text-slate-400">
                                  <span className="flex items-center gap-1">
                                    <Smartphone
                                      size={12}
                                      className="text-slate-300"
                                    />
                                    TEL:{" "}
                                    <span className="text-slate-600 font-bold">
                                      {g?.guarantor_mobile}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* RIGHT: ACTION PANEL (Hides natively until hovered) */}
                            <div className="transition-opacity duration-200 pl-4">
                              <button
                                type="button"
                                className="p-2 rounded-xl bg-white border border-slate-200/60 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50/50 transition-all shadow-sm flex items-center justify-center"
                                title="Remove this guarantor"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        {/* --- RIGHT SIDE: QUEUE (5 Cols) --- */}
        <div>
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <History size={16} className="text-slate-400" />
              <h3 className="text-[11px] font-medium uppercase text-slate-400">
                Assignment Queue
              </h3>
            </div>
            <span className="text-[10px] font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
              {guarantors?.length} / {numberOfGuarantors} SELECTED
            </span>
          </div>
          {/* Bottom Actions */}
          <div className="pt-5 mb-8 space-y-6">
            <div className="flex gap-4 p-2 bg-amber-50/40 border border-amber-100 rounded-2xl items-center">
              <AlertCircle size={20} className="text-amber-500 shrink-0" />
              <div className="space-y-1">
                <span className="text-[10px] font-medium uppercase tracking-widest text-amber-900">
                  Important Notice
                </span>
                <p className="text-[11px] leading-relaxed text-amber-800 font-medium">
                  Nominated members must electronically sign and ratify this
                  guarantee indemnity agreement via the Anansi secure member
                  portal within 48 hours of issuance. Unsigned payloads
                  automatically expire, requiring full configuration
                  re-submission.
                </p>
              </div>
            </div>

            {(() => {
              // Only evaluate routing buttons if the minimum guarantor target has been met
              if (guarantors?.length >= numberOfGuarantors) {
                // 1. PATH A: Still requires Collateral Upload step
                if (requireCollateral) {
                  return (
                    <button
                      type="button"
                      onClick={() => navigate(`/collateral-registry/${appId}`)}
                      className="w-full h-16 bg-[#1A1C1E] text-white rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-900/10 group animate-fade-in"
                    >
                      Send Invites & Proceed to Collateral
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  );
                }

                // 2. PATH B: Collateral skipped, but requires Bank/Mobile Statements step
                if (requireStatements) {
                  return (
                    <button
                      type="button"
                      onClick={() => navigate(`/add-statements/${appId}`)}
                      className="w-full h-16 bg-[#1A1C1E] text-white rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-900/10 group animate-fade-in"
                    >
                      Send Invites & Proceed to Statements
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  );
                }

                // 3. PATH C: Default / Fallback—Review Terms and Conditions
                return (
                  <button
                    type="button"
                    onClick={() => navigate(`/loan-terms-conditions/${appId}`)}
                    className="w-full h-16 bg-[#1A1C1E] text-white rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-900/10 group animate-fade-in"
                  >
                    Review Terms & Apply
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                );
              }

              // Fallback return when criteria are not yet fulfilled
              return null;
            })()}
          </div>
        </div>
        {/* Regulatory & Security Detail Section */}
        <div className="flex items-start gap-5 w-full">
          <InfoBlock
            icon={<ShieldCheck size={20} className="text-[#005C53]" />}
            title="Privacy & Data Encapsulation"
            text={
              <>
                We utilize{" "}
                <span className="text-slate-900 font-semibold">
                  AES-256 bit encryption
                </span>{" "}
                to shield member financial data. Your nominees' share balances
                and contribution history remain strictly confidential and are
                only revealed to the system's credit engine once they provide
                explicit digital consent through the secure portal.
              </>
            }
          />
          <InfoBlock
            icon={<Gavel size={20} className="text-[#005C53]" />}
            title="Collateral & Lien Protocol"
            text={
              <>
                By nominating a member, you initiate a{" "}
                <span className="text-slate-900 font-semibold">
                  conditional lien
                </span>{" "}
                request. Upon their approval, an amount equivalent to the
                guaranteed portion is legally earmarked within their savings.
                This ensures compliance with Sacco bylaws while protecting the
                mutual interests of all participating members.
              </>
            }
          />
        </div>
      </main>
    </div>
  );
};

const InfoBlock = ({ icon, title, text }) => (
  <div className="flex items-center border p-3 rounded-xl gap-4">
    <div className="shrink-0">{icon}</div>
    <div className="space-y-1">
      <h4 className="text-[10px] font-medium uppercase tracking-widest text-slate-800">
        {title}
      </h4>
      <p className="text-[11px] text-slate-500 leading-normal font-medium">
        {text}
      </p>
    </div>
  </div>
);

const GuarantorRowSkeleton = () => {
  return (
    <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl flex items-center justify-between animate-pulse select-none h-[74px] w-full">
      {/* LEFT: AVATAR & CREDENTIAL DATA FIELDS PLACEHOLDER */}
      <div className="flex items-center gap-4 flex-1">
        {/* Minimalist Avatar Box Mock */}
        <div className="w-10 h-10 bg-slate-200 border border-slate-200/20 rounded-xl shrink-0" />

        {/* Metadata Rows Mock */}
        <div className="space-y-2 flex-1">
          {/* Name & Verification Badge Line */}
          <div className="flex items-center gap-2">
            <div className="h-4 bg-slate-200 rounded-md w-1/3" />
            <div className="w-3.5 h-3.5 bg-slate-100 rounded-full shrink-0" />
          </div>

          {/* Aligned Telephone Subtext Line */}
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-slate-100 rounded shrink-0" />
            <div className="h-2.5 bg-slate-100 rounded w-1/4" />
          </div>
        </div>
      </div>

      {/* RIGHT: ACTION PANEL BUTTON MOCK */}
      <div className="pl-4">
        <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/40 shrink-0" />
      </div>
    </div>
  );
};

export default AddGuarantors;

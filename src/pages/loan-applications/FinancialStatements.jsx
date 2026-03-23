import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  Trash2,
  ShieldCheck,
  Lock,
  AlertCircle,
  Smartphone,
  Building2,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import { uploadStatements } from "../../sdks/loans/loans";

const FinancialStatements = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeModal, setActiveModal] = useState(null);
  // Lists
  const [statements, setStatements] = useState([]);
  const [bankStatements, setBankStatements] = useState([]);
  // Form State
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const fileInputRef = useRef(null);

  const { mutate: uploadMutation, isLoading: isUploading } = useMutation({
    mutationKey: ["upload statements"],
    mutationFn: ({ file, type, password }) =>
      uploadStatements(file, type, password),
    onSuccess: (data, variables) => {
      const { file, type, password } = variables;
      const newEntry = {
        file,
        password,
        uploadedAt: new Date(),
        id: data?.data?.id,
      };
      if (type === "mpesa") {
        setStatements((prev) => [...prev, newEntry]);
      } else {
        setBankStatements((prev) => [...prev, newEntry]);
      }
      showToast({
        title: "Statement Verified",
        position: "top-right",
        description: `Successfully processed your ${type.toUpperCase()} file.`,
        type: "success",
      });
      closeModal();
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message ||
        "Verification failed. Check your file and password.";
      showToast({
        title: "Upload Error",
        position: "top-right",
        description: errorMessage,
        type: "error",
      });
    },
  });

  const closeModal = () => {
    setActiveModal(null);
    setFile(null);
    setPassword("");
  };

  const handleUpload = () => {
    if (!file) return;
    uploadMutation({ file, type: activeModal, password });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <div className="max-w-6xl sm:px-3 mx-auto overflow-hidden">
        {/* Header Section */}
        <div className="py-4 border-b border-slate-50">
          <h1 className="text-2xl mb-2 font-black text-[#042159] uppercase tracking-tight">
            Financial Verification
          </h1>
          <div className="space-y-2">
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Your financial privacy is our highest priority. All uploaded
              statements are processed through an automated, end-to-end
              encrypted pipeline using **AES-256 bit protocols**.
            </p>
            <p className="text-[14px] text-slate-500 leading-relaxed">
              Our system performs a programmatic analysis of high-level cash
              flow patterns and liquidity ratios to determine loan eligibility.
              In strict compliance with the **Kenya Data Protection Act
              (2019)**, individual transaction descriptions, counterparty names,
              and personal spending habits are never indexed, stored in plain
              text, or made visible to Anansi staff or third-party credit
              committees. Once the automated verification is complete, the
              temporary processing files are purged from our active memory.
            </p>
          </div>
        </div>

        <div className="py-4 space-y-8">
          {/* Disclaimer / Info Box */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-4">
            <ShieldCheck className="text-[#4DB8E4] shrink-0" size={24} />
            <div>
              <h4 className="text-[11px] font-black text-[#042159] uppercase tracking-widest mb-1">
                Privacy Guarantee
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your statements are processed using automated 256-bit
                encryption. We analyze cash flow patterns only; Anansi agents
                never view individual private transactions.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatementSection
              title="M-PESA Statements"
              icon={<Smartphone size={20} />}
              data={statements}
              onUpload={() => setActiveModal("mpesa")}
              onDelete={(i) =>
                setStatements(statements.filter((_, idx) => idx !== i))
              }
            />
            <StatementSection
              title="Bank Statements"
              icon={<Building2 size={20} />}
              data={bankStatements}
              onUpload={() => setActiveModal("bank")}
              onDelete={(i) =>
                setBankStatements(bankStatements.filter((_, idx) => idx !== i))
              }
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => navigate("/collateral-registry")}
              className="h-14 w-full md:w-[240px] bg-[#074073] text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-blue-900/20 transition-all active:scale-[0.98]"
            >
              Continue Application
            </button>
          </div>
        </div>
      </div>

      {/* Side Drawer Modal */}
      <AnimatePresence>
        {activeModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-[#042159]/40 backdrop-blur-sm z-20"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[450px] bg-white shadow-2xl z-[90] flex flex-col p-8"
            >
              <div className="flex-1 overflow-y-auto">
                <h3 className="text-xl font-black text-[#042159] uppercase tracking-tight mb-2">
                  Upload {activeModal === "mpesa" ? "M-PESA" : "Bank"} Statement
                </h3>
                <p className="text-sm text-slate-500 mb-8">
                  Ensure the PDF covers at least 6 months of activity.
                </p>

                {/* Dropzone */}
                <div
                  onClick={() => fileInputRef.current.click()}
                  className={`border-2 border-dashed rounded-[24px] p-8 transition-all flex flex-col items-center justify-center cursor-pointer mb-6
                    ${file ? "border-green-200 bg-green-50/30" : "border-slate-200 bg-slate-50 hover:border-[#4DB8E4]"}
                  `}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <div
                    className={`p-4 rounded-full mb-4 ${file ? "bg-green-100 text-green-600" : "bg-white text-slate-400 shadow-sm"}`}
                  >
                    {file ? <ShieldCheck size={32} /> : <Upload size={32} />}
                  </div>
                  <p className="text-sm font-bold text-slate-700">
                    {file ? file.name : "Tap to browse or drag file here"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 uppercase font-black tracking-widest">
                    PDF format only
                  </p>
                </div>

                {/* Password Input */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-[#4DB8E4]" />
                    <label className="text-xs font-black text-[#042159] uppercase tracking-widest">
                      Document Password
                    </label>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter file password if protected"
                    className="w-full h-14 px-5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[#4DB8E4] focus:ring-4 focus:ring-[#4DB8E4]/5 transition-all outline-none"
                  />
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex gap-3">
                    <AlertCircle
                      size={14}
                      className="text-slate-400 shrink-0"
                    />
                    <p className="text-[10px] text-slate-500 leading-tight">
                      This password is encrypted and never stored on our servers
                      after the file is opened.
                    </p>
                  </div>
                </div>
              </div>

              <button
                disabled={!file || isUploading}
                onClick={handleUpload}
                className="w-full h-16 bg-[#042159] text-white rounded-[20px] font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 mt-6"
              >
                {isUploading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Verify & Upload"
                )}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatementSection = ({ title, icon, data, onUpload, onDelete }) => (
  <div className="flex flex-col h-full">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2 text-[#042159]">
        {icon}
        <h3 className="text-sm font-black uppercase tracking-widest">
          {title}
        </h3>
      </div>
      {data.length > 0 && (
        <button
          onClick={onUpload}
          className="text-[11px] font-black text-[#4DB8E4] uppercase hover:underline"
        >
          Add More
        </button>
      )}
    </div>

    <div className="flex-1 min-h-[220px] bg-white border border-slate-200 rounded-[24px] bg-slate-50/30 p-4">
      {data.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-6">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 mb-4">
            <FileText size={24} />
          </div>
          <p className="text-xs text-slate-400 font-medium mb-4">
            No statements attached yet.
          </p>
          <button
            onClick={onUpload}
            className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-[11px] font-black uppercase text-[#042159] hover:bg-[#042159] hover:text-white transition-all shadow-sm"
          >
            Upload Now
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((item, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#074073]">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 truncate max-w-[150px]">
                    {item.file.name}
                  </p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
                    Verified • PDF
                  </p>
                </div>
              </div>
              <button
                onClick={() => onDelete(i)}
                className="p-2 text-rose-400 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default FinancialStatements;

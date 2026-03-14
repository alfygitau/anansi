import { useState } from "react";
import { X, Info } from "lucide-react";

const SharesAmount = ({ isOpen, onClose, onConfirm, initialMobile }) => {
  const [numberShares, setNumberShares] = useState("0");
  const [mobile, setMobile] = useState("");

  if (!isOpen) return null;

  const calculateUnits = () => {
    const units = Number(numberShares) / 1000;
    return new Intl.NumberFormat("en-KE", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 4,
    }).format(units);
  };

  const handleSave = () => {
    onConfirm({
      sharesAmount: Number(numberShares),
      mobile: mobile,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#074073]/40 backdrop-blur-sm">
      {/* Centered Modal */}
      <div className="bg-white relative w-full max-w-[500px] rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="text-gray-400 absolute top-5 right-5 hover:text-gray-900"
        >
          <X size={20} />
        </button>
        {/* Header */}
        <div className="px-8 pt-8 pb-2">
          <h2 className="text-center text-xl font-bold text-[#074073]">
            Buy Shares
          </h2>
          <p className="text-sm text-center text-slate-500 mt-1">
            Invest in your future by increasing your stake in the SACCO.
          </p>
        </div>

        {/* Body */}
        <div className="p-8 space-y-10">
          {/* Share Calculation Section */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                Purchase Cost (KES)
              </label>
              <div className="h-12 flex items-center bg-white border border-gray-200 rounded-xl focus-within:border-[#074073] transition-all">
                <input
                  type="number"
                  value={numberShares}
                  onChange={(e) => setNumberShares(e.target.value)}
                  className="w-full h-full px-4 rounded-xl outline-none text-sm font-semibold"
                  placeholder="e.g. 5000"
                />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                Units to Receive
              </label>
              <div className="h-12 flex items-center justify-center bg-[#F0F7FF] border border-[#D1E9FF] rounded-xl">
                <p className="text-sm font-bold text-[#074073]">
                  {calculateUnits()}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Tooltip */}
          <div className="flex items-center gap-2 text-[11px] text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <Info size={14} />
            <span>
              Currently, <strong>1 Share = KES 1,000</strong>
            </span>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">
                Pay with
              </h4>
              <img src="/mpesa.svg" className="h-6" alt="M-PESA" />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                M-PESA Phone Number
              </label>
              <div className="flex h-12 border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#074073] transition-all">
                <div className="bg-gray-50 px-4 flex items-center justify-center border-r border-gray-200 text-[10px] font-bold text-gray-500 uppercase">
                  Mobile
                </div>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g 0722000000"
                  className="flex-1 px-4 outline-none text-sm font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-8 pt-0">
          <button
            onClick={handleSave}
            className="w-full h-14 bg-[#074073] hover:bg-[#052d52] text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98]"
          >
            Review and Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default SharesAmount;

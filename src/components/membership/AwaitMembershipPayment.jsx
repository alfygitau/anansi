import { useState, useEffect, useRef } from "react";
import { X, ShieldCheck, Smartphone, CheckCircle2 } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import { useMutation, useQuery } from "react-query";
import { useToast } from "../../contexts/ToastProvider";
import {
  confirmMembership,
  updateMembership,
} from "../../sdks/membership/membership";

const AwaitingMembershipPayment = ({
  isOpen,
  onClose,
  onNext,
  reference,
  refetch,
  onFail,
}) => {
  const { auth } = useAuth();
  const { showToast } = useToast();

  useQuery({
    queryKey: ["poll membership"],
    queryFn: async () => {
      const response = await confirmMembership();
      return response.data.data.exists;
    },
    enabled: !!isOpen,
    onSuccess: async (data) => {
      if (data) {
        await updateMembershipMutate();
      }
    },
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
    onErrors: (error) => {
      showToast({
        title: "Authentication glitch",
        type: "error",
        position: "top-right",
        description: error?.response?.data?.message || error.message,
      });
      onFail();
    },
  });

  const { mutate: updateMembershipMutate } = useMutation({
    mutationKey: ["update membership"],
    mutationFn: () => updateMembership(auth?.user?.id, auth?.user?.status),
    onSuccess: () => {
      showToast({
        title: "Payment Confirmed",
        description: "Your membership is now active. Let's get started!",
        type: "success",
        position: "top-right",
        duration: 5000,
      });
      refetch();
      onNext();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#074073]/40 backdrop-blur-md">
      <div className="bg-white relative w-full max-w-[480px] rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="text-gray-400 absolute right-5 top-5 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
        {/* Header Section */}
        <div className="px-8 pt-8"></div>

        {/* Success Banner */}
        <div className="px-8 my-6">
          <div className="bg-green-50 border border-green-100 rounded-2xl p-4 flex items-center gap-4">
            <div className="bg-green-500 p-2 rounded-full">
              <CheckCircle2 className="text-white" size={20} />
            </div>
            <div>
              <p className="text-green-800 font-bold text-sm">
                Initiated Successfully!
              </p>
              <p className="text-green-700/70 text-xs">
                Authorize the M-PESA prompt on your phone.
              </p>
            </div>
          </div>
        </div>

        {/* Modern Animation Section */}
        <div className="flex flex-col items-center justify-center py-10">
          <div className="relative mb-8">
            {/* Pulsing Rings */}
            <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping"></div>
            <div className="absolute inset-[-15px] rounded-full bg-green-500/10 animate-[ping_2s_linear_infinite]"></div>

            {/* Center Icon */}
            <div className="relative bg-white p-6 rounded-full border-4 border-green-50 shadow-sm">
              <Smartphone size={40} className="text-green-600 animate-bounce" />
            </div>
          </div>

          <div className="text-center mt-6 px-12">
            <h3 className="text-[#074073] font-bold mb-2">
              Awaiting Verification
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Hang tight! We’re communicating with M-PESA to confirm your
              payment.
            </p>
          </div>
        </div>

        {/* Checklist Section */}
        <div className="px-8 pb-10">
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <p className="text-[11px] font-bold text-[#074073] uppercase tracking-widest mb-4">
              Ensure that:
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="bg-green-100 p-1 rounded-full">
                  <ShieldCheck size={14} className="text-green-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  Your M-PESA SIM is active and has signal.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-green-100 p-1 rounded-full">
                  <ShieldCheck size={14} className="text-green-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  You enter the correct PIN in the STK Push.
                </span>
              </li>
            </ul>
          </div>

          <p className="text-center text-[10px] text-gray-400 mt-6 italic">
            Reference: {reference || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AwaitingMembershipPayment;

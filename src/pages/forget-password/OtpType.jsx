import React, { useState } from "react";
import {
  Lock,
  Smartphone,
  Mail,
  Info,
  ShieldCheck,
  KeyRound,
  Fingerprint,
} from "lucide-react";

export default function AccountRecoveryType() {
  const [selectedMethod, setSelectedMethod] = useState("");

  const handleContinue = () => {
    if (!selectedMethod) return;
    console.log("Navigating to recovery with method:", selectedMethod);
    // Execute programmatic navigation/router events here
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8 sm:p-2 antialiased">
      {/* Centralized Card Container Chassis */}
      <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-[28px] shadow-[0_12px_40px_-12px_rgba(7,64,115,0.06)] border border-slate-100 overflow-hidden">
        {/* LEFT PANEL: Security & Context (Hidden on Mobile/Tablet, visible on lg screens) */}
        <div className="hidden lg:flex bg-[#074073]/[0.02] border-r border-slate-100/80 flex-col justify-between p-12">
          <div className="space-y-8">
            {/* Sacco Branding Header Tag */}
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-[#074073] flex items-center justify-center text-white font-bold text-xs">
                A
              </div>
              <span className="text-xs font-bold text-[#074073] tracking-widest uppercase">
                Anansi Sacco
              </span>
            </div>

            {/* Core Security Value Proposition */}
            <div className="space-y-4 max-w-sm pt-4">
              <h1 className="text-3xl font-extrabold text-[#074073] tracking-tight leading-[1.2]">
                Securing Your Digital Wealth.
              </h1>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed">
                We employ military-grade multi-factor isolation parameters to
                protect your financial footprint and membership integrity.
              </p>
            </div>

            {/* System Security Features Ledger */}
            <div className="space-y-6 pt-2">
              <SecurityFeatureRow
                icon={<ShieldCheck size={16} />}
                title="End-to-End Cryptographic Isolation"
                desc="Every single channel handshake is encrypted using advanced RSA keys."
              />
              <SecurityFeatureRow
                icon={<KeyRound size={16} />}
                title="Timed One-Time Tokens"
                desc="Verification payloads automatically decay inside a strict 120-second window."
              />
              <SecurityFeatureRow
                icon={<Fingerprint size={16} />}
                title="Tamper Protection Engine"
                desc="Suspicious routing instantly halts distribution to safeguard account access."
              />
            </div>
          </div>

          {/* Security Compliance Footer Label */}
          <p className="text-[10px] text-slate-400 font-medium tracking-wide pt-6">
            Anansi Sacco Security Core • System Version 2026.4
          </p>
        </div>

        {/* RIGHT PANEL: OTP Verification Engine */}
        <div className="w-full flex flex-col justify-between p-6 sm:p-10 md:p-12">
          {/* Main Contents Wrapper */}
          <div className="space-y-8 flex-grow">
            {/* Header Section */}
            <div className="flex items-center gap-3">
              <div className="w-fit p-3 bg-[#074073]/[0.05] border border-[#074073]/10 rounded-[16px] text-[#074073] flex items-center justify-center">
                <Lock size={24} className="stroke-[2.25]" />
              </div>
              <h2 className="text-2xl font-black text-[#074073] tracking-tight">
                Account Recovery
              </h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[13px] text-slate-400 font-medium leading-relaxed">
                  To protect your account, choose a verification method to
                  receive a one-time security code.
                </p>
              </div>
            </div>

            {/* Interactive OTP Methods Section Container */}
            <div className="space-y-3.5">
              {/* Method Option: Mobile SMS */}
              <InteractiveOtpRow
                title="Mobile Phone (SMS)"
                description="We'll send a code directly to your registered phone number via SMS."
                estimate="INSTANT"
                icon={<Smartphone size={22} />}
                isSelected={selectedMethod === "mobile"}
                onClick={() => setSelectedMethod("mobile")}
              />

              {/* Method Option: Email Address */}
              <InteractiveOtpRow
                title="Email Address"
                description="A secure link or code will be sent to your inbox. Check your spam folder if it doesn't arrive."
                estimate="1-2 MINS"
                icon={<Mail size={22} />}
                isSelected={selectedMethod === "email"}
                onClick={() => setSelectedMethod("email")}
              />
            </div>
          </div>

          {/* Advisory Card & Core Button Sticky Action Matrix */}
          <div className="space-y-4 pt-8 bg-white">
            {/* Blue Advisory Box */}
            <div className="p-3.5 bg-sky-50 border border-sky-100/60 rounded-[14px] flex items-start gap-2.5">
              <p className="text-[11px] text-sky-700 font-semibold leading-relaxed">
                Make sure you have access to the device or email associated with
                your Anansi account.
              </p>
            </div>

            {/* Main Action Submit Button */}
            <button
              onClick={handleContinue}
              disabled={!selectedMethod}
              className={`w-full h-[52px] font-bold rounded-[16px] text-[14px] uppercase tracking-wider transition-all duration-200 active:scale-[0.99] ${
                selectedMethod
                  ? "bg-[#074073] hover:bg-[#052d52] text-white shadow-md shadow-[#074073]/5"
                  : "bg-slate-100 text-slate-300 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   SUPPORTING COMPONENT MICRO-TEMPLATES
   ========================================================================== */

// Left-side features indicator line row item template
const SecurityFeatureRow = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4">
    <div className="size-8 rounded-lg bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-[#074073] shrink-0">
      {icon}
    </div>
    <div>
      <h4 className="text-[13px] font-bold text-[#074073] tracking-tight">
        {title}
      </h4>
      <p className="text-[11px] text-slate-400 font-semibold mt-0.5 leading-normal max-w-xs">
        {desc}
      </p>
    </div>
  </div>
);

// Selection row item template
const InteractiveOtpRow = ({
  title,
  description,
  estimate,
  icon,
  isSelected,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`group flex items-start gap-4 p-5 rounded-[24px] border-2 cursor-pointer transition-all duration-200 select-none ${
      isSelected
        ? "bg-white border-[#074073] shadow-xl shadow-[#074073]/5"
        : "bg-slate-50 border-slate-100 hover:border-slate-200 hover:bg-white"
    }`}
  >
    {/* Icon Wrapper Frame Container */}
    <div
      className={`size-12 rounded-[16px] flex items-center justify-center shrink-0 transition-colors ${
        isSelected
          ? "bg-[#074073] text-white"
          : "bg-white text-[#074073] border border-slate-200/60"
      }`}
    >
      {icon}
    </div>

    {/* Typography Descriptions Details Stack */}
    <div className="flex-grow space-y-1">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-[15px] font-black text-[#074073] tracking-tight">
          {title}
        </h3>
        <span
          className={`text-[9px] font-bold tracking-wider uppercase transition-colors ${
            isSelected ? "text-[#074073]" : "text-slate-400"
          }`}
        >
          {estimate}
        </span>
      </div>
      <p className="text-[12px] text-slate-400 font-medium leading-relaxed pr-2">
        {description}
      </p>
    </div>
  </div>
);

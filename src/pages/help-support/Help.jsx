import React, { useState } from "react";
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
  Globe,
  ChevronDown,
  HelpCircle,
  AlertTriangle,
  ShieldAlert,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const HelpSupport = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const contactMethods = [
    {
      icon: <Phone size={24} />,
      title: "Call Center",
      detail: "+254 700 000 000",
      sub: "Available 8:00 AM - 5:00 PM",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: <MessageSquare size={24} />,
      title: "WhatsApp Support",
      detail: "+254 711 111 111",
      sub: "Average response: 15 mins",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: <Mail size={24} />,
      title: "Email Inquiry",
      detail: "support@sacco.co.ke",
      sub: "For formal disputes & documents",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: <Globe size={24} />,
      title: "Physical Branch",
      detail: "Anansi Plaza, 4th Floor",
      sub: "Nairobi, Kenya",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  const faqs = [
    {
      q: "Why is my loan application still pending?",
      a: "Loan applications typically undergo vetting by the Credit Committee which meets every Tuesday and Thursday. Ensure your guarantors have signed the digital forms via their portals.",
    },
    {
      q: "How do I update my next of kin details?",
      a: "For security reasons, Next of Kin updates require a physical form to be signed and submitted at any branch with a copy of the nominee's ID.",
    },
    {
      q: "What is the maximum I can borrow?",
      a: "Most Sacco products allow you to borrow up to 3x or 4x your total deposits, provided you have sufficient collateral or guarantors to cover the risk.",
    },
    {
      q: "How long does M-PESA withdrawal take?",
      a: "Withdrawals to M-PESA are usually processed within 10 minutes. If the funds haven't arrived in 1 hour, please check the 'System Issues' section below.",
    },
    {
      q: "When are dividends paid out?",
      a: "Dividends and interest on deposits are typically declared after the Annual General Meeting (AGM) held in the first quarter of the year. Once approved, they are credited to your FOSA account within 48 hours.",
    },
    {
      q: "What happens if my account becomes dormant?",
      a: "An account is classified as dormant if there are no contributions for over 6 consecutive months. To reactivate, you must pay a reactivation fee (KES 500) and resume monthly deposits.",
    },
    {
      q: "Can I offset my loan using my deposits?",
      a: "Yes, but this usually applies only when you are withdrawing your membership. Your deposits serve as collateral; therefore, you cannot offset and remain an active member unless your remaining deposits cover your other liabilities.",
    },
    {
      q: "What are my responsibilities as a guarantor?",
      a: "As a guarantor, you are legally liable for the loan if the borrower defaults. You will not be able to withdraw your deposits or use the 'guaranteed' portion of your deposits to back your own loans until the borrower clears theirs.",
    },
    {
      q: "Why is my 'Withdrawable Balance' different from my 'Total Deposits'?",
      a: "Total Deposits (Non-withdrawable shares) are your long-term savings used to determine your loan limit. Withdrawable Balance refers to funds in your FOSA/Savings account which can be accessed via M-PESA or ATM at any time.",
    },
    {
      q: "How can I increase my loan limit?",
      a: "You can increase your limit by boosting your monthly deposits or making a lump-sum 'share boost.' Note that most Saccos require boosted shares to remain in the account for at least 3 to 6 months before they can be used to qualify for a larger loan.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-primary pb-20">
      <div className="max-w-6xl sm:px-4 mx-auto">
        {/* Header */}
        <header className="py-3 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-slate-200 rounded-xl transition-all"
              >
                <ArrowLeft size={20} />
              </button>
              <span className="text-[10px] font-black uppercase tracking-widest text-secondary">
                Support Center
              </span>
            </div>
            <h1 className="text-4xl font-black tracking-tight">
              How can we help you today?
            </h1>
          </div>
        </header>

        {/* 1. Detailed Contact Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {contactMethods.map((method, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl shadow-blue-900/5 hover:border-secondary/40 transition-all group cursor-pointer"
            >
              <div
                className={`w-12 h-12 ${method.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                {method.icon}
              </div>
              <h3 className="font-black text-sm mb-1">{method.title}</h3>
              <p className="text-primary font-bold text-xs mb-2">
                {method.detail}
              </p>
              <p className="text-slate-400 text-[10px] font-medium leading-tight">
                {method.sub}
              </p>
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* 2. Simple Sacco FAQs (8 Cols) */}
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="text-secondary" size={24} />
              <h2 className="text-2xl font-black tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-100 rounded-[24px] overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                  >
                    <span className="font-bold text-sm pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`transition-transform text-secondary ${openFaq === idx ? "rotate-180" : ""}`}
                      size={18}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-6 text-xs text-slate-500 leading-relaxed font-medium">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3. System Status & Disclaimers (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Logged-in Issues Notification */}
            <div className="bg-primary text-white rounded-[32px] p-8 shadow-xl shadow-blue-900/20 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <AlertTriangle className="text-amber-400" size={20} />
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-blue-200">
                    System Status
                  </h3>
                </div>
                <div className="space-y-4">
                  <StatusUpdate
                    title="M-PESA Integration"
                    status="Degraded Performance"
                    time="10 mins ago"
                    type="warning"
                  />
                  <StatusUpdate
                    title="Loan Calculator"
                    status="Operational"
                    time="Active"
                    type="success"
                  />
                </div>
                <p className="mt-6 text-[10px] text-blue-300 leading-relaxed italic">
                  Experienced a balance mismatch? Log out and log back in to
                  refresh your local session data.
                </p>
              </div>
            </div>

            {/* Legal Disclaimers */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <ShieldAlert className="text-secondary" size={18} />
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                  Disclaimers
                </h3>
              </div>
              <ul className="space-y-4">
                <li className="text-[10px] text-slate-400 leading-relaxed">
                  <strong>Security:</strong> Our staff will <u>never</u> ask for
                  your Password or M-PESA PIN over the phone.
                </li>
                <li className="text-[10px] text-slate-400 leading-relaxed">
                  <strong>Information:</strong> Data provided on this portal is
                  subject to audit. Final balances are those held in the Sacco
                  Core Banking System.
                </li>
              </ul>
              <button className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                View Full Terms <ExternalLink size={12} />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

/* --- Sub-Components --- */

const StatusUpdate = ({ title, status, time, type }) => (
  <div>
    <div className="flex justify-between items-center mb-1">
      <span className="text-[11px] font-bold text-white">{title}</span>
      <span
        className={`text-[9px] font-black uppercase tracking-tighter ${type === "warning" ? "text-amber-400" : "text-emerald-400"}`}
      >
        {status}
      </span>
    </div>
    <div className="flex items-center gap-1.5 opacity-40">
      <Clock size={10} />
      <span className="text-[9px] font-bold uppercase tracking-widest">
        {time}
      </span>
    </div>
  </div>
);

export default HelpSupport;

import React, { useState } from "react";
import {
  ArrowLeft,
  Shield,
  Clock,
  Users,
  FileText,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
  Briefcase,
  RefreshCcw,
  CheckSquare,
  Scale,
} from "lucide-react";
import { useQuery } from "react-query";
import { getLoanProduct } from "../../sdks/loans/loans";
import { useToast } from "../../contexts/ToastProvider";
import { useParams } from "react-router-dom";
import { useFormatAmount } from "../../hooks/useFormatAmount";

const LoanProductDetails = () => {
  const { showToast } = useToast();
  const [loanProduct, setLoanProduct] = useState({});
  const { id } = useParams();
  const fomatAmount = useFormatAmount();

  useQuery({
    queryKey: ["explore product", id],
    queryFn: async () => {
      const response = await getLoanProduct(id);
      return response?.data?.data;
    },
    onSuccess: (data) => {
      setLoanProduct(data);
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

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(val);
  const formatPercent = (val) => `${Number(val).toFixed(1)}%`;

  return (
    <div className="bg-slate-50/50 text-[#0F172A] pb-24">
      {/* ====== STICKY BACKBAR HEADER ====== */}
      <nav>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#0F172A] transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Products</span>
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto mt-3 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ====== LEFT COLUMNS: MAIN CONTENT CORE ====== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Headline Title Card */}
          <div className="bg-white rounded-[32px] border border-slate-200/60 p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-14 h-14 bg-[#0F172A] rounded-2xl flex items-center justify-center text-white mb-6">
                <Briefcase size={28} strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-primary mb-3">
                {loanProduct?.product_name}
              </h1>
            </div>
            <p className="text-slate-500 leading-relaxed text-base">
              {loanProduct?.description}
            </p>

            <div className="h-px bg-slate-100 my-6" />

            {/* Quick Metrics Core Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                  Interest Rate
                </span>
                <span className="text-xl font-bold text-[#0F172A]">
                  {formatPercent(loanProduct?.interest_rate)}{" "}
                  <span className="text-xs font-medium text-slate-400">
                    p.m
                  </span>
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                  Max Period
                </span>
                <span className="text-xl font-bold text-[#0F172A]">
                  {loanProduct?.max_period}{" "}
                  <span className="text-xs font-medium text-slate-400">
                    Months
                  </span>
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                  Calculation
                </span>
                <span className="text-sm font-bold text-slate-700 capitalize block mt-1">
                  {loanProduct?.interest_method?.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>

          {/* Product Operational Limits Segment */}
          <div className="bg-white rounded-[32px] border border-slate-200/60 p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2.5">
              <Clock size={18} className="text-slate-400" /> Loan Limits &
              Parameters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                  Principal Funding Matrix
                </span>
                <div className="flex justify-between items-baseline mt-2">
                  <span className="text-xs text-slate-500">
                    Min: {formatCurrency(loanProduct?.min_amount)}
                  </span>
                  <span className="text-base font-bold text-[#0F172A]">
                    Max: {formatCurrency(loanProduct?.max_amount)}
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                  Repayment Tenure Bounds
                </span>
                <div className="flex justify-between items-baseline mt-2">
                  <span className="text-xs text-slate-500">
                    Min: {loanProduct?.min_period} Months
                  </span>
                  <span className="text-base font-bold text-[#0F172A]">
                    Max: {loanProduct?.max_period} Months
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Core Sacco Membership Eligibility Requirements */}
          <div className="bg-white rounded-[32px] border border-slate-200/60 p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2.5">
              <Shield size={18} className="text-slate-400" /> Institutional
              Eligibility Rules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                <CheckCircle2
                  size={16}
                  className="text-[#10B981] mt-0.5 shrink-0"
                />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Minimum Membership
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Continuous active contribution for at least{" "}
                    {loanProduct?.min_membership_months} months.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                <CheckCircle2
                  size={16}
                  className="text-[#10B981] mt-0.5 shrink-0"
                />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Minimum Capital Vault Shares
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Must hold minimum shares worth{" "}
                    {formatCurrency(loanProduct?.min_shares_amount)}.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                <CheckCircle2
                  size={16}
                  className="text-[#10B981] mt-0.5 shrink-0"
                />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Minimum Core Deposits
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sustained deposit base balance above{" "}
                    {formatCurrency(loanProduct?.min_savings_amount)}.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors">
                <CheckCircle2
                  size={16}
                  className="text-[#10B981] mt-0.5 shrink-0"
                />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Borrowing Multiplier Power
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Cap absolute maximum funding up to{" "}
                    {Number(loanProduct?.max_loan_to_shares_ratio || 0).toFixed(
                      0,
                    )}{" "}
                    x your shares balance.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Collateral Security & Backing Disclaimers */}
          <div className="bg-white rounded-[32px] border border-slate-200/60 p-6 space-y-6 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2.5">
              <Users size={18} className="text-slate-400" /> Guarantorship &
              Collateral Guardrails
            </h2>
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-4 items-center">
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0 text-slate-600">
                  <Users size={18} />
                </div>
                <div>
                  <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase block">
                    Required Guarantor Bounds
                  </span>
                  <span className="text-sm font-bold text-slate-800">
                    Requires between {loanProduct?.min_guarantors} and{" "}
                    {loanProduct?.max_guarantors} approved member co-signers
                  </span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-4 items-center">
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0 text-slate-600">
                  <FileText size={18} />
                </div>
                <div>
                  <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase block">
                    Collateral Security Matrix
                  </span>
                  <span className="text-sm font-medium text-slate-600 block mt-0.5">
                    {loanProduct?.collateral_description}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ====== RIGHT COLUMN: STICKY BREAKDOWN ASSETS SIDEBAR ====== */}
        <div className="space-y-6">
          {/* ====== UNCOLORED MAIN FEE CONTAINER ====== */}
          <div className="bg-white text-slate-900 rounded-[32px] p-6 space-y-6 border border-slate-200/60 shadow-sm top-24">
            <div className="space-y-1">
              <h3 className="text-lg font-bold tracking-tight text-slate-900">
                Fee Structure & Protection
              </h3>
              <p className="text-slate-400 text-xs">
                Cost calculations linked to capital application parameters
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  Processing Fee{" "}
                  <HelpCircle size={12} className="opacity-60 text-slate-400" />
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {fomatAmount(Number(loanProduct?.processing_fee_value) ?? 0)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-xs text-slate-500">
                  Insurance Premium
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {formatPercent(loanProduct?.insurance_rate)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-xs text-slate-500">
                  Late Payment Penalty
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {formatPercent(loanProduct?.penalty_value)}{" "}
                  <span className="text-[10px] text-slate-400 font-normal">
                    /mo
                  </span>
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-xs text-slate-500">Grace Period</span>
                <span className="text-sm font-bold text-[#10B981]">
                  {loanProduct?.grace_period_days} Days
                </span>
              </div>
            </div>

            {/* Workflow Review Pipeline (Swapped to clear/uncolored outline style) */}
            <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-4 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest block uppercase">
                Workflow Review Path
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Requires 3 Credit Committee Signatures</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span>Requires Senior Executive Manager Review</span>
                </div>
              </div>
            </div>

            {/* Deductibility Note Warning (Muted desaturated styling parameters) */}
            <div className="flex gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] leading-relaxed text-slate-500">
              <AlertCircle
                size={14}
                className="shrink-0 mt-0.5 text-slate-400"
              />
              <span>
                Note: Upfront processing fees are deducted directly from your
                approved principal amount upon disbursement.
              </span>
            </div>
          </div>

          <div className="bg-white text-slate-900 rounded-[32px] p-8 space-y-5 border border-slate-200/60 shadow-sm">
            <div className="space-y-1">
              <h3 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <Scale size={20} className="text-slate-400" /> Terms &
                Conditions
              </h3>
              <p className="text-slate-400 text-xs">
                Legal bound framework constraints for{" "}
                {loanProduct?.product_name}
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-600">
              <div className="flex gap-3 items-start">
                <CheckSquare
                  size={14}
                  className="text-slate-400 mt-0.5 shrink-0"
                />
                <p>
                  <strong>Penalty Ceiling Rate:</strong> Accumulated penalties
                  are capped at a maximum of{" "}
                  <span className="text-slate-900 font-semibold">
                    {formatPercent(loanProduct?.max_penalty_rate)}
                  </span>{" "}
                  of outstanding value.
                </p>
              </div>

              <div className="flex gap-3 items-start">
                <CheckSquare
                  size={14}
                  className="text-slate-400 mt-0.5 shrink-0"
                />
                <p>
                  <strong>Disbursement Channels:</strong> Funds are strictly
                  disburseable to verified{" "}
                  <span className="text-slate-900 font-semibold">
                    {loanProduct?.allowed_disbursement_methods?.join(" or ")}
                  </span>{" "}
                  profiles.
                </p>
              </div>

              <div className="flex gap-3 items-start">
                <CheckSquare
                  size={14}
                  className="text-slate-400 mt-0.5 shrink-0"
                />
                <p>
                  <strong>No Rollovers Allowed:</strong> This long-term facility
                  does not allow maturity dynamic balance roll-overs.
                </p>
              </div>

              {loanProduct?.allows_topup && (
                <div className="flex gap-3 items-start">
                  <RefreshCcw
                    size={14}
                    className="text-[#10B981] mt-0.5 shrink-0"
                  />
                  <p>
                    <strong>Top-Up Eligible:</strong> Refinancing/Top-ups are
                    allowed once you settle at least{" "}
                    <span className="text-slate-900 font-semibold">
                      {formatPercent(
                        loanProduct?.min_repayment_percent_for_topup,
                      )}
                    </span>{" "}
                    of the principal ledger.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ====== PRIMARY ACTION BUTTON (Anchored at the end of the space) ====== */}
          <button className="w-full py-4 bg-[#0F172A] hover:bg-slate-800 text-white font-bold rounded-2xl text-sm transition-all active:scale-[0.98] shadow-xl shadow-blue-950/10">
            Begin Loan Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanProductDetails;

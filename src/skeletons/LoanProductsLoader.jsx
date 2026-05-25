import { Briefcase, Info } from "lucide-react";

const LoanProductsLoader = () => {
  const skeletonCards = Array(9).fill(null);
  return skeletonCards.map((_, index) => <ProductCardSkeleton key={index} />);
};

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden mb-6 shadow-sm">
      {/* Top Section Content Canvas Layout */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          {/* Left Icon Node Avatar */}
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300/70">
            <Briefcase size={26} strokeWidth={1.5} />
          </div>

          {/* Right Interest Rate Badge Capsule */}
          <div className="w-24 h-7 bg-slate-100 rounded-full" />
        </div>

        {/* Title and Description Track Elements */}
        <div className="mb-8 space-y-3">
          {/* Card Headline Title */}
          <div className="h-6 w-3/4 bg-slate-200 rounded-md" />
          {/* Paragraph Multiline Block representations */}
          <div className="space-y-2 pt-1">
            <div className="h-3.5 w-full bg-slate-200 rounded" />
            <div className="h-3.5 w-5/6 bg-slate-200 rounded" />
          </div>
        </div>

        {/* Info Parameter Metadata Grid (Mimicking your custom InfoColumn system) */}
        <div className="flex items-center justify-between py-4 border-t border-slate-50">
          {/* Stats Segment 1: Max Amount */}
          <div className="flex flex-col gap-2">
            <div className="h-2 w-14 bg-slate-200 rounded" />
            <div className="h-3.5 w-20 bg-slate-300 rounded font-bold" />
          </div>
          <div className="h-8 w-px bg-slate-100" />

          {/* Stats Segment 2: Tenure */}
          <div className="flex flex-col gap-2">
            <div className="h-2 w-10 bg-slate-200 rounded" />
            <div className="h-3.5 w-14 bg-slate-300 rounded font-bold" />
          </div>
          <div className="h-8 w-px bg-slate-100" />

          {/* Stats Segment 3: Repayment */}
          <div className="flex flex-col gap-2">
            <div className="h-2 w-14 bg-slate-200 rounded" />
            <div className="h-3.5 w-16 bg-slate-300 rounded font-bold" />
          </div>
        </div>
      </div>

      {/* Bottom Legal/Action Controller Bar Deck */}
      <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
        {/* Footnote Warning Legal Disclaimer Anchor */}
        <div className="flex items-center gap-1.5 text-slate-300">
          <Info size={12} />
          <div className="h-2.5 w-28 bg-slate-200 rounded" />
        </div>

        {/* Main Application Execution Button Mock */}
        <div className="w-24 h-9 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
};

export default LoanProductsLoader;

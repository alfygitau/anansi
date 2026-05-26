const LoanProductLoder = () => {
  return (
    <div className="max-w-6xl mx-auto mt-3 grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
      
      {/* ====== LEFT COLUMNS: MAIN CONTENT CORE SKELETONS ====== */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Headline Title Card Skeleton */}
        <div className="bg-white rounded-[32px] border border-slate-200/60 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Left Primary Icon Wrapper */}
            <div className="w-14 h-14 bg-slate-200 rounded-2xl shrink-0" />
            <div className="space-y-3 w-full">
              {/* Product Name Title Bar */}
              <div className="h-7 bg-slate-200 rounded-lg w-1/2" />
            </div>
          </div>
          {/* Subtext Description Multi-line Block */}
          <div className="space-y-2 mt-6">
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-5/6" />
          </div>

          <div className="h-px bg-slate-100 my-6" />

          {/* Quick Metrics Core Grid Skeletons */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 bg-slate-200 rounded w-3/4" />
                <div className="h-6 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Operational Limits Segment Skeleton */}
        <div className="bg-white rounded-[32px] border border-slate-200/60 p-6 space-y-6 shadow-sm">
          {/* Title Header Bar */}
          <div className="h-5 bg-slate-200 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="flex justify-between mt-2">
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
              </div>
            </div>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="flex justify-between mt-2">
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
              </div>
            </div>
          </div>
        </div>

        {/* Core Sacco Membership Eligibility Requirements Skeleton */}
        <div className="bg-white rounded-[32px] border border-slate-200/60 p-6 space-y-6 shadow-sm">
          {/* Title Header Bar */}
          <div className="h-5 bg-slate-200 rounded w-44" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3">
                {/* Circular indicator mock */}
                <div className="w-4 h-4 bg-slate-200 rounded-full mt-0.5 shrink-0" />
                <div className="space-y-2 w-full">
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Collateral Security & Backing Disclaimers Skeleton */}
        <div className="bg-white rounded-[32px] border border-slate-200/60 p-6 space-y-6 shadow-sm">
          {/* Title Header Bar */}
          <div className="h-5 bg-slate-200 rounded w-56" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-4 items-center">
                <div className="w-10 h-10 bg-slate-200 rounded-xl shrink-0" />
                <div className="space-y-2 w-full">
                  <div className="h-3 bg-slate-200 rounded w-24" />
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ====== RIGHT COLUMN: STICKY BREAKDOWN ASSETS SIDEBAR SKELETON ====== */}
      <div className="space-y-4">
        {/* Top Floating Master Action Button Skeleton */}
        <div className="h-14 bg-slate-200 rounded-2xl w-full" />

        {/* Fee Structure Container Skeleton */}
        <div className="bg-white rounded-[32px] p-6 space-y-6 border border-slate-200/60 shadow-sm">
          <div className="space-y-2">
            <div className="h-5 bg-slate-200 rounded w-1/2" />
            <div className="h-3 bg-slate-200 rounded w-3/4" />
          </div>

          {/* Table Strip Parameter Rows Skeleton */}
          <div className="space-y-5 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100">
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-4 bg-slate-200 rounded w-1/4" />
              </div>
            ))}
          </div>

          {/* Workflow Path Box Loader Segment */}
          <div className="bg-slate-50/50 border border-slate-200/60 rounded-2xl p-4 space-y-3">
            <div className="h-3 bg-slate-200 rounded w-1/3" />
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded w-5/6" />
              <div className="h-3 bg-slate-200 rounded w-4/5" />
            </div>
          </div>

          {/* Bottom Warning Disclaimer Callout Shimmer */}
          <div className="h-12 bg-slate-50 border border-slate-200 rounded-xl w-full" />
        </div>

        {/* Terms & Conditions Box Skeleton */}
        <div className="bg-white rounded-[32px] p-8 space-y-5 border border-slate-200/60 shadow-sm">
          <div className="space-y-2">
            <div className="h-5 bg-slate-200 rounded w-1/2" />
            <div className="h-3 bg-slate-200 rounded w-2/3" />
          </div>

          <div className="space-y-4 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="w-3.5 h-3.5 bg-slate-200 rounded shrink-0 mt-0.5" />
                <div className="space-y-2 w-full">
                  <div className="h-3 bg-slate-200 rounded w-full" />
                  <div className="h-3 bg-slate-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoanProductLoder;
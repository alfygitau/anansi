const HomeLoader = () => {
  return (
    <div className="bg-slate-50 animate-pulse">
      {/* Centered Container */}
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <header className="flex justify-between mb-6 items-center">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
            <div className="h-4 w-64 bg-slate-200 rounded-md"></div>
          </div>
        </header>

        {/* Accounts Grid Skeleton */}
        {/* MASTER DASHBOARD CONTAINER SKELETON LAYER */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6 items-start animate-pulse">
          {/* LEFT PANEL: COMPACT ACCOUNT CARDS VECTORS SKELETON (5 COLS) */}
          <div className="lg:col-span-5 space-y-3">
            {/* Header Placeholder String */}
            <div className="h-3 w-28 bg-slate-200 rounded ml-1 mb-2"></div>

            {/* Downscaled Account Card Placements */}
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="p-4 bg-white border border-slate-200/60 rounded-2xl h-[144px] flex flex-col justify-between"
                >
                  {/* Top Row Block Elements */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-1.5 w-full">
                      <div className="h-2.5 w-20 bg-slate-200 rounded"></div>
                      <div className="h-3 w-28 bg-slate-100 rounded font-mono"></div>
                    </div>
                    <div className="w-7 h-7 bg-slate-100 rounded-lg shrink-0"></div>
                  </div>
                  {/* Bottom Row Balance Parameter */}
                  <div className="h-5 w-32 bg-slate-200 rounded mt-2"></div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL: CONVOLUTED QUICK ACTIONS DECK SKELETON (7 COLS) */}
          <div className="lg:col-span-7">
            {/* Micro-Header Text Vector Placeholder */}
            <div className="h-3 w-24 bg-slate-200 rounded ml-0.5 mb-3"></div>

            {/* Micro Matrix Outer Envelope Ring */}
            <div className="bg-slate-50/40">
              {/* High-Density 2-Column Symmetrical Skeleton Grid */}
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 p-[9px] bg-white border border-slate-100 rounded-xl"
                  >
                    {/* Action Icon Square Base Plate Indicator (Perfect 1:1 Match) */}
                    <div className="w-12 h-12 bg-slate-100 border border-slate-200/10 rounded-lg shrink-0"></div>

                    {/* Typography String Tracking Row */}
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="h-2.5 w-20 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Explore Products Grid Skeleton */}
        <section className="mb-10">
          <div className="h-4 w-40 bg-slate-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 bg-white border border-slate-100 rounded-2xl"
              ></div>
            ))}
          </div>
        </section>

        {/* Loans Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="h-6 w-40 bg-slate-200 rounded"></div>
            <div className="h-24 bg-white border border-slate-200 rounded-2xl"></div>
          </div>
          <div className="space-y-4">
            <div className="h-6 w-40 bg-slate-200 rounded"></div>
            <div className="h-24 bg-white border border-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeLoader;

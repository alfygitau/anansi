const ProfileLoader = () => {
  return (
    <div className="min-h-screen max-w-6xl mx-auto bg-slate-50 pb-20 pt-10 px-4 animate-pulse">
      <div className="w-full mx-auto space-y-6">
        {/* TOP SECTION: SIDE-BY-SIDE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* PROFILE SUMMARY CARD SKELETON (4 Cols) */}
          <div className="lg:col-span-4 bg-slate-200 rounded-[32px] p-8 flex flex-col items-center justify-center">
            <div className="w-28 h-28 rounded-full bg-slate-300 mb-4" />
            <div className="h-6 w-32 bg-slate-300 rounded-md mb-2" />
            <div className="h-3 w-40 bg-slate-300 rounded-md mb-6" />
            <div className="h-8 w-24 bg-slate-300 rounded-full" />
          </div>

          {/* MAIN PERSONAL INFO CARD SKELETON (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-[28px] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2.5 mb-8">
              <div className="h-8 w-8 bg-slate-100 rounded-lg" />
              <div className="h-4 w-32 bg-slate-100 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-2 w-16 bg-slate-50 rounded" />
                  <div className="h-4 w-24 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: 3-COLUMN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((card) => (
            <div
              key={card}
              className="bg-white rounded-[28px] p-6 border border-slate-100 h-[220px]"
            >
              <div className="flex items-center gap-2.5 mb-8">
                <div className="h-8 w-8 bg-slate-100 rounded-lg" />
                <div className="h-4 w-24 bg-slate-100 rounded" />
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="h-2 w-12 bg-slate-50 rounded" />
                  <div className="h-4 w-20 bg-slate-100 rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-12 bg-slate-50 rounded" />
                  <div className="h-4 w-32 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* EXIT POLICY SECTION SKELETON */}
        <section className="bg-white rounded-[32px] p-8 border border-slate-100 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-slate-100 rounded-2xl" />
            <div className="space-y-2">
              <div className="h-3 w-32 bg-slate-100 rounded" />
              <div className="h-6 w-56 bg-slate-100 rounded" />
            </div>
          </div>
          <div className="h-4 w-full max-w-2xl bg-slate-50 rounded" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-24 bg-slate-50 rounded-2xl border border-slate-100" />
            <div className="h-24 bg-slate-50 rounded-2xl border border-slate-100" />
          </div>

          <div className="h-20 bg-cyan-50/30 rounded-2xl border border-cyan-100/50" />

          <div className="pt-8 border-t border-slate-50 flex justify-between items-center">
            <div className="h-4 w-48 bg-slate-100 rounded" />
            <div className="h-14 w-48 bg-slate-200 rounded-2xl" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileLoader;

const HomeLoader = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-12 animate-pulse">
      {/* Centered Container */}
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <header className="flex justify-between mb-6 items-center pt-8">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
            <div className="h-4 w-64 bg-slate-200 rounded-md"></div>
          </div>
        </header>

        {/* Accounts Grid Skeleton */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="h-40 bg-white border border-slate-200 rounded-[24px]"></div>
          <div className="h-40 bg-white border border-slate-200 rounded-[24px]"></div>
        </section>

        {/* Quick Actions Scroll Skeleton */}
        <section className="mb-10">
          <div className="h-4 w-32 bg-slate-200 rounded mb-4"></div>
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center min-w-[100px] space-y-3"
              >
                <div className="w-20 h-20 bg-slate-200 rounded-3xl"></div>
                <div className="h-3 w-14 bg-slate-200 rounded"></div>
              </div>
            ))}
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

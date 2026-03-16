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

        {/* Membership Progress Skeleton */}
        <div className="mb-6 w-full rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Left Content */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
                <div className="h-6 w-40 bg-slate-200 rounded-md"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full max-w-[400px] bg-slate-100 rounded"></div>
                <div className="h-4 w-full max-w-[350px] bg-slate-100 rounded"></div>
              </div>
              <div className="h-8 w-56 bg-slate-100 rounded-lg"></div>
            </div>

            {/* Right Progress Area */}
            <div className="w-full lg:w-[340px] space-y-5">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-slate-200 rounded"></div>
                  <div className="h-3 w-10 bg-slate-200 rounded"></div>
                </div>
                <div className="h-4 w-full bg-slate-100 rounded-full"></div>
                <div className="h-3 w-24 bg-slate-100 rounded self-end ml-auto"></div>
              </div>
              <div className="h-14 w-full bg-slate-200 rounded-2xl"></div>
            </div>
          </div>
        </div>

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
              <div key={i} className="flex flex-col items-center min-w-[100px] space-y-3">
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
              <div key={i} className="h-24 bg-white border border-slate-100 rounded-2xl"></div>
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
const AccountDetailsLoader = () => {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <header className="py-8 flex items-center gap-4">
          <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse" />
          <div className="w-32 h-3 bg-slate-200 rounded animate-pulse" />
        </header>

        {/* 1. Hero & Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
          {/* Main Balance Area Skeleton */}
          <div className="lg:col-span-8 bg-slate-200 rounded-[40px] p-10 min-h-[300px] flex flex-col justify-between animate-pulse">
            <div>
              <div className="w-24 h-2 bg-slate-300 rounded mb-6" />
              <div className="w-64 h-12 bg-slate-300 rounded" />
            </div>
            <div className="flex justify-between items-end border-t border-slate-300 pt-8 mt-8">
              <div className="space-y-2">
                <div className="w-20 h-2 bg-slate-300 rounded" />
                <div className="w-40 h-4 bg-slate-300 rounded" />
              </div>
              <div className="space-y-2">
                <div className="w-20 h-2 bg-slate-300 rounded ml-auto" />
                <div className="w-32 h-4 bg-slate-300 rounded" />
              </div>
            </div>
          </div>

          {/* Quick Actions Skeleton */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white border border-slate-100 p-6 rounded-[32px] flex flex-col items-center justify-center gap-4 animate-pulse"
              >
                <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
                <div className="w-16 h-2 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* 2. Transactions & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Transaction List Skeleton */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex justify-between mb-6">
              <div className="w-48 h-6 bg-slate-200 rounded animate-pulse" />
              <div className="w-20 h-6 bg-slate-200 rounded animate-pulse" />
            </div>

            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-[28px] border border-slate-100 flex items-center justify-between animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
                  <div className="space-y-2">
                    <div className="w-32 h-3 bg-slate-200 rounded" />
                    <div className="w-24 h-2 bg-slate-100 rounded" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="w-20 h-4 bg-slate-200 rounded ml-auto" />
                  <div className="w-12 h-2 bg-slate-100 rounded ml-auto" />
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Skeleton */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 h-40 animate-pulse">
              <div className="w-32 h-3 bg-slate-100 rounded mb-6" />
              <div className="space-y-2">
                <div className="w-full h-2 bg-slate-50 rounded" />
                <div className="w-full h-2 bg-slate-50 rounded" />
                <div className="w-2/3 h-2 bg-slate-50 rounded" />
              </div>
            </div>

            <div className="bg-slate-100/50 rounded-[32px] p-8 h-56 animate-pulse">
              <div className="w-32 h-3 bg-slate-200 rounded mb-6" />
              <div className="space-y-4">
                <div className="w-full h-2 bg-slate-200 rounded" />
                <div className="w-full h-2 bg-slate-200 rounded" />
                <div className="w-full h-2 bg-slate-200 rounded" />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsLoader;

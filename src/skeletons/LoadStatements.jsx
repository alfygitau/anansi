import React from "react";

const LoadStatements = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-20 animate-pulse">
      <div className="max-w-6xl sm:px-4 mx-auto">
        
        {/* HEADER SKELETON */}
        <header className="py-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 w-full max-w-md">
            <div className="h-7 bg-slate-200 rounded-lg w-1/3" />
            <div className="h-4 bg-slate-200 rounded-md w-full" />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: FILTERS & LIST SKELETON */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Filter Card Skeleton */}
            <section className="bg-white rounded-[20px] p-5 border border-slate-200">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Account/Loan Filter */}
                <div className="flex-1 w-full space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-24 ml-2" />
                  <div className="h-12 bg-slate-100 rounded-2xl w-full" />
                </div>
                {/* Year Filter */}
                <div className="w-full md:w-48 space-y-2">
                  <div className="h-3 bg-slate-200 rounded w-12 ml-2" />
                  <div className="h-12 bg-slate-100 rounded-2xl w-full" />
                </div>
              </div>
            </section>

            {/* Tabs Skeleton */}
            <div className="flex gap-4">
              <div className="h-11 bg-slate-200 rounded-xl w-32" />
              <div className="h-11 bg-slate-200 rounded-xl w-32" />
            </div>

            {/* List Array Skeleton (Simulating 3 statement rows loading) */}
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-3xl p-5 border border-slate-100 flex items-center justify-between h-20"
                >
                  <div className="flex items-center gap-4 w-2/3">
                    <div className="w-10 h-10 bg-slate-200 rounded-xl shrink-0" />
                    <div className="space-y-2 w-full">
                      <div className="h-4 bg-slate-200 rounded w-1/3" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                    </div>
                  </div>
                  <div className="w-24 h-9 bg-slate-200 rounded-xl" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: INFO & DISCLAIMERS SKELETON */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Primary Action Button Skeleton */}
            <div className="h-14 bg-slate-200 rounded-2xl w-full" />

            {/* Security Card Skeleton */}
            <div className="bg-slate-200 rounded-[32px] p-8 h-56 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-7 h-7 bg-white/40 rounded-lg" />
                <div className="h-5 bg-white/40 rounded-md w-1/2" />
                <div className="h-3 bg-white/30 rounded w-3/4" />
              </div>
              <div className="h-14 bg-white/20 rounded-2xl w-full" />
            </div>

            {/* Disclaimer Card Skeleton */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-slate-200 rounded-full" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
              </div>
              <div className="space-y-3.5">
                <div className="h-3 bg-slate-100 rounded w-full" />
                <div className="h-3 bg-slate-100 rounded w-5/6" />
                <div className="h-3 bg-slate-100 rounded w-11/12" />
                <div className="h-3 bg-slate-100 rounded w-4/5" />
              </div>
            </div>

            {/* Support Card Skeleton */}
            <div className="bg-slate-100/70 rounded-[32px] p-8 border border-slate-200/40 space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-3 bg-slate-200 rounded w-full" />
              <div className="h-3 bg-slate-200 rounded w-2/3" />
              <div className="pt-2">
                <div className="h-4 bg-slate-300 rounded w-1/3" />
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
};

export default LoadStatements;
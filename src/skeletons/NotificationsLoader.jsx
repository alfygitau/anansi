const NotificationsLoader = () => {
  return (
    <div className="max-w-6xl mx-auto py-8 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: NOTIFICATION FEED */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
              <div className="h-4 w-64 bg-slate-100 rounded-md"></div>
            </div>
            <div className="h-10 w-40 bg-slate-200 rounded-2xl"></div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-6 border-b border-slate-50 last:border-0">
                <div className="shrink-0 w-12 h-12 bg-slate-100 rounded-2xl"></div>
                <div className="flex-grow space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="h-4 w-3/4 bg-slate-100 rounded-md"></div>
                    <div className="h-3 w-12 bg-slate-50 rounded-md"></div>
                  </div>
                  <div className="h-3 w-1/2 bg-slate-50 rounded-md"></div>
                </div>
                <div className="h-5 w-5 bg-slate-50 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-slate-200 rounded-[32px] h-[240px] p-6">
             <div className="h-6 w-32 bg-slate-300/50 rounded-md mb-6"></div>
             <div className="space-y-3">
               <div className="h-12 w-full bg-slate-300/50 rounded-2xl"></div>
               <div className="h-12 w-full bg-slate-300/50 rounded-2xl"></div>
             </div>
          </div>

          <div className="bg-white rounded-[32px] p-6 border border-slate-100 space-y-6">
            <div className="h-4 w-24 bg-slate-100 rounded-md"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-3 w-24 bg-slate-50 rounded-md"></div>
                <div className="h-3 w-12 bg-slate-100 rounded-md"></div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default NotificationsLoader
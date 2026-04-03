import React from 'react';
import { ChevronLeft, Circle} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyProgress = ({ currentTitle, currentSubtitle }) => {
  const navigate = useNavigate();
  const steps = [
    {
      title: "Identity Verification",
      substeps: ["Upload Government Document", "Selfie Verification"],
    },
    {
      title: "Profile Information",
      substeps: ["Enter Address", "Employment & KRA Verification", "Add Next of Kin"],
    },
    {
      title: "Terms and conditions",
      substeps: ["Review and Accept"],
    },
  ];

  return (
    <div className="flex flex-col gap-8 select-none">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[#042159] hover:text-[#4DB8E4] transition-colors w-fit group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-wider">Back</span>
      </button>

      <div className="flex flex-col gap-0">
        {steps.map((step, index) => {
          const isActive = currentTitle === step.title;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.title} className="relative flex gap-4 pb-8">
              {/* Connector Line */}
              {!isLast && (
                <div className="absolute left-[9px] top-6 bottom-0 w-[2px] bg-slate-100" />
              )}

              {/* Icon Logic */}
              <div className="relative z-10">
                {isActive ? (
                  <div className="w-5 h-5 bg-[#042159] rounded-full flex items-center justify-center shadow-lg shadow-blue-900/20">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                ) : (
                  <Circle size={20} className="text-slate-300" />
                )}
              </div>

              {/* Text Content */}
              <div className="flex flex-col gap-2">
                <h3 className={`text-sm font-black uppercase tracking-tight ${
                  isActive ? 'text-[#042159]' : 'text-slate-400'
                }`}>
                  {step.title}
                </h3>
                
                <div className="flex flex-col gap-2">
                  {step.substeps.map((sub) => {
                    const isSubActive = currentSubtitle === sub;
                    return (
                      <p 
                        key={sub}
                        className={`text-sm transition-all duration-300 ${
                          isSubActive 
                            ? 'text-[#4DB8E4] font-bold pl-2 border-l-2 border-[#4DB8E4]' 
                            : 'text-slate-400 font-medium pl-2 border-l-2 border-transparent'
                        }`}
                      >
                        {sub}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyProgress;
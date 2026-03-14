import { LogOut, HelpCircle, ShieldCheck } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="w-full h-[120px] bg-gray-50 flex items-center justify-between sticky top-0 z-50">
      {/* Logo Section */}
      <div className="flex items-center">
        <div className="w-16 h-16 bg-[#042159] rounded-[22px] flex items-center justify-center shadow-2xl shadow-blue-900/20">
          <ShieldCheck className="text-[#4DB8E4]" size={32} />
        </div>
        {/* Optional: Add brand name if not in logo image */}
        <span className="ml-3 text-xl font-bold text-[#042159]">
          Anansi
        </span>
      </div>

      {/* Navigation Actions */}
      <div className="flex items-center gap-6 md:gap-8">
        {/* Need Help Button */}
        <button className="flex items-center gap-2 text-gray-600 hover:text-[#042159] transition-colors group">
          <HelpCircle
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="text-sm font-medium">Need Help?</span>
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-[1px] bg-gray-200" />

        {/* Logout Button */}
        <button className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors group">
          <LogOut
            size={20}
            className="group-hover:translate-x-0.5 transition-transform"
          />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

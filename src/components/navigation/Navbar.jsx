import { LogOut, HelpCircle } from "lucide-react";
import Logout from "../auth/Logout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  return (
    <>
      {<Logout isOpen={showLogout} onClose={() => setShowLogout(false)} />}
      <nav className="w-full h-[120px] bg-gray-50 flex items-center justify-between sticky top-0 z-50">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/10">
            <span className="text-white text-2xl font-medium">A</span>
          </div>
          <span className="text-lg font-medium text-primary tracking-tighter uppercase">
            Anansi Sacco
          </span>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-6 md:gap-8">
          {/* Need Help Button */}
          <button
            onClick={() => navigate("/onboarding/help")}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors group"
          >
            <HelpCircle
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            <span className="text-sm font-medium">Need Help?</span>
          </button>

          {/* Vertical Divider */}
          <div className="h-6 w-[1px] bg-gray-200" />

          {/* Logout Button */}
          <button
            onClick={() => setShowLogout(true)}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 transition-colors group"
          >
            <LogOut
              size={20}
              className="group-hover:translate-x-0.5 transition-transform"
            />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;

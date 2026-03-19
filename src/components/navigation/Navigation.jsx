import { useEffect, useRef, useState } from "react";
import {
  Bell,
  User,
  Settings,
  LogOut,
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Navigation = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { auth } = useAuth();
  const navigate = useNavigate();
  // 1. Create a ref for the dropdown container
  const dropdownRef = useRef(null);

  // 2. Add the "click outside" logic
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the dropdown is open and the click is NOT inside the ref element, close it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Clean up the listener on unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  const getInitials = (firstName = "", lastName = "") => {
    // Extract first letter, convert to uppercase, and handle empty strings
    const firstInitial = firstName.trim().charAt(0).toUpperCase();
    const lastInitial = lastName.trim().charAt(0).toUpperCase();

    return `${firstInitial}${lastInitial}`;
  };

  return (
    <nav className="sticky top-0 z-[90] sm:px-3 md:px-3 bg-slate-50 backdrop-blur-md py-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Logo */}
        <div
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-10 h-10 bg-[#042159] rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-xl">A</span>
          </div>
          <span className="text-[#042159] font-black text-xl tracking-tighter">
            ANANSI
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Help Icon */}
          <button
            onClick={() => navigate("/help-support")}
            className="p-2.5 text-slate-400 hover:text-[#4DB8E4] hover:bg-blue-50 rounded-2xl transition-all flex items-center gap-2"
          >
            <HelpCircle size={22} />
            <span className="hidden md:block text-xs font-bold uppercase tracking-widest">
              Need Help?
            </span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => navigate("/notifications")}
              className="p-2.5 text-slate-400 hover:text-[#042159] hover:bg-slate-50 rounded-2xl transition-all relative"
            >
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
          </div>

          {/* Divider */}
          <div className="h-8 w-[1px] bg-slate-100 hidden md:block"></div>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 p-1.5 pl-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-[20px] transition-all"
            >
              <div className="flex flex-col items-end hidden md:block">
                <span className="text-[11px] font-black text-[#042159] leading-none uppercase tracking-wider">
                  {auth?.user?.firstname} {auth?.user?.lastname}
                </span>
              </div>
              <div className="w-9 h-9 bg-[#042159] rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-900/20">
                {getInitials(auth?.user?.firstname, auth?.user?.lastname)}
              </div>
              <ChevronDown
                size={16}
                className={`text-slate-400 transition-transform ${isProfileOpen ? "rotate-0" : ""}`}
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-[28px] shadow-2xl shadow-blue-900/10 p-2 animate-in fade-in zoom-in-95 duration-200">
                <DropdownItem
                  icon={<User size={18} />}
                  label="Manage Profile"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/profile");
                  }}
                />
                <DropdownItem
                  icon={<Settings size={18} />}
                  label="Account Settings"
                />
                <DropdownItem
                  icon={<ShieldCheck size={18} />}
                  label="Security"
                />

                <div className="my-2 border-t border-slate-50"></div>

                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/auth/login");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-rose-500 hover:bg-rose-50 rounded-2xl transition-all group"
                >
                  <LogOut
                    size={18}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                  <span className="text-sm font-bold">Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <button className="md:hidden p-2 text-[#042159]">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

/* Sub-component for Dropdown Items */
const DropdownItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-[#042159] hover:bg-slate-50 rounded-2xl transition-all"
  >
    <span className="text-slate-400 group-hover:text-[#4DB8E4]">{icon}</span>
    <span className="text-sm font-bold">{label}</span>
  </button>
);

export default Navigation;

import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  User,
  LogOut,
  HelpCircle,
  ChevronDown,
  Menu,
  Home,
  FileText,
  Briefcase,
  LayoutDashboard,
  X,
  PlusCircle,
  CreditCard,
  LayoutGrid,
  Wallet,
  Users,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const Navigation = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { auth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  const getInitials = (firstName = "", lastName = "") => {
    const firstInitial = firstName?.trim()?.charAt(0)?.toUpperCase();
    const lastInitial = lastName?.trim()?.charAt(0)?.toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="sm:px-3 bg-slate-50 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Logo */}
          <div
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-xl">A</span>
            </div>
            <span className="text-primary font-black text-xl tracking-tighter">
              ANANSI
            </span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Help Icon */}
            <button
              onClick={() => navigate("/help-support")}
              className="p-2.5 text-slate-400 hover:text-secondary hover:bg-blue-50 rounded-2xl transition-all flex items-center gap-2"
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
                className="p-2.5 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-2xl transition-all relative"
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
                  <span className="text-[11px] font-black text-primary leading-none uppercase tracking-wider">
                    {auth?.user?.firstname} {auth?.user?.lastname}
                  </span>
                </div>
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-blue-900/20">
                  {getInitials(auth?.user?.firstname, auth?.user?.lastname)}
                </div>
                <ChevronDown
                  size={16}
                  className={`text-slate-400 transition-transform ${isProfileOpen ? "rotate-0" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 z-50 w-56 bg-white border border-slate-100 rounded-[28px] shadow-2xl shadow-blue-900/10 p-2 animate-in fade-in zoom-in-95 duration-200">
                  <DropdownItem
                    icon={<User size={18} />}
                    label="Manage Profile"
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/profile");
                    }}
                  />
                  <DropdownItem
                    icon={<FileText size={18} className="text-primary" />}
                    label="Statements"
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/statements");
                    }}
                  />
                  <DropdownItem
                    icon={<Users size={18} className="text-primary" />}
                    label="Guarantorship"
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/guarantorship");
                    }}
                  />
                  <DropdownItem
                    icon={<Wallet size={18} className="text-primary" />}
                    label="Loans"
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/all-loans");
                    }}
                  />
                  <DropdownItem
                    icon={<LayoutGrid size={18} className="text-primary" />}
                    label="Explore Products"
                    onClick={() => {
                      setIsProfileOpen(false);
                      navigate("/loan-products");
                    }}
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

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-primary bg-slate-50 rounded-xl"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>
      {/* --- MOBILE SIDE DRAWER --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-[320px] bg-white z-[100] shadow-2xl p-6 flex flex-col md:hidden"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="font-black text-primary">MENU</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-slate-50 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-2 flex-1">
                <MobileLink
                  icon={<LayoutDashboard />}
                  label="Loan Applications"
                  onClick={() => navigate("/all-loan-applications")}
                />
                <MobileLink
                  icon={<PlusCircle />}
                  label="Loan Products"
                  onClick={() => navigate("/loan-products")}
                />
                <MobileLink
                  icon={<CreditCard />}
                  label="Active Loans"
                  onClick={() => navigate("/all-loans")}
                />
                <MobileLink
                  icon={<FileText />}
                  label="Statements"
                  onClick={() => navigate("/statements")}
                />
              </div>

              <div className="mt-auto p-4 bg-blue-50 rounded-3xl">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
                  Support
                </p>
                <p className="text-xs text-slate-500">
                  Need help with your application?
                </p>
                <button className="mt-3 text-xs font-bold text-secondary">
                  Contact Support
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- MOBILE BOTTOM TAB BAR --- */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 px-6 py-3 flex justify-between items-center md:hidden z-[40] pb-8">
        <TabItem
          icon={<Home />}
          active={isActive("/home")}
          onClick={() => navigate("/home")}
        />
        <TabItem
          icon={<Briefcase />}
          active={isActive("/loans")}
          onClick={() => navigate("/all-loans")}
        />
        <div className="relative -top-6">
          <button
            onClick={() => navigate("/loan-products")}
            className="w-14 h-14 bg-primary rounded-2xl shadow-xl shadow-blue-900/40 flex items-center justify-center text-white active:scale-90 transition-transform"
          >
            <PlusCircle size={28} />
          </button>
        </div>
        <TabItem
          icon={<Bell />}
          active={isActive("/notifications")}
          onClick={() => navigate("/notifications")}
        />
        <TabItem
          icon={<User />}
          active={isActive("/profile")}
          onClick={() => navigate("/profile")}
        />
      </div>
    </>
  );
};

const MobileLink = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl text-slate-600 font-bold transition-all active:bg-slate-100"
  >
    <span className="text-secondary">{icon}</span>
    <span className="text-sm">{label}</span>
  </button>
);

const TabItem = ({ icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`p-2 transition-all ${active ? "text-primary scale-110" : "text-slate-300"}`}
  >
    {React.cloneElement(icon, { size: 24, strokeWidth: active ? 2.5 : 2 })}
  </button>
);

/* Sub-component for Dropdown Items */
const DropdownItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-primary hover:bg-slate-50 rounded-2xl transition-all"
  >
    <span className="text-slate-400 group-hover:text-secondary">{icon}</span>
    <span className="text-sm font-bold">{label}</span>
  </button>
);

export default Navigation;
